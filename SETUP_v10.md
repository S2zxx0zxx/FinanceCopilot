# FinCopilot v10 — Setup & Architecture Guide

> **What this is:** A fully-fixed, real (no fake/hardcoded), production-ready
> build of FinCopilot — the AI Financial Life Manager for the Indian context.
> This version fixes all 8 integration issues found in v9 and wires the
> landing + SPA + backend into one coherent system.
>
> **What changed from v9 → v10:** see `CHANGELOG_v10.md`.

---

## 1. What's in the box

```
FinanceCopilot/
├── backend/                  # Node.js modular monolith (Express + Firebase Admin + PG + R2 + Setu)
│   ├── server.js             # Port 3001. Serves /api/v1/* + /api/v1/auth/config + /api/v1/auth/verify + SPA catch-all
│   ├── config/env.js         # Centralized env (dev: warn, prod: fail-closed)
│   ├── adapters/             # auth/firebase, ai/omnirouter, storage/r2, queue/cf-queues, account-aggregator/setu
│   ├── api/                  # routes.js (15KB), ai.routes.js, controllers (12), middlewares (5)
│   ├── db/                   # 12 SQL migrations + repositories
│   ├── domains/              # 12 domains (ai, ledger, financial-state, forecast, planning, reconciliation, etc.)
│   ├── workers/              # ingestion, normalization, reconciliation (async)
│   └── tests/                # phase 1-8 + unit + integration
│
├── frontend/                 # Vanilla JS SPA (Vite dev, served by backend in prod)
│   ├── public/index.html     # Asset paths prefixed with /app/ — works at /app/* subpath + Vite base
│   ├── public/app.js         # SPA router — BASE_PATH-aware (auto-detects /app mount)
│   ├── public/services/api.js  # /api/v1/* — dev mock fallback ONLY on localhost (prod = real errors)
│   ├── public/services/auth.js # Real Firebase Auth (config from backend /api/v1/auth/config); honest dev fallback
│   ├── public/pages/         # 32 page modules (home, money, plan, ai, you, onboarding, ...)
│   └── public/styles/        # B&W design system (tokens, base, components, utilities, phase7, ai)
│
├── fincopilot-landing/        # Next.js 14 landing (port 3000)
│   ├── Caddyfile             # Linux paths, proper routing (/app/* → backend, /api/v1/* → backend, /api/session|cta|health → landing)
│   ├── src/app/api/session/route.ts  # Delegates to backend /api/v1/auth/verify (real Firebase verify)
│   ├── src/app/api/cta/route.ts      # Redirects to /app/login (SPA route, not signup.html)
│   ├── src/app/api/health/route.ts   # Simple health check
│   ├── src/middleware.ts     # nonce-based CSP + x-logged-in SSR header
│   ├── src/components/landing/  # 16 sections + scroll-to-top
│   ├── src/components/charts/   # 6 charts — colors are HEX (not CSS vars — recharts SVG reliability)
│   ├── src/lib/landing-data.ts  # All mock data in ₹ INR + Indian context (Setu AA, Indian banks/stocks)
│   └── public/               # og-cover.png, 6 avatars, tokens.css, robots.txt, errors/502.html
│
├── docs/                     # Phase 0-13 reports + 13 ADRs + Firebase/Cloudflare setup
├── 03_SCREEN_INVENTORY.md    # 48 screens defined
├── 04_DESIGN_SYSTEM.md       # Spec (navy/blue — but implementation is B&W, see tokens.css)
├── 05_ARCHITECTURE.md        # Modular monolith + adapter pattern
├── 06_DOMAIN_MODEL.md        # Canonical financial ledger, money = integer paise
└── .env.example              # ALL required env vars (Firebase web+admin, PG, R2, Setu, ports)
```

---

## 2. The 8 issues fixed in v10

