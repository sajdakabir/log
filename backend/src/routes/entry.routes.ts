import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/requireAuth';
import * as entry from '../controllers/entry.controller';

export const entryRouter = Router();

entryRouter.get('/projects/:id/entries', requireAuth, asyncHandler(entry.list));

// Per-entry read/update/delete/publish routes are added in M4.
