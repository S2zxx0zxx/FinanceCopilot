# Changelog v10

> All 8 integration issues fixed. Landing + SPA + backend wired into one coherent system. Real auth, real verification, honest dev fallbacks, ₹ INR throughout.

## Fixed

### Integration
1. **SPA subpath mounting** — `frontend/public/app.js` now auto-detects BASE_PATH from `<script src="/app/app.js">` and prefixes all navigation. New helpers: `withBase()`, `stripBase()`, `window.fcUrl()`, `window.fcNavigateTo()`, `App.prefixAnchors()` (rewrites all `<a href="/...">` after each render). 5 page files updated to use `fcNavigateTo` for full-page reloads.
2. **API client honesty** — `frontend/public/services/api.js` dev-mock fallback now logs a ONE-TIME clear warning ("DEV MODE: ... This NEVER happens in production."). Production = real errors → ErrorState.
3. **Real Firebase auth** — `frontend/public/services/auth.js` rewritten: fetches Firebase web config from backend `/api/v1/auth/config`, dynamically loads Firebase CDN, inits real Google/GitHub OAuth. Honest dev fallback only if no config (clearly labeled `dev@localhost` + `dev-mock-no-firebase` token — never a fake JWT).
4. **Backend port** — default 3001 (was 3000, conflicting with landing). `backend/config/env.js` + Vite proxy + Caddyfile all updated.
5. **Caddyfile (Linux)** — `fincopilot-landing/Caddyfile` rewritten with Linux paths, proper routing priority (`/app/api/*` → backend, `/api/v1/*` → backend, `/api/session|cta|health` → landing, `/app/*` → backend strip, `/*` → landing), `lb_try_duration 5s`, `handle_errors` 502. Preserves sandbox `:81` + `XTransformPort`.
6. **Real session verification** — landing `/api/session` now delegates to backend `/api/v1/auth/verify` (new endpoint) which uses `FirebaseAuthAdapter.verifyToken()` (real Firebase Admin). Backend has inline cookie parser (no new dep). Fail-closed.
7. **CTA redirect** — landing `/api/cta` now redirects to `/app/login` (SPA route — the SPA's login page handles both login + signup via Firebase OAuth). Was redirecting to `/app/signup.html` (doesn't exist).
8. **₹ INR currency** — landing data + components + charts fully converted to ₹ INR with Indian number formatting (`en-IN` locale, lakhs notation). Indian context: Setu AA (not Plaid), 300+ Indian institutions, NSE stock tickers, Indian press (YourStory, Inc42, The Ken), Indian cities in testimonials, ₹ pricing (Free / ₹299 / ₹499).

### Backend
- `backend/server.js` — added `/api/v1/auth/config` (public Firebase web config), `/api/v1/auth/verify` (real Firebase token verification), inline cookie parser middleware.
- `backend/config/env.js` — added `firebase.web` (public config), `auth.mode`, `queue`, `setu`, `cors` sections. Dev mode warns instead of crashing on missing vars (fail-closed still in production).

### Frontend
- `frontend/public/index.html` — asset paths prefixed with `/app/`. Documented mount-awareness strategy.
- `frontend/vite.config.js` — `base: '/app/'` so dev serves at localhost:5173/app/ matching production subpath. Proxy target → 3001.
- `frontend/public/services/auth.js` — rewritten for real Firebase (see #3).

### Landing (merged improvements from sandbox)
- Chart colors → HEX (`#34D399`, `#C9A86A`, `#5EEAD4`, `#FBBF24`, `#F472B6`) — recharts SVG `fill`/`stroke` doesn't reliably resolve CSS vars.
- `scroll-to-top.tsx` component added to page.tsx.
- `public/og-cover.png` (1200×630 social share) generated and wired into metadata.
- `public/founder-avatar-1..6.jpg` (6 testimonial avatars) generated and wired into Testimonials component (replacing CSS-fallback initials).
- All `Plaid` references → `Setu AA` (how-it-works, integrations, security, footer).

## Removed
- Fake `test@example.com` mock user (was silent, pretending to be real)
- Dummy JWT `dummy-jwt-token` (was silent, pretending to be real)
- Windows paths from `fincopilot-landing/Caddyfile` (`C:/Fincopilot/...`)
- Silent dev-mock fallback in production (now real errors surface)
- All `$` USD values from landing (now `₹` INR)

## Added
- `.env.example` — comprehensive: Firebase web+admin, PG, R2, CF Queues, Setu, ports, CORS, analytics
- `SETUP_v10.md` — full setup + architecture + verification guide
- `CHANGELOG_v10.md` — this file
- `FinCopilot_MASTER_PROMPT_v10.md` — updated master prompt for the AI agent

## Verification (v10 passes)
- All 8 issues addressed with documented fixes
- No `$` USD remaining in landing (`grep -r '\$[0-9]' fincopilot-landing/src/` empty)
- No `Plaid` remaining in landing
- Chart colors all hex (no CSS vars in recharts SVG fill/stroke)
- Auth is real-by-default, mock-only-when-no-config (honest)
- Dev mode: backend starts without DB, SPA + landing work with mock data + clear warnings
- Production mode: fail-closed on missing env, real Firebase verify, real errors surface
