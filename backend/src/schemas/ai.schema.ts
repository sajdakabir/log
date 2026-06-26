import { z } from 'zod';

export const changeItemSchema = z.object({
  type: z.enum(['Added', 'Improved', 'Fixed', 'Removed']),
  text: z.string(),
});

export const aiEntrySchema = z.object({
  version: z.string(),
  title: z.string(),
  summary: z.string(),
  changes: z.array(changeItemSchema),
  body_markdown: z.string(),
});

export const changelogResponseSchema = z.object({
  entries: z.array(aiEntrySchema),
});

export type AIEntry = z.infer<typeof aiEntrySchema>;

/** JSON Schema handed to OpenAI structured outputs (mirrors changelogResponseSchema). */
export const CHANGELOG_JSON_SCHEMA = {
  name: 'changelog',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['entries'],
    properties: {
      entries: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['version', 'title', 'summary', 'changes', 'body_markdown'],
          properties: {
            version: { type: 'string' },
            title: { type: 'string' },
            summary: { type: 'string' },
            changes: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['type', 'text'],
                properties: {
                  type: { type: 'string', enum: ['Added', 'Improved', 'Fixed', 'Removed'] },
                  text: { type: 'string' },
                },
              },
            },
            body_markdown: { type: 'string' },
          },
        },
      },
    },
  },
} as const;
