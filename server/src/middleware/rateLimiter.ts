import { rateLimit } from 'express-rate-limit';
import type { RateLimitRequestHandler } from 'express-rate-limit';
import { config } from '../config';

export function createRateLimiter(options: {
  windowMs?: number;
  max?: number;
  message?: string;
}): RateLimitRequestHandler {
  return rateLimit({
    windowMs: options.windowMs ?? config.rateLimit.windowMs,
    max: options.max ?? config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests',
      message: options.message ?? 'Too many requests, please try again later.',
    },
    skip: () => !config.isProduction && process.env.DISABLE_RATE_LIMIT === 'true' ? true : false,
  });
}

export const authRateLimiter = createRateLimiter({
  max: config.rateLimit.authMax,
  message: 'Too many attempts, please try again later.',
});

export const contactRateLimiter = createRateLimiter({
  max: 20,
  message: 'Too many contact requests, please try again later.',
});

export const reportRateLimiter = createRateLimiter({
  max: 10,
  message: 'Too many reports, please try again later.',
});
