import 'dotenv/config';
import { newDb } from 'pg-mem';
import type { Pool } from 'pg';
import { setPool, getPool } from '../db';
import { SCHEMA_SQL } from '../db/schema';
import app from '../app';
import request from 'supertest';

let memDb: any;beforeAll(async () => {
  memDb = newDb();
  const { Pool } = memDb.adapters.createPg();
  const pool = new Pool(memDb.connectionParameters) as unknown as Pool;
  setPool(pool);

  const client = await getPool().connect();
  try {
    await client.query(SCHEMA_SQL);
  } finally {
    client.release();
  }
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

describe('GET /api/items (empty)', () => {
  it('returns empty array', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

const sampleItem = {
  name: 'Blue Notebook',
  status: 'lost',
  category: 'books',
  description: 'A blue spiral notebook with notes.',
  location: 'library',
  date: '2026-09-20',
  image: null,
  reporterName: 'Alex Chen',
  contact: 'alex@example.edu',
};

describe('POST /api/items', () => {
  it('creates an item', async () => {
    const res = await request(app).post('/api/items').send(sampleItem);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Blue Notebook');
    expect(res.body.status).toBe('lost');
  });

  it('rejects invalid status', async () => {
    const res = await request(app).post('/api/items').send({ ...sampleItem, status: 'missing' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/items/:id', () => {
  it('returns a created item', async () => {
    const create = await request(app).post('/api/items').send(sampleItem);
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
});

describe('GET /api/items filters', () => {
  it('filters by status', async () => {
    await request(app).post('/api/items').send(sampleItem);
    await request(app).post('/api/items').send({ ...sampleItem, status: 'found' });
    const res = await request(app).get('/api/items?status=lost');
    expect(res.status).toBe(200);
    expect(res.body.every((i: { status: string }) => i.status === 'lost')).toBe(true);
  });
});
