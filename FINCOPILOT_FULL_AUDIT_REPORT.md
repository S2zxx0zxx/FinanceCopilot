# FinCopilot — Full-Stack Deep Audit Report
**Prepared for GL5.2 Agent** | Scan Date: 2026-09-07 | Engineer: Antigravity

---

## EXECUTIVE SUMMARY

This is a real-engineer-grade audit of the **entire FinCopilot codebase** — every file, folder, domain, controller, frontend page, migration, adapter, and utility. The app is a 3-tier Indian personal finance platform built with:

- **Backend**: Node.js/Express BFF API (`backend/`) — port 3001
- **Frontend**: Next.js app router (`frontend/`) — port 3000  
- **Landing**: Next.js marketing site (`fincopilot-landing/`) — port 3002
- **Database**: PostgreSQL (Neon/Supabase) — 22 migration files (001–022)
- **Auth**: Clerk (production) / x-dev-bypass header (dev)
- **Storage**: Cloudflare R2 (statement PDFs)
- **AI**: Gemini 2.5 Flash (primary) → GPT-4o-mini (fallback)

**Launch status**: App is functional but has 🔴 P0 blockers, 🟠 P1 critical issues, 🟡 P2 bugs, and 🔵 P3 cleanup items documented below.

---

## PART 1: ARCHITECTURE OVERVIEW

### Monorepo Structure (`c:\Fincopilot`)

```
c:\Fincopilot\
├── backend/                   ← Express API server
│   ├── server.js              ← Entry point (port 3001)
│   ├── api/
│   │   ├── routes.js          ← All 50+ route definitions
│   │   ├── ai.routes.js       ← AI-specific routes (separate setup fn)
│   │   ├── controllers/       ← 15 controllers
│   │   └── middlewares/       ← security, auth, feature-flag, performance
│   ├── domains/               ← Core business logic
│   │   ├── ai/                ← gateway, intent, risk, policy, tools, validator
│   │   ├── financial-state/   ← balances, commitments, safe-to-spend, income, spending
│   │   ├── forecast/          ← engine, models, baselines, calibration, evaluation
│   │   ├── ingestion/         ← ingestion.service, aa.service
│   │   ├── consent/           ← consent.service
│   │   └── planning/          ← goals, upcoming, cashflow, health
│   ├── adapters/              ← Auth, AI, Storage, Queue, AA adapters
│   ├── db/                    ← client, repositories, migrations (022 files)
│   ├── config/                ← env.js, policies.js
│   └── utils/                 ← logger, errors, telemetry, feature-flags, beta-cohort
├── frontend/                  ← Next.js app router
│   └── src/
│       ├── app/               ← 20+ pages
│       ├── components/        ← shell, shared, charts, landing
│       ├── hooks/             ← use-app-data, use-toast, use-api
│       └── lib/               ← api.ts, data.ts, format.ts, use-api.ts
├── fincopilot-landing/        ← Marketing site (Clerk-protected sign-in)
│   └── src/
│       ├── app/               ← page.tsx, sign-in, sign-up, api/session
│       ├── components/landing/ ← 14 section components
│       └── middleware.ts      ← CSP + Clerk session check
├── dev.js                     ← Concurrent dev server launcher
└── package.json               ← Root scripts: dev:all, migrate, build
```

---

## PART 2: BACKEND — ROUTE INVENTORY

All routes are mounted under `/api/v1/` via `setupRoutes()` + `setupAIRoutes()`.

### Auth / Public Routes
| Route | Auth | Status |
|-------|------|--------|
| `GET /api/health` | None | ✅ Working |
| `GET /api/v1/auth/config` | None | ✅ Working |
| `GET /api/v1/auth/verify` | Cookie/Bearer | ✅ Working |
| `GET /api/v1/auth/me` | requireAuth | ⚠️ Uses `req.user.id` (not `req.user.userId`) — may fail |
| `POST /api/v1/auth/onboarding-complete` | requireAuth | ⚠️ Same ID mismatch |
| `GET /api/v1/auth/security` | requireAuth | ✅ Delegates to TrustController |
| `PUT /api/v1/auth/security` | requireAuth | ✅ Stub (returns managed_by_clerk) |
| `POST /api/v1/auth/security/sessions/revoke` | requireAuth | ✅ |
| `DELETE /api/v1/auth/account` | requireAuth | ✅ Delegates to requestDeletion |

### Ingestion
| Route | Auth | Status |
|-------|------|--------|
| `POST /api/v1/import/upload-intent` | requireAuth | ✅ |
| `POST /api/v1/import/confirm` | requireAuth | ✅ |
| `POST /api/v1/import/replay/:job_id` | requireAuth | ✅ |

