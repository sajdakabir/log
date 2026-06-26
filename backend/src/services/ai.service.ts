import { getOpenAI } from '../lib/openai';
import { assertOpenAIConfigured } from '../config/env';
import { AppError } from '../utils/AppError';
import { logger } from '../lib/logger';
import { changelogResponseSchema, CHANGELOG_JSON_SCHEMA, type AIEntry } from '../schemas/ai.schema';
import type { RepoActivity } from './github.service';

const SYSTEM_PROMPT = `You are a release-notes writer for a software product changelog. You turn raw
GitHub activity (merged pull requests and commits) into clean, user-facing release notes.

Rules:
- Write for END USERS of the product, not for developers. Avoid internal jargon,
  file names, and implementation detail.
- Be concise and scannable. Prefer short, benefit-oriented bullet points.
- Collapse trivial work (typo fixes, dependency bumps, CI, refactors, formatting)
  into a single "Maintenance" item rather than listing each one.
- Assign exactly ONE type to each change from: Added, Improved, Fixed, Removed.
- Group all changes under their version. If a version/tag is given, use it;
  otherwise use "Unreleased".
- NEVER invent features or claims that are not supported by the input. If the
  input is unclear, describe it conservatively.
- Output ONLY JSON that conforms to the provided schema. No prose outside JSON.`;

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

export function renderUserPrompt(activity: RepoActivity): string {
  const lines: string[] = [
    `Repository: ${activity.repoFullName}`,
    `Default branch: ${activity.defaultBranch}`,
    `Target version: ${activity.version}`,
    `Window: ${activity.windowDescription}`,
    '',
  ];

  if (activity.prs.length > 0) {
    lines.push('New merged pull requests:');
    for (const pr of activity.prs) {
      const labels = pr.labels.length ? ` — labels: ${pr.labels.join(', ')}` : '';
      const body = pr.body ? ` :: ${truncate(pr.body, 300)}` : '';
      lines.push(`- PR #${pr.number}: ${pr.title}${labels}${body}`);
    }
  }

  if (activity.commits.length > 0) {
    lines.push('');
    lines.push('Recent commits:');
    for (const c of activity.commits) lines.push(`- ${c.sha}: ${c.message}`);
  }

  lines.push('');
  lines.push(`Produce exactly one changelog entry for version "${activity.version}".`);
  return lines.join('\n');
}

async function requestCompletion(
  model: string,
  userPrompt: string,
  extraInstruction?: string,
): Promise<unknown> {
  const messages: { role: 'system' | 'user'; content: string }[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ];
  if (extraInstruction) messages.push({ role: 'user', content: extraInstruction });

  const completion = await getOpenAI().chat.completions.create({
    model,
    messages,
    response_format: { type: 'json_schema', json_schema: CHANGELOG_JSON_SCHEMA },
    max_tokens: 4000,
    temperature: 0.3,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw AppError.badGateway('Empty response from OpenAI', 'AI_EMPTY');
  try {
    return JSON.parse(raw);
  } catch {
    throw AppError.badGateway('OpenAI returned invalid JSON', 'AI_INVALID_JSON');
  }
}

/** Generate changelog entries from repo activity; one entry for the target version. */
export async function generateChangelog(activity: RepoActivity, model: string): Promise<AIEntry[]> {
  assertOpenAIConfigured();
  const userPrompt = renderUserPrompt(activity);

  let parsed = await requestCompletion(model, userPrompt);
  let validated = changelogResponseSchema.safeParse(parsed);

  if (!validated.success) {
    logger.warn({ issues: validated.error.issues }, 'AI response failed validation, retrying once');
    parsed = await requestCompletion(
      model,
      userPrompt,
      'Your previous response did not match the required schema. Return ONLY valid JSON matching the schema exactly.',
    );
    validated = changelogResponseSchema.safeParse(parsed);
  }

  if (!validated.success) {
    throw AppError.badGateway('OpenAI response did not match the expected format', 'AI_SCHEMA_MISMATCH');
  }

  // We feed a single version bucket → keep one entry and pin its version to ours.
  const entries = validated.data.entries.slice(0, 1).map((e) => ({ ...e, version: activity.version }));
  if (entries.length === 0) {
    throw AppError.badGateway('OpenAI returned no changelog entries', 'AI_EMPTY');
  }
  return entries;
}
