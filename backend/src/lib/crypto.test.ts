import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encrypt, decrypt } from './crypto';

test('encrypt/decrypt round-trips', () => {
  const secret = 'gho_exampleToken_1234567890';
  const enc = encrypt(secret);
  assert.notEqual(enc, secret);
  assert.match(enc, /^v1:/);
  assert.equal(decrypt(enc), secret);
});

test('each encryption uses a fresh IV', () => {
  const a = encrypt('same');
  const b = encrypt('same');
  assert.notEqual(a, b);
  assert.equal(decrypt(a), 'same');
  assert.equal(decrypt(b), 'same');
});

test('tampered ciphertext fails authentication', () => {
  const enc = encrypt('secret');
  const parts = enc.split(':');
  parts[3] = Buffer.from('tampered-bytes').toString('base64');
  assert.throws(() => decrypt(parts.join(':')));
});
