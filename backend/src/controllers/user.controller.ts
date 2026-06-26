import type { Request, Response } from 'express';
import type { UserDTO } from '@shiplog/shared';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

export async function me(req: Request, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, githubLogin: true, name: true, email: true, avatarUrl: true },
  });
  if (!user) throw AppError.unauthorized('User not found', 'NO_USER');
  res.json(user satisfies UserDTO);
}