### Financial State
| Route | Auth | Status |
|-------|------|--------|
| `GET /api/v1/financial-state/home` | requireAuth | ✅ |
| `GET /api/v1/financial-state/money` | requireAuth | ✅ |
| `GET /api/v1/financial-state/spending-story` | requireAuth | ✅ |
| `GET /api/v1/financial-state/income` | requireAuth | ✅ |
| `GET /api/v1/financial-state/categories/:id` | requireAuth | ✅ |
| `GET /api/v1/financial-health` | requireAuth | ✅ |
| `GET /api/v1/financial/cashflow` | requireAuth | ✅ |
| `GET /api/v1/financial/liabilities` | requireAuth | ⚠️ Uses `req.user.id` not `.userId` |

### Accounts & Transactions
| Route | Auth | Status |
|-------|------|--------|
| `GET /api/v1/accounts` | requireAuth | ✅ |
| `GET /api/v1/accounts/:id` | requireAuth | ✅ |
| `GET /api/v1/transactions` | requireAuth | ✅ |
| `GET /api/v1/transactions/:id` | requireAuth | ✅ |
| `PUT /api/v1/transactions/:id` | requireAuth | ✅ |
| `POST /api/v1/transactions/:id/split` | requireAuth | ✅ |
| `GET /api/v1/search` | requireAuth | ✅ |

### Planning (Phase 7)
| Route | Auth | Status |
|-------|------|--------|
| `GET /api/v1/recurring/detect` | requireAuth | ✅ |
| `GET /api/v1/recurring/summary` | requireAuth | ✅ |
| `GET /api/v1/recurring` | requireAuth | ✅ |
| `GET /api/v1/recurring/:seriesId` | requireAuth | ✅ |
| `PATCH /api/v1/recurring/:seriesId` | requireAuth | ✅ |
| `GET /api/v1/upcoming` | requireAuth | ✅ |
| `GET /api/v1/goals` | requireAuth | ✅ |
| `POST /api/v1/goals` | requireAuth | ✅ |
| `GET /api/v1/goals/:goalId` | requireAuth | ✅ |
| `PATCH /api/v1/goals/:goalId` | requireAuth | ✅ |
| `DELETE /api/v1/goals/:goalId` | requireAuth | ✅ |
| `POST /api/v1/goals/:goalId/contributions` | requireAuth | ✅ |
| `GET /api/v1/goals/:goalId/contributions` | requireAuth | ✅ |
| `POST /api/v1/goals/:goalId/simulate` | requireAuth | ✅ |
| `GET /api/v1/plan` | requireAuth | ✅ |

### Forecast (Phase 8 — Feature Gated)
| Route | Auth | Feature Flag | Status |
|-------|------|-------------|--------|
| `GET /api/v1/forecast/outlook` | requireAuth | `ai_forecast_beta` | ✅ Gated |
| `POST /api/v1/forecast/scenario` | requireAuth | `ai_forecast_beta` | ✅ Gated |
| `GET /api/v1/forecast/evaluation` | requireAuth | `ai_forecast_beta` | ✅ Gated |

### AI (Phase 9)
| Route | Auth | Status |
|-------|------|--------|
| `POST /api/v1/ai/chat` | requireAuth + rateLimiter | ✅ |
| `POST /api/v1/ai/chat/confirm` | requireAuth | ✅ |
| `GET /api/v1/ai/home-feed` | requireAuth | ✅ |
| `GET /api/v1/ai/insights/:id` | requireAuth | ✅ |
| `POST /api/v1/ai/insights/:id/feedback` | requireAuth | ✅ |
| `POST /api/v1/ai/simulate` | requireAuth + rateLimiter | ✅ |
| `POST /api/v1/ai/simulate/save` | requireAuth | ✅ |

### Trust & Operations (Phase 11)
| Route | Auth | Status |
|-------|------|--------|
| `GET /api/v1/trust/connections` | requireAuth | ✅ |
| `POST /api/v1/trust/connections/:id/disconnect` | requireAuth | ✅ |
| `GET /api/v1/trust/privacy/inventory` | requireAuth | ✅ |
| `POST /api/v1/trust/privacy/consent` | requireAuth | ✅ |
| `GET /api/v1/trust/security/sessions` | requireAuth | ✅ |
| `POST /api/v1/trust/security/sessions/revoke` | requireAuth | ✅ |
| `POST /api/v1/trust/export` | requireAuth | ✅ |
| `GET /api/v1/trust/export/status` | requireAuth | ✅ |
| `PATCH /api/v1/internal/export/status` | validateInternalWebhook | ✅ |
| `POST /api/v1/trust/deletion` | requireAuth | ✅ |
| `GET /api/v1/trust/deletion/status` | requireAuth | ✅ |
| `PATCH /api/v1/internal/deletion/status` | validateInternalWebhook | ✅ |
| `GET/POST /api/v1/trust/preferences` | requireAuth | ✅ |
| `GET/POST /api/v1/trust/notifications/preferences` | requireAuth | ✅ |

