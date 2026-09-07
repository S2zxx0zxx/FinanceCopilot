# FinCopilot — 3-Day Production Launch Master Prompt

> **FOR:** Antigravity IDE Agent (has full codebase access at the GitHub repo `S2zxx0zxx/FinanceCopilot`)
> **MISSION:** Make FinCopilot a REAL, working, production-grade app in 3 days. Every feature must work with real data — no mocks, no hardcoded values, no fake spinners, no dead buttons.
> **MINDSET:** You are a top-tier AI engineering team (Staff Engineer + Senior Fullstack + QA Lead). Think like Stripe/Linear/Razorpay engineers. Production-grade. No shortcuts.

---

## 🎯 CRITICAL CONTEXT — READ FIRST

### Architecture (LOCKED — do not change)
- **Backend:** Node.js + Express + PostgreSQL (modular monolith). Located at `backend/`. Runs on port 3001.
- **Frontend:** Next.js 16 + React 19 + Tailwind + shadcn/ui. Located at `frontend/`. Runs on port 3000.
- **Landing:** Separate Next.js app at `fincopilot-landing/` (port 3002). Already polished. DO NOT TOUCH except bug fixes.
- **Database:** PostgreSQL with 15 raw SQL migrations (NOT Prisma). Tables defined in `backend/db/migrations/*.sql`.
- **Auth:** Clerk (backend uses `ClerkAuthAdapter`, frontend has `@clerk/nextjs` installed but GUTTED).
- **Money:** ALL monetary values stored as BIGINT paise (₹1 = 100 paise). NEVER use floats.
- **AI:** OmniRouter adapter (or `z-ai-web-dev-sdk` as fallback for dev).

### Current Reality (verified by deep scan)
- **Frontend:** 30 pages. Only `/` (Home) tries to call API → all 404. Other 29 use hardcoded `data.ts`. Auth gutted. Onboarding is fake (spinner only). "New Goal", "Detect New", "Analyze" buttons have NO onClick. AI Chat returns hardcoded string. Sign Out shows toast only.
- **Backend:** ~70% real, ~30% broken. 12 P0 endpoints crash (broken imports, wrong columns, missing tables). Real: auth, ingestion (CSV/Excel), normalization, reconciliation, goals, recurring, health, budgets, notifications, gamification. Broken: `/financial-state/home` (missing `coverage.engine.js`), `/forecast/*` (wrong columns), `/auth/onboarding-complete`, `/financial/liabilities`, `/calendar/events`, `/net-worth/history`, `/savings-challenges`, 4 AI routes (missing `ai_insights` table), AA routes (no auth + mock).

