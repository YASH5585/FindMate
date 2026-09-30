import { RequestHandler } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { AppError } from '../middleware/errorHandler';

export function validateBody(schema: ZodSchema): RequestHandler {
  return (req, _res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues[0]?.message ?? 'Validation failed';
        next(new AppError(message, 400));
      } else {
        next(err);
      }
    }
  };
}

export function validateParams(schema: ZodSchema): RequestHandler {
  return (req, _res, next) => {
    try {
      schema.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues[0]?.message ?? 'Validation failed';
        next(new AppError(message, 400));
      } else {
        next(err);
      }
    }
  };
}
