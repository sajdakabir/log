import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/requireAuth';
import { requireCsrf } from '../middleware/requireCsrf';
import * as auth from '../controllers/auth.controller';
import * as user from '../controllers/user.controller';

export const authRouter = Router();

authRouter.get('/auth/github', auth.startGithubOAuth);
authRouter.get('/auth/github/callback', asyncHandler(auth.githubCallback));
authRouter.post('/auth/logout', requireAuth, requireCsrf, auth.logout);
authRouter.get('/me', requireAuth, asyncHandler(user.me));