### Infra YOU must set up (ask user for keys if missing)
- PostgreSQL (Neon free tier recommended — instant, free, 0.5GB)
- Clerk account (free tier) — get `CLERK_SECRET_KEY` + `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Cloudflare R2 (free 10GB) — for statement file storage
- `OMNIROUTER_API_KEY` OR use `z-ai-web-dev-sdk` (already in package.json) for AI
- Frontend deploy: Vercel. Backend deploy: Railway or Render.

---

## 📋 EXECUTION ORDER (DO NOT REORDER)

### ════════════════════════════════════════════════
### DAY 1 — BACKEND FIX & SEED (make backend 100% real)
### ════════════════════════════════════════════════

**Goal:** Every API endpoint returns real data. Server boots, connects to PostgreSQL, all 60+ routes work. Seed data exists so frontend has something to show.

---

#### STEP 1.1 — Create missing `coverage.engine.js`
**File:** `backend/domains/financial-state/coverage/coverage.engine.js` (NEW)

This file is imported by `safe-to-spend/safe_to_spend.engine.js:5` but doesn't exist. Without it, `/financial-state/home` AND `/ai/chat` crash at import time.

Create the file with:
```javascript
// Coverage Engine — calculates data coverage ratio (synced / total accounts).
export class CoverageEngine {
    static calculateCoverage(totalAccounts, syncedAccounts) {
        const total = Number(totalAccounts) || 0;
        const synced = Number(syncedAccounts) || 0;
        if (total === 0) return 'no_coverage';
        if (synced === 0) return 'no_coverage';
        if (synced >= total) return 'full';
        return 'partial';
    }
    static calculateCoverageRatio(totalAccounts, syncedAccounts) {
        const total = Number(totalAccounts) || 0;
        const synced = Number(syncedAccounts) || 0;
        if (total === 0) return 0;
        return synced / total;
    }
}
export const COVERAGE_VERSION = 'v1.0.0';
```

**Verify:** `node -e "import('./backend/domains/financial-state/coverage/coverage.engine.js').then(m => console.log(m.CoverageEngine.calculateCoverage(4, 3)))"` → should print `partial`.

---

#### STEP 1.2 — Fix `forecast/features.js` column references
**File:** `backend/domains/forecast/features.js`

The `extractPointInTimeFeatures` function queries non-existent columns. Fix these (read the file, find each query, replace):

| Wrong (in code) | Correct (per migration 010 + 009 + 003) |
|---|---|
| `financial_snapshots.current_balance_paise` | `financial_snapshots.result_paise` (migration 008 creates `result_paise`) |
| `financial_snapshots.as_of` | `financial_snapshots.computed_at` (migration 008) |
| `commitments.expected_amount_paise` | `commitments.amount_paise` (migration 009 — verify exact column name by reading migration) |
| `transactions.transaction_date` | `transactions.observed_at` (migration 003) |
| `transactions.is_transfer` | remove this filter OR use `transaction_type IN ('transfer_out','transfer_in')` OR `transfer_role IS NOT NULL` |

**How:** Read `backend/db/migrations/010_forecast_schema.sql`, `008_financial_state_schema.sql`, `009_planning_schema.sql`, `003_core_ledger_schema.sql` to confirm exact column names. Then edit `features.js` to match. Run the forecast engine test: `node backend/tests/phase8/engine.test.js`.

---

#### STEP 1.3 — Fix `/auth/onboarding-complete` column names
**File:** `backend/api/routes.js` (find the inline `/auth/onboarding-complete` handler)

Current code: `UPDATE users SET onboarding_completed = true, onboarding_completed_at = NOW()`
Schema (migration 001): `users` has `onboarding_done BOOLEAN` + `onboarding_step VARCHAR`. Fix to:
```sql
UPDATE users SET onboarding_done = true, onboarding_step = 'completed', updated_at = NOW() WHERE user_id = $1
```

---

#### STEP 1.4 — Fix `/auth/security` (2FA toggle)
**File:** `backend/api/routes.js` (find inline PUT `/auth/security`)

Current: `UPDATE users SET two_factor_enabled = $1` — column doesn't exist.
**Option A (preferred):** Remove the 2FA toggle route entirely — 2FA is managed by Clerk, not the DB. Return `{ status: 'managed_by_clerk' }` and point frontend to Clerk's profile.
**Option B:** Add migration `014_users_two_factor.sql` adding `two_factor_enabled BOOLEAN DEFAULT false` to `users`. Then keep the route.

Choose A (cleaner). Update the frontend `/you/security` page to open Clerk's user profile modal instead of a local toggle.

---

#### STEP 1.5 — Fix `/financial/liabilities` table name
**File:** `backend/api/routes.js` (find inline GET `/financial/liabilities`)

Current: `FROM accounts` — table is `financial_accounts`. Fix:
```sql
SELECT account_id, institution_name, account_type,
       (balances->>'available_balance_paise')::bigint as balance_paise
FROM financial_accounts
WHERE user_id = $1 AND account_type = 'credit_card' AND is_active = true
```
Also compute `min_due_paise`, `due_date`, `utilization_pct` from real statement data if available, else return null (frontend handles null).

---

#### STEP 1.6 — Fix `insights.controller.js` (3 broken methods)

**File:** `backend/api/controllers/insights.controller.js`

**6a. `getCalendarEvents`:**
- `commitments.description` → `commitments.name` (read migration 009 for exact column)
- `commitments.status='pending'` → `status IN ('expected','due','overdue')` (check migration 009 enum)
- `recurring_series.category` → remove (categories are via `category_id` JOIN) OR join `categories` table

**6b. `getNetWorthHistory`:**
- `financial_snapshots.snapshot_type` → `calculation_type` (migration 008)
- `financial_snapshots.snapshot_value_paise` → `result_paise` (migration 008)
- Fix the malformed `account_type` join — `account_type` is on `financial_accounts`, not `transactions`. Rewrite the fallback query to aggregate net worth from `financial_snapshots WHERE calculation_type = 'net_worth'`.

**6c. `getSavingsChallenges` auto-seed:**
- The INSERT omits NOT NULL `start_date` (migration 013). Add `start_date: CURRENT_DATE` to the INSERT.

---

#### STEP 1.7 — Create missing AI tables (migration 014)
**File:** `backend/db/migrations/014_ai_insights_tables.sql` (NEW)

3 tables are referenced in code but never migrated. Create them:

```sql
-- AI Insights (generated insights surfaced to user)
CREATE TABLE IF NOT EXISTS ai_insights (
    insight_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    interaction_id      UUID REFERENCES ai_interactions(interaction_id) ON DELETE SET NULL,
    title               TEXT NOT NULL,
    summary             TEXT NOT NULL,
    evidence            JSONB NOT NULL DEFAULT '{}'::jsonb,
    tags                TEXT[] NOT NULL DEFAULT '{}',
    confidence          INTEGER NOT NULL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 100),
    status              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','dismissed','expired')),
    generated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ
);
CREATE INDEX idx_ai_insights_user ON ai_insights(user_id, generated_at DESC);

