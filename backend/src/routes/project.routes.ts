import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/requireAuth';
import { requireCsrf } from '../middleware/requireCsrf';
import { loadUser } from '../middleware/loadUser';
import { validateBody } from '../middleware/validate';
import { generateRateLimit } from '../middleware/rateLimit';
import { createProjectSchema, updateProjectSchema } from '../schemas/project.schema';
import * as project from '../controllers/project.controller';
import * as generateCtrl from '../controllers/generate.controller';

export const projectRouter = Router();

projectRouter.get('/projects', requireAuth, asyncHandler(project.list));
projectRouter.post(
  '/projects',
  requireAuth,
  requireCsrf,
  loadUser,
  validateBody(createProjectSchema),
  asyncHandler(project.create),
);
projectRouter.get('/projects/:id', requireAuth, asyncHandler(project.get));
projectRouter.patch(
  '/projects/:id',
  requireAuth,
  requireCsrf,
  validateBody(updateProjectSchema),
  asyncHandler(project.update),
);
projectRouter.delete('/projects/:id', requireAuth, requireCsrf, asyncHandler(project.remove));

projectRouter.post(
  '/projects/:id/generate',
  requireAuth,
  requireCsrf,
  loadUser,
  generateRateLimit,
  asyncHandler(generateCtrl.generate),
);