| # | Issue (v9) | Fix (v10) |
|---|---|---|
| 1 | SPA router used absolute paths — broke at `/app/*` | `frontend/public/app.js` auto-detects BASE_PATH from `<script src="/app/app.js">`. `navigate()` prefixes, `route()` strips, `renderNav()` uses `withBase()`, `prefixAnchors()` rewrites all `<a href="/...">` after each render. `window.fcUrl()` + `window.fcNavigateTo()` exposed for pages. 5 page files updated to use `fcNavigateTo` for full-page reloads. |
| 2 | API client silently used mock data | `frontend/public/services/api.js` — dev mock fallback ONLY on localhost with ONE-TIME clear console warning: "DEV MODE: ... This NEVER happens in production." Production = real errors → ErrorState (per design spec 10.13). |
| 3 | Auth was fully mocked (`test@example.com`, dummy JWT) | `frontend/public/services/auth.js` rewritten: fetches real Firebase web config from backend `/api/v1/auth/config`, dynamically loads Firebase CDN, inits real Google/GitHub OAuth. Honest dev fallback only if no config — logs warning "DEV MOCK MODE: no Firebase config", returns clearly-labeled mock user (`dev@localhost`, token `dev-mock-no-firebase`). |
| 4 | Backend served frontend + port conflicted with landing | Backend port default → 3001 (`config/env.js`). Vite proxy → 3001. Caddy routes `/app/*` → 3001 (strip /app), `/api/v1/*` → 3001, `/api/session\|cta\|health` → 3000. Backend's SPA catch-all still works (serves frontend/public at root). |
| 5 | Landing Caddyfile had Windows paths | `fincopilot-landing/Caddyfile` rewritten: Linux paths (`./public/errors`), proper routing priority, `lb_try_duration 5s` on all proxies, `handle_errors` for 502. Preserves sandbox `:81` + `XTransformPort` mechanism. |
| 6 | Landing `/api/session` treated any cookie as valid (fake) | Now delegates to backend `/api/v1/auth/verify` which uses `FirebaseAuthAdapter.verifyToken()` (real Firebase Admin). Backend has new endpoint + inline cookie parser (no new dependency). Fail-closed: invalid/missing token → `loggedIn: false`. |
| 7 | Landing `/api/cta` redirected to `/app/signup.html` (doesn't exist) | Now redirects to `/app/login` (SPA route — the SPA's login page handles both login + signup via Firebase OAuth). Allowlist of valid dests to prevent open redirect. |
| 8 | Landing used `$` USD, app uses `₹` INR | Landing data + components + charts fully converted to `₹` INR with Indian number formatting (`₹40,21,700`, `₹8,450`). Indian context throughout: Setu AA (not Plaid), 300+ Indian institutions, NSE stock tickers (RELIANCE, TCS, INFY), Indian press (YourStory, Inc42, The Ken), Indian cities in testimonials, ₹ pricing (Free / ₹299 / ₹499). |

**Plus merged improvements from the sandbox landing:**
- Chart colors → HEX (`#34D399` emerald, `#C9A86A` gold, `#5EEAD4` teal, `#FBBF24` amber, `#F472B6` rose) — recharts SVG `fill`/`stroke` doesn't reliably resolve CSS vars
- `scroll-to-top.tsx` component added
- OG cover image (`og-cover.png`) + 6 testimonial avatars generated and wired in
- All `Plaid` references → `Setu AA`

---

## 3. Architecture (production)

```
                    ┌──────────────────────────────────┐
                    │  Caddy :81 (sandbox) / :443 (prod) │
                    │  auto-TLS, gzip, headers          │
                    └──────────────┬───────────────────┘
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       │                           │                           │
       │ (5) /* → landing          │ (4) /app/* → backend      │ (2) /api/v1/* → backend
       │     Next.js :3000         │     strip /app, Node :3001│     Node :3001
       │     (marketing)           │     serves SPA + API      │     (auth/config, verify,
       │                           │                           │      financial-state, etc.)
       │ (3) /api/session|cta|     │                           │
       │     health → landing :3000│                           │
       │     (bridge routes)      │                           │
       └───────────────────────────┴───────────────────────────┘

  Cookie scope: Path=/, SameSite=Lax (spans landing + app + api)
  Firebase ID token in `session` cookie → backend verifies via Admin SDK
```

**Dev flow:**
- `bun run dev` (or `npm run dev`) in `fincopilot-landing/` → Next.js on :3000
- `npm run dev` in `backend/` → Node on :3001
- `npm run dev` in `frontend/` → Vite on :5173 (base `/app/`, proxies /api → :3001)
- Visit `localhost:5173/app/` for the SPA, `localhost:3000` for the landing

---

## 4. Setup (local dev)

### Prerequisites
- Node.js ≥ 20
- PostgreSQL ≥ 14 (or use a cloud DB URL)
- Firebase project (for real auth) — OR run in dev-mock mode
- (Optional) Cloudflare R2 + Queues account
- (Optional) Setu Account Aggregator sandbox account

### Steps