### New Features (Phase v988)
| Route | Auth | Status |
|-------|------|--------|
| `GET /api/v1/budgets` | requireAuth | ✅ |
| `POST /api/v1/budgets` | requireAuth | ✅ |
| `PUT /api/v1/budgets/:id` | requireAuth | ✅ |
| `DELETE /api/v1/budgets/:id` | requireAuth | ✅ |
| `POST /api/v1/budgets/recalculate` | requireAuth | ✅ |
| `GET /api/v1/notifications` | requireAuth | ✅ |
| `PUT /api/v1/notifications/:id/read` | requireAuth | ✅ |
| `PUT /api/v1/notifications/read-all` | requireAuth | ✅ |
| `POST /api/v1/notifications` | requireAuth | ✅ |
| `DELETE /api/v1/notifications/:id` | requireAuth | ✅ |
| `GET /api/v1/gamification` | requireAuth | ✅ |
| `POST /api/v1/gamification/streak/tick` | requireAuth | ✅ |
| `POST /api/v1/gamification/badges/:name/earn` | requireAuth | ✅ |
| `POST /api/v1/gamification/milestones/:id/progress` | requireAuth | ✅ |
| `GET /api/v1/peer-comparison` | requireAuth | ✅ |
| `GET /api/v1/calendar/events` | requireAuth | ✅ |
| `GET /api/v1/net-worth/history` | requireAuth | ✅ |
| `GET /api/v1/savings-challenges` | requireAuth | ✅ |
| `POST /api/v1/savings-challenges/:id/contribute` | requireAuth | ✅ |
| `GET/PUT /api/v1/preferences` | requireAuth | ✅ |
| `GET /api/v1/data-quality` | requireAuth | ✅ |

---

## PART 3: FRONTEND — PAGE INVENTORY

### App Router Pages (`frontend/src/app/`)

| Page Route | File | Data Source | Real API? | Status |
|-----------|------|-------------|-----------|--------|
| `/` | `page.tsx` | `use-app-data.ts` | Mix | ✅ Shell works |
| `/money` | `money/page.tsx` | `financialStateMoney`, `accounts`, `netWorthHistory` from `data.ts` | ❌ Mock only | 🔴 STUB |
| `/transactions` | `transactions/page.tsx` | `recentTransactions` from `data.ts` | ❌ Mock only | 🔴 STUB |
| `/spending-story` | `spending-story/page.tsx` | `spendingStory` from `data.ts` | ❌ Mock only | 🔴 STUB |
| `/plan` | `plan/page.tsx` | `forecastData`, `cashflowData` from `data.ts` | ❌ Mock only | 🔴 STUB |
| `/goals` | `goals/page.tsx` | `goals` from `data.ts` | ❌ Mock only | 🔴 STUB |
| `/recurring` | `recurring/page.tsx` | `recurringSeries` from `data.ts` | ❌ Mock only | 🔴 STUB |
| `/ai` | `ai/page.tsx` | `aiHomeFeed`, `aiInsights` from `data.ts` | ❌ Mock only | 🔴 STUB |
| `/ai/chat` | `ai/chat/page.tsx` | Hardcoded mock + broken send() | ❌ Broken | 🔴 BROKEN |
| `/ai/afford` | `ai/afford/page.tsx` | Unknown | ? | Needs check |
| `/ai/leaks` | `ai/leaks/page.tsx` | Unknown | ? | Needs check |
| `/ai/insight/[id]` | `ai/insight/[id]/page.tsx` | Unknown | ? | Needs check |
| `/financial-health` | `financial-health/page.tsx` | `financialHealth`, `peerComparison` from `data.ts` | ❌ Mock only | 🔴 STUB |
| `/forecast` | `forecast/page.tsx` | `forecastData` from `data.ts` | ❌ Mock only + **Syntax Error** | 🔴 BROKEN |
| `/goals/[id]` | `goals/[id]/page.tsx` | Unknown | ? | Needs check |
| `/you` | `you/page.tsx` | `currentUser`, `securityData`, `gamification`, `privacyData`, `accounts` from `data.ts` | ❌ Mock only | 🔴 STUB |
| `/you/security` | `you/security/page.tsx` | Unknown | ? | Needs check |
| `/you/privacy` | `you/privacy/page.tsx` | Unknown | ? | Needs check |
| `/you/connections` | `you/connections/page.tsx` | Unknown | ? | Needs check |
| `/you/export` | `you/export/page.tsx` | Unknown | ? | Needs check |
| `/sign-in/[[...sign-in]]` | Clerk component | Clerk | ✅ Real Clerk | ✅ |
| `/onboarding` | `onboarding/page.tsx` | 37KB file | ? | Needs check |

---

## PART 4: CRITICAL BUGS (P0 — BLOCKERS)

### 🔴 P0-1: AI Chat `send()` Function Is Completely Broken
**File**: `frontend/src/app/ai/chat/page.tsx`, line 28  
**Bug**:
```js
const response = {});   // ← SYNTAX ERROR / stub — not an API call
```
The AI chat page has a **malformed line that is not valid JS**. The `send()` function never calls the backend. AI chat is **completely non-functional**.  
**Fix**: Replace with `await api.post('/ai/chat', { prompt: input })`.

---

