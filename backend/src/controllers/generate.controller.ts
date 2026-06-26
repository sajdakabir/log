import type { Request, Response } from 'express';
import { z } from 'zod';
import type { GenerateResultDTO } from '@shiplog/shared';
import { env } from '../config/env';
import { createOctokit } from '../lib/octokit';
import { getUserAccessToken } from '../services/github.service';
import * as projectService from '../services/project.service';
import * as changelogService from '../services/changelog.service';
import { toEntryDTO } from '../lib/serializers';

const bodySchema = z.object({ force: z.boolean().optional() });

export async function generate(req: Request, res: Response): Promise<void> {
  const project = await projectService.getOwnedProject(req.userId!, req.params.id!);
  const { force } = bodySchema.parse(req.body ?? {});

  const octokit = createOctokit(getUserAccessToken(req.user!));
  const result = await changelogService.generateForProject(project, octokit, {
    force: force ?? false,
    model: env.OPENAI_MODEL,
  });

  const payload: GenerateResultDTO = {
    generationId: result.generationId,
    reused: result.reused,
    entries: result.entries.map(toEntryDTO),
  };
  res.json(payload);
}
