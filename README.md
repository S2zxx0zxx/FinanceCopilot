# FinCopilot

> The AI co-pilot for your money — built for India (₹ INR, Setu Account Aggregator, RBI/DPDP-aligned).

FinCopilot tracks your spending, builds smart budgets, forecasts cash flow, and answers your money questions — all in one beautiful place.

---

## 🏗️ Architecture

FinCopilot is a **modular monorepo** with three independently-deployable Node.js apps,
a background worker, and a Cloudflare-gateway fronted by Caddy.

```
                       ┌─────────────────────────────────────────┐
                       │              Caddy gateway               │
                       │  (Caddyfile — TLS termination + routing) │
                       └────────────┬───────────────┬────────────┘
                                    │               │
                  /api/v1/* + /app/*│               │ /*
                  (backend)         │               │ (landing)
                                    ▼               ▼
       ┌──────────────────────────────┐   ┌──────────────────────────┐
       │  backend/  (Node + Express)  │   │ fincopilot-landing/      │
       │  Port :3001                  │   │   (Next.js 16 marketing) │
       │  • REST API + SPA catch-all  │   │   Port :3002             │
       │  • Clerk token verification  │   │   • Clerk middleware     │
       └─────────┬──────────┬─────────┘   │   • CSP + JSON-LD       │
                 │          │             └──────────────────────────┘
                 │          │
        PostgreSQL │   R2 / CF Queues
        (pg, paise)│   (raw statements,
                    │    async jobs)
                    ▼
       ┌──────────────────────────────┐
       │  frontend/  (Next.js 16 SPA)  │
       │  • Authenticated dashboard    │
       │  • ClerkProvider + AuthGate  │
       │  • TanStack Query + Zustand  │
       └──────────────────────────────┘

       ┌──────────────────────────────┐
       │  backend/worker.js (Node)    │  ◀── polls DB for async jobs
       │  • ingestion worker          │       (ingestion / normalization /
       │  • normalization worker      │        reconciliation)
       │  • reconciliation worker     │
       └──────────────────────────────┘
```

### Tech stack

| Layer | Choice | Why |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) + React 19 + TypeScript 5 | Server Components, RSC streaming, modern edge-ready runtime |
| **Styling** | Tailwind CSS v4 (`@theme` in `globals.css`) + shadcn/ui (New York) | CSS-first config — `tailwind.config.ts` is a deprecated stub |
| **Auth** | Clerk (`@clerk/nextjs` + `@clerk/backend`) | Drop-in MFA, session cookies, webhooks; replaces earlier Firebase design |
| **Database** | PostgreSQL via `pg` | Money stored as **integer paise** (no floats) — see `docs/adrs/ADR-003` |
| **Object storage** | Cloudflare R2 (`@aws-sdk/client-s3`) | Raw uploaded statements (PDF/CSV/XLSX) |
| **Job queue** | Cloudflare Queues | Async ingestion / normalization / reconciliation |
| **AI gateway** | OmniRouter (multi-model) + Gemini direct (ZAI adapter) | Provider abstraction — see `docs/adrs/ADR-004` |
| **Account Aggregator** | Setu AA (RBI-regulated framework) | Read-only, revocable consent |
| **Caching** | Local in-memory only (no Redis/MySQL middleware) | Per monorepo policy |
| **Realtime** | (Reserved) Socket.IO mini-services | See `mini-services/` if added |

---

## 📁 Repository layout

```
fincopilot-landing/   Next.js 16 marketing site (port :3002)
├─ src/app/             App Router root, JSON-LD, sitemap
├─ src/components/      Landing sections (hero, pricing, security, testimonials, …)
├─ src/components/charts/  Recharts visualisations (₹ INR formatted)
└─ src/middleware.ts    Clerk + CSP middleware

frontend/             Next.js 16 authenticated SPA (Clerk-protected)
├─ src/app/             All authenticated routes (/money, /forecast, /ai, /you, …)
├─ src/components/      shadcn/ui + domain components
└─ src/components/providers.tsx  ClerkProvider + AuthGate

backend/              Node.js + Express API (port :3001)
├─ server.js            Express boot — Helmet, CORS, Clerk adapter, route mounting
├─ worker.js            Background worker master process
├─ api/                 Controllers, routes, middlewares (auth, security, error)
├─ adapters/            Auth (Clerk), storage (R2), queue (CF Queues), AI (OmniRouter/ZAI)
├─ domains/             Domain modules (ingestion, normalization, reconciliation,
│                       forecast, planning, financial-state, consent, identity, AI)
├─ db/                  pg client, repositories, migrations, seed
└─ docs/                Backend phase reports + ADRs

docs/                  Cross-cutting docs + Architecture Decision Records
Dockerfile            Multi-stage build — backend + landing in one image
dev.js                Concurrent launcher: backend + frontend + landing
Caddyfile             (root — production routing reference; see fincopilot-landing/Caddyfile for the live config)
wrangler.toml         ⚠️  NON-FUNCTIONAL reference stub (Express cannot run on Workers)
tailwind.config.ts    Deprecated empty stub (Tailwind v4 uses CSS @theme)
```