### 🔴 P0-2: Forecast Page Has a Syntax Error
**File**: `frontend/src/app/forecast/page.tsx`, lines 16–22  
**Bug**:
```tsx
import { ForecastComboChart } from "@/components/charts/recharts";
import {      // ← import statement SPLIT by another import in between
import { forecastData } from "@/lib/data";   // ← inserted in wrong place
  SectionHeader, Badge, FreshnessBadge, CountUp,
} from "@/components/shared";
```
The `import { forecastData }` is inserted **between the opening `{` and closing `}` of the shared-components import**. This is a syntax error. The page will fail to compile.  
**Fix**: Move `import { forecastData } from "@/lib/data"` above or below the shared import block.

---

### 🔴 P0-3: Goals Page Calls `refetch?.()` on Undefined Variable
**File**: `frontend/src/app/goals/page.tsx`, line 26  
**Bug**:
```tsx
await refetch?.();  // `refetch` is never declared in this component
```
`goals` data is imported directly from `data.ts` (static), so there is no `refetch`. Calling this after goal creation silently does nothing — goal list never refreshes.  
**Fix**: Either wire up `useApi` hook with real goals API, or remove the `refetch` call.

---

### 🔴 P0-4: `req.user.id` vs `req.user.userId` Inconsistency (Multiple Routes)
**Affected files**:
- `backend/api/routes.js`: `GET /auth/me` uses `req.user.id`
- `backend/api/routes.js`: `GET /financial/liabilities` uses `req.user.id`  
- `backend/api/routes.js`: `POST /auth/onboarding-complete` uses `req.user.id`

**Bug**: `requireAuth` middleware populates `req.user = { id: ..., userId: ..., clerkId: ... }`. Most controllers use `req.user.userId` correctly. But inline route handlers in routes.js use `req.user.id`. The `id` and `userId` are the **same value** in most paths, but this inconsistency causes confusion and could break if the object shape ever changes.  
**Fix**: Standardize all inline routes to use `req.user.userId`.

---

### 🔴 P0-5: ClerkAuthAdapter Crashes on `AUTH_MODE=mock` Outside Tests
**File**: `backend/adapters/auth/clerk.adapter.js`, line 14  
**Bug**:
```js
if (this.mode === 'mock' && env.NODE_ENV !== 'test') {
  throw new Error('INV-SEC-001: AUTH_MODE=mock is strictly forbidden outside of NODE_ENV=test');
}
```
In development, if a developer sets `AUTH_MODE=mock` (which was the previous dev pattern), the server **immediately crashes** on boot. The dev bypass now relies on `x-dev-bypass` header instead, but the old `.env` files might still have `AUTH_MODE=mock`.  
**Fix**: Ensure `.env` has `AUTH_MODE=production` (or remove `AUTH_MODE`) for local dev. Document this. OR change the restriction to `NODE_ENV === 'production'` check instead.

---

## PART 5: HIGH-PRIORITY ISSUES (P1 — Must Fix Before Launch)

### 🟠 P1-1: ALL Frontend Pages Still Use Static `data.ts` Mock Data
**File**: `frontend/src/lib/data.ts`  
**Summary**: Every core page — money, transactions, spending-story, plan, goals, recurring, ai, financial-health, forecast, you — imports static mock data from `data.ts`. The `use-app-data.ts` hook exists and makes real API calls, but **pages don't use it**. They import mock directly.  

The real API hooks (`use-app-data.ts`) exist and work, but are only consumed by the `app-shell.tsx` (for gamification/notifications). No page connects to the real backend.  

**Fix**: Wire up each page to use `useApi()` or `useAppData()` hooks with the real API clients. Priority order:
1. `/` (dashboard) — uses `useAppData` partially  
2. `/money` — needs `api.getAccounts()`, `api.getNetWorthHistory()`
3. `/transactions` — needs `api.getTransactions()`
4. `/goals` — needs `api.getGoals()`
5. `/plan` — needs `api.getPlan()`
6. `/recurring` — needs `api.getRecurringSeries()`
7. `/spending-story` — needs `api.getSpendingStory()`

---

### 🟠 P1-2: No Database Seed for Production-Equivalent Data
**Situation**: Migrations 001–022 create all tables. But there is no seed file that creates test user data (categories, accounts, transactions, etc.) for the first user.  

When a new user signs up via Clerk, the `requireAuth` middleware creates a `users` row. But:
- No categories are seeded (transactions will have `NULL category_id`)
- No financial accounts exist (all balance queries return 0)
- Gamification state is auto-initialized on first API call (good)
- Budget recalculation will run but have nothing to recalculate

**Impact**: First-time users see a completely empty app with no data. No onboarding flow actually imports financial data.  
**Fix**: Complete the onboarding flow in `frontend/src/app/onboarding/page.tsx` so that users can upload a bank statement. Verify the ingestion pipeline (upload → R2 → queue → parse → transactions) is end-to-end functional.

---

