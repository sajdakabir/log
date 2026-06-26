import { Router } from 'express';
import { authRouter } from './auth.routes';

export const apiRouter = Router();
export const publicRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

apiRouter.use(authRouter);

// Repo, project, entry, and public changelog routers are mounted in later milestones.
