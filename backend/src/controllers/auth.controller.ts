import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../config/env';
import * as authService from '../services/auth.service';
import {
  setSessionCookies,
  clearSessionCookies,
  setStateCookie,
  clearStateCookie,
  STATE_COOKIE,
} from '../lib/cookies';
import { logger } from '../lib/logger';

const callbackQuery = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
});

function redirectToCallback(res: Response, error?: string): void {
  const url = new URL('/auth/callback', env.APP_URL);
  if (error) url.searchParams.set('error', error);
  res.redirect(url.toString());
}

export function startGithubOAuth(_req: Request, res: Response): void {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    redirectToCallback(res, 'github_not_configured');
    return;
  }
  const state = authService.randomToken(16);
  setStateCookie(res, state);
  res.redirect(authService.buildAuthorizeUrl(state));
}

export async function githubCallback(req: Request, res: Response): Promise<void> {
  const parsed = callbackQuery.safeParse(req.query);
  const cookieState = req.cookies?.[STATE_COOKIE];
  clearStateCookie(res);

  if (!parsed.success) return redirectToCallback(res, 'invalid_request');
  const { code, state, error } = parsed.data;

  if (error) return redirectToCallback(res, error);
  if (!code || !state || !cookieState) return redirectToCallback(res, 'missing_code_or_state');

  if (
    state.length !== cookieState.length ||
    !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(cookieState))
  ) {
    return redirectToCallback(res, 'state_mismatch');
  }

  try {
    const { accessToken, scope } = await authService.exchangeCodeForToken(code);
    const ghUser = await authService.fetchGithubUser(accessToken);
    const user = await authService.upsertUserFromGithub(ghUser, accessToken, scope);
    setSessionCookies(res, authService.signSession(user.id, user.githubLogin));
    redirectToCallback(res);
  } catch (err) {
    logger.error({ err }, 'GitHub OAuth callback failed');
    redirectToCallback(res, 'oauth_failed');
  }
}

export function logout(_req: Request, res: Response): void {
  clearSessionCookies(res);
  res.json({ ok: true });
}
