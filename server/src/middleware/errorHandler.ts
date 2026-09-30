import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(err);
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const response: ApiError = {
    error: 'Internal Server Error',
  };

  if (isAppError) {
    response.error = err.message;
    if (err.message.toLowerCase().includes('not found')) {
      response.message = 'The requested resource could not be found';
    }
  } else {
    response.message = 'Something went wrong on the server';
  }

  if (isDevelopment && !isAppError) {
    response.details = err.message;
  }

  res.status(statusCode).json(response);
}
