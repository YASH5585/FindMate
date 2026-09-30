import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { AppError } from './errorHandler';

/**
 * Middleware that loads the authenticated user from the session (if a
 * userId is present) and attaches it to req.user. Does NOT reject
 * unauthenticated requests — use requireAuth for that.
 */
export async function loadSessionUser(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const userId = req.session?.userId;
  if (userId) {
    const user = await authService.findUserById(userId);
    if (user) {
      req.user = user;
    }
  }
  next();
}

/**
 * Middleware that rejects requests without an authenticated user (401).
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new AppError('Authentication required', 401));
    return;
  }
  next();
}
