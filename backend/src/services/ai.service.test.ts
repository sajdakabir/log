import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderUserPrompt } from './ai.service';
import { changelogResponseSchema } from '../schemas/ai.schema';
import type { RepoActivity } from './github.service';

const activity: RepoActivity = {
  repoFullName: 'octocat/hello',
  defaultBranch: 'main',
  headSha: 'abc123',
  version: 'v1.2.0',
  windowDescription: 'since 2026-05-01',
  prs: [{ number: 1, title: 'Add dark mode', body: 'adds a toggle', labels: ['enhancement'], mergedAt: '2026-05-02' }],
  commits: [],
};

test('renderUserPrompt includes PRs and pins the target version', () => {
  const prompt = renderUserPrompt(activity);
  assert.match(prompt, /PR #1: Add dark mode/);
  assert.match(prompt, /Target version: v1\.2\.0/);
  assert.match(prompt, /exactly one changelog entry for version "v1\.2\.0"/);
});

test('changelogResponseSchema accepts a valid model response', () => {
  const result = changelogResponseSchema.safeParse({
    entries: [
      {
        version: 'v1.2.0',
        title: 'Dark mode',
        summary: 'A new dark theme.',
        changes: [{ type: 'Added', text: 'Dark mode toggle' }],
        body_markdown: '## v1.2.0\n- Dark mode',
      },
    ],
  });
  assert.ok(result.success);
});

test('changelogResponseSchema rejects an invalid change type', () => {
  const result = changelogResponseSchema.safeParse({
    entries: [{ version: 'v1', title: 't', summary: 's', changes: [{ type: 'Nope', text: 'x' }], body_markdown: 'h' }],
  });
  assert.ok(!result.success);
});
