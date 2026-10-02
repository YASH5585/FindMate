import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient, ApiError } from '@/lib/api/client';

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  globalThis.fetch = mockFetch as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

const mockResponse = (status: number, body: unknown, headers: Record<string, string> = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: new Headers(headers),
  json: () => Promise.resolve(body),
  text: () => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
});

describe('ApiClient', () => {
  const client = new ApiClient({ baseURL: 'https://api.example.com' });

  it('sends GET requests with credentials include', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(200, { ok: true }, { 'content-type': 'application/json' }));
    const result = await client.get('/test');
    expect(result).toEqual({ ok: true });
    const call = (mockFetch.mock.calls[0] as unknown) as [string, RequestInit];
    expect(call[1].credentials).toBe('include');
    expect(call[1].method).toBe('GET');
  });

  it('sends POST requests with JSON body', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(201, { created: true }, { 'content-type': 'application/json' }));
    const result = await client.post('/items', { name: 'Test' });
    expect(result).toEqual({ created: true });
    const call = mockFetch.mock.calls[0];
    expect(call[1].method).toBe('POST');
    expect(call[1].body).toBe('{"name":"Test"}');
    expect(call[1].credentials).toBe('include');
  });

  it('throws ApiError on non-2xx response with JSON body', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse(401, { message: 'Invalid email or password' }, { 'content-type': 'application/json' })
    );
    let caught: unknown;
    try {
      await client.post('/auth/login', { email: 'a@b.com', password: 'wrong' });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).status).toBe(401);
    expect((caught as ApiError).message).toBe('Invalid email or password');
  });

  it('throws ApiError with default message on non-JSON error', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(500, 'Internal Server Error', {}));
    let caught: unknown;
    try {
      await client.get('/fail');
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).status).toBe(500);
  });

  it('handles 409 conflict', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(409, { message: 'Conflict' }, { 'content-type': 'application/json' }));
    let caught: unknown;
    try {
      await client.post('/items', { name: 'dup' });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).status).toBe(409);
  });

  it('returns text for non-JSON responses', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(200, 'plain text', {}));
    const result = await client.get('/text');
    expect(result).toBe('plain text');
  });

  it('strips trailing slash from baseURL', () => {
    const c = new ApiClient({ baseURL: 'https://api.example.com/' });
    expect((c as any).baseURL).toBe('https://api.example.com');
  });
});