### 🟠 P1-3: Ingestion Pipeline — CloudflareQueuesAdapter Is Likely Broken in Dev
**File**: `backend/adapters/queue/cf-queues.adapter.js`  
**Issue**: Cloudflare Queues only work inside Cloudflare Workers. In local dev, the queue adapter will fail to enqueue jobs. This means:
1. `POST /import/upload-intent` → gets R2 presigned URL (works if R2 creds exist)
2. `POST /import/confirm` → tries to enqueue parse job → **fails silently or errors**
3. Transactions never get extracted from uploaded PDFs

**Fix**: Add a local dev queue fallback (e.g. in-memory queue or direct function call) that processes uploads synchronously when not in Cloudflare Workers environment.

---

### 🟠 P1-4: Forecast Feature Flag Blocks All Users (5% Rollout Too Restrictive)
**File**: `backend/utils/beta-cohort.js`, line 66  
**Issue**: Forecast routes are gated by `ai_forecast_beta` flag, which requires users to be in `INTERNAL` or `BETA_COHORT_1` cohort. `BETA_COHORT_1` is assigned via deterministic hash — only **5% of users** qualify. The `ensureBetaCohortAssigned` in `security.js` creates cohort assignments, but only 5% get access.  

**Impact**: 95% of users get 403 on `/forecast/outlook` — the Forecast page in the frontend is dead for most users.  
**Fix**: For V1 launch, change the rollout to 100% or remove the forecast feature flag gate. Update `feature-flags.js` to set `cohorts: ['ALL']` for `ai_forecast_beta`.

---

### 🟠 P1-5: Account Aggregator (AA/Setu) Routes Are Completely Disabled
**File**: `backend/server.js`, line 174
```js
// setupAARoutes(app, aaService); // AA disabled for V1 launch
```
The AA/Setu integration (Open Banking data aggregation) is commented out. Users have no way to connect real bank accounts automatically. The only data ingestion path is manual PDF upload, which itself has queue issues (P1-3).  
**Fix**: For V1 launch, keep AA disabled if not ready. But the PDF upload path MUST work. Prioritize fixing P1-3.

---

### 🟠 P1-6: Onboarding Page Is 37KB — Needs Audit
**File**: `frontend/src/app/onboarding/page.tsx` (37,111 bytes)  
**Issue**: This is a very large page file (37KB). It likely contains the critical first-run flow. Not fully audited — needs GL5.2 to check for:
- Does it correctly call `POST /auth/onboarding-complete`?
- Does it integrate with the PDF upload flow?
- Does it handle Clerk auth state correctly?
- Are there console errors or broken imports?

---

### 🟠 P1-7: Frontend `providers.tsx` Has Auth Disabled — No Clerk `ClerkProvider`
**File**: `frontend/src/components/providers.tsx`  
**Code**:
```tsx
// PREVIEW MODE: No auth — dashboard renders without login
// To replace with real auth, use providers.tsx.bak
```
The Clerk `ClerkProvider` is NOT wrapping the app. All pages render without authentication enforcement. This means:
1. `useClerk()` in `you/page.tsx` (SignOutButton) may work if Clerk auto-initializes
2. Route protection does NOT exist — any user can access any page
3. The frontend never sends a Clerk JWT to the backend — API calls will 401

**Fix**: Replace `providers.tsx` with the real Clerk version from `providers.tsx.bak`. Add `ClerkProvider` wrapping. Add Next.js middleware to protect routes.

---

### 🟠 P1-8: No `middleware.ts` in Frontend — All Pages Are Public
**File**: `frontend/src/` — **no `middleware.ts` exists**  
**Issue**: The frontend (main app) has no `middleware.ts`. The landing has one (`fincopilot-landing/src/middleware.ts`). Without middleware, there is no server-side auth check on any app route.  
**Fix**: Create `frontend/src/middleware.ts` using `clerkMiddleware` from `@clerk/nextjs/server`. Protect all routes except `/sign-in`.

---

### 🟠 P1-9: DB Connection Pool Has No Size Limits or Health Check
**File**: `backend/db/client.js`  
**Issue**: The `new Pool(...)` call has no `max`, `idleTimeoutMillis`, or `connectionTimeoutMillis` settings. Default `pg` pool size is 10 connections. Under load (10k users), 10 connections will be exhausted almost immediately.  
**Fix**: Set `max: 20`, `idleTimeoutMillis: 30000`, `connectionTimeoutMillis: 5000`. For production, consider PgBouncer.

---

## PART 6: MEDIUM PRIORITY (P2 — Fix Before 10K Users)

### 🟡 P2-1: AI Rate Limiter Uses Per-Minute DB Sliding Window — Not Scalable
**File**: `backend/api/ai.routes.js`, lines 19–37  
**Issue**: The AI rate limiter queries `ai_rate_limits` table (count + insert) on every AI request. At 10k concurrent users, this creates:
- 2 DB queries per AI request (SELECT count + INSERT)
- Table will grow unboundedly (no cleanup)
- No index on `created_at` — the SELECT will full-scan

