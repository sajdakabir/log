import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

/**
 * Loads the full User record (including the encrypted GitHub token) onto req.user.
 * Use after requireAuth, on routes that call GitHub on the user's behalf.
 */
export async function loadUser(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw AppError.unauthorized();
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) throw AppError.unauthorized('User not found', 'NO_USER');
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
