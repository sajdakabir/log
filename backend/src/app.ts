import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { env, isProd } from './config/env';
import { logger } from './lib/logger';
import { apiRouter, publicRouter } from './routes';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

const here = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(here, '../../frontend/dist');

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(
    pinoHttp({
      logger,
      autoLogging: { ignore: (req) => req.url === '/api/health' },
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(cors({ origin: env.APP_URL, credentials: true }));

  app.use('/api', apiRouter);
  app.use('/public', publicRouter);

  // Single-origin prod: serve the built SPA and fall back to index.html for client
  // routes. Mounted after /api and /public so API routes are never shadowed.
  if (isProd) {
    app.use(express.static(clientDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/public')) return next();
      res.sendFile(path.join(clientDir, 'index.html'));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
