# FinCopilot — AI Financial Life Manager

> A finance-first AI copilot designed for the Indian context.

[![Status](https://img.shields.io/badge/status-pre--launch-orange)](./REPOSITORY_AUDIT.md)

## What is FinCopilot?

FinCopilot is an AI co-pilot for personal finance: track spending across banks,
build smart budgets, forecast cash flow, and chat with your money in plain
English. Indian context throughout — Account Aggregator (Setu) for bank linking,
INR currency, Indian number system (lakhs notation).

## Architecture

| Layer        | Stack                                                                              |
| ------------ | ---------------------------------------------------------------------------------- |
| **Backend**  | Node.js 20 + Express 4 (modular monolith) on `:3001`                             |
| **Frontend** | Next.js 16 (App Router) on `:3000` — the authenticated dashboard                   |
| **Landing**  | Next.js 16 (App Router) on `:3002` — public marketing page                         |
| **Database** | PostgreSQL (BIGINT `paise` for all money — never floats)                          |
| **Auth**     | Clerk (`@clerk/backend` + `@clerk/nextjs`). Firebase adapter retained as legacy only |
| **Storage**  | Cloudflare R2 (`@aws-sdk/client-s3` compatible API)                                |
| **Queue**    | Cloudflare Queues (production) / PostgreSQL `FOR UPDATE SKIP LOCKED` (local dev)   |
| **AI**       | OmniRouter router + ZAI adapter (Gemini/OpenAI fallback)                          |
| **Styling**  | Tailwind CSS v4 (CSS-first config — `@theme inline` in `globals.css`) + shadcn/ui |

### Key Principles

- **Money is always stored as integer `paise`** (BIGINT). Floating point
  arithmetic is forbidden — see `06_DOMAIN_MODEL.md`.
- **Money is displayed in Indian number system** (`en-IN` locale —
  ₹40,21,700 not ₹4,021,700).
- **No fake stats / no fake testimonials / no fake certifications** — see the
  `landing-data.ts` "Illustrative scenarios" disclaimer.

## Repository Layout

```
fc-final-fix/
├── backend/                  # Node + Express API (port 3001)
│   ├── api/                  # Express routes, controllers, middlewares
│   ├── adapters/             # Auth (Clerk), Storage (R2), Queue (CF), AI (OmniRouter/ZAI), AA (Setu)
│   ├── db/                   # Prisma-style repositories + run-migrations.js + seed.js
│   │   └── migrations/      # 001 → 020 — see BACKEND section below
│   ├── domains/              # Business logic (financial-state, ai, forecast, planning, etc.)
│   └── workers/              # Background workers (ingestion, normalization, reconciliation)
├── frontend/                 # Next.js 16 dashboard (port 3000)
├── fincopilot-landing/       # Next.js 16 marketing page (port 3002)
│   └── Caddyfile             # Production gateway config
├── Dockerfile                # Multi-stage build — starts BOTH backend + landing
├── dev.js                    # Local dev: spawns all 3 processes via `node dev.js`
└── package.json              # Monorepo scripts (dev:all, migrate, lint, test)
```

## Setup

### Prerequisites

- Node.js ≥ 20
- PostgreSQL ≥ 14
- Clerk account + publishable/secret keys
- (Production) Cloudflare R2 + Queues + OmniRouter API keys

### Install

```bash
npm install                          # root (concurrently + eslint)
cd backend && npm install
cd frontend && npm install
cd fincopilot-landing && npm install
```

### Configure env

```bash
cp .env.example .env
# Fill in DATABASE_URL, CLERK_*, OMNIROUTER_API_URL, etc.
```

Required variables (see `.env.example` for the full list):

- `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (frontend + landing)
- `NEXT_PUBLIC_API_URL` (frontend API base URL)
- `R2_ENDPOINT_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
- `CF_QUEUE_API_TOKEN`, `CF_ACCOUNT_ID`
- `OMNIROUTER_API_URL`, `OMNIROUTER_API_KEY`
- `AI_KILL_SWITCH` (set `true` to disable all AI calls — returns 503)

### Run migrations

```bash
npm run migrate
# Equivalent to: node --env-file=.env backend/db/run-migrations.js
```

The canonical runner is `backend/db/run-migrations.js` — it sorts migrations
**numerically** (not alphabetically) and tracks applied migrations with SHA-256
checksums in the `schema_migrations` table.

### Start dev servers

```bash
npm run dev:all
# Spawns: backend (:3001), frontend (:3000), landing (:3002)
```

### Production

Production uses the included `Dockerfile` (multi-stage, non-root user). It
builds both Next.js apps in standalone mode and starts the backend Express
server + landing server with a process supervisor. A `Caddyfile` is provided
for the reverse-proxy gateway (replace `:81` with your domain to enable
auto-TLS — see `fincopilot-landing/Caddyfile`).

## Documentation

The source of truth for this project is entirely within the repository:

1. `05_ARCHITECTURE.md` — System architecture & ADRs
2. `06_DOMAIN_MODEL.md` — Domain model & money rule (BIGINT paise)
3. `09_AI_GATEWAY_SPEC.md` — AI gateway spec
4. `10_FORECAST_SPEC.md` — Forecast engine spec
5. `15_TASK_BOARD.md` — Current tasks and status

## License

Proprietary. © 2025 FinCopilot, Inc.
