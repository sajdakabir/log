import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { CSRF_COOKIE, CSRF_HEADER } from '@shiplog/shared';
import { AppError } from '../utils/AppError';

/** Double-submit CSRF check for state-changing requests. */
export function requireCsrf(req: Request, _res: Response, next: NextFunction): void {
  const cookie = req.cookies?.[CSRF_COOKIE];
  const header = req.get(CSRF_HEADER);

  if (
    !cookie ||
    !header ||
    cookie.length !== header.length ||
    !crypto.timingSafeEqual(Buffer.from(cookie), Buffer.from(header))
  ) {
    next(AppError.forbidden('Invalid CSRF token', 'CSRF_FAILED'));
    return;
  }
  next();
}
