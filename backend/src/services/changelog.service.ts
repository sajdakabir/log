import crypto from 'node:crypto';
import type { ChangelogEntry, Prisma, Project } from '@prisma/client';
import type { Octokit } from '@octokit/rest';
import { prisma } from '../lib/prisma';
import * as githubService from './github.service';
import * as aiService from './ai.service';
import type { RepoActivity } from './github.service';
import type { AIEntry } from '../schemas/ai.schema';

export interface GenerateResult {
  generationId: string;
  reused: boolean;
  entries: ChangelogEntry[];
}

function computeFingerprint(activity: RepoActivity, model: string): string {
  const prNumbers = activity.prs.map((p) => p.number).sort((a, b) => a - b);
  const shas = activity.commits.map((c) => c.sha).sort();
  const payload = JSON.stringify({
    head: activity.headSha,
    version: activity.version,
    prs: prNumbers,
    commits: shas,
    model,
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

export function listProjectEntries(projectId: string): Promise<ChangelogEntry[]> {
  return prisma.changelogEntry.findMany({ where: { projectId }, orderBy: { updatedAt: 'desc' } });
}

async function advanceWatermark(project: Project, activity: RepoActivity): Promise<void> {
  await prisma.project.update({
    where: { id: project.id },
    data: { lastSyncedAt: new Date(), lastSyncedSha: activity.headSha },
  });
}

async function upsertDrafts(
  projectId: string,
  aiEntries: AIEntry[],
  activity: RepoActivity,
): Promise<void> {
  const sourceRefs: Prisma.InputJsonValue = {
    prs: activity.prs.map((p) => p.number),
    commits: activity.commits.map((c) => c.sha),
  };

  for (const entry of aiEntries) {
    const existing = await prisma.changelogEntry.findUnique({
      where: { projectId_version: { projectId, version: entry.version } },
    });
    // Published versions are frozen — never overwrite them.
    if (existing?.status === 'PUBLISHED') continue;

    const data = {
      title: entry.title,
      summary: entry.summary,
      bodyMarkdown: entry.body_markdown,
      changes: entry.changes as unknown as Prisma.InputJsonValue,
      sourceRefs,
      status: 'DRAFT' as const,
    };

    if (existing) {
      await prisma.changelogEntry.update({ where: { id: existing.id }, data });
    } else {
      await prisma.changelogEntry.create({ data: { projectId, version: entry.version, ...data } });
    }
  }
}

export async function generateForProject(
  project: Project,
  octokit: Octokit,
  opts: { force: boolean; model: string },
): Promise<GenerateResult> {
  const activity = await githubService.collectActivity(octokit, project);
  const fingerprint = computeFingerprint(activity, opts.model);
  const hasActivity = activity.prs.length > 0 || activity.commits.length > 0;

  const latest = await prisma.generation.findFirst({
    where: { projectId: project.id, status: 'DONE' },
    orderBy: { createdAt: 'desc' },
  });

  // Same fingerprint and not forced → reuse existing drafts, no OpenAI call.
  if (!opts.force && latest && latest.fingerprint === fingerprint) {
    return { generationId: latest.id, reused: true, entries: await listProjectEntries(project.id) };
  }

  // Nothing new in the window → record, advance watermark, no OpenAI call.
  if (!hasActivity) {
    const gen = await prisma.generation.create({
      data: {
        projectId: project.id,
        status: 'DONE',
        fingerprint,
        model: opts.model,
        finishedAt: new Date(),
      },
    });
    await advanceWatermark(project, activity);
    return { generationId: gen.id, reused: true, entries: await listProjectEntries(project.id) };
  }

  const gen = await prisma.generation.create({
    data: { projectId: project.id, status: 'RUNNING', fingerprint, model: opts.model },
  });

  try {
    const aiEntries = await aiService.generateChangelog(activity, opts.model);
    await upsertDrafts(project.id, aiEntries, activity);
    await prisma.generation.update({
      where: { id: gen.id },
      data: { status: 'DONE', finishedAt: new Date() },
    });
    await advanceWatermark(project, activity);
    return { generationId: gen.id, reused: false, entries: await listProjectEntries(project.id) };
  } catch (err) {
    await prisma.generation.update({
      where: { id: gen.id },
      data: {
        status: 'FAILED',
        error: err instanceof Error ? err.message : String(err),
        finishedAt: new Date(),
      },
    });
    throw err;
  }
}
