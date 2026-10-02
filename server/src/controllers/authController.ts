import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { RegisterSchema, LoginSchema } from '../services/validation';
import { AppError } from '../middleware/errorHandler';
import { config } from '../config';

const SESSION_COOKIE_NAME = config.auth.cookieName;

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Validation failed';
      throw new AppError(message, 400);
    }
    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((err: any) => (err ? reject(err) : resolve()));
    });
    const user = await authService.registerUser(parsed.data);
    req.session!.userId = user.id;
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Validation failed';
      throw new AppError(message, 400);
    }
    const user = await authService.verifyCredentials(parsed.data);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }
    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((err: any) => (err ? reject(err) : resolve()));
    });
    req.session!.userId = user.id;
    res.json({ user: authService.toSafeUser(user) });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.session!.userId = null;
    req.session!.destroy((err: Error | null) => {
      if (err) {
        next(err);
        return;
      }
      res.clearCookie(SESSION_COOKIE_NAME);
      res.json({ success: true });
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError('Authentication required', 401);
    }
    res.json({ user: authService.toSafeUser(user) });
  } catch (err) {
    next(err);
  }
};