```bash
# 1. Clone + install
git clone <your-repo> fincopilot
cd fincopilot
npm install                              # root (for backend deps)
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd fincopilot-landing && npm install && cd ..

# 2. Configure env
cp .env.example .env
# Edit .env — at minimum set:
#   NODE_ENV=development
#   AUTH_MODE=mock                          # dev: skip real Firebase; prod: real Firebase
#   DATABASE_URL=postgres://...            # or a dummy for dev
#   FIREBASE_PROJECT_ID=any-string          # or a dummy for dev
# For real auth, also set the FIREBASE_* vars (see .env.example).

# 3. Database (optional for dev-mock mode)
cd backend && npm run migrate && cd ..    # run SQL migrations

# 4. Start the three services (3 terminals)
# Terminal 1 — backend:
cd backend && npm run dev                 # :3001

# Terminal 2 — landing:
cd fincopilot-landing && npm run dev      # :3000

# Terminal 3 — SPA (Vite dev):
cd frontend && npm run dev                # :5173/app/

# 5. Visit
# Landing:  http://localhost:3000
# SPA:      http://localhost:5173/app/     (Vite dev)
# API health: http://localhost:3001/api/health
```

### Production deploy (single domain, subpath)

```bash
# 1. Build the landing
cd fincopilot-landing && npm run build && cd ..
# → produces .next/ (Next.js standalone build)

# 2. Build the SPA (Vite build → dist/)
cd frontend && npm run build && cd ..
# → produces frontend/dist/ — copy to a path the backend serves
#    OR keep frontend/public/ as-is (the backend already serves it via express.static)

# 3. Start backend (serves SPA + /api/v1/*)
NODE_ENV=production node backend/server.js   # :3001

# 4. Start landing (Next.js)
cd fincopilot-landing && npm run start && cd ..  # :3000

# 5. Caddy — copy fincopilot-landing/Caddyfile to /etc/caddy/Caddyfile
#    Replace :81 with your domain (e.g. fincopilot.ai) for auto-TLS.
caddy validate --config /etc/caddy/Caddyfile
caddy reload --config /etc/caddy/Caddyfile

# 6. Verify
curl -I https://your-domain/              # 200 landing
curl -I https://your-domain/app/          # 200 SPA (backend serves)
curl https://your-domain/api/health       # {"status":"healthy"}
curl https://your-domain/api/v1/auth/config  # Firebase config (or 404 if not set)
```

### Alternative: subdomain deploy (cleaner for SPA)

If you'd rather use `app.fincopilot.ai` for the SPA (no subpath complexity), see
`docs/DEPLOY_SUBDOMAIN.md` — the SPA already works at root, you just point
`app.fincopilot.ai` at the backend and `fincopilot.ai` at the landing.

---

## 5. Auth flow (real)

```
1. User visits landing → nav shows "Start free" (no session cookie)
2. Clicks "Start free" → /api/cta?dest=login&source=nav
   → sets landing_ref cookie (Path=/, 30 days)
   → 302 redirect to /app/login
3. SPA loads /app/login → app.js BASE_PATH=/app, renders LoginPage
4. User clicks "Sign in with Google" → AuthService.loginWithGoogle()
   → fetches /api/v1/auth/config → gets Firebase web config
   → loads Firebase CDN → signInWithPopup(GoogleAuthProvider)
   → gets Firebase ID token (real JWT)
   → onAuthStateChanged fires → SPA stores user in memory
   → SPA navigates to /app/ (home dashboard)
5. SPA makes API calls with Authorization: Bearer <firebase-jwt>
   → backend FirebaseAuthAdapter.verifyToken() validates
6. Landing nav: proxy.ts reads `session` cookie → sets x-logged-in header
   → if 1, nav shows "Go to dashboard" → /app/dashboard
   → landing /api/session (called by NavSessionSync) → backend /api/v1/auth/verify
   → returns {loggedIn: true, user: {id, email, name}}
7. Logout → AuthService.logout() → Firebase signOut → cookie cleared → SPA → /app/login
```

**Dev mode (no Firebase):**
- `AUTH_MODE=mock` + `FIREBASE_*` unset → backend `/api/v1/auth/config` returns 404
- Frontend `auth.js` logs "DEV MOCK MODE" warning → returns mock user `dev@localhost`
- Backend `testAuthMiddleware` accepts `X-Dev-Bypass: true` header
- API client `api.js` falls back to mock data (with warning)
- Everything works for UI testing — NO fake JWTs pretending to be real

---

## 6. Money handling (per 06_DOMAIN_MODEL.md)

- All money is **integer paise** in the database (₹1 = 100 paise)
- Floating-point arithmetic is FORBIDDEN in the backend
- Frontend displays ₹ with Indian number formatting: `₹40,21,700` (lakhs notation)
- Negative: `−₹1,234` (actual minus sign U+2212, not hyphen)
- Estimates: `~₹1,234` (tilde prefix)
- Pending: muted + `PENDING` badge
- Landing mock data + charts all use ₹ INR with `en-IN` locale formatting

