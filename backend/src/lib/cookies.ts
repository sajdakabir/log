import crypto from 'node:crypto';
import type { Response } from 'express';
import { isProd } from '../config/env';
import { SESSION_COOKIE, CSRF_COOKIE } from '@shiplog/shared';

export const STATE_COOKIE = 'oauth_state';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const TEN_MIN_MS = 10 * 60 * 1000;

// Single-origin deploy → SameSite=Lax is enough (no cross-site XHR). Secure only in prod.
const httpOnlyBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: isProd,
  path: '/',
};

/** Set the session (sid, httpOnly) + CSRF (csrf, readable by JS) cookies. */
export function setSessionCookies(res: Response, sid: string): void {
  res.cookie(SESSION_COOKIE, sid, { ...httpOnlyBase, maxAge: SEVEN_DAYS_MS });
  const csrf = crypto.randomBytes(24).toString('hex');
  // CSRF cookie is intentionally NOT httpOnly — the SPA reads it and echoes it in a header.
  res.cookie(CSRF_COOKIE, csrf, {
    httpOnly: false,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: SEVEN_DAYS_MS,
  });
}

export function clearSessionCookies(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.clearCookie(CSRF_COOKIE, { path: '/' });
}

export function setStateCookie(res: Response, state: string): void {
  res.cookie(STATE_COOKIE, state, { ...httpOnlyBase, maxAge: TEN_MIN_MS });
}

export function clearStateCookie(res: Response): void {
  res.clearCookie(STATE_COOKIE, { path: '/' });
}
