import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import type { Pool } from 'pg';
import { config } from './config';
import itemRoutes from './routes/itemRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

const PostgresqlStore = connectPgSimple(session);

export function createApp(pool: Pool, useMemoryStore = false): express.Application {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  let store: session.Store;
  if (useMemoryStore) {
    store = new session.MemoryStore();
  } else {
    store = new PostgresqlStore({ pool, tableName: 'session' });
  }

  app.use(
    session({
      name: config.auth.cookieName,
      store,
      secret: config.auth.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/items', itemRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
