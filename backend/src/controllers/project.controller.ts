import type { Request, Response } from 'express';
import { createOctokit } from '../lib/octokit';
import { getUserAccessToken } from '../services/github.service';
import * as projectService from '../services/project.service';
import { toProjectDTO } from '../lib/serializers';

export async function create(req: Request, res: Response): Promise<void> {
  const octokit = createOctokit(getUserAccessToken(req.user!));
  const project = await projectService.createProject(req.user!, octokit, req.body);
  res.status(201).json(toProjectDTO(project));
}

export async function list(req: Request, res: Response): Promise<void> {
  const projects = await projectService.listProjects(req.userId!);
  res.json(projects.map(toProjectDTO));
}

export async function get(req: Request, res: Response): Promise<void> {
  const project = await projectService.getOwnedProject(req.userId!, req.params.id!);
  res.json(toProjectDTO(project));
}

export async function update(req: Request, res: Response): Promise<void> {
  const project = await projectService.updateProject(req.userId!, req.params.id!, req.body);
  res.json(toProjectDTO(project));
}

export async function remove(req: Request, res: Response): Promise<void> {
  await projectService.deleteProject(req.userId!, req.params.id!);
  res.status(204).end();
}
