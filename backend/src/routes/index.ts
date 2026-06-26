import { Router } from 'express';
import { authRouter } from './auth.routes';
import { repoRouter } from './repo.routes';
import { projectRouter } from './project.routes';
import { entryRouter } from './entry.routes';

export const apiRouter = Router();
export const publicRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

apiRouter.use(authRouter);
apiRouter.use(repoRouter);
apiRouter.use(projectRouter);
apiRouter.use(entryRouter);

// The public changelog router is mounted in M5.
