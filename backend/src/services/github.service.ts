import type { Octokit } from '@octokit/rest';
import type { User } from '@prisma/client';
import type { GithubRepoDTO } from '@shiplog/shared';
import { decrypt } from '../lib/crypto';
import { AppError } from '../utils/AppError';

/** Decrypt a user's stored GitHub token, or signal that re-auth is required. */
export function getUserAccessToken(user: User): string {
  if (!user.accessTokenEnc) {
    throw AppError.unauthorized('GitHub re-authorization required', 'GITHUB_REAUTH_REQUIRED');
  }
  try {
    return decrypt(user.accessTokenEnc);
  } catch {
    throw AppError.unauthorized('GitHub re-authorization required', 'GITHUB_REAUTH_REQUIRED');
  }
}

function githubStatus(err: unknown): number | undefined {
  if (err && typeof err === 'object' && 'status' in err) {
    return (err as { status?: number }).status;
  }
  return undefined;
}

/** Run a GitHub call, normalizing common failures into AppErrors. */
async function callGithub<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    switch (githubStatus(err)) {
      case 401:
        throw AppError.unauthorized('GitHub re-authorization required', 'GITHUB_REAUTH_REQUIRED');
      case 403:
      case 429:
        throw AppError.tooMany('GitHub rate limit reached — try again shortly', 'GITHUB_RATE_LIMITED');
      case 404:
        throw AppError.notFound('Repository not found on GitHub', 'GITHUB_NOT_FOUND');
      default:
        throw AppError.badGateway('GitHub request failed', 'GITHUB_ERROR');
    }
  }
}

export async function listUserRepos(octokit: Octokit): Promise<GithubRepoDTO[]> {
  const repos = await callGithub(() =>
    octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
      visibility: 'public',
      affiliation: 'owner',
      sort: 'updated',
      per_page: 100,
    }),
  );
  return repos.slice(0, 200).map((r) => ({
    id: r.id,
    fullName: r.full_name,
    owner: r.owner.login,
    name: r.name,
    description: r.description,
    defaultBranch: r.default_branch,
    isPrivate: r.private,
    htmlUrl: r.html_url,
    updatedAt: r.updated_at ?? null,
    stargazersCount: r.stargazers_count ?? 0,
  }));
}

export interface GithubRepoDetail {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  description: string | null;
  owner: { id: number; login: string };
}

/** Fetch a single repo by its numeric id (GET /repositories/{id}). */
export async function getRepoById(octokit: Octokit, repoId: number): Promise<GithubRepoDetail> {
  const res = await callGithub(() =>
    octokit.request('GET /repositories/{id}', { id: repoId }),
  );
  return res.data as unknown as GithubRepoDetail;
}
