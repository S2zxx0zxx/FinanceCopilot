# Frontend Folder — Deep Scan Report

> **Scanned:** 2026-09-01 · Source: `https://github.com/S2zxx0zxx/FinanceCopilot` (main branch) → `frontend/` folder only
> **Scope:** every file, every line. 51 files total, 1.1MB.
> **Purpose:** full understanding before any code changes.

---

## 1. WHAT THIS FOLDER IS

**FinCopilot Frontend** — a vanilla JS Single Page Application (no framework in V1 per spec). Built with Vite. Mobile-first. Ultra-Premium **Black & White** design system.

**Stack:**
- **Build tool:** Vite 5.2.0 (dev only — production serves static files via backend's `express.static`)
- **Language:** Vanilla ES Modules (no React, no Vue, no framework)
- **Auth:** **Clerk** (`@clerk/clerk-js` ^6.30.3) — was Firebase in v10 spec, now switched to Clerk
- **Icons:** `lucide` ^0.372.0 (but most icons are inline SVG strings in `app.js`)
- **Currency:** ₹ INR with integer paise + Indian number formatting (`en-IN` locale)
- **Fonts:** Inter (Google Fonts)
- **No backend deps** — this is a pure frontend served as static files in production

**Total:** 51 files, 1.1MB

---

## 2. FILE STRUCTURE

```
frontend/
├── .env.local                          (VITE_CLERK_PUBLISHABLE_KEY)
├── package.json                        (vite + clerk + lucide)
├── package-lock.json
├── vite.config.js                      (base: '/app/', root: 'public', proxy /api → :3001)
└── public/
    ├── index.html                      (the SPA shell — Inter font, 6 CSS files, <div id="app-root">, <script src="/app.js">)
    ├── app.js                          (28KB — SPA router, 32 routes, Clerk auth, FAB, shell, icons, BASE_PATH detection)
    ├── components/
    │   ├── ui.js                       (Button, Card, MetricCard, Badge, FreshnessBadge, EmptyState, ErrorState, Skeleton, SectionHeader, etc.)
    │   └── ai/
    │       ├── AIComposer.js           (chat input — auto-growing textarea, suggestion chips, send button)
    │       ├── AIInteractionState.js   (state machine: IDLE → SUBMITTING → GATEWAY_PROCESSING → COMPLETE|ERROR)
    │       └── AIMessage.js            (message bubble with markdown-lite, evidence, actions, confidence)
    ├── pages/                          (32 page modules)
    │   ├── home.js (260 lines)
    │   ├── money.js (104)
    │   ├── accounts.js (63)
    │   ├── account-detail.js (72)
    │   ├── transactions.js (~115)
    │   ├── transaction-detail.js (~110)
    │   ├── spending-story.js (158)
    │   ├── income.js (130)
    │   ├── category-detail.js (61)
    │   ├── search.js (130)
    │   ├── login.js (60)
    │   ├── plan.js (237)
    │   ├── recurring.js (243)
    │   ├── upcoming.js (~130)
    │   ├── cashflow.js (135)
    │   ├── goals.js (230)
    │   ├── goal-detail.js (~140)
    │   ├── financial-health.js (159)
    │   ├── forecast.js (307)
    │   ├── ai-home.js (312)
    │   ├── ai-chat.js (315)
    │   ├── ai-insight.js (277)
    │   ├── ai-simulators.js (488 — has 5 simulators: afford, leaks, explain-month, goal-accelerator, what-if)
    │   ├── you.js (222)
    │   ├── you-connections.js (251)
    │   ├── you-privacy.js (219)
    │   ├── you-security.js (331)
    │   ├── you-export-delete.js (446 — has YouExportPage + YouDeletePage)
    │   ├── you-settings.js (371 — has YouPreferencesPage + YouNotificationsPage)
    │   ├── onboarding.js (371 — 4-step: welcome, trust, goal, data)
    │   ├── data-coverage.js (159)
    │   ├── liabilities.js (108)
    │   └── error-states.js (192 — LoadingState, EmptyState, ErrorState, ConnectionErrorPage, IncompleteDataPage)
    ├── services/
    │   ├── api.js                      (ApiClient with dev-mock fallback + safeFetch wrapper)
    │   └── auth.js                     (Clerk auth — real if VITE_CLERK_PUBLISHABLE_KEY set, else dev mock)
    └── styles/                         (7,868 lines total CSS)
        ├── tokens.css                  (247 lines — B&W design tokens: colors, type, spacing, radius, shadows, transitions, z-index)
        ├── base.css                     (590 lines — resets, base elements)
        ├── components.css               (3,743 lines — ALL UI components: cards, buttons, nav, sheets, transaction rows, etc.)
        ├── utilities.css                (1,059 lines — utility classes)
        ├── phase7.css                   (1,080 lines — planning phase styles)
        └── ai.css                       (1,149 lines — AI chat/insight styles)
```

---

## 3. THE 32 ROUTES (from app.js)

```
/                        → HomePage
/money                   → MoneyPage
/accounts                → AccountsPage
/accounts/:id            → AccountDetailPage (param)
/transactions            → TransactionsPage
/transactions/:id        → TransactionDetailPage (param)
/spending-story          → SpendingStoryPage
/income                  → IncomePage
/categories/:id          → CategoryDetailPage (param)
/search                  → SearchPage
/login                   → LoginPage (no shell)
/plan                    → PlanPage
/recurring               → RecurringPage
/upcoming                → UpcomingPage
/cashflow                → CashflowPage
/goals                   → GoalsPage
/goal-detail/:id         → GoalDetailPage (param)
/financial-health        → FinancialHealthPage
/forecast                → ForecastPage
/ai                      → AIHomePage
/ai/chat                 → AIChatPage
/ai/afford               → AIAffordPage
/ai/leaks                → AIMoneyLeaksPage
/ai/explain-month        → AIExplainMonthPage
/ai/goal-accelerator     → AIGoalAcceleratorPage
/ai/what-if              → AIWhatIfPage
/ai/insight/:id          → AIInsightPage (param)
/you                     → YouPage
/you/connections         → YouConnectionsPage
/you/privacy             → YouPrivacyPage
/you/security            → YouSecurityPage
/you/export              → YouExportPage
/you/delete              → YouDeletePage
/you/preferences         → YouPreferencesPage
/you/notifications       → YouNotificationsPage
/onboarding              → OnboardingPage
/data-coverage           → DataCoveragePage
/liabilities             → LiabilitiesPage
/error/connection        → ConnectionErrorPage
/error/incomplete        → IncompleteDataPage
```

**Bottom nav (5 tabs):** Home `/`, Money `/money`, Plan `/plan`, AI `/ai`, You `/you`

**Pages with AfterRender hooks** (run after DOM render — for event listeners, async data loads): recurring, upcoming, cashflow, goals, financial-health, all ai/*, all you/*, onboarding, data-coverage, liabilities, error-states, goal-detail, ai-insight.

---

## 4. AUTH — Clerk (was Firebase in v10)

### `services/auth.js`

```js
import { Clerk } from '@clerk/clerk-js';

// DEV_MOCK_USER when no VITE_CLERK_PUBLISHABLE_KEY:
const DEV_MOCK_USER = {
    uid: "dev-mock-user",
    email: "dev@localhost",
    displayName: "Dev (No Clerk)",
    photoURL: null,
    getIdToken: async () => "dev-mock-no-clerk",
};
```

**API:**
- `loginWithGoogle()` → Clerk `redirectToSignIn({ strategy: 'oauth_google' })`
- `loginWithGithub()` → Clerk `redirectToSignIn({ strategy: 'oauth_github' })`
- `logout()` → Clerk `signOut()`
- `getToken()` → Clerk `session.getToken()` (returns real JWT)
- `onAuthStateChanged(callback)` → Clerk `addListener` (fires on user change)
- `getCurrentUser()` → returns user object or null

**Flow:**
1. `_ensureInit()` reads `VITE_CLERK_PUBLISHABLE_KEY` from `import.meta.env` or `window.VITE_CLERK_PUBLISHABLE_KEY`
2. If key present → `new Clerk(key)`, `await clerk.load()` → `_initState = "real"`
3. If key missing → logs warning "DEV MOCK MODE: Clerk Publishable Key missing", `_initState = "mock"`
4. All methods check `_initState` — real calls go to Clerk, mock returns `DEV_MOCK_USER`

**`.env.local` has:** `VITE_CLERK_PUBLISHABLE_KEY=pk_test_aGVhbHRoeS1hYXJkdmFyay02Nzg3LmNsZXJrLmFjY291bnRzLmRldiQ`

This is a **Clerk test/dev key** (pk_test_ prefix). Real production needs a `pk_live_` key.

---

## 5. API — `services/api.js`

### Endpoints used (from grep across all pages):

| Endpoint | Method | Used by |
|---|---|---|
| `/financial-state/home` | GET | home.js |
| `/financial-state/money` | GET | money.js |
| `/financial-state/income` | GET | income.js |
| `/financial-state/spending-story` | GET | spending-story.js |
| `/financial-state/categories/:id` | GET | category-detail.js |
| `/accounts` | GET | money.js, accounts.js |
| `/accounts/:id` | GET | account-detail.js |
| `/transactions` | GET | transactions.js |
| `/goals` | GET, POST | goals.js |
| `/recurring` | GET | recurring.js |
| `/recurring/detect` | POST | recurring.js |
| `/recurring/summary` | GET | recurring.js |
| `/plan` | GET | plan.js |
| `/financial-health` | GET | financial-health.js, plan.js |
| `/financial/cashflow?period=` | GET | cashflow.js |
| `/financial/liabilities` | GET | liabilities.js |
| `/ai/home-feed` | GET | ai-home.js |
| `/ai/chat` | POST | ai-chat.js |
| `/ai/chat/confirm` | POST | ai-chat.js |
| `/ai/insights/:id` | GET | ai-insight.js |
| `/ai/simulate` | POST | ai-simulators.js |
| `/ai/simulate/save` | POST | ai-simulators.js |
| `/search?q=` | GET | search.js |
| `/auth/account` | GET | you.js |
| `/auth/onboarding-complete` | POST | onboarding.js |
| `/auth/security` | GET | you-security.js |
| `/auth/security/sessions/revoke` | POST | you-security.js |
| `/trust/consent` | POST | onboarding.js |
| `/trust/privacy` | GET | you-privacy.js |
| `/trust/preferences/update` | POST | you-settings.js |
| `/trust/notifications/update` | POST | you-settings.js |
| `/trust/export` | POST | you-export-delete.js |
| `/trust/delete-data` | POST | you-export-delete.js |
| `/data-quality` | GET | data-coverage.js |
| `/feedback` | POST | (various) |

All prefixed with `/api/v1` (the `ApiClient.request` does `fetch('/api/v1${endpoint}')`).

### Dev mock fallback:
- `DEV_MODE = hostname is localhost/127.0.0.1/0.0.0.0/empty`
- On 401 or network error in dev mode → falls back to `getMockData(endpoint)` with ONE-TIME warning
- In production → real errors surface → ErrorState component
- `safeFetch(endpoint, {timeout, fallback})` → returns `{data, error}` (graceful)

### Mock data covers:
`/financial-state/home`, `/financial-state/money`, `/accounts`, `/transactions`, `/goals`, `/ai/insight`, `/ai/home-feed`, `/users/me/profile`, `/users/me/privacy`

Note: mock data has **HDFC Bank** and **ICICI Bank** (Indian) — consistent with ₹ INR context.

---

## 6. DESIGN SYSTEM — Ultra-Premium Black & White

### `styles/tokens.css` (247 lines) — the design tokens

**COLOR PALETTE — Black & White Only:**
- bg: `#FAFAFA`, surface: `#FFFFFF`, surface-elevated: `#FFFFFF`
- text-primary: `#0A0A0A`, text-secondary: `#525252`, text-tertiary: `#8C8C8C`
- border: `#E5E5E5`, border-subtle: `#F0F0F0`, border-strong: `#CCCCCC`
- **primary: `#0A0A0A` (BLACK)** — no brand color
- Semantic (minimal use): positive `#17A34A` (green), negative `#DC2626` (red), warning `#CA8A04` (orange)
- Grayscale ladder 50→950 (`#FAFAFA` → `#0A0A0A`)

**TYPOGRAPHY:**
- font-family: `'Inter', -apple-system, ...`
- font-mono: `'SF Mono', 'Fira Code', ...`
- Sizes: 10px → 56px (text-2xs → text-hero)
- Weights: 300 → 800

**SPACING (4px base):** 0 → 128px (space-0 → space-32)

**BORDER RADIUS:** 8px → 9999px (radius-sm → radius-full)

**SHADOWS:** ultra subtle, layered (xs → 2xl)

**TRANSITIONS:** 150ms → 600ms, ease-default/spring/bounce/elastic

**Z-INDEX:** base 0, above 1, dropdown 100, ...

### Other CSS files:
- `base.css` (590 lines) — resets, base elements
- `components.css` (3,743 lines) — ALL UI components
- `utilities.css` (1,059 lines) — utility classes
- `phase7.css` (1,080 lines) — planning phase (cashflow, goals, recurring, etc.)
- `ai.css` (1,149 lines) — AI chat/insight styles

**Total CSS:** 7,868 lines.

---

## 7. THE SPA SHELL (from app.js ensureShell)

```
<div id="app-shell" class="app-shell">
    <aside id="sidebar" class="sidebar">           ← desktop sidebar (hidden on mobile)
        <div class="sidebar-header">logo + brand</div>
        <nav class="sidebar-nav" id="sidebar-nav">  ← nav items injected
        <div class="sidebar-footer">user info</div>
    </aside>
    <main id="page-content" class="page-content">   ← page HTML injected here
    <nav id="bottom-nav" class="bottom-nav">        ← mobile bottom nav
    <div id="fab" class="fab">                       ← floating action button (Ask AI, Transactions, Goals)
```

**Shell features:**
- Sidebar (desktop) + bottom nav (mobile) — both render same `NAV_ITEMS`
- FAB (floating action button) with menu — Ask AI, Transactions, Goals
- FAB hidden on full-screen pages (`/onboarding`, `/ai/chat`, `/ai/afford`, `/ai/leaks`, `/ai/what-if`, `/ai/explain-month`, `/ai/goal-accelerator`, `/login`)
- Offline banner appears when `navigator.onLine === false`
- Page transitions: opacity 0→1, translateY 8px→0, 300ms

---

## 8. SPA ROUTER — Base Path Aware (v10 fix is in)

```js
// Auto-detects BASE_PATH from <script src="/app/app.js">
const BASE_PATH = (() => { ... })();
function stripBase(pathname) { ... }   // '/app/money' → '/money'
function withBase(cleanPath) { ... }  // '/money' → '/app/money'
window.fcUrl = function (cleanPath) { ... }
window.fcNavigateTo = function (cleanPath) { window.location.href = window.fcUrl(cleanPath); }

// navigate() prefixes, route() strips, prefixAnchors() rewrites all <a href="/..."> after render
```

This means the SPA works at:
- Root: `localhost:5173/money` (Vite dev without base — but vite.config has `base: '/app/'`)
- Subpath: `example.com/app/money` (production via Caddy)

**Note:** `index.html` has paths like `/styles/tokens.css` (NOT `/app/styles/tokens.css`). But Vite's `base: '/app/'` handles this in dev (serves at `/app/styles/tokens.css`). In production, the backend serves at root and Caddy strips `/app` — so the paths work. **This is a potential issue if the production setup doesn't strip correctly.**

---

## 9. PAGE PATTERNS (how each page works)

Every page exports an async function that returns an HTML string:

```js
export async function SomePage(arg) {
    try {
        const data = await ApiClient.get('/some-endpoint');
        const formatCurrency = (paise) => (paise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
        return `
            <main class="page animate-fade-in">
                <header class="mb-8">
                    <h1 class="text-h1">Title</h1>
                </header>
                <div class="card">...</div>
            </main>
        `;
    } catch (err) {
        return ErrorState({ title: 'Failed to load', description: err.message, onRetry: 'window.appInstance.route()' });
    }
}
```

**Pages with AfterRender hooks** do async data loading after initial render (skeleton shown first, then real data). Example: `liabilities.js`, `you.js`, `you-connections.js`, etc.

**Currency formatting:** every page has its own `formatCurrency(paise)` helper — converts paise to ₹ INR with `en-IN` locale. Some use `style: 'currency'`, some use `'₹' + rupees`.

---

## 10. WHAT'S WORKING vs WHAT MIGHT BE INCOMPLETE

### ✅ Working (well-implemented):
- 32 routes all defined and imported
- Clerk auth (real + dev mock fallback)
- API client with dev-mock data
- B&W design system (comprehensive — 7,868 lines CSS)
- SPA router with BASE_PATH awareness
- Offline banner
- FAB with quick actions
- Page transitions (fade + slide)
- Skeleton loaders + error states + empty states
- ₹ INR formatting throughout
- Indian context in mock data (HDFC, ICICI banks)

### ⚠️ Potential issues / incomplete:
1. **No backend running** — the SPA calls `/api/v1/*` which the backend (`backend/server.js`) serves. Without the backend, dev-mock kicks in (only on localhost).
2. **Clerk is test key** — `pk_test_...` in `.env.local` is a dev key. Production needs `pk_live_...`.
3. **index.html paths not `/app/`-prefixed** — uses `/styles/tokens.css` not `/app/styles/tokens.css`. Vite `base: '/app/'` handles in dev. Production depends on Caddy strip + backend serve. **This was flagged as Issue #1 in the v10 scan** but the current state has Vite base handling it.
4. **No tests** — no test files in frontend/
5. **No build output committed** — `npm run build` produces `dist/` but it's gitignored
6. **Some pages are heavy** — `ai-simulators.js` (488 lines), `you-export-delete.js` (446 lines), `you-settings.js` (371 lines), `onboarding.js` (371 lines)
7. **Inline SVG icons everywhere** — `app.js` has an `Icons` object with SVG strings, but pages also have inline SVGs scattered (not DRY)
8. **No shared `formatCurrency`** — every page redefines it (could be a util)

---

## 11. SUMMARY — What I Now Understand

✅ **Product:** Indian AI financial life manager SPA, 32 routes, ₹ INR paise, mobile-first B&W
✅ **Stack:** Vanilla JS ES Modules + Vite 5 + Clerk 6 + lucide
✅ **Design:** Ultra-Premium Black & White (Inter font, `#0A0A0A` primary, no brand color)
✅ **Auth:** Clerk (real if key set, dev mock otherwise) — was Firebase in v10 spec, now Clerk
✅ **API:** `/api/v1/*` via backend, dev-mock fallback on localhost
✅ **Routing:** SPA with BASE_PATH detection (works at `/app/*` subpath)
✅ **CSS:** 7,868 lines across 6 files (tokens, base, components, utilities, phase7, ai)
✅ **Pages:** 32 page modules, each returns HTML string, some have AfterRender hooks
✅ **Shell:** sidebar (desktop) + bottom nav (mobile) + FAB + offline banner

**Ready for next instructions — what do you want done with this folder?**
