import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z.string().default('info'),
  APP_URL: z.string().url().default('http://localhost:5173'),

  DATABASE_URL: z.string().min(1),
  SESSION_JWT_SECRET: z.string().min(16, 'SESSION_JWT_SECRET must be at least 16 chars'),
  TOKEN_ENC_KEY: z.string().min(1),

  GITHUB_CLIENT_ID: z.string().default(''),
  GITHUB_CLIENT_SECRET: z.string().default(''),
  GITHUB_OAUTH_CALLBACK_URL: z
    .string()
    .url()
    .default('http://localhost:4000/api/auth/github/callback'),
  GITHUB_OAUTH_SCOPES: z.string().default('read:user,public_repo'),

  OPENAI_API_KEY: z.string().default(''),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error(
    'Invalid environment variables:\n',
    JSON.stringify(parsed.error.flatten().fieldErrors, null, 2),
  );
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
export const isDev = env.NODE_ENV === 'development';

/** OAuth scopes as a space-delimited string for the GitHub authorize URL. */
export const githubScopeParam = env.GITHUB_OAUTH_SCOPES.split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .join(' ');

export function assertGithubConfigured(): void {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    throw new Error(
      'GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend/.env',
    );
  }
}

export function assertOpenAIConfigured(): void {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OpenAI is not configured. Set OPENAI_API_KEY in backend/.env');
  }
}
