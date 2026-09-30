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

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/items (unauthenticated browse)', () => {
  it('returns empty array', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/items (authorization)', () => {
  it('rejects unauthenticated', async () => {
    const res = await request(app).post('/api/items').send({
      name: 'X',
      status: 'lost',
      category: 'books',
      description: 'd',
      location: 'L',
      date: '2026-09-20',
      image: null,
      reporterName: 'X',
      contact: 'x@x.com',
    });
    expect(res.status).toBe(401);
  });
});

describe('Auth: registration and login', () => {
  let agent: any;
  const testEmail = `user-${Date.now()}@example.edu`;

  beforeAll(() => {
    agent = request.agent(app);
  });

  it('registers a new user', async () => {
    const res = await agent.post('/api/auth/register').send({
      name: 'Alex Chen',
      email: testEmail,
      password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).not.toHaveProperty('password_hash');
  });

  it('rejects duplicate email', async () => {
    const res = await agent.post('/api/auth/register').send({
      name: 'Alex Chen',
      email: testEmail,
      password: 'password123',
    });
    expect(res.status).toBe(409);
  });

  it('rejects invalid registration', async () => {
    const res = await agent.post('/api/auth/register').send({
      name: 'A',
      email: 'not-an-email',
      password: 'short',
    });
    expect(res.status).toBe(400);
  });

  it('logs in with valid credentials', async () => {
    const res = await agent.post('/api/auth/login').send({
      email: testEmail,
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
  });

  it('rejects wrong password', async () => {
    const res = await agent.post('/api/auth/login').send({
      email: testEmail,
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });
});

describe('Auth: session and me', () => {
  let agent: any;

  beforeAll(() => {
    agent = request.agent(app);
  });

  it('/me rejects unauthenticated', async () => {
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('session persists after login', async () => {
    const email = `session-${Date.now()}@example.edu`;
    await agent.post('/api/auth/register').send({ name: 'Bob', email, password: 'password123' });
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(email);
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).not.toHaveProperty('password_hash');
  });

  it('logout ends the session', async () => {
    const email = `logout-${Date.now()}@example.edu`;
    await agent.post('/api/auth/register').send({ name: 'Sam', email, password: 'password123' });
    let res = await agent.post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    res = await agent.get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('Auth: password storage', () => {
  it('password is stored hashed (not plaintext)', async () => {
    const email = `hashcheck-${Date.now()}@example.edu`;
    await request(app).post('/api/auth/register').send({ name: 'Test', email, password: 'password123' });
    const result = await getPool().query('SELECT password_hash FROM users WHERE email = $1', [email]);
    const hash = result.rows[0].password_hash;
    expect(hash).not.toBe('password123');
    expect(hash.startsWith('$2')).toBe(true);
  });
});

describe('Authorization: report ownership', () => {
  let agent: any;
  let ownerId: string;

  beforeAll(() => {
    agent = request.agent(app);
  });

  it('authenticated report creation assigns correct user_id', async () => {
    const email = `owner-${Date.now()}@example.edu`;
    await agent.post('/api/auth/register').send({ name: 'Owner', email, password: 'password123' });
    const me = await agent.get('/api/auth/me').then((r: { body: { user: { id: string } } }) => r.body.user.id);
    ownerId = me;

    const res = await agent.post('/api/items').send({
      name: 'Blue Notebook',
      status: 'lost',
      category: 'books',
      description: 'A blue notebook',
      location: 'Library',
      date: '2026-09-20',
      image: null,
      reporterName: 'Owner',
      contact: 'owner@example.edu',
    });
    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(ownerId);
  });

  it('rejects invalid status', async () => {
    const res = await agent.post('/api/items').send({
      name: 'Item',
      status: 'missing',
      category: 'books',
      description: 'desc',
      location: 'L',
      date: '2026-09-20',
      image: null,
      reporterName: 'Owner',
      contact: 'o@x.com',
    });
    expect(res.status).toBe(400);
  });

  it('returns a created item by id', async () => {
    const create = await agent.post('/api/items').send({
      name: 'Notebook',
      status: 'lost',
      category: 'books',
      description: 'd',
      location: 'Library',
      date: '2026-09-20',
      image: null,
      reporterName: 'Owner',
      contact: 'o@x.com',
    });
    const id = create.body.id;
    const res = await request(app).get(`/api/items/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
  });

  it('returns 404 for nonexistent item', async () => {
    const res = await request(app).get('/api/items/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid id', async () => {
    const res = await request(app).get('/api/items/not-a-uuid');
    expect(res.status).toBe(400);
  });

  it('filters by status', async () => {
    await agent.post('/api/items').send({
      name: 'Book',
      status: 'lost',
      category: 'books',
      description: 'd',
      location: 'Library',
      date: '2026-09-20',
      image: null,
      reporterName: 'Owner',
      contact: 'o@x.com',
    });
    await agent.post('/api/items').send({
      name: 'Pen',
      status: 'found',
      category: 'accessories',
      description: 'd',
      location: 'Library',
      date: '2026-09-20',
      image: null,
      reporterName: 'Owner',
      contact: 'o@x.com',
    });
    const res = await request(app).get('/api/items?status=lost');
    expect(res.status).toBe(200);
    expect(res.body.every((i: { status: string }) => i.status === 'lost')).toBe(true);
  });

  it('/api/items/mine returns only own items', async () => {
    const res = await agent.get('/api/items/mine');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((i: { userId: string }) => i.userId === ownerId)).toBe(true);
  });

  it('/api/items/mine rejects unauthenticated', async () => {
    const res = await request(app).get('/api/items/mine');
    expect(res.status).toBe(401);
  });

  it('another user cannot see the owner items in /mine', async () => {
    const email = `other-${Date.now()}@example.edu`;
    const otherAgent = request.agent(app);
    await otherAgent.post('/api/auth/register').send({ name: 'Other', email, password: 'password123' });
    const res = await otherAgent.get('/api/items/mine');
    expect(res.status).toBe(200);
    expect(res.body.every((i: { userId: string }) => i.userId !== ownerId)).toBe(true);
  });
});
