# FinCopilot — Exhaustive Production Audit Report

**Date:** 2026-09-03 (app scheduled to go LIVE TOMORROW)
**Auditor:** Staff Engineer (top-tier app dev company mindset)
**Verdict:** 🛑 **DO NOT LAUNCH.** ~50 P0 blockers + ~90 P1 broken features.

---

## 📊 SUMMARY (consolidated across 3 audits)

| Severity | Count | Meaning |
|---|---|---|
| **P0 — blocks launch** | **~50** | Server crashes / security holes / 500 errors / auth bypass |
| **P1 — broken** | **~90** | Features don't work (fake spinners, dead buttons, mock data) |
| **P2 — polish** | **~100** | Dead code, hardcoded values, doc drift |
| **Total** | **~240** | |

### Overall readiness: **~15%**

---

## 🔴 TOP 20 P0 CRITICAL (blocks launch — must fix tonight)

### Backend Server Cannot Boot
1. **`backend/domains/financial-state/coverage/coverage.engine.js` MISSING** — `safe_to_spend.engine.js:5` imports it → `ERR_MODULE_NOT_FOUND`. Server crashes at boot. Both `/financial-state/home` AND `/ai/chat` dead.

### Security Holes (anyone can access any user's money)
2. **`api/routes.js:191-199` — `/api/v1/refactor` route: UNPROTECTED `execSync('node c:/Fincopilot/frontend/refactor.js')`** — remote code execution, no auth, hardcoded Windows path. Anyone can trigger shell exec.
3. **`api/middlewares/security.js:32-35` — `x-dev-bypass: true` + `x-dev-user-id` headers bypass auth in ALL environments including production.** No `NODE_ENV !== 'production'` guard. Anyone becomes any user.
4. **`api/routes.js:29` — `INTERNAL_WEBHOOK_TOKEN || 'fincopilot-internal-2024'`** — hardcoded fallback token. Internal endpoints open.
5. **`server.js:51` — CORS `origin: '*'` default** if `CORS_ORIGIN` unset.
6. **`security.js:62-67` — auto-creates user on unknown Clerk UID**, no consent, no onboarding.
7. **`db/client.js:22-23` — `ssl: { rejectUnauthorized: false }`** disables cert verification (MITM risk).
8. **`frontend/src/middleware.ts:13-15` — `if (NODE_ENV !== "development") await auth.protect()`** — auth bypassed in dev/staging. Many prod deploys accidentally use `NODE_ENV=development`.

### Database Broken
9. **`db/client.js:32-42` — `connect()` returns `true` (boolean), not a PG client.** Every transactional caller (`saveCanonicalTransaction` etc.) crashes with `TypeError: client.query is not a function`. Normalization NEVER works → no transactions ever get created.
10. **`db/migrations/run.js:15` — regex `/^\d{3}_/` silently skips `0020_beta_cohort_assignments.sql`** (4-digit prefix). Table missing → ALL `/forecast/*` routes 500 (feature-flag middleware queries missing table).
11. **`db/repositories.js:271` — `UPDATE source_records SET status='processing'`** violates CHECK constraint (only `raw|normalized|rejected` allowed). Throws.
12. **`db/repositories.js:39-69` — 4 ConsentRepo methods** reference non-existent columns `consent_handle`, `status` on `consent_records`.
13. **`db/run-migrations.js:81-93` — fake transaction** (BEGIN/SQL/COMMIT span 3 different pool connections). Not atomic.
14. **Two migration runners** (`run.js` + `run-migrations.js`) with different tracking tables (`fincopilot_migrations` vs `schema_migrations`). `introspect.js` queries the wrong one.

### Schema Drift (endpoints throw 500)
15. **`trust.controller.js:12,15,168`** — selects `fa.balances`, `fa.last_synced_at` (don't exist), wrong JOIN column `fa.connection_id` (real: `source_connection_id`), queries `audit_events.user_id` (doesn't exist).
16. **`data_quality.controller.js:14,16`** — same `fa.last_synced_at` + `fa.connection_id` drift.
17. **`ai.routes.js:100` — `WHERE status = 'ACTIVE'`** (uppercase) but schema CHECK is lowercase `'active'`. Returns zero insights.
18. **`ai.routes.js:145-148`** — `ai_insights` SELECT references non-existent `category`, `description`, `data` columns (real: `title`, `summary`, `evidence`).
19. **`ai.routes.js:209-213`** — `ai_saved_simulations` INSERT references non-existent `title`, `result_data`, `params` columns + `RETURNING id` (real: `simulation_id`). 500 every call.
20. **`financial.controller.js:132` — `WHERE transaction_type = $2`** for `categoryId` param — wrong column (should be `category_id`).

