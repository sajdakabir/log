export const queryKeys = {
  me: ['me'] as const,
  githubRepos: ['github-repos'] as const,
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  entries: (projectId: string) => ['projects', projectId, 'entries'] as const,
  entry: (projectId: string, entryId: string) =>
    ['projects', projectId, 'entries', entryId] as const,
};
