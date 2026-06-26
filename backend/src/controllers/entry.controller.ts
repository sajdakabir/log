import type { Request, Response } from 'express';
import * as projectService from '../services/project.service';
import * as changelogService from '../services/changelog.service';
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
