import type { ChangelogEntry, Project } from '@prisma/client';
import type { ChangeItem, EntryDTO, ProjectDTO } from '@shiplog/shared';

export function toProjectDTO(p: Project): ProjectDTO {
  return {
    id: p.id,
    repoFullName: p.repoFullName,
    repoOwner: p.repoOwner,
    repoName: p.repoName,
    defaultBranch: p.defaultBranch,
    slug: p.slug,
    displayName: p.displayName,
    description: p.description,
    isPublic: p.isPublic,
    lastSyncedAt: p.lastSyncedAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export function toEntryDTO(e: ChangelogEntry): EntryDTO {
  return {
    id: e.id,
    projectId: e.projectId,
    title: e.title,
    summary: e.summary,
    bodyMarkdown: e.bodyMarkdown,
    version: e.version,
    changes: (e.changes as ChangeItem[] | null) ?? null,
    status: e.status,
    publishedAt: e.publishedAt?.toISOString() ?? null,
    sortOrder: e.sortOrder,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  };
}
