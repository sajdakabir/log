import crypto from 'node:crypto';

/** Slugs that would collide with app routes / static assets and must never be assigned. */
export const RESERVED_SLUGS = new Set([
  'api',
  'public',
  'app',
  'login',
  'logout',
  'auth',
  'callback',
  'dashboard',
  'settings',
  'admin',
  'assets',
  'static',
  'favicon.ico',
  'robots.txt',
  '_next',
  'new',
  'connect',
]);

/** Normalize an arbitrary string into a URL-safe slug. */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'project';
}

export function isReserved(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}

/** A short random suffix used to break slug collisions. */
export function randomSuffix(): string {
  return crypto.randomBytes(3).toString('hex');
}
