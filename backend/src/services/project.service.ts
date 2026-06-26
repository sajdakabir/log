import type { Octokit } from '@octokit/rest';
import type { Project, User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { slugify, isReserved, randomSuffix } from '../lib/slug';
import { AppError } from '../utils/AppError';
import * as githubService from './github.service';
import type { CreateProjectBody, UpdateProjectBody } from '../schemas/project.schema';

export async function generateUniqueSlug(desired: string): Promise<string> {
  let base = slugify(desired);
  if (isReserved(base)) base = `${base}-1`;
  let candidate = base;
  for (let i = 0; i < 5; i++) {
    const existing = await prisma.project.findUnique({ where: { slug: candidate } });
    if (!existing && !isReserved(candidate)) return candidate;
    candidate = `${base}-${randomSuffix()}`;
  }
  return `${base}-${randomSuffix()}`;
}

export async function createProject(
  user: User,
  octokit: Octokit,
  input: CreateProjectBody,
): Promise<Project> {
  const repo = await githubService.getRepoById(octokit, input.githubRepoId);

  if (repo.private) {
    throw AppError.badRequest('Only public repositories are supported', 'PRIVATE_REPO');
  }
  if (repo.owner?.id !== user.githubId) {
    throw AppError.forbidden('You can only connect repositories you own', 'NOT_OWNER');
  }

  const existing = await prisma.project.findUnique({
    where: { userId_githubRepoId: { userId: user.id, githubRepoId: repo.id } },
  });
  if (existing) throw AppError.conflict('This repository is already connected', 'ALREADY_CONNECTED');

  const slug = await generateUniqueSlug(input.slug || repo.name);

  return prisma.project.create({
    data: {
      userId: user.id,
      githubRepoId: repo.id,
      repoOwner: repo.owner.login,
      repoName: repo.name,
      repoFullName: repo.full_name,
      defaultBranch: repo.default_branch,
      slug,
      displayName: repo.name,
      description: repo.description,
    },
  });
}

export function listProjects(userId: string): Promise<Project[]> {
  return prisma.project.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

export async function getOwnedProject(userId: string, id: string): Promise<Project> {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.userId !== userId) throw AppError.notFound('Project not found');
  return project;
}

export async function updateProject(
  userId: string,
  id: string,
  input: UpdateProjectBody,
): Promise<Project> {
  const project = await getOwnedProject(userId, id);

  const data: Record<string, unknown> = {};
  if (input.displayName !== undefined) data.displayName = input.displayName;
  if (input.description !== undefined) data.description = input.description;
  if (input.isPublic !== undefined) data.isPublic = input.isPublic;

  if (input.slug !== undefined) {
    const desired = slugify(input.slug);
    if (desired !== project.slug) {
      if (isReserved(desired)) throw AppError.conflict('That slug is reserved', 'SLUG_RESERVED');
      const taken = await prisma.project.findUnique({ where: { slug: desired } });
      if (taken && taken.id !== id) {
        throw AppError.conflict('That slug is already taken', 'SLUG_TAKEN');
      }
      data.slug = desired;
    }
  }

  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(userId: string, id: string): Promise<void> {
  await getOwnedProject(userId, id);
  await prisma.project.delete({ where: { id } });
}