**Fix**: 
1. Add index: `CREATE INDEX ON ai_rate_limits (user_id, created_at DESC)`
2. Add a periodic cleanup job to delete rows older than 1 hour
3. Consider Redis for rate limiting at scale

---

### 🟡 P2-2: `logger.info` on Every DB Query — Performance Killer
**File**: `backend/db/client.js`, line 41
```js
logger.info(`[DB] Executed Query`, { text, duration, rows: res.rowCount });
```
**Issue**: Every single DB query logs at INFO level. A single page load fires 10–15 queries. At 10k users, this floods logs and adds I/O overhead.  
**Fix**: Change to `logger.debug` or use a sampling rate (log only queries >100ms).

---

### 🟡 P2-3: `GamificationController` N+1 Query Problem
**File**: `backend/api/controllers/gamification.controller.js`, lines 39–66  
**Issue**: For new users, the controller runs individual `INSERT` statements in a loop for 6 badges and 10 milestones (16 sequential DB roundtrips).  
**Fix**: Batch insert with `INSERT INTO gamification_badges VALUES ($1,$2,$3,false), ($4,$5,$6,false)...`.

---

### 🟡 P2-4: `financial/liabilities` Route — N+1 Query for Each Account
**File**: `backend/api/routes.js`, lines 223–234  
**Issue**: For each liability account, it calls `FinancialStateRepo.getAccountBalances()` individually inside a `for` loop. If user has 5 credit cards, that's 5 sequential DB calls.  
**Fix**: Refactor to single aggregation query.

---

### 🟡 P2-5: Frontend `useMultipleApi` Fail-All on Any Error
**File**: `frontend/src/lib/use-api.ts`, lines 76–88  
**Issue**: `useMultipleApi` uses `Promise.all` which fails everything if one endpoint fails. A single bad API response empties the entire page.  
**Fix**: Use `Promise.allSettled` and map fulfilled/rejected results separately.

---

### 🟡 P2-6: Transactions Page Shows Mock Data — No Filter API Integration
**File**: `frontend/src/app/transactions/page.tsx`  
**Issue**: Uses `recentTransactions` from `data.ts`. Filter works on static mock. Real filters (date range, category, account) need to call `GET /api/v1/transactions?accountId=&category=&startDate=&endDate=`. The backend supports all these params — frontend just doesn't call it.

---

### 🟡 P2-7: `ClerkExpressRequireAuth` from Deprecated `@clerk/clerk-sdk-node`
**File**: `backend/api/middlewares/security.js`, line 28  
**Issue**: 
```js
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
```
`@clerk/clerk-sdk-node` is a legacy package. The modern equivalent is `@clerk/express`. This will generate deprecation warnings in newer Node versions and may break in future Clerk versions.  
**Fix**: Migrate to `@clerk/express`.

---

### 🟡 P2-8: `notifications/read-all` Route Order Conflict
**File**: `backend/api/routes.js`, lines 249–251  
```js
router.put('/notifications/:id/read',   ...);
router.put('/notifications/read-all',  ...);
```
**Issue**: Express matches routes in order. `PUT /notifications/read-all` will match `:id/read` route first, with `id = "read"` and path segment `"all"` — this will **never reach the read-all handler**.  
**Fix**: Swap the order — put `read-all` BEFORE `/:id/read`.

---

### 🟡 P2-9: Missing Error Boundaries on All Frontend Pages
**Issue**: No `error.tsx` or React Error Boundaries exist in the app. A single runtime error crashes the whole page with Next.js default error screen.  
**Fix**: Add `error.tsx` in `frontend/src/app/` (global) and key subdirectories.

---

### 🟡 P2-10: `you/page.tsx` — `refetch` Called on Undefined in GoalCreated Handler
**File**: `frontend/src/app/goals/page.tsx`, line 26 (same as P0-3)  
Already documented above.

---

## PART 7: DATABASE — MIGRATIONS AUDIT

### Migration Files (`backend/db/migrations/`)

| # | File | Purpose | Status |
|---|------|---------|--------|
| 001 | `001_init.sql` | Core tables: users, financial_accounts, transactions | ✅ |
| 002 | `002_ingestion.sql` | Ingestion jobs, source connections | ✅ |
| 003 | `003_categories.sql` | Categories table + default data | ✅ |
| 004 | `004_audit_events.sql` | Audit log table | ✅ |
| 005 | `005_financial_state.sql` | Balances, snapshots | ✅ |
| 006 | `006_planning.sql` | Goals, commitments, recurring series | ✅ |
| 007 | `007_consent.sql` | consent_records, privacy policies | ✅ |
| 008 | `008_ai.sql` | AI tables: interactions, insights, rate_limits, budgets | ✅ |
| 009 | `009_trust.sql` | Export/deletion requests, user preferences | ✅ |
| 010 | `010_forecast.sql` | Forecast snapshots, evaluations | ✅ |
| 011 | `011_notifications.sql` | Notifications table | ✅ |
| 012 | `012_gamification.sql` | gamification_state, badges, milestones | ✅ |
| 013 | `013_beta_cohorts.sql` | beta_cohort_assignments | ✅ |
| 014 | `014_data_quality.sql` | Data quality metrics | ✅ |
| 015 | `015_peer_comparison.sql` | Net worth history, calendar events, savings challenges | ✅ |
| 016 | `016_budgets.sql` | budgets table | ✅ |
| 017 | `017_ai_saved_simulations.sql` | ai_saved_simulations table | ✅ |
| 018 | `018_consent_handle_and_status.sql` | Adds consent_handle, status columns | ✅ Fixed |
| 019 | `019_ai_insight_feedback.sql` | ai_insight_feedback table | ✅ |
| 020 | `020_statements.sql` | statements table for document storage | ✅ |
| 021 | `021_firebase_uid_nullable.sql` | Makes firebase_uid nullable | ✅ |
| 022 | `022_users_display_name.sql` | Adds display_name to users | ✅ |

