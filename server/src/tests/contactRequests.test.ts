import 'dotenv/config';
import express from 'express';
import { newDb } from 'pg-mem';
import type { Pool } from 'pg';
import { setPool, getPool } from '../db';
import { SCHEMA_SQL } from '../db/schema';
import { registerExtensions } from '../db/pg-mem-helpers';
import { createApp } from '../app';
import request from 'supertest';

let memDb: any;
let pool: Pool;
let app: express.Application;

const registerAndLogin = async (agent: any, name: string, email: string) => {
  const res = await agent.post('/api/auth/register').send({ name, email, password: 'password123' });
  return res.body.user;
};

const createItem = async (agent: any, ownerEmail: string) => {
  await registerAndLogin(agent, ownerEmail, ownerEmail);
  const res = await agent.post('/api/items').send({
    name: 'Lost Badge',
    status: 'lost',
    category: 'id-card',
    description: 'A lost staff badge',
    location: 'Main Gate',
    date: '2026-09-20',
    image: null,
    reporterName: 'Owner',
    contact: 'owner@test.com',
  });
  return res.body.id as string;
};

beforeAll(async () => {
  memDb = newDb();
  registerExtensions(memDb);
  const { Pool } = memDb.adapters.createPg();
  pool = new Pool(memDb.connectionParameters) as unknown as Pool;
  setPool(pool);

  const client = await getPool().connect();
  try {
    await client.query(SCHEMA_SQL);
  } finally {
    client.release();
  }

  app = createApp(pool, true);
}, 30000);

afterAll(async () => {
  await getPool().end();
});

