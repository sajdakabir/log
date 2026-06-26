import { Octokit } from '@octokit/rest';
import { throttling } from '@octokit/plugin-throttling';
import { retry } from '@octokit/plugin-retry';
import { logger } from './logger';

const ThrottledOctokit = Octokit.plugin(throttling, retry);

export function createOctokit(accessToken: string): Octokit {
  return new ThrottledOctokit({
    auth: accessToken,
    userAgent: 'shiplog',
    throttle: {
      onRateLimit: (retryAfter, options, _octokit, retryCount) => {
        logger.warn(
          { retryAfter, method: options.method, url: options.url },
          'GitHub rate limit hit',
        );
        return retryCount < 1; // retry once
      },
      onSecondaryRateLimit: (retryAfter, options) => {
        logger.warn(
          { retryAfter, method: options.method, url: options.url },
          'GitHub secondary rate limit',
        );
        return false;
      },
    },
  });
}