-- AI Insight Feedback (thumbs up/down + comments)
CREATE TABLE IF NOT EXISTS ai_insight_feedback (
    feedback_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_id          UUID NOT NULL REFERENCES ai_insights(insight_id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating              INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment             TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ai_insight_feedback_insight ON ai_insight_feedback(insight_id);

-- AI Saved Simulations (what-if scenarios user saved)
CREATE TABLE IF NOT EXISTS ai_saved_simulations (
    simulation_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    interaction_id      UUID REFERENCES ai_interactions(interaction_id) ON DELETE SET NULL,
    simulation_type     TEXT NOT NULL CHECK (simulation_type IN ('affordability','money-leaks','explain-month','goal-accelerator','what-if')),
    input_snapshot      JSONB NOT NULL,
    output_snapshot     JSONB NOT NULL,
    label               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ai_saved_simulations_user ON ai_saved_simulations(user_id, created_at DESC);
```

Run: `node backend/db/migrations/run.js` (or `npm run migrate`).

---

#### STEP 1.8 — Fix AA routes (auth + mock adapter)
**File:** `backend/api/routes/aa.routes.js`

Add `requireAuth` middleware to ALL 4 AA routes. Currently they use `req.user ? req.user.id : 'anonymous'` — security hole.

**File:** `backend/domains/ingestion/aa.service.js`

The service calls ConsentRepo methods that don't exist:
- `consentService.trackPendingConsent` → add to ConsentRepo (INSERT into consent_records with status 'pending')
- `consentService.getConsentByHandle` → add (SELECT by consent_handle)
- `consentService.activateConsent` → add (UPDATE status='active')
- `consentService.revokeConsentById` → already exists as `revokeConsent`

Also `dbRepository.getJobByFileRef` → add to IngestionRepo (SELECT by file_ref).
Also `updateImportJobStatus(_, 'pending_data')` → 'pending_data' not in enum. Use 'processing' instead.

**File:** `backend/adapters/account-aggregator/account-aggregator.adapter.js`

If no real Setu credentials, the adapter stays mock BUT must clearly log `[AA MOCK]` warnings. For V1 launch, DISABLE the AA routes entirely (comment them out in `server.js` line 157 `setupAARoutes`) — users will import via CSV/Excel only. Add a `feature_flag` check.

---

#### STEP 1.9 — Fix ingestion replay ownership check
**File:** `backend/api/controllers/ingestion.controller.js` — `replayJob` method

Add ownership check: `WHERE job_id = $1 AND user_id = $2` (currently any user can replay any job).

---

#### STEP 1.10 — Auto-create `ai_user_budgets` row
**File:** `backend/domains/ai/gateway.js`

In `handleQuery`, before the cost governor UPDATE, check if `ai_user_budgets` row exists for the user. If not, INSERT one with default `budget_limit_paise = 500000` (₹5,000 equivalent in paise tokens). Else every first AI request returns `TOKEN_BUDGET_EXCEEDED`.

---

#### STEP 1.11 — Fix R2 adapter boot crash
**File:** `backend/server.js` line 142

Currently `new R2StorageAdapter(process.env)` throws if R2 env vars missing → server crashes at boot. Wrap in try/catch:
```javascript
let storageAdapter = null;
try {
    storageAdapter = new R2StorageAdapter(process.env);
} catch (e) {
    console.warn('[BOOT] R2 storage disabled — file uploads will not work:', e.message);
}
```
Pass `storageAdapter` (may be null) to IngestionService. IngestionController should return 503 if storage is null.

---

#### STEP 1.12 — Create seed script
**File:** `backend/db/seed.js` (NEW)

Create a seed script that inserts realistic Indian-context data for a test user. This is what the frontend will display. Use the data from `frontend/src/lib/data.ts` as the source of truth (it's already realistic mock data — now make it real DB rows).

Seed:
- 1 user (Arjun Sharma, arjun.sharma@fincopilot.in) — use a real Clerk user ID if available, else a placeholder UUID
- 4 financial_accounts (HDFC savings ₹18,450, ICICI current ₹6,520, Axis CC -₹450, Zerodha investment ₹12,400)
- 12 transactions (BigBasket, Uber, Salary, Swiggy, Netflix, Amazon, Rent, Zomato pending, SIP, Jio, BookMyShow, Cult.fit) — all with real merchant names, categories, amounts in paise
- 3 goals (Emergency Fund ₹1,50,000 target, Goa Vacation ₹40,000, New Laptop ₹12,000)
- 6 recurring_series (Netflix ₹649, Cult.fit ₹1,199, Salary ₹85,000, Rent ₹4,500, SIP ₹1,000, Jio ₹399)
- 6 budgets (Groceries, Dining, Transport, Shopping, Entertainment, Subscriptions)
- 6 notifications (3 unread)
- gamification_state (47 day streak, level 4, 2450 XP)
- Categories (seed the `categories` table with: Rent, Groceries, Dining, Transport, Shopping, Subscriptions, Entertainment, Utilities, Investments, Salary, Health, Education, Travel, Insurance, Credit Card, Refunds)

Run: `node backend/db/seed.js`

**Verify:** `psql $DATABASE_URL -c "SELECT COUNT(*) FROM transactions"` → 12. `SELECT COUNT(*) FROM accounts` → 4.

---

#### STEP 1.13 — Run migrations + seed
```bash
cd backend
npm install
npm run migrate          # applies all 15 + new 014 migration
node db/seed.js          # seeds test data
npm run dev              # start server on :3001
```

**Verify Day 1 complete:**
```bash
curl http://localhost:3001/api/health                           # → {"status":"ok"}
curl http://localhost:3001/api/v1/financial-state/home -H "Authorization: Bearer <clerk-token>"  # → real Safe-to-Spend
curl http://localhost:3001/api/v1/transactions -H "Authorization: Bearer <clerk-token>"         # → 12 real transactions
curl http://localhost:3001/api/v1/forecast/outlook?horizon=30 -H "Authorization: Bearer <clerk-token>"  # → real forecast
curl http://localhost:3001/api/v1/ai/home-feed -H "Authorization: Bearer <clerk-token>"        # → real insights
```

ALL must return 200 with real data. If any 500, fix before Day 2.

---

### ════════════════════════════════════════════════
### DAY 2 — FRONTEND WIRING (make frontend real)
### ════════════════════════════════════════════════

**Goal:** User can sign up, complete onboarding, see REAL dashboard with real Safe-to-Spend, navigate all pages with real data.

---

#### STEP 2.1 — Restore Clerk auth
**File:** `frontend/src/components/providers.tsx`

Restore from `providers.tsx.bak` (the backup has full Clerk wiring). It should have:
- `ClerkProvider` with `CLERK_PUBLISHABLE_KEY`
- `ClerkTokenSync` component (syncs token to `window.__clerk_session_token` every 30s)
- `AuthGate` (redirects to `/sign-in` if not signed in, except public routes)
- `ThemeProvider` (next-themes, dark default)
- `AppShell` wrapping children
- `Toaster`

**File:** `frontend/src/middleware.ts`

Restore from `middleware.ts.bak`. Clerk middleware protecting all routes except `/sign-in`, `/sign-up`, `/` (landing — but actually make `/` protected too since dashboard is at `/`).

Wait — the landing is at `fincopilot-landing/` (separate app). The frontend `frontend/` IS the dashboard. So `/` in frontend should be PROTECTED (it's the home dashboard).

**File:** `frontend/.env.local` (NEW)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
CLERK_SECRET_KEY=sk_test_your_key
```

---

#### STEP 2.2 — Wire API proxy (so frontend calls backend)
**File:** `frontend/next.config.ts`

Add `rewrites()` to proxy `/api/v1/*` to backend (avoids CORS in dev):
```typescript
const nextConfig: NextConfig = {
    output: "standalone",
    async rewrites() {
        return [
            { source: '/api/v1/:path*', destination: 'http://localhost:3001/api/v1/:path*' },
        ];
    },
};
```

**File:** `frontend/src/lib/api.ts` line 8

Set `API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1"`. With the rewrite, `/api/v1/*` proxies to backend. In production, set `NEXT_PUBLIC_API_URL` to the real backend URL.

---

#### STEP 2.3 — Fix Home page (`/`)
**File:** `frontend/src/app/page.tsx`

Already uses `useMultipleApi` with 7 endpoints. Now that backend works, verify:
- `home.safe_to_spend_paise` renders real amount
- `transactions.transactions` — check shape: backend returns `{ transactions: [...], pagination: {...} }` (read `transactions.controller.js` to confirm). If backend returns flat array, wrap it.
- `aiFeed.insights` — backend `/ai/home-feed` now returns real insights from `ai_insights` table
- `spendingStory` — real spending aggregation
- `gamification` — real streak/level from DB
- `me` — real user from `/auth/me`
- `calendar.events` — backend returns `{ events: [...] }` or flat array? Match the shape.

**Fix shape mismatches:** The home page reads `data.transactions?.transactions` (wrapped) and `data.calendar?.events` (wrapped). Verify backend returns these wrapper shapes. If not, adjust either the backend response OR the frontend access pattern. Document the final shape in `frontend/src/lib/api.ts` as TypeScript interfaces.

---

#### STEP 2.4 — Fix Onboarding (`/onboarding`)
**File:** `frontend/src/app/onboarding/page.tsx`

**Step 2 (Privacy):** On "I Agree", call `api.completeOnboarding({ consented: true })` → POST `/auth/onboarding-complete` (now fixed in backend). Persist consent to `consent_records`.

**Step 3 (Goal):** On "Continue", call `api.createGoal({ name, goal_type, target_amount_paise, target_date, monthly_contribution_paise })`. Use the selected goal type + target + timeline to build the payload.

**Step 4 (Connect):** On "Connect", call `api.initiateUpload({ fileName, mimeType })` → get presigned URL → user uploads file → `api.confirmUpload({ jobId })` → backend parses. For V1, if no real file, at least call `api.completeOnboarding({ import_method: 'manual' })` to mark onboarding done.

After success, redirect to `/` (home).

---

#### STEP 2.5 — Migrate pages from `data.ts` → `api.ts` (PRIORITY ORDER)

For EACH page below, replace `import { X } from "@/lib/data"` with `import { api } from "@/lib/api"` + `useApi(() => api.X())`. Add loading skeletons + error states + retry. Use the `AsyncBoundary` component from `@/components/shared/async-boundary`.

**Order (by user impact):**

1. **`/money`** — replace `accounts`, `financialStateMoney`, `netWorthHistory` with `api.getAccounts()`, `api.getMoneyState()`, `api.getNetWorthHistory()`. Wire "Tap to reveal" to real balance breakdown.

2. **`/transactions`** — replace `recentTransactions` with `api.getTransactions({ limit: 50 })`. Wire search input to `api.search(q)` (debounced 300ms). Keep client-side filter as fallback.

3. **`/transactions/[id]`** — replace `recentTransactions.find` with `api.getTransactionDetail(id)`. Remove the `[0]` fallback — show 404 / EmptyState if not found.

4. **`/accounts`** — replace `accounts` with `api.getAccounts()`.

5. **`/accounts/[id]`** — replace `accounts.find` with `api.getAccountDetail(id)`. Show recent transactions for this account (new API call or filter).

6. **`/goals`** — replace `goals` with `api.getGoals()`. **Wire "New Goal" button** — open a `<Dialog>` with a form (name, type, target, date, monthly). On submit, `api.createGoal()` then refetch.

7. **`/goals/[id]`** — replace with `api.getGoalDetail(id)`. Add "Add Contribution" button → `api.addContribution()` with idempotency key. Add "Edit" + "Delete" (with confirm).

8. **`/plan`** — replace 8 data.ts imports with parallel API calls: `api.getGoals()`, `api.getBudgets()`, `api.getFinancialHealth()`, `api.getRecurring()`, `api.getUpcoming()`, `api.getCashflow('12mo')`, `api.getForecast(30)`, `api.getGamification()`. Wire debt slider to `api.runScenario({ strategy, monthly_payment })`.

9. **`/recurring`** — replace with `api.getRecurring()`. **Wire "Detect New" button** → `api.detectRecurring()` then refetch.

10. **`/forecast`** — replace with `api.getForecast(horizon)`. Wire horizon toggle to refetch with new horizon.

11. **`/cashflow`** — replace with `api.getCashflow(period)`. Wire period toggle to refetch.

12. **`/financial-health`** — replace with `api.getFinancialHealth()` + `api.getPeerComparison()`.

13. **`/ai`** — replace with `api.getAIHomeFeed()`. Wire suggested questions to navigate to `/ai/chat?q=...`.

14. **`/ai/chat`** — **REAL AI CHAT.** Replace the `setTimeout` fake reply with:
    ```typescript
    const reply = await api.sendAIChat(input);
    setMessages(m => [...m, { role: 'user', content: input }, { role: 'assistant', content: reply.answer, insight: reply.evidence }]);
    ```
    Show typing indicator while waiting. Display evidence cards if `reply.evidence` exists. Handle errors gracefully ("AI temporarily unavailable").

15. **`/ai/afford`** — **Wire "Analyze" button.** Add input state. On click, `api.runAISimulate({ kind: 'affordability', item, amount })`. Show real affordability result (yes/no + reasoning + remaining balance).

16. **`/ai/leaks`** — **Wire "Analyze" button.** `api.runAISimulate({ kind: 'money-leaks' })`. Show list of unused subscriptions + cancel actions.

17. **`/search`** — replace client filter with `api.search(q)` (debounced). Show real results from backend.

18. **`/you`** — replace `currentUser`, `securityData`, `gamification`, `privacyData`, `accounts` with `api.getMe()`, `api.getSecuritySessions()`, `api.getGamification()`, `api.getPrivacyInventory()`, `api.getAccounts()`. **Wire Sign Out** → `clerk.signOut()` (real, not toast).

19. **`/you/connections`** — replace with `api.getConnections()`. **Wire "Sync Now"** → real API call (or at least refetch). **Wire "Disconnect"** → `api.disconnectConnection(id)` then refetch. **Wire "Add New"** → open Setu AA flow (or CSV upload for V1).

20. **`/you/privacy`** — replace with `api.getPrivacyInventory()`. **Wire consent toggles** → `api.updatePrivacyConsent({ marketing, analytics, ai_sharing })`. **Wire retention dropdown** → `api.updatePreferences({ data_retention_days })`. **Wire "Delete forever"** → `api.requestDeletion()` then show real pending state.

21. **`/you/security`** — replace with `api.getSecuritySessions()`. **Wire 2FA toggle** → open Clerk profile (2FA managed by Clerk). **Wire "Revoke"** → `api.revokeSession(id)` then refetch. **Wire "Change Password"** → open Clerk profile.

22. **`/you/export`** — **Wire "Export Now"** → `api.requestExport(format)` → poll `api.getExportStatus(jobId)` → when COMPLETED, download from real URL. **Wire "Delete Account"** → `api.requestDeletion()` → real deletion flow.

23. **`/income`** — replace with `api.getIncome()`.

24. **`/liabilities`** — replace with `api.getLiabilities()`.

25. **`/spending-story`** — replace with `api.getSpendingStory()`.

26. **`/data-coverage`** — replace with `api.getDataQuality()` + `api.getAccounts()`.

27. **`/ai/insight/[id]`** — replace with `api.getAIInsight(id)`. Remove `[0]` fallback.

---

#### STEP 2.6 — Fix AppShell dynamic data
**File:** `frontend/src/components/shell/app-shell.tsx`

Replace `import { unreadNotificationsCount, notifications, gamification } from "@/lib/data"` with real API calls:
- Notifications: `useApi(() => api.getNotifications({ unread_only: true }))` — show real unread count + list. Click a notification → `api.markNotificationRead(id)` then refetch.
- Gamification (streak): `useApi(() => api.getGamification())` — show real streak. Call `api.tickStreak()` on first mount of the day (track last tick date in localStorage).
- Sign Out: wire to real `clerk.signOut()`.

---

#### STEP 2.7 — Fix detail page fallbacks
**Files:** `goals/[id]/page.tsx`, `transactions/[id]/page.tsx`, `accounts/[id]/page.tsx`, `ai/insight/[id]/page.tsx`

ALL currently fall back to `[0]` for unknown IDs. Remove this. If `api.getX(id)` returns null/404, show `<EmptyState title="Not found" />`.

---

#### STEP 2.8 — Verify Day 2 complete
- Sign up as a new user via Clerk → land on onboarding → complete 4 steps → land on home with REAL data
- Home shows real Safe-to-Spend (not ₹0)
- Navigate to /money, /transactions, /goals, /plan — all show real DB data
- Click "New Goal" → create goal → it appears in list
- Click "Detect New" on /recurring → real detection runs
- Search "Netflix" → real results from DB
- Open /ai/chat → ask "How much did I spend on dining?" → real AI response with evidence
- Sign Out → redirected to /sign-in

**ALL must work with real data. No mock fallbacks.**

---

### ════════════════════════════════════════════════
### DAY 3 — AI, DEPLOY, QA (production-ready)
### ════════════════════════════════════════════════

---

#### STEP 3.1 — Real AI Chat with evidence
**File:** `backend/domains/ai/gateway.js` + `adapters/ai/omnirouter.adapter.js`

If `OMNIROUTER_API_KEY` is set, real LLM calls happen. If not, FALL BACK to `z-ai-web-dev-sdk` (already in `package.json`):

**File:** `backend/adapters/ai/zai.adapter.js` (NEW)
Create an adapter implementing `AIInterface` that uses `z-ai-web-dev-sdk`:
```javascript
import ZAI from 'z-ai-web-dev-sdk';
export class ZAIAdapter {
    async generateStructured(systemPrompt, userPrompt, context, jsonSchema, options = {}) {
        const zai = await ZAI.create();
        const messages = [
            { role: 'system', content: systemPrompt },
            ...context,
            { role: 'user', content: userPrompt },
        ];
        const response = await zai.chat.completions.create({ messages, response_format: { type: 'json_object' } });
        // parse + return { result, usage, modelId, providerId }
    }
}
```

Register in `provider.registry.js` as fallback when OmniRouter unavailable.

**Verify:** `/ai/chat` returns real LLM-generated answers with evidence (cited transaction amounts). Test with: "How much did I spend on dining this month?" → should return real ₹8,450 with evidence linking to actual transactions.

---

#### STEP 3.2 — Real export/deletion
**File:** `backend/api/controllers/trust.controller.js`

Implement real export: query all user data (transactions, accounts, goals, etc.) → format as CSV/JSON → upload to R2 → return presigned download URL. For PDF, use a PDF library (or skip PDF for V1, return 501).

Implement real deletion: soft-delete user (set `is_active=false` + `deleted_at=NOW()`) → queue hard-delete job (30-day grace) → return confirmation.

---

#### STEP 3.3 — Fix reconciliation worker tenant
**File:** `backend/worker.js`

The reconciliation cron uses `'system_tenant'` which matches no real user. Fix: iterate all real user_ids:
```javascript
setInterval(async () => {
    const { rows } = await dbClient.query('SELECT user_id FROM users WHERE is_active = true');
    for (const row of rows) {
        await ReconciliationWorker.startRun(row.user_id);
    }
}, 60000);
```

---

#### STEP 3.4 — Production env + security hardening
**File:** `.env.example` — update with all required vars.
**File:** `backend/config/env.js` — fail-closed in production for: `CLERK_SECRET_KEY`, `DATABASE_URL`, `CORS_ORIGIN` (don't default to `*`).
**File:** `backend/server.js` — set `CORS_ORIGIN` from env. Remove `INTERNAL_WEBHOOK_TOKEN` default (require env var).
**File:** `frontend/next.config.ts` — remove `typescript.ignoreBuildErrors: true` (fix any TS errors that surface). Set `reactStrictMode: true`.

---

#### STEP 3.5 — Deploy
**Backend (Railway/Render):**
1. Push code to GitHub (already there)
2. Connect Railway to repo, set root to `backend/`
3. Set env vars: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CORS_ORIGIN=https://your-frontend.vercel.app`, `R2_*`, `OMNIROUTER_API_KEY`
4. Run migrations: `npm run migrate` (Railway has a pre-deploy hook)
5. Run seed: `node db/seed.js` (one-time)
6. Backend live at `https://fincopilot-api.railway.app`

**Frontend (Vercel):**
1. Connect Vercel to repo, set root to `frontend/`
2. Set env: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_API_URL=https://fincopilot-api.railway.app/api/v1`, `CLERK_SECRET_KEY`
3. Deploy → live at `https://fincopilot.vercel.app`

**Landing (Vercel):**
1. Connect Vercel to repo, set root to `fincopilot-landing/`
2. Deploy → live at `https://landing-fincopilot.vercel.app` (or use as marketing page)

---

#### STEP 3.6 — End-to-end QA (AS A USER)
Sign up as a NEW user. Trace the FULL journey:
1. Land on marketing page → click "Start free" → sign up via Clerk
2. Complete onboarding (consent + goal + connect CSV)
3. Land on home → see REAL Safe-to-Spend from MY data
4. Navigate Money, Plan, AI, You — all show MY data
5. Create a goal → it persists (refresh page → still there)
6. Ask AI "Can I afford a ₹40,000 vacation?" → real answer with evidence
7. Search "Netflix" → real result
8. Export data as CSV → real download
9. Toggle privacy consent → persists on refresh
10. Sign out → sign back in → data intact

**If ANY step fails, fix before declaring done.**

---

## 🚫 ABSOLUTE RULES (NEVER BREAK)

1. **NO MOCK DATA in production.** Every number, every list, every chart must come from the real DB via real API calls. The only acceptable hardcoded values are: category icons (emoji map), merchant brand colors, design tokens.

2. **NO FAKE SPINNERS.** If an action takes time, show a real loading state tied to a real API call. Never `setTimeout` to fake work.

3. **NO DEAD BUTTONS.** Every button must have an `onClick` that does something real (API call, navigation, or modal open). If a feature isn't implemented, remove the button — don't leave it as decoration.

4. **NO `data.ts` imports in pages** (after Day 2). `data.ts` can remain as TypeScript types reference, but NO page should import data from it. All data via `api.ts`.

5. **NO `[0]` fallbacks** for detail pages. If ID not found, show EmptyState.

6. **MONEY IS ALWAYS PAISE.** Never use floats. Display via `formatPaise()`.

7. **EVERY MUTATION needs idempotency** (Idempotency-Key header for POST) + audit log entry.

8. **AUTH ON EVERY ROUTE** except: `/api/health`, `/api/v1/auth/config`, `/api/v1/auth/verify`, sign-in/up pages. AA routes MUST have `requireAuth`.

9. **NEVER commit `.env`.** Only `.env.example` with placeholder values.

10. **TEST before declaring done.** Run `npm test` in backend. Manually trace the user journey. If something breaks, fix it — don't skip.

---

## ✅ DEFINITION OF DONE

A real user can:
1. Sign up with email/Google
2. Complete onboarding (consent + goal + CSV import)
3. See their REAL Safe-to-Spend, transactions, accounts, goals
4. Create/edit/delete goals (persists)
5. Chat with AI about their money (real LLM responses with evidence)
6. Run affordability check + money leak detection
7. Search across all their data
8. View forecasts, cashflow, financial health
9. Manage privacy consents, export data, delete account
10. Sign out / sign back in — data intact

**All 30 pages work with real data. Zero hardcoded mocks. Zero dead buttons. Zero 500 errors.**

---

## 📁 KEY FILES REFERENCE

**Backend:**
- `backend/server.js` — entry, middleware, route mounting
- `backend/api/routes.js` — 60+ routes
- `backend/api/controllers/*.js` — 17 controllers
- `backend/domains/financial-state/safe-to-spend/safe_to_spend.engine.js` — Safe-to-Spend engine (BROKEN import)
- `backend/domains/forecast/features.js` — forecast features (BROKEN columns)
- `backend/domains/ai/gateway.js` — AI gateway (10-step pipeline)
- `backend/db/migrations/*.sql` — 15 migrations + new 014
- `backend/db/seed.js` — seed script (NEW)
- `backend/config/env.js` — env config
- `backend/adapters/auth/clerk.adapter.js` — Clerk auth

**Frontend:**
- `frontend/src/app/layout.tsx` — root layout (wrap in Providers)
- `frontend/src/components/providers.tsx` — Clerk + Theme + AppShell (RESTORE from .bak)
- `frontend/src/middleware.ts` — Clerk route protection (RESTORE from .bak)
- `frontend/src/lib/api.ts` — 50 API methods (base URL config)
- `frontend/src/lib/data.ts` — mock data (REMOVE imports from pages, keep types)
- `frontend/src/lib/use-api.ts` — `useApi` + `useMultipleApi` hooks
- `frontend/src/components/shared/async-boundary.tsx` — loading/error states
- `frontend/src/components/shell/app-shell.tsx` — nav + notifications + streak
- `frontend/next.config.ts` — add rewrites() for API proxy

**Infra:**
- `.env.example` — all env vars documented
- PostgreSQL (Neon) — DATABASE_URL
- Clerk — auth keys
- R2 — file storage
- OmniRouter OR z-ai-web-dev-sdk — AI

---

**EXECUTE. NO EXCUSES. NO SHORTCUTS. REAL APP IN 3 DAYS. 🚀**
