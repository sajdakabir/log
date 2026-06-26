import type { NextFunction, Request, Response } from 'express';
import { SESSION_COOKIE } from '@shiplog/shared';
import { verifySession } from '../services/auth.service';
import { AppError } from '../utils/AppError';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) {
    next(AppError.unauthorized('Not authenticated', 'NO_SESSION'));
    return;
  }
  try {
    const payload = verifySession(token);
    req.userId = payload.sub;
    next();
  } catch {
    next(AppError.unauthorized('Invalid or expired session', 'INVALID_SESSION'));
  }
}
