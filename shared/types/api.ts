/**
 * Single source of truth for API paths. The frontend api client builds requests
 * from these; the backend mounts routers at the matching prefixes.
 */
export const API = {
  // auth
  authGithub: '/api/auth/github',
  logout: '/api/auth/logout',
  me: '/api/me',
  // repos + projects
  repos: '/api/repos',
  projects: '/api/projects',
  project: (id: string) => `/api/projects/${id}`,
  generate: (id: string) => `/api/projects/${id}/generate`,
  // entries
  entries: (projectId: string) => `/api/projects/${projectId}/entries`,
  entry: (projectId: string, entryId: string) =>
    `/api/projects/${projectId}/entries/${entryId}`,
  publish: (projectId: string, entryId: string) =>
    `/api/projects/${projectId}/entries/${entryId}/publish`,
  // public
  publicChangelog: (slug: string) => `/public/changelog/${slug}`,
} as const;

export const CSRF_HEADER = 'X-CSRF-Token';
export const CSRF_COOKIE = 'csrf';
export const SESSION_COOKIE = 'sid';
