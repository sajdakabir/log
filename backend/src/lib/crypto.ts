import crypto from 'node:crypto';
import { env } from '../config/env';

const ALGO = 'aes-256-gcm';
const VERSION = 'v1';

let cachedKey: Buffer | null = null;

function getKey(): Buffer {
  if (cachedKey) return cachedKey;
  const key = Buffer.from(env.TOKEN_ENC_KEY, 'base64');
  if (key.length !== 32) {
    throw new Error(
      'TOKEN_ENC_KEY must be a base64 string that decodes to 32 bytes (try: openssl rand -base64 32)',
    );
  }
  cachedKey = key;
  return key;
}

/** Encrypt plaintext into "v1:iv:authTag:ciphertext" (all base64). */
export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [
    VERSION,
    iv.toString('base64'),
    authTag.toString('base64'),
    ciphertext.toString('base64'),
  ].join(':');
}

/** Decrypt a "v1:iv:authTag:ciphertext" payload back to plaintext. */
export function decrypt(payload: string): string {
  const [version, ivB64, tagB64, ctB64] = payload.split(':');
  if (version !== VERSION || !ivB64 || !tagB64 || !ctB64) {
    throw new Error('Malformed or unsupported ciphertext');
  }
  const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(ctB64, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
