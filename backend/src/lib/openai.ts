import OpenAI from 'openai';
import { env } from '../config/env';

let client: OpenAI | null = null;

/**
 * Lazily construct the OpenAI client. The SDK throws on an empty API key, so we
 * only build it when generation actually runs (guarded by assertOpenAIConfigured).
 */
export function getOpenAI(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY, maxRetries: 3, timeout: 60_000 });
  }
  return client;
}
