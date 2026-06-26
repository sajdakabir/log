import { z } from 'zod';

export const createProjectSchema = z.object({
  githubRepoId: z.number().int().positive(),
  slug: z.string().min(1).max(60).optional(),
});

export const updateProjectSchema = z.object({
  displayName: z.string().max(120).nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  slug: z.string().min(1).max(60).optional(),
  isPublic: z.boolean().optional(),
});

export type CreateProjectBody = z.infer<typeof createProjectSchema>;
export type UpdateProjectBody = z.infer<typeof updateProjectSchema>;
