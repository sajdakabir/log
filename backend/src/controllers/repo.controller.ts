import type { Request, Response } from 'express';
import { createOctokit } from '../lib/octokit';
import * as githubService from '../services/github.service';

export async function listRepos(req: Request, res: Response): Promise<void> {
  const octokit = createOctokit(githubService.getUserAccessToken(req.user!));
  const repos = await githubService.listUserRepos(octokit);
  res.json(repos);
}
