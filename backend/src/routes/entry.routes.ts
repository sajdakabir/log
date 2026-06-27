import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/requireAuth';
import { requireCsrf } from '../middleware/requireCsrf';
import { validateBody } from '../middleware/validate';
import { updateEntrySchema } from '../schemas/entry.schema';
import * as entry from '../controllers/entry.controller';

export const entryRouter = Router();

entryRouter.get('/projects/:id/entries', requireAuth, asyncHandler(entry.list));
entryRouter.get('/projects/:id/entries/:entryId', requireAuth, asyncHandler(entry.getOne));
entryRouter.patch(
  '/projects/:id/entries/:entryId',
  requireAuth,
  requireCsrf,
  validateBody(updateEntrySchema),
  asyncHandler(entry.update),
);
entryRouter.delete(
  '/projects/:id/entries/:entryId',
  requireAuth,
  requireCsrf,
  asyncHandler(entry.remove),
);
entryRouter.post(
  '/projects/:id/entries/:entryId/publish',
  requireAuth,
  requireCsrf,
  asyncHandler(entry.publish),
);
