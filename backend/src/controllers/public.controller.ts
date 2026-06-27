import type { Request, Response } from 'express';
import type { PublicChangelogDTO } from '@shiplog/shared';
import * as changelogService from '../services/changelog.service';
import { toEntryDTO } from '../lib/serializers';

export async function getChangelog(req: Request, res: Response): Promise<void> {
  const { project, versions } = await changelogService.getPublicChangelog(req.params.slug!);

  const payload: PublicChangelogDTO = {
    project: {
      displayName: project.displayName,
      description: project.description,
      slug: project.slug,
      repoFullName: project.repoFullName,
    },
    versions: versions.map((v) => ({
      version: v.version,
      entries: v.entries.map(toEntryDTO),
    })),
  };
  res.json(payload);
}
