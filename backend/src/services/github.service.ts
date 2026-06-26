import type { Octokit } from '@octokit/rest';
import type { Project, User } from '@prisma/client';
import type { GithubRepoDTO } from '@shiplog/shared';
import { decrypt } from '../lib/crypto';
import { AppError } from '../utils/AppError';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_PRS = 150;
const MAX_PR_PAGES = 3;

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

export interface ActivityPR {
  number: number;
  title: string;
  body: string;
  labels: string[];
  mergedAt: string;
}

export interface ActivityCommit {
  sha: string;
  message: string;
}

export interface RepoActivity {
  repoFullName: string;
  defaultBranch: string;
  headSha: string | null;
  /** Version bucket the new work belongs to ("Unreleased" if no fresh release). */
  version: string;
  windowDescription: string;
  prs: ActivityPR[];
  commits: ActivityCommit[];
}

/** Collect the new activity (merged PRs, commit fallback, version) since the watermark. */
export async function collectActivity(octokit: Octokit, project: Project): Promise<RepoActivity> {
  const owner = project.repoOwner;
  const repo = project.repoName;
  const branch = project.defaultBranch ?? 'main';
  const since = project.lastSyncedAt ?? new Date(Date.now() - THIRTY_DAYS_MS);
  const windowDescription = project.lastSyncedAt
    ? `since ${since.toISOString().slice(0, 10)}`
    : 'the last 30 days';

  const head = await callGithub(() =>
    octokit.rest.repos.listCommits({ owner, repo, sha: branch, per_page: 1 }),
  );
  const headSha = head.data[0]?.sha ?? null;

  const prs: ActivityPR[] = [];
  for (let page = 1; page <= MAX_PR_PAGES && prs.length < MAX_PRS; page++) {
    const { data } = await callGithub(() =>
      octokit.rest.pulls.list({
        owner,
        repo,
        state: 'closed',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
        page,
      }),
    );
    if (data.length === 0) break;
    for (const pr of data) {
      if (!pr.merged_at || new Date(pr.merged_at) <= since) continue;
      prs.push({
        number: pr.number,
        title: pr.title,
        body: pr.body ?? '',
        labels: pr.labels
          .map((l) => (typeof l === 'string' ? l : (l.name ?? '')))
          .filter(Boolean),
        mergedAt: pr.merged_at,
      });
      if (prs.length >= MAX_PRS) break;
    }
  }

  let commits: ActivityCommit[] = [];
  if (prs.length < 3) {
    const { data } = await callGithub(() =>
      octokit.rest.repos.listCommits({
        owner,
        repo,
        sha: branch,
        since: since.toISOString(),
        per_page: 100,
      }),
    );
    commits = data
      .filter((c) => (c.parents?.length ?? 0) <= 1 && !c.commit.message.startsWith('Merge '))
      .slice(0, 80)
      .map((c) => ({ sha: c.sha.slice(0, 7), message: c.commit.message.split('\n')[0] ?? '' }));
  }

  let version = 'Unreleased';
  try {
    const releases = await callGithub(() =>
      octokit.rest.repos.listReleases({ owner, repo, per_page: 5 }),
    );
    const latest = releases.data.find((r) => !r.draft && r.published_at);
    if (
      latest?.published_at &&
      (!project.lastSyncedAt || new Date(latest.published_at) > project.lastSyncedAt)
    ) {
      version = latest.tag_name;
    }
  } catch {
    // releases are optional; fall back to "Unreleased"
  }

  return { repoFullName: project.repoFullName, defaultBranch: branch, headSha, version, windowDescription, prs, commits };
}