describe('Contact requests: authentication', () => {
  it('returns 401 when listing contact requests unauthenticated', async () => {
    const res = await request(app).get('/api/contact-requests');
    expect(res.status).toBe(401);
  });

  it('returns 401 when creating a contact request unauthenticated', async () => {
    const res = await request(app).post('/api/contact-requests').send({
      itemId: '00000000-0000-0000-0000-000000000000',
      message: 'Hi, I found this!',
    });
    expect(res.status).toBe(401);
  });

  it('returns 401 when viewing a contact request unauthenticated', async () => {
    const res = await request(app).get('/api/contact-requests/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(401);
  });

  it('returns 401 when updating a contact request unauthenticated', async () => {
    const res = await request(app)
      .patch('/api/contact-requests/00000000-0000-0000-0000-000000000000')
      .send({ status: 'accepted' });
    expect(res.status).toBe(401);
  });
});

describe('Contact requests: creation', () => {
  let ownerAgent: any;
  let senderAgent: any;
  let itemId: string;

  beforeAll(async () => {
    ownerAgent = request.agent(app);
    senderAgent = request.agent(app);
    itemId = await createItem(ownerAgent, 'owner-crt@test.com');
    await registerAndLogin(senderAgent, 'Sender', 'sender-crt@test.com');
  });

  it('authenticated user can create a contact request', async () => {
    const res = await senderAgent.post('/api/contact-requests').send({
      itemId,
      message: 'I found your badge near the main gate.',
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.itemId).toBe(itemId);
    expect(res.body.message).toBe('I found your badge near the main gate.');
    expect(res.body.status).toBe('pending');
  });

  it('rejects a contact request for a nonexistent item', async () => {
    const res = await senderAgent.post('/api/contact-requests').send({
      itemId: '00000000-0000-0000-0000-000000000000',
      message: 'Hello',
    });
    expect(res.status).toBe(404);
  });

  it('rejects contacting yourself (the item owner)', async () => {
    const res = await ownerAgent.post('/api/contact-requests').send({
      itemId,
      message: 'Contact myself',
    });
    expect(res.status).toBe(400);
  });

  it('rejects duplicate pending contact request for the same item', async () => {
    await senderAgent.post('/api/contact-requests').send({
      itemId,
      message: 'Duplicate attempt',
    });
    const res = await senderAgent.post('/api/contact-requests').send({
      itemId,
      message: 'Duplicate attempt two',
    });
    expect(res.status).toBe(409);
  });

  it('sender is derived from the session (not the body)', async () => {
    const res = await senderAgent.get('/api/contact-requests');
    const outgoing = res.body.find((r: any) => r.role === 'sender');
    expect(outgoing).toBeDefined();
    expect(outgoing.senderId).not.toBe('');
  });
});

describe('Contact requests: authorization and visibility', () => {
  let ownerAgent: any;
  let senderAgent: any;
  let strangerAgent: any;
  let itemId: string;
  let requestId: string;

  beforeAll(async () => {
    ownerAgent = request.agent(app);
    senderAgent = request.agent(app);
    strangerAgent = request.agent(app);
    itemId = await createItem(ownerAgent, 'owner-vis@test.com');
    await registerAndLogin(senderAgent, 'Sender', 'sender-vis@test.com');
    await registerAndLogin(strangerAgent, 'Stranger', 'stranger-vis@test.com');

    const res = await senderAgent.post('/api/contact-requests').send({
      itemId,
      message: 'Visibility test message',
    });
    requestId = res.body.id;
  });

  it('receiver sees the request as incoming', async () => {
    const res = await ownerAgent.get('/api/contact-requests');
    const incoming = res.body.find((r: any) => r.role === 'receiver');
    expect(incoming).toBeDefined();
    expect(incoming.status).toBe('pending');
  });

  it('sender sees the request as outgoing', async () => {
    const res = await senderAgent.get('/api/contact-requests');
    const outgoing = res.body.find((r: any) => r.role === 'sender');
    expect(outgoing).toBeDefined();
    expect(outgoing.status).toBe('pending');
  });

  it('unrelated user cannot see the request in their list', async () => {
    const res = await strangerAgent.get('/api/contact-requests');
    expect(res.body).toEqual([]);
  });

  it('unrelated user cannot GET the request (404)', async () => {
    const res = await strangerAgent.get(`/api/contact-requests/${requestId}`);
    expect(res.status).toBe(404);
  });

  it('unrelated user cannot PATCH the request (404)', async () => {
    const res = await strangerAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'accepted' });
    expect(res.status).toBe(404);
  });

  it('participant can GET their own request', async () => {
    const res = await senderAgent.get(`/api/contact-requests/${requestId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(requestId);
    expect(res.body.message).toBe('Visibility test message');
  });

  it('response does not include sender/receiver contact info (only names)', async () => {
    const res = await ownerAgent.get(`/api/contact-requests/${requestId}`);
    expect(res.body).not.toHaveProperty('senderEmail');
    expect(res.body).not.toHaveProperty('receiverEmail');
    expect(res.body).not.toHaveProperty('senderContact');
    expect(res.body).toHaveProperty('senderName');
    expect(res.body).toHaveProperty('receiverName');
  });
});

describe('Contact requests: status transitions', () => {
  let senderAgent: any;
  let ownerAgent: any;
  let requestId: string;
  let itemId: string;

  beforeEach(async () => {
    ownerAgent = request.agent(app);
    senderAgent = request.agent(app);
    itemId = await createItem(ownerAgent, `owner-trans-${Date.now()}@test.com`);
    await registerAndLogin(senderAgent, 'TransSender', `sender-trans-${Date.now()}@test.com`);
    const res = await senderAgent.post('/api/contact-requests').send({
      itemId,
      message: 'Transition test',
    });
    requestId = res.body.id;
  });

  it('receiver can accept a pending request (pending -> accepted)', async () => {
    const res = await ownerAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'accepted' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('accepted');
  });

  it('receiver can decline a pending request (pending -> declined)', async () => {
    const res = await ownerAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'declined' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('declined');
  });

  it('sender can close their own pending request (pending -> closed)', async () => {
    const res = await senderAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'closed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('closed');
  });

  it('rejects invalid transition (accepted -> accepted)', async () => {
    await ownerAgent.patch(`/api/contact-requests/${requestId}`).send({ status: 'accepted' });
    const res = await ownerAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'accepted' });
    expect(res.status).toBe(400);
  });

  it('receiver cannot close (pending -> closed is sender-only)', async () => {
    const res = await ownerAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'closed' });
    expect(res.status).toBe(400);
  });

  it('sender cannot accept their own outgoing request', async () => {
    const res = await senderAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'accepted' });
    expect(res.status).toBe(400);
  });

  it('either participant can close an accepted request', async () => {
    const accepted = await ownerAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'accepted' });
    expect(accepted.status).toBe(200);
    const res = await senderAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'closed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('closed');
  });

  it('does not allow invalid status value', async () => {
    const res = await ownerAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'hacked' });
    expect(res.status).toBe(400);
  });
});

describe('Security: hardening and edge cases', () => {
  let ownerAgent: any;
  let senderAgent: any;
  let strangerAgent: any;
  let itemId: string;
  let requestId: string;

  beforeAll(async () => {
    ownerAgent = request.agent(app);
    senderAgent = request.agent(app);
    strangerAgent = request.agent(app);
    itemId = await createItem(ownerAgent, 'owner-sec@test.com');
    await registerAndLogin(senderAgent, 'Sender', 'sender-sec@test.com');
    await registerAndLogin(strangerAgent, 'Stranger', 'stranger-sec@test.com');

    const res = await senderAgent.post('/api/contact-requests').send({
      itemId,
      message: 'Initial contact request for security tests',
    });
    requestId = res.body.id;
  });

  it('rejects invalid UUID format in path param (GET)', async () => {
    const res = await senderAgent.get('/api/contact-requests/not-a-uuid');
    expect(res.status).toBe(400);
  });

  it('rejects invalid UUID format in path param (PATCH)', async () => {
    const res = await senderAgent
      .patch('/api/contact-requests/not-a-uuid')
      .send({ status: 'closed' });
    expect(res.status).toBe(400);
  });

  it('rejects oversized message input (>2000 chars)', async () => {
    const res = await senderAgent.post('/api/contact-requests').send({
      itemId,
      message: 'X'.repeat(2001),
    });
    expect(res.status).toBe(400);
  });

  it('rejects missing message field', async () => {
    const res = await senderAgent.post('/api/contact-requests').send({
      itemId,
    });
    expect(res.status).toBe(400);
  });

  it('stranger cannot duplicate a pending request (dup prevention)', async () => {
    await senderAgent.post('/api/contact-requests').send({
      itemId,
      message: 'Duplicate attempt from security tests',
    });
    const res = await strangerAgent.post('/api/contact-requests').send({
      itemId,
      message: 'Stranger trying to create a second pending request',
    });
    expect(res.status).toBe(201);
    const dupRes = await strangerAgent.post('/api/contact-requests').send({
      itemId,
      message: 'Stranger duplicate attempt',
    });
    expect(dupRes.status).toBe(409);
  });

  it('stranger cannot PATCH an existing contact request (horizontal escalation, returns 404)', async () => {
    const res = await strangerAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'accepted' });
    expect(res.status).toBe(404);
  });

  it('stranger cannot see the request via GET (returns 404)', async () => {
    const res = await strangerAgent.get(`/api/contact-requests/${requestId}`);
    expect(res.status).toBe(404);
  });

  it('rejects invalid status enum value in PATCH body', async () => {
    const res = await senderAgent
      .patch(`/api/contact-requests/${requestId}`)
      .send({ status: 'malicious_status' });
    expect(res.status).toBe(400);
  });

  it('rejects invalid sortBy filter on public items list', async () => {
    const res = await request(app).get('/api/items?sortBy=nonexistent_column');
    expect(res.status).toBe(400);
  });

  it('rejects invalid sortOrder filter on public items list', async () => {
    const res = await request(app).get('/api/items?sortOrder=sideways');
    expect(res.status).toBe(400);
  });

  it('rejects out-of-range limit on public items list', async () => {
    const res = await request(app).get('/api/items?limit=99999');
    expect(res.status).toBe(400);
  });

  it('rejects invalid item id format in GET /api/items/:id', async () => {
    const res = await request(app).get('/api/items/not-a-uuid');
    expect(res.status).toBe(400);
  });

  it('response headers include security headers (helmet)', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBeDefined();
    expect(res.headers['content-security-policy']).toBeDefined();
  });
});

describe('Public item APIs do not expose private contact data', () => {
  let ownerAgent: any;

  beforeAll(async () => {
    ownerAgent = request.agent(app);
    await createItem(ownerAgent, 'owner-privacy@test.com');
  });

  it('GET /api/items omits contact field', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    const item = res.body.find((i: any) => i.name === 'Lost Badge');
    expect(item).toBeDefined();
    expect(item).not.toHaveProperty('contact');
  });

  it('GET /api/items/:id (unauthenticated) omits contact field', async () => {
    const list = await request(app).get('/api/items');
    const item = list.body[0];
    const res = await request(app).get(`/api/items/${item.id}`);
    expect(res.status).toBe(200);
    expect(res.body).not.toHaveProperty('contact');
  });
});
