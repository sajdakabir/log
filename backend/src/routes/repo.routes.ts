import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/requireAuth';
import { loadUser } from '../middleware/loadUser';
import * as repo from '../controllers/repo.controller';

export const repoRouter = Router();

repoRouter.get('/repos', requireAuth, loadUser, asyncHandler(repo.listRepos));
