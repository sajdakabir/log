import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import { env, githubScopeParam } from '../config/env';
import { prisma } from '../lib/prisma';
import { encrypt } from '../lib/crypto';
import { AppError } from '../utils/AppError';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_API = 'https://api.github.com';

export interface SessionPayload {
  sub: string;
  githubLogin: string;
}

interface GithubTokenResponse {
  access_token?: string;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

export interface GithubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

export function randomToken(bytes = 16): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: env.GITHUB_OAUTH_CALLBACK_URL,
    scope: githubScopeParam,
    state,
    allow_signup: 'false',
  });
  return `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string,
): Promise<{ accessToken: string; scope: string }> {
  const res = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: env.GITHUB_OAUTH_CALLBACK_URL,
    }),
  });
  const data = (await res.json()) as GithubTokenResponse;
  if (!res.ok || data.error || !data.access_token) {
    throw AppError.badGateway(
      `GitHub token exchange failed: ${data.error_description ?? data.error ?? res.statusText}`,
      'GITHUB_OAUTH_FAILED',
    );
  }
  return { accessToken: data.access_token, scope: data.scope ?? '' };
}

export async function fetchGithubUser(accessToken: string): Promise<GithubUser> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'shiplog',
  };
  const res = await fetch(`${GITHUB_API}/user`, { headers });
  if (!res.ok) throw AppError.badGateway('Failed to fetch GitHub user', 'GITHUB_USER_FAILED');
  const user = (await res.json()) as GithubUser;

  if (!user.email) {
    const emailsRes = await fetch(`${GITHUB_API}/user/emails`, { headers });
    if (emailsRes.ok) {
      const emails = (await emailsRes.json()) as Array<{
        email: string;
        primary: boolean;
        verified: boolean;
      }>;
      const chosen = emails.find((e) => e.primary && e.verified) ?? emails.find((e) => e.verified);
      if (chosen) user.email = chosen.email;
    }
  }
  return user;
}

export async function upsertUserFromGithub(
  gh: GithubUser,
  accessToken: string,
  scope: string,
): Promise<User> {
  const data = {
    githubLogin: gh.login,
    name: gh.name,
    avatarUrl: gh.avatar_url,
    email: gh.email ?? undefined,
    accessTokenEnc: encrypt(accessToken),
    scopes: scope,
  };
  return prisma.user.upsert({
    where: { githubId: gh.id },
    update: data,
    create: { githubId: gh.id, ...data },
  });
}

export function signSession(userId: string, githubLogin: string): string {
  return jwt.sign({ sub: userId, githubLogin } satisfies SessionPayload, env.SESSION_JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifySession(token: string): SessionPayload {
  const decoded = jwt.verify(token, env.SESSION_JWT_SECRET);
  if (typeof decoded === 'string' || !decoded.sub) {
    throw new Error('Invalid session payload');
  }
  return { sub: String(decoded.sub), githubLogin: String((decoded as SessionPayload).githubLogin) };
}