---

## 🚀 Quick start

### Prerequisites
- Node.js 20+ (LTS)
- PostgreSQL 14+
- A Clerk application (publishable + secret keys)
- (Optional) Cloudflare account for R2 + Queues

### 1. Install dependencies
```bash
# Backend (root package.json)
npm install

# Frontend SPA
cd frontend && npm install

# Landing
cd fincopilot-landing && npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in CLERK_SECRET_KEY, DATABASE_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, etc.
```
See `.env.example` for the full list. The backend validates required vars at boot
(`backend/config/env.js`) and **fails closed in production** if `CLERK_SECRET_KEY`
or `DATABASE_URL` are missing.

### 3. Run database migrations
```bash
npm run migrate
# or: node --env-file=.env backend/db/run-migrations.js
```

### 4. Run all three apps concurrently (dev)
```bash
npm run dev:all
# → backend on :3001, frontend on next available, landing on :3002
```

Or run each separately:
```bash
npm run dev                 # backend (Node --watch)
cd frontend && npm run dev  # SPA
cd fincopilot-landing && npm run dev  # landing on :3002
```

### 5. Run the background worker
```bash
node backend/worker.js
```

---

## 🌐 Production deployment

The included `Dockerfile` is multi-stage:
1. **Builder stage** — installs backend + frontend + landing deps, builds both Next.js apps (standalone output).
2. **Production stage** — installs only backend production deps, copies built artifacts, runs **both** `backend/server.js` (:3001) and `landing-standalone/server.js` (:3002) under a tiny `sh` supervisor. If either dies, the container exits non-zero so the orchestrator restarts it.

```bash
docker build -t fincopilot .
docker run -p 3001:3001 -p 3002:3002 --env-file .env fincopilot
```

The Caddy gateway (see `fincopilot-landing/Caddyfile`) routes:
- `/api/v1/*` and `/app/*` → `localhost:3001` (backend)
- `/api/session`, `/api/cta`, `/api/health` → `localhost:3002` (landing bridge routes)
- `/*` → `localhost:3002` (landing)

> ⚠️ **TLS**: The shipped Caddyfile listens on `:81` (plaintext HTTP) for **sandbox
> preview only**. In production, **replace `:81` with your domain** (`fincopilot.ai { … }`)
> so Caddy auto-provisions Let's Encrypt certs. NEVER ship `:81` to prod — session
> cookies would be sent in cleartext.

> ⚠️ **Cloudflare Workers**: `wrangler.toml` is kept as a **non-functional reference
> stub**. Express + `pg` + `xlsx` cannot run on the Workers runtime (no
> `node:http`, `node:fs`, or raw TCP). Run the backend on a Node host instead.

---

## 🔒 Security posture

- **Clerk** for auth (session cookies, MFA, webhooks). Dev-only `x-dev-bypass`
  header is gated behind `NODE_ENV !== 'production'`.
- **CSP** + per-request nonce set by `fincopilot-landing/src/middleware.ts`.
- **Helmet** hardening on the backend Express server.
- **Strict CORS** — `PATCH` and `OPTIONS` included; `CORS_ORIGIN` env var (no
  wildcard default in production).
- **Read-only by design** via the Setu AA framework — FinCopilot can see your
  data, never move your money.
- **256-bit AES** encryption in transit and at rest.
- **Money is integer paise** — no floating-point rounding errors.

See `docs/PHASE_12_SECURITY_HARDENING.md` and `docs/adrs/` for the full threat
model and decisions.

---

## 🇮🇳 India-first

- Currency everywhere is **₹ INR**, formatted via `toLocaleString('en-IN')`
  (Indian lakh/crore number system).
- Net-worth / forecast tick formatters use Indian `L` (lakh), not Western `k`.
- Account connections via the **Setu Account Aggregator** (RBI-regulated).
- DPDP Act 2023 compliance — see `docs/PHASE_13_*` and `docs/adrs/ADR-006-data-retention-deletion.md`.

---

## 📚 Key documentation

- **Architecture Decision Records** — `docs/adrs/` (canonical ledger model, money
  precision, AI gateway abstraction, reconciliation invariants, etc.)
- **Phase reports** — `docs/PHASE_*.md` and `backend/docs/PHASE_*.md`
- **Environment matrix** — `docs/ENVIRONMENT_VARIABLE_MATRIX.md`
- **Audit reports** — `frontend/public/FINCOPILOT-FULL-AUDIT.md` and `FINCOPILOT-FINAL-AUDIT.md`
- **Honest pre-launch status** — `fincopilot-landing/src/lib/landing-data.ts`
  (illustrative testimonials, ₹0 tracked, 0★ — be among the first)

---

## 📝 License

Proprietary — © FinCopilot, Inc. All rights reserved.

> **Not a bank. Not financial advice.**
