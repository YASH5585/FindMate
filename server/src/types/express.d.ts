import type { User } from '../types/auth';

declare module 'express-session' {
  interface SessionData {
    userId: string | null;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

export type { User };
