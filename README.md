# ShipLog

An AI-powered changelog generator. Connect a public GitHub repo, let OpenAI turn its
merged PRs / commits / release tags into clean, user-facing release notes, review the
drafts, and publish them to a hosted public changelog at `/{slug}`.

> Clone of [ShipLog](https://www.getshiplog.site/) — built as a lean MVP.

## Stack

- **Frontend** — React + Vite + TypeScript + Tailwind + TanStack Query (`/frontend`)
- **Backend** — Node + Express + TypeScript + Prisma (`/backend`)
- **Shared** — TypeScript DTOs + API path constants (`/shared`)
- **DB** — MongoDB (Atlas) via Prisma
- **AI** — OpenAI (`gpt-4o-mini`)
- **Auth** — GitHub OAuth (`read:user public_repo`), on-demand REST fetch

Served **single-origin**: in dev the Vite server proxies `/api` + `/public` to the API;
in prod Express serves the built SPA under one domain.

## Quick start

```bash
# 1. install
npm install

# 2. configure backend env
cp backend/.env.example backend/.env
#   set DATABASE_URL to your MongoDB Atlas connection string (with a db name, e.g. /shiplog)
#   set SESSION_JWT_SECRET and TOKEN_ENC_KEY (openssl rand -base64 32)
#   and, for auth, GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET / OPENAI_API_KEY

# 3. push schema + seed
npm run db:push
npm run db:seed

# 4. run both dev servers
npm run dev
#   web → http://localhost:3000   api → http://localhost:8080
```

## Project layout

```
backend/    Express API, Prisma schema, services
frontend/   React SPA
shared/     Shared TS types + API path constants
```

See the full build plan in `~/.claude/plans/eventual-conjuring-wave.md`.
