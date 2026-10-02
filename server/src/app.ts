import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import helmet, { type HelmetOptions } from 'helmet';
import type { Pool } from 'pg';
import { config } from './config';
import itemRoutes from './routes/itemRoutes';
import authRoutes from './routes/authRoutes';
import contactRequestRoutes from './routes/contactRequestRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';
import {
  authRateLimiter,
  contactRateLimiter,
  reportRateLimiter,
} from './middleware/rateLimiter';

const PostgresqlStore = connectPgSimple(session);

function buildHelmetOptions(): HelmetOptions {
  const directives: Record<string, string[]> = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    fontSrc: ["'self'", 'https:', 'data:'],
    connectSrc: ["'self'"],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
  };
  directives.connectSrc.push(config.corsOrigin);
  if (!config.isProduction) {
    directives.connectSrc.push('http://localhost:4000', 'http://localhost:5173');
  }
  return {
    contentSecurityPolicy: {
      directives,
    },
    crossOriginEmbedderPolicy: false,
    // HSTS only for HTTPS production; never emit on local HTTP dev.
    hsts: config.isProduction
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
  };
}

export function createApp(pool: Pool, useMemoryStore = false): express.Application {
  const app = express();

  if (config.isProduction) {
    app.set('trust proxy', 1);
  }

  app.use(helmet(buildHelmetOptions()));
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: config.bodyParse.limit }));
  app.use(express.urlencoded({ extended: true, limit: config.bodyParse.limit }));

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
        maxAge: config.auth.sessionMaxAge,
      },
    })
  );

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRateLimiter, authRoutes);
  app.use('/api/items', reportRateLimiter, itemRoutes);
  app.use('/api/contact-requests', contactRateLimiter, contactRequestRoutes);
  app.use('/api/upload', uploadRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
