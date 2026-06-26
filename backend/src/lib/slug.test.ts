import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, isReserved } from './slug';

test('slugify normalizes to url-safe form', () => {
  assert.equal(slugify('My Cool Repo!!'), 'my-cool-repo');
  assert.equal(slugify('  spaced  out  '), 'spaced-out');
  assert.equal(slugify('UPPER_Case.Name'), 'upper-case-name');
  assert.equal(slugify('___'), 'project');
});

test('reserved slugs are detected', () => {
  assert.ok(isReserved('api'));
  assert.ok(isReserved('dashboard'));
  assert.ok(!isReserved('my-app'));
});
