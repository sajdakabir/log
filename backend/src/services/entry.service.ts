import { Prisma, type ChangelogEntry } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { getOwnedProject } from './project.service';
import type { UpdateEntryBody } from '../schemas/entry.schema';

/** Fetch an entry, asserting the caller owns its project and it belongs to that project. */
export async function getOwnedEntry(
  userId: string,
  projectId: string,
  entryId: string,
): Promise<ChangelogEntry> {
  await getOwnedProject(userId, projectId);
  const entry = await prisma.changelogEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.projectId !== projectId) throw AppError.notFound('Entry not found');
  return entry;
}

export async function updateEntry(
  userId: string,
  projectId: string,
  entryId: string,
  input: UpdateEntryBody,
): Promise<ChangelogEntry> {
  const entry = await getOwnedEntry(userId, projectId, entryId);

  const data: Prisma.ChangelogEntryUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.summary !== undefined) data.summary = input.summary;
  if (input.bodyMarkdown !== undefined) data.bodyMarkdown = input.bodyMarkdown;
  if (input.changes !== undefined) {
    data.changes =
      input.changes === null ? Prisma.JsonNull : (input.changes as unknown as Prisma.InputJsonValue);
  }

  if (input.version !== undefined && input.version !== entry.version) {
    const clash = await prisma.changelogEntry.findUnique({
      where: { projectId_version: { projectId, version: input.version } },
    });
    if (clash && clash.id !== entryId) {
      throw AppError.conflict('Another entry already uses that version', 'VERSION_TAKEN');
    }
    data.version = input.version;
  }

  return prisma.changelogEntry.update({ where: { id: entryId }, data });
}

export async function deleteEntry(
  userId: string,
  projectId: string,
  entryId: string,
): Promise<void> {
  const entry = await getOwnedEntry(userId, projectId, entryId);
  await prisma.changelogEntry.delete({ where: { id: entry.id } });
}