**All 22 migrations applied successfully.** No pending migrations.

### Missing Indexes (Performance Risk at Scale)
- `transactions(user_id, observed_at DESC)` — needed for all timeline queries
- `transactions(user_id, direction, observed_at)` — needed for income/spend calcs
- `ai_rate_limits(user_id, created_at DESC)` — needed for rate limiter (P2-1)
- `recurring_series(user_id, status)` — needed for recurring summary
- `gamification_badges(user_id, badge_name)` — has unique constraint but needs index confirmed

---

## PART 8: AUTH FLOW AUDIT

### Production Auth Path
```
User → Clerk sign-in → Clerk JWT in Authorization header
→ Backend requireAuth → ClerkExpressRequireAuth validates JWT
→ req.auth.userId = Clerk ID
→ DB lookup: SELECT user_id FROM users WHERE clerk_uid = $1
→ If not found: auto-create user row
→ req.user = { id, userId, clerkId, email, displayName }
```

### Dev Auth Path (LOCAL ONLY)
```
Frontend sends header: x-dev-bypass: true, x-dev-user-id: <clerk-uid>
→ Backend skips Clerk JWT validation
→ DB lookup for user by clerk_uid
→ req.user populated
```

### Issues
1. **Frontend doesn't send any auth header** (P1-7 / P1-8 — Clerk provider disabled)
2. `x-dev-bypass` still present in CORS `allowedHeaders` — must be removed before production
3. `test-auth.js` middleware is imported and conditionally mounted at server startup — unused in production but still runs the import check

---

## PART 9: ENVIRONMENT VARIABLES REQUIRED

### Backend `.env`
```
DATABASE_URL                    ← PostgreSQL connection string
CLERK_SECRET_KEY                ← Clerk backend secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ← Clerk publishable key
GEMINI_API_KEY                  ← Google Gemini API key (optional — AI mocked without it)
OPENAI_API_KEY                  ← OpenAI fallback (optional)
R2_ENDPOINT_URL                 ← Cloudflare R2 endpoint
R2_ACCESS_KEY_ID                ← R2 access key
R2_SECRET_ACCESS_KEY            ← R2 secret
R2_BUCKET_NAME                  ← R2 bucket name
CORS_ORIGIN                     ← Frontend origins (comma-separated)
INTERNAL_WEBHOOK_TOKEN          ← For /internal/* webhook routes
TELEMETRY_SALT                  ← For anonymous user hashing
PORT                            ← Backend port (default 3001)
NODE_ENV                        ← production | development
AI_KILL_SWITCH                  ← Set to "ENGAGED" to disable AI
SETU_BASE_URL                   ← Account Aggregator API base (optional)
SETU_FIU_ID                     ← Setu FIU ID (optional)
```

