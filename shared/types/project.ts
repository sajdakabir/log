import type { EntryDTO } from './entry';

export interface ProjectDTO {
  id: string;
  repoFullName: string;
  repoOwner: string;
  repoName: string;
  defaultBranch: string | null;
  slug: string;
  displayName: string | null;
  description: string | null;
  isPublic: boolean;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GithubRepoDTO {
  id: number;
  fullName: string;
  owner: string;
  name: string;
  description: string | null;
  defaultBranch: string;
  isPrivate: boolean;
  htmlUrl: string;
  updatedAt: string | null;
  stargazersCount: number;
}

export interface CreateProjectInput {
  githubRepoId: number;
  slug?: string;
}

export interface UpdateProjectInput {
  displayName?: string | null;
  slug?: string;
  description?: string | null;
  isPublic?: boolean;
}

export interface GenerateResultDTO {
  generationId: string;
  reused: boolean;
  entries: EntryDTO[];
}

export interface PublicVersionGroup {
  version: string;
  entries: EntryDTO[];
}

export interface PublicChangelogDTO {
  project: {
    displayName: string | null;
    description: string | null;
    slug: string;
    repoFullName: string;
  };
  versions: PublicVersionGroup[];
}