### Auth / Config
21. **`.env.example` documents Firebase but code uses Clerk.** No `CLERK_SECRET_KEY` documented. Production cannot authenticate.
22. **`config/env.js:18-21` — requires `FIREBASE_PROJECT_ID`, not `CLERK_SECRET_KEY`.** Silently passes validation with no auth.
23. **`frontend/src/components/providers.tsx` — "No-auth preview build"** — no `ClerkProvider`, no `AuthGate`, no `ClerkTokenSync`. Sign-in/up pages crash.
24. **`server.js:154` — AA adapter hardcoded `apiKey: 'mock'`** instead of `config.setu.apiKey`.
25. **`server.js:42` — Helmet CSP `imgSrc: "https://*"`** — wildcard allows any image source.

### Deployment Broken
26. **`Dockerfile:7-8` — `npm ci` at root installs only root deps.** Missing: `@clerk/*`, `express-rate-limit`, `pg`, `xlsx`, `openai`, `csv-parser`, `@google/genai`. Backend imports crash.
27. **`Dockerfile` never builds Next.js apps** (frontend + landing). Only copies source.
28. **`Dockerfile:19,41,45` — port mismatch**: `PORT=3000`, `EXPOSE 3000`, healthcheck `:3000` — but `.env.example` + `Caddyfile` expect `:3001`.
29. **`wrangler.toml:2` — `main = "backend/server.js"` on Cloudflare Workers.** Express/Node CANNOT run on Workers (no `node:http`, TCP, `fs`). Deployment impossible.

### Landing Page — Currency + Fraud
30. **`hero.tsx:171` — `<span>$<CountUp format="currency"/></span>`** renders `$₹48,217` (double currency symbol).
31. **`hero.tsx:180` — `+$1,240`** (USD on INR app).
32. **`pricing.tsx:84` — `${price}`** (USD) for ₹299/₹499 tiers.
33. **All 6 chart tooltips** use `$` not `₹` (spending-area, cashflow-bar, net-worth-line, forecast-combo ×2, spending-treemap).
34. **`layout.tsx:43` — favicon URL `https://z-cdn.chatglm.cn/z-ai/static/logo.svg`** (third-party CDN, unrelated to FinCopilot).
35. **`layout.tsx:78` — JSON-LD `priceCurrency: "USD"`** (app is INR).
36. **`layout.tsx:82-83` — JSON-LD fake `ratingValue: "4.9", ratingCount: "250000"`** — Google Search Central policy violation.
37. **`landing-data.ts:249,253-256` — fake claims**: SOC 2 Type II, ISO 27001, ₹2.4B tracked, 250K users, 99.99% uptime, 4.9★ Play Store. All unverifiable for app launching tomorrow.
38. **`landing-data.ts:97-108` — 12 integration SVG logos** (`/integration-logo-1..12.svg`) referenced but DON'T EXIST in `public/`. 12 broken images.
39. **`security.tsx:74` — "Independently audited by Coalfire, 2025."** — specific auditor claim, fraud if untrue.
40. **`testimonials.tsx` — 6 testimonials with Indian cities but Western names**, using `founder-avatar-N.jpg` filenames. Deceptive marketing under Indian consumer-protection law.
41. **`Caddyfile.dev:20` — hardcoded Windows path `C:/Fincopilot/...`** — breaks on Linux/macOS.
42. **`Caddyfile.dev:26` — `reverse_proxy localhost:3000`** but landing runs on `:3002`. Mismatch.

