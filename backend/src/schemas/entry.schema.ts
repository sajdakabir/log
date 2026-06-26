import { z } from 'zod';

export const changeItemSchema = z.object({
  type: z.enum(['Added', 'Improved', 'Fixed', 'Removed']),
  text: z.string().min(1).max(300),
});

export const updateEntrySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  version: z.string().min(1).max(60).optional(),
  summary: z.string().max(500).nullable().optional(),
  bodyMarkdown: z.string().max(20_000).optional(),
  changes: z.array(changeItemSchema).nullable().optional(),
});

export type UpdateEntryBody = z.infer<typeof updateEntrySchema>;
