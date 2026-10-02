import 'dotenv/config';
import express from 'express';
import { newDb } from 'pg-mem';
import type { Pool } from 'pg';
import { setPool, getPool } from '../db';
import { SCHEMA_SQL } from '../db/schema';
import { registerExtensions } from '../db/pg-mem-helpers';
import { createApp } from '../app';
import request from 'supertest';
import { Readable } from 'stream';
import type { UploadApiResponse } from 'cloudinary';

process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'test-secret-change-in-prod';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
process.env.DISABLE_RATE_LIMIT = 'true';

// Set Cloudinary env vars for tests that expect the upload feature to be enabled
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
process.env.CLOUDINARY_API_KEY = 'test-key';
process.env.CLOUDINARY_API_SECRET = 'test-secret';

// Mock Cloudinary module
jest.mock('cloudinary', () => {
  const mockUploadStream = jest.fn();
  const mockConfig = jest.fn();
  return {
    v2: {
      config: mockConfig,
      uploader: {
        upload_stream: mockUploadStream,
      },
    },
    __mockUploadStream: mockUploadStream,
    __mockConfig: mockConfig,
  };
});

// Get references to the mocked functions
const cloudinaryModule = require('cloudinary');
const mockUploadStream = cloudinaryModule.__mockUploadStream as jest.Mock;
const mockConfig = cloudinaryModule.__mockConfig as jest.Mock;

// Helper: create a fake file buffer that can be piped
function createFakeImageBuffer(): Buffer {
  return Buffer.from('fake-image-data-for-testing', 'utf8');
}

// Helper: register a user and return an authenticated agent
async function createAuthenticatedAgent(app: express.Application): Promise<any> {
  const agent = request.agent(app);
  const email = `upload-test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@example.edu`;
  await agent.post('/api/auth/register').send({
    name: 'Uploader',
    email,
    password: 'password123',
  });
  return agent;
}

describe('POST /api/upload/image', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfig.mockClear();
  });

  describe('authentication', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const res = await request(app)
        .post('/api/upload/image')
        .attach('image', createFakeImageBuffer(), 'test.jpg');
      expect(res.status).toBe(401);
    });
  });

  describe('Cloudinary not configured', () => {
    it('returns 501 when Cloudinary env vars are missing', async () => {
      const agent = await createAuthenticatedAgent(app);
      // Temporarily remove Cloudinary env vars
      const savedCloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const savedApiKey = process.env.CLOUDINARY_API_KEY;
      const savedApiSecret = process.env.CLOUDINARY_API_SECRET;
      delete process.env.CLOUDINARY_CLOUD_NAME;
      delete process.env.CLOUDINARY_API_KEY;
      delete process.env.CLOUDINARY_API_SECRET;

      const res = await agent
        .post('/api/upload/image')
        .attach('image', createFakeImageBuffer(), 'test.jpg');
      expect(res.status).toBe(501);
      expect(res.body.error).toBe('Image uploads are not configured.');

      // Restore env vars
      process.env.CLOUDINARY_CLOUD_NAME = savedCloudName;
      process.env.CLOUDINARY_API_KEY = savedApiKey;
      process.env.CLOUDINARY_API_SECRET = savedApiSecret;
    });
  });

  describe('successful upload', () => {
    it('uploads an image and returns the Cloudinary secure_url', async () => {
      const agent = await createAuthenticatedAgent(app);

      const mockResult = {
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v123/test.jpg',
        public_id: 'findmate/test',
      } as Partial<UploadApiResponse>;

      mockUploadStream.mockImplementation((_options, callback) => {
        callback(null, mockResult as UploadApiResponse);
        return new Readable({ read() {} });
      });

      const res = await agent
        .post('/api/upload/image')
        .attach('image', createFakeImageBuffer(), 'test.jpg');

      expect(res.status).toBe(201);
      expect(res.body.url).toBe(
        'https://res.cloudinary.com/test-cloud/image/upload/v123/test.jpg'
      );
      expect(mockUploadStream).toHaveBeenCalledWith(
        { folder: 'findmate', resource_type: 'image' },
        expect.any(Function)
      );
    });
  });

  describe('Cloudinary failure', () => {
    it('returns 502 when Cloudinary upload fails', async () => {
      const agent = await createAuthenticatedAgent(app);

      mockUploadStream.mockImplementation((_options, callback) => {
        callback(new Error('Cloudinary API error'), undefined);
        return new Readable({ read() {} });
      });

      const res = await agent
        .post('/api/upload/image')
        .attach('image', createFakeImageBuffer(), 'test.jpg');

      expect(res.status).toBe(502);
      expect(res.body.error).toBe('Failed to upload image to object storage.');
    });
  });

  describe('oversized file', () => {
    it('rejects files larger than 5MB with 413', async () => {
      const agent = await createAuthenticatedAgent(app);

      const largeBuffer = Buffer.alloc(6 * 1024 * 1024);

      const res = await agent
        .post('/api/upload/image')
        .attach('image', largeBuffer, 'large.jpg');

      expect(res.status).toBe(413);
      expect(res.body.message).toContain('5MB');
    });
  });

  describe('invalid file type', () => {
    it('rejects non-image files with 400', async () => {
      const agent = await createAuthenticatedAgent(app);

      const res = await agent
        .post('/api/upload/image')
        .attach('image', Buffer.from('not-an-image'), 'test.txt');

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Unsupported file type');
    });
  });

  describe('missing file', () => {
    it('returns 400 when no file is provided', async () => {
      const agent = await createAuthenticatedAgent(app);

      const res = await agent.post('/api/upload/image').send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('No file provided.');
    });
  });
});
