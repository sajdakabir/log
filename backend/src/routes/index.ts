import { Router } from 'express';
import { authRouter } from './auth.routes';
import { repoRouter } from './repo.routes';
import { projectRouter } from './project.routes';

export const apiRouter = Router();
export const publicRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

apiRouter.use(authRouter);
apiRouter.use(repoRouter);
apiRouter.use(projectRouter);

// Entry and public changelog routers are mounted in later milestones.
