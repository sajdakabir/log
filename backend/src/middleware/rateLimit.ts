import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

/** Per-user limit on the expensive generate endpoint. Mount after requireAuth. */
export const generateRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.userId ?? 'anonymous',
  handler: (_req, res) => {
    res.status(429).json({
      error: { code: 'RATE_LIMITED', message: 'Too many generations — try again later.' },
    });
  },
});