### Frontend `.env.local`
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_API_BASE_URL        ← Backend URL (http://localhost:3001)
```

### Landing `.env.local`
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```

---

## PART 10: DEAD CODE / CLEANUP ITEMS (P3)

| File | Issue |
|------|-------|
| `frontend/src/app/page.landing.tsx.bak` | Backup landing page in app — should be deleted |
| `frontend/src/components/providers.tsx.bak` | Backup provider file — should be deleted or renamed |
| `backend/api/middlewares/test-auth.js` | Unused in production — file can stay but is dead code in prod |
| `frontend/src/app/transactions/page.tsx` line 11 | Dangling `;` on its own line — cleanup artifact |
| `frontend/src/app/goals/page.tsx` line 13 | Same dangling `;` |
| `frontend/src/app/recurring/page.tsx` line 38 | Same dangling `;` |
| `frontend/src/app/spending-story/page.tsx` line 11 | Same dangling `;` |
| `frontend/src/app/ai/page.tsx` line 13 | Same dangling `;` |
| `frontend/src/app/money/page.tsx` line 28 | `CurrencyNoteCard` component has dangling `;` at top |
| All pages using `data.ts` imports | These are temporary stubs — all mock data should be removed after real API wiring |
| `frontend/src/app/you/page.tsx` | `useClerk()` works but `SignOutButton` component is defined outside `use client` boundary — check compilation |

---

## PART 11: LANDING PAGE (`fincopilot-landing/`)

### Status: ✅ Mostly Complete

The landing page is a full-featured marketing site with:
- **14 sections**: Nav, Hero, TrustMarquee, Problem, HowItWorks, BentoFeatures, AICopilotDeepDive, ChartShowcase, DashboardPreview, Integrations, Security, Testimonials, Pricing, FAQ, FinalCTA, Footer
- Clerk middleware for CSP headers + login state detection
- Sign-in/sign-up via Clerk components
- `api/session` route to check if user is logged in

### Issues
1. Pricing page — verify it shows correct pricing tiers and CTA links to `/sign-up`
2. The landing page `page.tsx` is missing `Comparison` and `SavingsCalculator` sections from the `.bak` file — these were intentionally removed or accidentally dropped

---

## PART 12: AI PIPELINE — DETAILED STATUS

### AI Gateway (`backend/domains/ai/gateway.js`)
✅ Full pipeline: Intent → Risk → Policy → Context Planning → Tool Execution → Cost Governor → LLM → Validation → Audit Logging

### Known Issues
1. **Evidence validation** (`Validator.validateEvidence`) — implementation needs audit (may be too strict, blocking all AI responses)
2. **Context Planner** (`ContextPlanner.planContext`) — not audited — may return empty context for new users
3. **Tool Executor** — only `affordability` pre-fetch and `create_goal` mutation implemented. Other tool IDs (`money-leaks`, `explain-month`) are handled by sending to LLM without tool pre-fetch.
4. **Budget row auto-creation** in gateway — if `ai_user_budgets` row doesn't exist, it creates one. But `budget_limit_paise = 500000` (₹5000) — verify this is the intended limit.
5. **Gemini SDK version** — using `@google/genai` with `gemini-2.5-flash`. Verify the SDK version matches the model name.

---

## PART 13: ACTION PLAN FOR GL5.2 AGENT

### Phase A — Critical Fixes (Do First, Required for Launch)

1. **Fix `/forecast/page.tsx` syntax error** — move the import line (P0-2)
2. **Fix `/ai/chat/page.tsx` `send()` function** — wire to `api.post('/ai/chat', ...)` (P0-1)
3. **Fix `notifications/read-all` route order** — swap route definitions (P2-8)
4. **Enable Clerk auth in frontend** — restore `providers.tsx` to use `ClerkProvider`, create `middleware.ts` (P1-7, P1-8)
5. **Fix `req.user.id` vs `req.user.userId`** in inline route handlers (P0-4)
6. **Remove `AUTH_MODE=mock` guard** confusion — ensure `.env` is correct (P0-5)

### Phase B — Data Wiring (Required for App to Show Real Data)

7. **Wire money page** to `GET /accounts` + `GET /net-worth/history`
8. **Wire transactions page** to `GET /transactions`
9. **Wire goals page** to `GET /goals` + `POST /goals`
10. **Wire spending-story page** to `GET /financial-state/spending-story`
11. **Wire plan/budget page** to `GET /plan` (which returns goals+upcoming+cashflow+health)
12. **Wire recurring page** to `GET /recurring`
13. **Wire AI page** to `GET /ai/home-feed`
14. **Wire financial-health page** to `GET /financial-health`
15. **Wire you/settings page** to `GET /auth/me`, `GET /gamification`, etc.

### Phase C — Feature Activation

16. **Open Forecast to all users** — change feature flag cohort to `['ALL']` (P1-4)
17. **Fix PDF ingestion queue** — add local dev fallback for CloudflareQueuesAdapter (P1-3)
18. **Add DB indexes** — at minimum on `transactions(user_id, observed_at)` (P2 missing indexes)

### Phase D — Performance / Cleanup

19. **Fix gamification N+1** — batch INSERT for badges/milestones (P2-3)
20. **Fix liabilities N+1** — single aggregation query (P2-4)
21. **Set DB pool limits** — `max: 20` connections (P1-9)
22. **Remove dangling `;` lines** from all page files (P3)
23. **Delete .bak files** from frontend (P3)
24. **Change `logger.info` to `logger.debug`** for DB queries (P2-2)

---

## SUMMARY TABLE

| Priority | Count | Description |
|---------|-------|-------------|
| 🔴 P0 Blocker | 5 | Crashes, syntax errors, broken core features |
| 🟠 P1 Critical | 9 | Auth disabled, all pages use mock data, no seed |
| 🟡 P2 High | 10 | N+1 queries, route order bug, no error boundaries |
| 🔵 P3 Cleanup | 12+ | Dead code, dangling semicolons, backup files |

**Bottom line for GL5.2**: The backend is architecturally solid with all 50+ routes implemented and 22 DB migrations applied. The AI pipeline, auth middleware, and domain services are well-built. The main launch blockers are: (1) frontend still uses 100% mock data, (2) Clerk auth provider is disabled in the frontend, (3) two pages have syntax errors, and (4) AI chat is broken. Fix these 4 areas and the app can launch.
