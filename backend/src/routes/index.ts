import { Router } from 'express';

export const apiRouter = Router();
export const publicRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Feature routers (auth, repos, projects, entries, public changelog) are mounted
// onto these in later milestones.
