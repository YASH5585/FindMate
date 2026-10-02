process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'test-secret-change-in-prod';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
// Rate limiting is in-memory and not needed for tests; disable to keep tests deterministic.
process.env.DISABLE_RATE_LIMIT = 'true';
