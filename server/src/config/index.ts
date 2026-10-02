import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  database: {
    url: process.env.DATABASE_URL,
  },
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: (process.env.NODE_ENV ?? 'development') === 'production',
  auth: {
    cookieName: process.env.SESSION_COOKIE_NAME ?? 'findmate_session',
    sessionMaxAge: process.env.SESSION_MAX_AGE
      ? parseInt(process.env.SESSION_MAX_AGE, 10)
      : 30 * 24 * 60 * 60 * 1000,
    get secret(): string {
      if (!process.env.AUTH_SECRET) {
        throw new Error('AUTH_SECRET environment variable is required.');
      }
      return process.env.AUTH_SECRET;
    },
  },
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS
      ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)
      : 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX
      ? parseInt(process.env.RATE_LIMIT_MAX, 10)
      : 100,
    authMax: process.env.RATE_LIMIT_AUTH_MAX
      ? parseInt(process.env.RATE_LIMIT_AUTH_MAX, 10)
      : 10,
  },
  bodyParse: {
    limit: process.env.BODY_LIMIT ?? '1mb',
  },
};
