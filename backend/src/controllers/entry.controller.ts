import type { Request, Response } from 'express';
import * as projectService from '../services/project.service';
import * as changelogService from '../services/changelog.service';
import * as entryService from '../services/entry.service';
import { toEntryDTO } from '../lib/serializers';

export async function list(req: Request, res: Response): Promise<void> {
  await projectService.getOwnedProject(req.userId!, req.params.id!);
  const status = req.query.status;
  let entries = await changelogService.listProjectEntries(req.params.id!);
  if (status === 'DRAFT' || status === 'PUBLISHED') {
    entries = entries.filter((e) => e.status === status);
  }
  res.json(entries.map(toEntryDTO));
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const entry = await entryService.getOwnedEntry(req.userId!, req.params.id!, req.params.entryId!);
  res.json(toEntryDTO(entry));
}

export async function update(req: Request, res: Response): Promise<void> {
  const entry = await entryService.updateEntry(
    req.userId!,
    req.params.id!,
    req.params.entryId!,
    req.body,
  );
  res.json(toEntryDTO(entry));
}

export async function remove(req: Request, res: Response): Promise<void> {
  await entryService.deleteEntry(req.userId!, req.params.id!, req.params.entryId!);
  res.status(204).end();
}

export async function publish(req: Request, res: Response): Promise<void> {
  const entry = await entryService.publishEntry(req.userId!, req.params.id!, req.params.entryId!);
  res.json(toEntryDTO(entry));
}
