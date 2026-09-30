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
    get secret(): string {
      if (!process.env.AUTH_SECRET) {
        throw new Error('AUTH_SECRET environment variable is required.');
      }
      return process.env.AUTH_SECRET;
    },
  },
};