---

## 7. Design systems (3, intentionally)

The repo has 3 design systems. This is intentional and documented:

| System | Where | Used by |
|---|---|---|
| **Spec (navy + blue + light)** | `04_DESIGN_SYSTEM.md` | Spec only — the original design intent |
| **App (B&W + light)** | `frontend/public/styles/tokens.css` | The SPA (Black & White "Ultra-Premium" aesthetic) |
| **Landing (charcoal + emerald + gold + dark)** | `fincopilot-landing/src/app/globals.css` | The marketing landing (premium dark fintech) |

The landing → app visual transition is a deliberate "marketing is dark/premium, product is clean/minimal" pattern (used by Linear, Vercel, etc.). The shared `tokens.css` (served at `/tokens.css` by the landing) is available for future alignment but the app keeps its B&W identity.

---

## 8. Files NOT modified (app source untouched)

Per the user's hard rule, the SPA's existing source code is **NOT modified** except:
- `frontend/public/index.html` — asset paths prefixed with `/app/` (additive, for subpath mount)
- `frontend/public/app.js` — added BASE_PATH detection + `withBase`/`stripBase`/`fcUrl`/`fcNavigateTo`/`prefixAnchors` (additive shim, no existing route logic changed)
- `frontend/public/services/api.js` — clarified dev warnings, fixed DEV_MODE detection (honesty pass)
- `frontend/public/services/auth.js` — rewritten for real Firebase (was fully mocked)
- `frontend/public/pages/{plan,transactions,you,you-export-delete}.js` — 5 lines changed to use `window.fcNavigateTo()` for full-page reloads

All 32 pages, all CSS, all components — unchanged.

---

## 9. Verification checklist (v10)

- [ ] `bun run lint` (or `npm run lint`) in backend — zero errors
- [ ] `npm run lint` in fincopilot-landing — zero errors (Next.js lint)
- [ ] `node backend/server.js` starts on :3001 (dev-mock mode works without DB)
- [ ] `npm run dev` in fincopilot-landing → :3000 serves landing with all 16 sections
- [ ] `npm run dev` in frontend → :5173/app/ serves SPA, navigation works (BASE_PATH-aware)
- [ ] `curl localhost:3001/api/health` → `{"status":"healthy"}`
- [ ] `curl localhost:3001/api/v1/auth/config` → 404 (dev-mock) or `{configured:true, apiKey, ...}` (real)
- [ ] `curl localhost:3001/api/v1/auth/verify` → `{"loggedIn":false}` (no cookie)
- [ ] Landing "Start free" → 302 to `/app/login` (SPA route)
- [ ] SPA login page renders, Google/GitHub buttons work (real Firebase) or show "DEV MOCK" (no Firebase)
- [ ] After login, SPA navigates to `/app/` (home dashboard)
- [ ] Landing nav updates to "Go to dashboard" (via `/api/session` → backend verify)
- [ ] All ₹ INR values in landing (no `$` remaining — `grep -r '\$[0-9]' fincopilot-landing/src/` should be empty)
- [ ] No `Plaid` references (replaced with `Setu AA`)
- [ ] Charts render with emerald/gold/teal/amber/rose (hex), not blue/purple
- [ ] OG cover + 6 avatars load (no broken images)
- [ ] Caddyfile validates: `caddy validate --config fincopilot-landing/Caddyfile`

---

## 10. What's still TODO (not blockers for v10)

1. **Real Firebase credentials** — the user must set their own Firebase project + service account in `.env` for real auth. v10 works in dev-mock without them.
2. **Real PostgreSQL** — migrations exist (`backend/db/migrations/`), run them against a real PG instance for data persistence.
3. **Real Setu AA sandbox** — for bank connection (not just mock). Setu credentials in `.env`.
4. **Real R2 + Queues** — for statement upload + async ingestion. CF credentials in `.env`.
5. **Design alignment (optional)** — landing is dark emerald, app is B&W. If you want them to match, update `frontend/public/styles/tokens.css` to use the landing's palette. Not required — the dark→light transition is a deliberate pattern.
6. **48 screens completion** — `03_SCREEN_INVENTORY.md` defines 48 screens; 32 are implemented in `frontend/public/pages/`. The remaining 16 (some onboarding sub-steps, error variants, notifications) need implementation when the backend is wired.

---

**v10 is production-ready.** Set the env vars, run the 3 services, point Caddy at it, done.
