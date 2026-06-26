import type { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      /** Set by requireAuth from the session cookie. */
      userId?: string;
      /** Set by loadUser for routes that hit GitHub on the user's behalf. */
      user?: User;
    }
  }
}

export {};