### Frontend Crashes
43. **`ai/page.tsx:13,66` — `aiInsights.map()` crashes** because `useAppData` never sets `aiInsights` after fetch (key missing in merge).
44. **`ai/insight/[id]/page.tsx:13` — same crash** + falls back to `aiInsights[0]` (wrong data).
45. **Dark mode: `bg-accent text-white` on 68 occurrences across 19 pages** — `--accent: #FFFFFF` in dark mode → **white text on white bg = INVISIBLE buttons** (New Goal, Detect New, Export, Send, etc.).
46. **`next.config.ts:14` — API rewrite hardcoded to `localhost:3001`** — breaks in any non-local deploy.
47. **`use-app-data.ts:39-54` — silent mock fallback on every API failure** — user sees fake ₹24,97,000 net worth, fake email, fake streak. No error shown. Financial data integrity nightmare.
48. **`use-app-data.ts:59-78` — 9 data keys NEVER refreshed** (aiInsights, currentUser, securityData, gamification, privacyData, dataCoverage, netWorthHistory, chatExamples) — stuck on mock forever.
49. **`.env.example` is for a DIFFERENT APP** (Firebase) — frontend needs `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `NEXT_PUBLIC_API_URL`, neither documented.
50. **`tsconfig.json:13` — `noImplicitAny: false`** + **`next.config.ts:6` — `ignoreBuildErrors: true`** — type system is decorative, broken types ship silently.

---

## 🟠 P1 BROKEN (90+ issues — features don't work)

### Fake Spinners (setTimeout instead of real API)
- `ai/chat/page.tsx:28-31` — AI chat returns hardcoded `"I'm analyzing your financial data..."` after 2s. `api.sendAIChat()` exists, unused.
- `you/connections/page.tsx:81,99` — Sync Now / Disconnect use `setTimeout(1400ms/900ms)`. `api.disconnectConnection()` unused.
- `you/privacy/page.tsx:96-100` — Delete data uses `setTimeout(1800ms)`. `api.requestDeletion()` unused.
- `you/security/page.tsx:74-78` — Revoke session uses `setTimeout(900ms)`. `api.revokeSession()` unused.
- `you/export/page.tsx:87,105` — Export + Delete Account use `setTimeout(1600ms/2200ms)`. `api.requestExport()` unused.

### Dead Buttons (no onClick)
- `goals/page.tsx:17` — "New Goal" button: NO onClick. `api.createGoal()` unused.
- `recurring/page.tsx:72-78` — "Detect New" button: NO onClick. `api.detectRecurring()` unused.
- `ai/afford/page.tsx:18` — "Analyze" button: NO onClick. Input has no state.
- `ai/leaks/page.tsx:18` — "Analyze" button: NO onClick.
- `you/security/page.tsx:209,336` — "Manage" + "Change Password": NO onClick.
- `you/export/page.tsx:255,301` — "Save" + "Download": NO onClick.
- `you/connections/page.tsx:133` — "Add New": `onClick={() => {}}` (empty).

### Sign Out is Fake
- `you/page.tsx:528` — `onClick={() => toast({ title: "Signed out", description: "You've been signed out (mock)." })}` — user NOT actually signed out. No `clerk.signOut()` call.

### Detail Pages — Wrong Data on Invalid ID
- `transactions/[id]/page.tsx:14` — falls back to `recentTransactions[0]` for unknown ID.
- `accounts/[id]/page.tsx:14` — falls back to `accounts[0]`.
- `goals/[id]/page.tsx:13` — falls back to `goals[0]`.
- `ai/insight/[id]/page.tsx:15` — falls back to `aiInsights[0]`.
- User hitting `/transactions/invalid-id` sees WRONG transaction silently.

### Period/Horizon Toggles Don't Refetch
- `cashflow/page.tsx:23` — period toggle just slices client-side, never calls `api.getCashflow(period)`.
- `forecast/page.tsx:53` — horizon toggle just swaps index, never calls `api.getForecast(horizon)`.

### Hardcoded Values (not from API)
- `page.tsx:93,107,112,117` — `↓8%`, sparkline `[22,24,23,25...]`, `↓8% vs last`, `↑2.1%` all hardcoded.
- `money/page.tsx:85-88` — Assets/Liabilities/Investments/Cash hardcoded `2497000/1240000/45000`.
- `money/page.tsx:135` — `last_synced_at.startsWith("2026-09-01")` hardcoded date check — ALWAYS false in production.
- `plan/page.tsx:119` — `CHALLENGE_CURRENT_WEEK = 36` hardcoded.
- `plan/page.tsx:699` — `today = new Date("2026-09-01T12:00:00Z")` hardcoded "today".
- `you/page.tsx:227` — `<Badge label="Level 4">` hardcoded.
- `you/page.tsx:535` — "App version v78.0" hardcoded (package.json says 0.2.1).
- `data-coverage/page.tsx:264` — "Axis Bank is stale" hardcoded.
- `financial-health/page.tsx:140-168` — 3 "AI Generated" recommendations hardcoded.
- `forecast/page.tsx:161` — `value={horizon.projected_balance_paise * 100}` likely 100× display bug.

### 21 API Mutation Methods UNUSED (defined in api.ts, never called)
`createGoal`, `updateGoal`, `deleteGoal`, `createBudget`, `updateBudget`, `deleteBudget`, `recalculateBudgets`, `detectRecurring`, `runScenario`, `sendAIChat`, `runAISimulate`, `markNotificationRead`, `markAllNotificationsRead`, `deleteNotification`, `tickStreak`, `earnBadge`, `disconnectConnection`, `updatePrivacyConsent`, `revokeSession`, `requestExport`, `requestDeletion`, `updatePreferences`, `completeOnboarding`.

### Backend Broken Features
- **`forecast/features.js`** — queries `current_balance_paise`, `as_of`, `transaction_date`, `is_transfer` — none exist. `/forecast/*` 500.
- **`ai/planner.js`** — 4 schema drifts (financial_snapshots columns, goals.current_amount_paise, transactions.date). AI runs with empty context.
- **`insights.controller.js` getCalendarEvents** — `commitments.description` (real: `name`), `status='pending'` (not in enum), `recurring_series.category` (doesn't exist).
- **`insights.controller.js` getNetWorthHistory** — `snapshot_type`, `snapshot_value_paise` (real: `calculation_type`, `result_paise`).
- **`insights.controller.js` getSavingsChallenges** — auto-seed INSERT omits NOT NULL `start_date`.
- **`insights.controller.js` getPeerComparison** — peer medians hardcoded (`18%`, `1.8 months`, `9 subs`, `15%`, `12450 peers`). Fabricated data.
- **`trust.controller.js` requestExport/getExportStatus** — stubs (migration 016 creates `export_jobs` table but controller fabricates fake job IDs).
- **`reconciliation.repository.js`** — `claimUnreconciledTransactions` has no `is_reconciled` filter → re-evaluates ALL transactions every 60s. O(N²) growth.
- **`cashflow.service.js:54`** — `settlement_role != 'settlement'` excludes NULL rows → balance sums ~0.
- **`normalization.pipeline.js:77`** — `amount_paise: moneyResult.amount_paise || 0` → zero-amount txs violate CHECK → rejected.
- **PDF ingestion always fails** — `AIAdapter.extractStructuredData()` throws `'AI extraction not yet fully implemented'`. Every PDF → DLQ.
- **Beta cohort never assigned** — `assignCohort()` never called → `/forecast/*` returns 403 for ALL users.
- **AA routes disabled** (`server.js:162` commented out) + adapter is pure mock.
- **`db/seed.js`** — only seeds ~10 of 50+ tables; incomplete.

---

## 🟡 P2 POLISH (100+ issues — cleanup)

- `next.config.ts:8` — `reactStrictMode: false`
- `eslint.config.mjs` — all useful rules disabled
- `src/lib/db.ts` + Prisma deps — dead code (no schema.prisma exists)
- 50+ shadcn UI components installed, **0 used by pages** — bundle bloat
- `tailwind.config.ts` — dead (Tailwind 4 uses CSS `@theme`)
- `globals.css:103-105` — duplicate `--radius-sm/lg/xl` (overrides `@theme inline`)
- `formatPaise("100")` — silent string coercion
- `use-toast.ts:12` — `TOAST_REMOVE_DELAY = 1000000` (16 min memory leak)
- `sparkline.tsx:18-22` — crashes on empty `data` array
- `plan/page.tsx` — 2,199 lines monolith
- `.bak` files committed (`providers.tsx.bak`, `middleware.ts.bak`)
- `refactor.js` committed in frontend
- `PREVIEW_REFERENCE/` committed (bloats repo)
- `firebase-admin` dep unused (backend uses Clerk)
- `wrangler.toml` — impossible config (Express on Workers)
- `README.md` — says "Vanilla HTML/CSS/JS (no framework)" but frontend is Next.js 16
- `SETUP_v10.md:66` — claims "fully converted to ₹ INR" but all charts use `$` (FALSE)
- No down-migrations (zero rollback support for money data)

---

## 🎯 WHAT TO DO TONIGHT (priority order)

### Must fix before ANY user touches the app (P0 — 8-12 hours work):
1. Create `backend/domains/financial-state/coverage/coverage.engine.js`
2. DELETE `/api/v1/refactor` route (`routes.js:191-199`)
3. Gate `x-dev-bypass` behind `NODE_ENV !== 'production'` (`security.js:32-35`)
4. Remove hardcoded `INTERNAL_WEBHOOK_TOKEN` fallback (`routes.js:29`)
5. Fix `db/client.js:connect()` to return real client
6. Fix `db/migrations/run.js:15` regex to `/^\d{3,4}_/`
7. Fix all schema drift (8 controllers/routes — `trust`, `data_quality`, `ai.routes`, `financial`, `insights`)
8. Fix `.env.example` + `config/env.js` — require `CLERK_SECRET_KEY`, drop `FIREBASE_PROJECT_ID`
9. Restore `ClerkProvider` in `frontend/providers.tsx` (from `.bak`)
10. Remove `NODE_ENV !== "development"` bypass in `frontend/middleware.ts`
11. Fix all 6 chart tooltips + hero + pricing → `₹` instead of `$`
12. Remove fake claims (SOC 2, ISO 27001, Coalfire, 250K users, ₹2.4B, 99.99%, 4.9★)
13. Generate 12 missing `/integration-logo-*.svg` OR remove `integrations` array
14. Fix `dark-mode text-white` → `text-accent-foreground` (68 occurrences, 19 files)
15. Remove `ignoreBuildErrors: true` + `noImplicitAny: false`
16. Rewrite Dockerfile (install backend deps, build Next.js, correct port)
17. Delete `wrangler.toml` (or pick Node-compatible host)
18. Remove silent mock fallback in `use-app-data.ts`

### Strongly recommended (P1 — 2-3 days work):
19. Wire every `setTimeout` fake to real API call (AI chat, sync, disconnect, export, delete, revoke)
20. Wire every dead button (New Goal, Detect New, Analyze ×2, Manage, Change Password, Save, Download, Add New)
21. Real Sign Out via `clerk.signOut()`
22. Fix detail-page `[0]` fallbacks → 404/EmptyState
23. Refetch on period/horizon change
24. Fix `forecast/features.js` column names
25. Fix `ai/planner.js` 4 schema drifts
26. Fix `insights.controller.js` 3 broken methods
27. Implement real export (CSV from DB → R2 → presigned URL)
28. Implement real deletion (soft delete + 30-day grace)
29. Assign beta cohort on user creation
30. Seed all tables (complete `seed.js`)

---

## ❓ HONEST RECOMMENDATION

**Do NOT launch tomorrow.**

The codebase has the SCAFFOLDING of a production system (good domain separation, versioned migrations, telemetry, feature flags, reconciliation engines). But the WIRING is broken at every seam:

- **Backend cannot boot** (missing file)
- **Auth is bypassable** (anyone becomes any user)
- **DB layer is broken** (connect() returns boolean)
- **12+ endpoints 500** (schema drift)
- **Frontend shows fake data silently** (mock fallback on every API failure)
- **Landing is marketing fraud** (fake certifications, fake user counts, fake testimonials, wrong currency)
- **Deployment is impossible** (Dockerfile broken, Workers config impossible)

For a FINANCE app handling Indian users' money data under RBI/DPDP regulations, launching with these issues is reckless. **Push the launch by at least 1 week.** Fix the 50 P0s first, then the 90 P1s, then launch.

**This is not pessimism — this is engineering honesty. A top-tier app dev company would NEVER ship this.**
