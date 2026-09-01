# 🎯 FinCopilot — MASTER BUILD PROMPT (v10 · Single Unified Edition)

> **⚠️ V10 UPDATE — READ THIS FIRST.** This is v10 of the master prompt.
> The original v2.0 (below) was written before the existing app was inspected.
> v10 supersedes the following assumptions from v2.0 with the ACTUAL app facts:
>
> | v2.0 assumption | v10 ACTUAL (from inspecting the real repo) |
> |---|---|
> | App is "existing HTML/CSS/JS" | App is a **vanilla JS SPA** with a 32-route client-side router in `frontend/public/app.js`, 32 page modules in `frontend/public/pages/`, served by a Node.js backend (`backend/server.js`) that has `express.static(frontendPath)` + SPA catch-all. Vite is dev-only. |
> | App has `signup.html`, `login.html`, `dashboard.html` static files | App has SPA routes (`/login`, `/money`, `/ai/chat`, etc.) — NO static `.html` files per route. The CTA must redirect to `/app/login` (SPA route), NOT `/app/signup.html`. |
> | Apply 3 additive HTML patches | Already applied in v10: `frontend/public/index.html` has `/app/`-prefixed asset paths, `app.js` has BASE_PATH detection, `auth.js` rewritten for real Firebase. |
> | Landing `tokens.css` shared with app | App has its OWN design system (`frontend/public/styles/tokens.css` — Black & White). Landing's `tokens.css` is a separate file. The 3 design systems are intentionally different (spec: navy/blue, app: B&W, landing: dark emerald). |
> | Currency is `$` USD | App uses `₹` INR with integer paise + Indian number formatting. v10 landing is fully converted to `₹` INR + Indian context (Setu AA, not Plaid). |
> | Auth is "if the app has its own auth" | App's `auth.js` was fully mocked; v10 rewrites it for real Firebase (config fetched from backend `/api/v1/auth/config`). Backend has real `FirebaseAuthAdapter` (just needed env vars). |
> | Caddy serves app from disk | v10 routes `/app/*` → backend (Node :3001) which serves the SPA via its existing `express.static` + catch-all. Caddy strips `/app` before proxying. Backend also serves `/api/v1/*` and `/api/v1/auth/{config,verify}`. |
> | Port conflict (landing + backend both want 3000) | v10 fixes: backend defaults to **3001** (`backend/config/env.js`). Landing stays at 3000. Caddy routes between them. |
>
> **v10 status:** All 8 integration issues are FIXED in this repo. The code is ready to deploy.
> See `SETUP_v10.md` for the full setup guide, `CHANGELOG_v10.md` for what changed.
> The rest of this file (v2.0, below) remains the authoritative spec for the
> LANDING PAGE design system, sections, animations, and quality gates — those
> parts are unchanged and already implemented in `fincopilot-landing/`.
>
> **For your AI agent:** if you're starting from this v10 repo, the build is
> ALREADY DONE. Your job is to (1) read `SETUP_v10.md`, (2) set env vars in
> `.env`, (3) run the 3 services, (4) verify with the checklist in SETUP_v10 §9.
> Do NOT rebuild the landing or rewrite the SPA — they're complete and wired.
>
> ---

# 🎯 FinCopilot — MASTER BUILD PROMPT (Single Unified Edition · v2.0)

> **This is the SINGLE source of truth for your AI agent.** Everything needed to (A) build the premium Next.js 16 landing page AND (B) integrate it with the existing HTML/CSS/JS app — without breaking a single line of the existing app — lives in this one file.
>
> **Read this entire file before touching code.** Then execute PART 11 (Build Order) top to bottom. No skipping. No improvisation on architecture or design system. Every color, every word of copy, every animation timing, every edge case is intentional and researched.
>
> **Result expectation:** A production-grade hybrid deployment where `example.com/` is the Next.js landing page (16 sections, 3D-animated, dark-mode-first, emerald+gold+charcoal palette, NO blue/indigo) and `example.com/app/*` is the existing vanilla HTML/CSS/JS app, served as-is from disk, sharing the same design tokens, same fonts, same auth cookie, same origin — zero CORS, zero broken links, zero visual disconnect. The existing app's source code is modified only by three additive HTML `<head>` patches (no existing line changed). Everything passes `agent-browser` QA and `bun run lint`.

---

## TABLE OF CONTENTS

1. [PART 1 · Mission & Product](#part-1--mission--product)
2. [PART 2 · Hard Rules (NON-NEGOTIABLE)](#part-2--hard-rules-non-negotiable)
3. [PART 3 · Tech Stack](#part-3--tech-stack)
4. [PART 4 · Architecture Decision — Pattern A (locked)](#part-4--architecture-decision--pattern-a-locked)
5. [PART 5 · Design System (locked)](#part-5--design-system-locked)
6. [PART 6 · Project Layout (folders, ports, processes)](#part-6--project-layout-folders-ports-processes)
7. [PART 7 · File & Component Architecture](#part-7--file--component-architecture)
8. [PART 8 · Section-by-Section Landing Build Spec (16 sections)](#part-8--section-by-section-landing-build-spec-16-sections)
9. [PART 9 · Animation & Interaction System](#part-9--animation--interaction-system)
10. [PART 10 · Mock Data Spec](#part-10--mock-data-spec)
11. [PART 11 · Responsive & Layout Rules](#part-11--responsive--layout-rules)
12. [PART 12 · Accessibility, SEO & Performance](#part-12--accessibility-seo--performance)
13. [PART 13 · Hybrid Integration (tokens, API, Caddy, app patches)](#part-13--hybrid-integration-tokens-api-caddy-app-patches)
14. [PART 14 · Every Edge Case & Mitigation](#part-14--every-edge-case--mitigation)
15. [PART 15 · Build Order (execute top to bottom)](#part-15--build-order-execute-top-to-bottom)
16. [PART 16 · Quality Gates (must pass before "done")](#part-16--quality-gates-must-pass-before-done)
17. [PART 17 · Worklog & Handover Protocol](#part-17--worklog--handover-protocol)
18. [APPENDIX A · Full Caddyfile (drop-in)](#appendix-a--full-caddyfile-drop-in)
19. [APPENDIX B · Full proxy.ts (Next.js middleware)](#appendix-b--full-proxyts-nextjs-middleware)
20. [APPENDIX C · API route specs](#appendix-c--api-route-specs)
21. [APPENDIX D · tokens.css extraction + app HTML patch script](#appendix-d--tokenscss-extraction--app-html-patch-script)
22. [APPENDIX E · Dev Caddyfile + runbook](#appendix-e--dev-caddyfile--runbook)
23. [APPENDIX F · robots.txt + sitemap.ts](#appendix-f--robotstxt--sitemapts)
24. [APPENDIX G · One-line brief](#appendix-g--one-line-brief)
25. [APPENDIX H · Do-not-forget list](#appendix-h--do-not-forget-list)

---

## PART 1 · MISSION & PRODUCT

### 1.1 What is FinCopilot?
**FinCopilot** is an AI-powered personal finance copilot. Think *Copilot.money* meets *an AI financial advisor*. It connects to all of a user's bank accounts, cards, brokerages, crypto wallets, and loans (read-only), auto-categorizes every transaction, builds smart budgets, forecasts cash flow, surfaces unused subscriptions, tracks net worth, and lets the user **chat with their money** in natural language ("How much did I spend on dining out last month?", "Can I afford a $2,000 vacation in August?", "Find me $200 I can save this month.").

### 1.2 The two halves of the product

| Half | Tech | Location | Build status |
|---|---|---|---|
| **Landing page** (marketing, SEO, conversion) | Next.js 16 + Tailwind 4 + shadcn/ui + framer-motion + recharts | `example.com/` (served by Next.js on `:3000`) | **To be built** — full spec in PART 8 |
| **The app** (dashboard, transactions, AI chat, budgeting, settings) | Existing plain HTML + CSS + JS (no build step, no framework) | `example.com/app/*` (served by Caddy's `file_server` from disk) | **Already built** — DO NOT modify source except 3 additive patches in PART 15 Step E |

### 1.3 Brand personality
- **Premium, not flashy.** Luxury fintech. Composed. Confident.
- **Anti-bank-speak.** Conversational, human, a little wit — but never goofy. "No bank-speak. Talk to it like a human."
- **Data as design material.** Charts ARE the interface, not decoration. Bright semantic data colors on a dark canvas.
- **Trust-first.** Every claim is a number. Every CTA is paired with a compliance microcopy.

### 1.4 The single sentence that defines the whole task
> Build a premium Next.js landing page for FinCopilot, then integrate it with the existing HTML/CSS/JS app on the **same domain via subpath** so that both look like one product, share one auth cookie, share one design token set, share one font set, and zero lines of existing app source code are broken.

### 1.5 Conversion goal
Get the visitor to click **"Start free"** (primary CTA, repeated ~5 times). Secondary goal: scroll-depth engagement with the AI chat demo and the bento feature grid.

---

## PART 2 · HARD RULES (NON-NEGOTIABLE)

1. **DO NOT modify the existing app's source code** except the three additive, non-breaking patches in Step E (`<base href>`, `<link rel="stylesheet" href="/app/tokens.css">`, `<meta name="robots" content="noindex">` + `<link rel="canonical">`). These are additive — they do not change any existing line. If a patch would require rewriting existing app code, STOP and report back instead.
2. **DO NOT change the app's tech stack.** No bundler, no build step, no TypeScript, no React added to the app. It stays vanilla HTML/CSS/JS.
3. **NO indigo, NO blue** anywhere on the landing. No `bg-blue-*`, no `bg-indigo-*`, no `#3B82F6`-family accents. Emerald `#34D399` + champagne gold `#C9A86A` + charcoal `#0A0F0D` only. The only acceptable "cool" color is the emerald/mint family and a soft teal used sparingly in charts.
4. **Only ONE user-visible route on the landing**: `/` (defined in `src/app/page.tsx`). Internal anchors (`#features`, `#pricing`, etc.) are fine. Do NOT create `/pricing`, `/about`, etc. as separate pages.
5. **`z-ai-web-dev-sdk` MUST stay server-side.** Never import it in a client component. (Not needed for the landing — all data is mock data; the chat demo is a scripted cycle, not a real LLM call.)
6. **DO NOT use `bun run build`** for development. Use `bun run dev` (port 3000). Build is only for production deploy (PART 15 Step H).
7. **Footer sticky to bottom** — root wrapper `min-h-screen flex flex-col`, footer `mt-auto`. No floating gap, no overlap.
8. **No layout overlap anywhere.** Every floating element within a `relative` parent with explicit `z-index`. Aurora blobs within `overflow-hidden` parents.
9. **Compact sizing.** The user explicitly wants everything "small / small" — tight, dense, premium, no wasted whitespace. body is 15px (not 16). Section padding `py-20 md:py-28` (NOT `py-32`). Card padding `p-4 sm:p-5` (NOT `p-6`/`p-8`). Gaps `gap-3 sm:gap-4`.
10. **No "TODO", no "Lorem ipsum", no placeholder text, no broken images.** Every image is either a generated asset (via the image-generation skill) or an inline SVG/CSS construction.
11. **TypeScript strict, zero `any`, zero `@ts-ignore`.** `bun run lint` must be clean.
12. **SameSite=Lax** for any auth cookie. `Path=/`. `HttpOnly`. `Secure` in prod. Never `SameSite=None` unless explicitly justified (Pattern A doesn't need it).
13. **Never expose JWT/session token to client JS.** Always verify server-side via an endpoint.
14. **Never put a private API key in client JS** (neither landing nor app). Backend proxies hold secrets.
15. **DO NOT remove the `:81` listener or `XTransformPort` block from Caddyfile.** They are the sandbox gateway's core — preserve them, only add new blocks.
16. **No `basePath` or `assetPrefix` on Next.js.** Not needed (landing at `/`) and they break things.
17. **No `output: 'export'` on Next.js.** Keep `output: 'standalone'` (already set) — `export` would break `/api/*` routes.
18. **No emojis in copy** unless explicitly specified (a few semantic emojis in mock transaction data, per the Copilot.money pattern — see PART 10).
19. **Read `/home/z/my-project/worklog.md` before starting** (prior research + decisions). Append your own work record at the end (PART 17).

---

## PART 3 · TECH STACK

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** App Router (already initialized) |
| Language | **TypeScript 5** strict |
| Styling | **Tailwind CSS 4** (already configured, `@import "tailwindcss"` in `globals.css`) |
| UI components | **shadcn/ui** (New York) — all components already exist in `src/components/ui/`. **Use them. Do not rebuild primitives.** |
| Icons | **lucide-react** (already installed) |
| Animation | **framer-motion** v12 (already installed) — use `motion`, `useScroll`, `useTransform`, `useMotionValue`, `useSpring`, `AnimatePresence`, `whileInView` |
| Charts | **recharts** v2 (already installed) |
| Theme | **next-themes** (already installed) — dark/light toggle, dark-first |
| State (client) | **zustand** for the chat demo cycle state; React `useState`/`useEffect` for the rest |
| Fonts | **Geist** + **Geist Mono** (already wired via `next/font/google`). Add **Plus Jakarta Sans** for display headlines (see PART 5.3). |
| Gateway | **Caddy** (existing `:81` listener + `XTransformPort` mechanism — preserve) |
| Existing app | **Plain HTML/CSS/JS** — DO NOT add a build step, bundler, or framework to it |

**Files you MUST NOT modify:**
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `tailwind.config.ts`, `package.json` (do not add deps unless absolutely necessary — everything needed is already installed).
- `prisma/*` (no DB needed for the landing page).

---

## PART 4 · ARCHITECTURE DECISION — PATTERN A (LOCKED)

### 4.1 The decision — Same domain, subpath

```
example.com/            →  Next.js landing  (port 3000)
example.com/app/*       →  static HTML/CSS/JS app  (Caddy file_server, no port needed)
example.com/app/api/*   →  the app's own backend, if any  (port 8080, strip /app prefix)
example.com/api/*       →  Next.js API routes  (session, cta, health — on port 3000)
example.com/_next/*     →  Next.js static assets  (port 3000)
```

### 4.2 Why Pattern A (not subdomain, not different domain)

| Concern | Pattern A (subpath) ✅ | Pattern B (subdomain) | Pattern C (different domain) |
|---|---|---|---|
| Cookies share automatically | ✅ yes (zero config) | ⚠️ needs `Domain=.example.com` | ❌ blocked by browser |
| localStorage shares | ✅ yes | ❌ no (different origin) | ❌ no |
| CORS | ✅ none (same origin) | ⚠️ yes, must configure | ❌ yes, painful |
| TLS cert | ✅ one (Caddy auto) | ⚠️ one per subdomain | ⚠️ one per domain |
| SEO authority | ✅ consolidates | ⚠️ splits | ❌ splits |
| Analytics cross-domain config | ✅ none | ⚠️ linker plugin | ❌ linker + cookieDomain |
| App's absolute paths (`/js/main.js`) | ⚠️ need `<base href="/app/">` (one line) | ✅ work as-is | ✅ work as-is |
| Real-company precedent | Vercel (`vercel.com/dashboard`) | Stripe, Linear, Notion, Mercury | Notion (rare) |

For a **plain HTML/CSS/JS app** that has no CORS plumbing, no OIDC, no subdomain cookie setup — Pattern A is strictly easier. The only cost is one `<base href="/app/">` line in the app's HTML, paid once. Stripe/Linear use subdomain because their apps are big Next.js apps that already paid those costs.

### 4.3 What this means concretely
- The existing `Caddyfile` at `/home/z/my-project/Caddyfile` gets a drop-in update (APPENDIX A) adding `/app/*` and `/app/api/*` blocks. The `:81` listener and the existing `XTransformPort` mechanism stay intact.
- The Next.js landing stays at `/`. **NO `basePath`, NO `assetPrefix`**.
- The existing app's files are **copied** to `./app-public/` (original untouched) and served by Caddy's `file_server` directly from disk. No build, no bundler, no server process for the app.
- Both stacks load the same `tokens.css` (extracted from the landing's `globals.css`) so colors/fonts/radii match exactly.
- Both stacks self-host the same woff2 font files so there's no FOUT when navigating landing → app.

---

## PART 5 · DESIGN SYSTEM (LOCKED)

### 5.1 Color tokens — DARK MODE (primary)
Define these in `globals.css` under `:root` (dark is the default). Final locked values:

```css
:root {
  /* === Canvas & surfaces (charcoal with a faint green undertone — NEVER pure black) === */
  --bg:               #0A0F0D;   /* near-black, green-charcoal tint */
  --bg-aurora-1:      #0E1A14;   /* aurora base glow */
  --surface:          #121815;   /* card */
  --surface-2:        #1A211D;   /* elevated card / hover */
  --surface-3:        #232B27;   /* modal / active */
  --recessed:         #070A09;   /* recessed wells, code blocks */
  --border:           rgba(255,255,255,0.08);
  --border-strong:    rgba(255,255,255,0.14);

  /* === Text (NEVER pure white) === */
  --text:             rgba(255,255,255,0.92);
  --text-secondary:   #9BA8A2;
  --text-muted:       #5E6B66;

  /* === Accent — EMERALD/MINT (money / growth / primary CTA) === */
  --accent:           #34D399;   /* mint emerald — primary interactive */
  --accent-bright:    #6EE7B7;
  --accent-dim:       rgba(52, 211, 153, 0.16);
  --accent-glow:      rgba(52, 211, 153, 0.28);

  /* === Premium — CHAMPAGNE GOLD (wealth / Pro tier / key numbers) === */
  --gold:             #C9A86A;
  --gold-bright:      #EFE2C8;
  --gold-glow:        rgba(201, 168, 106, 0.25);

  /* === Semantic data === */
  --success:          #34D399;
  --warning:          #FBBF24;
  --danger:           #F87171;
  --info:             #5EEAD4;   /* soft teal — the ONE cool non-blue */

  /* === Chart palette (5-series, NO blue) === */
  --chart-1:          #34D399;   /* emerald */
  --chart-2:          #C9A86A;   /* gold */
  --chart-3:          #5EEAD4;   /* teal */
  --chart-4:          #FBBF24;   /* amber */
  --chart-5:          #F472B6;   /* rose — used sparingly for "spending" negative */

  /* === Radii === */
  --radius:           14px;
  --radius-sm:        10px;
  --radius-lg:        20px;
  --radius-xl:         28px;

  /* === Shadows === */
  --shadow-sm:        0 1px 2px rgba(0,0,0,0.4);
  --shadow-card:      0 8px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset;
  --shadow-float:     0 24px 60px -12px rgba(0,0,0,0.55), 0 0 0 1px var(--border);
  --shadow-glow:      0 0 40px var(--accent-glow);

  /* === Easing === */
  --ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1);

  /* === shadcn token mapping (so shadcn components inherit our look) === */
  --background: var(--bg);
  --foreground: var(--text);
  --card: var(--surface);
  --card-foreground: var(--text);
  --popover: var(--surface-2);
  --popover-foreground: var(--text);
  --primary: var(--accent);
  --primary-foreground: #0A0F0D;
  --secondary: var(--surface-2);
  --secondary-foreground: var(--text);
  --muted: var(--surface-2);
  --muted-foreground: var(--text-secondary);
  --accent-foreground: #0A0F0D;
  --destructive: var(--danger);
  --input: var(--surface-3);
  --ring: var(--accent);
  --sidebar: var(--surface);
  --sidebar-foreground: var(--text);
  --sidebar-primary: var(--accent);
  --sidebar-primary-foreground: #0A0F0D;
  --sidebar-accent: var(--surface-2);
  --sidebar-accent-foreground: var(--text);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--accent);
}
```

### 5.2 Color tokens — LIGHT MODE (override via `.light` class on `<html>`)

```css
.light {
  --bg:               #FAFAF7;   /* warm off-white */
  --bg-aurora-1:      #F0F7F3;
  --surface:          #FFFFFF;
  --surface-2:        #F4F7F4;
  --surface-3:        #ECEFEC;
  --recessed:         #F2F5F2;
  --border:           rgba(10,15,13,0.08);
  --border-strong:    rgba(10,15,13,0.16);

  --text:             #0A0F0D;
  --text-secondary:   #4A5550;
  --text-muted:       #7A857F;

  --accent:           #059669;   /* deeper emerald for contrast on white */
  --accent-bright:    #10B981;
  --accent-dim:       rgba(5, 150, 105, 0.12);
  --accent-glow:      rgba(5, 150, 105, 0.18);

  --gold:             #A6823F;
  --gold-bright:      #C9A86A;
  --gold-glow:        rgba(166, 130, 63, 0.18);

  --success:          #059669;
  --warning:          #D97706;
  --danger:           #DC2626;
  --info:             #0D9488;

  --chart-1:          #059669;
  --chart-2:          #A6823F;
  --chart-3:          #0D9488;
  --chart-4:          #D97706;
  --chart-5:          #DB2777;

  --shadow-card:      0 4px 16px rgba(10,15,13,0.06), 0 1px 0 rgba(255,255,255,0.6) inset;
  --shadow-float:     0 20px 48px -12px rgba(10,15,13,0.18), 0 0 0 1px var(--border);

  --primary-foreground: #FFFFFF;
  --accent-foreground: #FFFFFF;
  --sidebar-primary-foreground: #FFFFFF;
}
```

> **Why this palette:** emerald = money/growth (universally positive in finance), gold = wealth/premium (luxury fintech signal), teal = the single cool accent for data variety. Charcoal canvas (not pure black) reduces eye strain and reads "premium". Completely blue/indigo-free, on-brief for a financial copilot, visually distinct from blue-led competitors (Copilot.money, Plaid).

### 5.3 Typography scale (locked)
Add **Plus Jakarta Sans** as the display font alongside Geist. In `layout.tsx`:

```ts
import { Plus_Jakarta_Sans } from "next/font/google";
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});
// add `${jakarta.variable}` to <body> className alongside geist vars
```

| Token | Font | Size | Weight | Tracking | Line-height | Usage |
|---|---|---|---|---|---|---|
| `display` | Plus Jakarta Sans | `clamp(2.75rem, 6vw, 4.5rem)` ~ 44→72px | 700 | -0.03em | 1.02 | Hero H1 |
| `h2` | Plus Jakarta Sans | `clamp(1.875rem, 3.5vw, 3rem)` ~ 30→48px | 600 | -0.02em | 1.1 | Section titles |
| `h3` | Plus Jakarta Sans | 1.5rem (24px) | 600 | -0.01em | 1.2 | Card titles |
| `h4` | Geist | 1.125rem (18px) | 600 | 0 | 1.3 | Sub-card titles |
| `body-lg` | Geist | 1.125rem (18px) | 400 | 0 | 1.65 | Hero subhead, lead paragraphs |
| `body` | Geist | 0.9375rem (15px) | 400 | 0 | 1.6 | Default body (NOTE: 15px, not 16 — compact per brief) |
| `body-sm` | Geist | 0.8125rem (13px) | 400 | 0 | 1.55 | Card meta, captions |
| `mono` | Geist Mono | 0.8125rem (13px) | 500 | 0 | 1.4 | Numbers, tickers, code, stats |
| `eyebrow` | Geist Mono | 0.75rem (12px) | 600 | 0.12em uppercase | 1 | Section eyebrows, labels |

> **Compact rule:** body is 15px not 18px. Premium but dense. Use `text-[13px]` / `text-[15px]` liberally. Hero is the ONLY oversized element.

### 5.4 Spacing scale (compact)
Vertical section padding = `py-20 md:py-28` (NOT `py-32`). Container horizontal padding = `px-5 sm:px-8 lg:px-12`. Inner card padding = `p-4 sm:p-5` (NOT `p-6`/`p-8`). Gaps in grids = `gap-3 sm:gap-4`.

### 5.5 Z-index tiers (no overlap rule)

| Token | z-index | Usage |
|---|---|---|
| `z-base` | 0 | section content |
| `z-aurora` | 0 (behind, with `-z-10` wrapper) | aurora blobs, grid backgrounds |
| `z-card` | 10 | floating insight cards |
| `z-sticky-nav` | 50 | sticky navigation |
| `z-scroll-progress` | 60 | top scroll progress bar |
| `z-modal` | 100 | mobile menu sheet, chat demo overlay (if any) |

Every floating element MUST be wrapped in a `relative` parent. Aurora backgrounds use `absolute inset-0 -z-10 overflow-hidden pointer-events-none`. Never let an aurora blob escape its section.

### 5.6 Motion language (locked timings)
- **ease-out premium:** `cubic-bezier(0.16, 1, 0.3, 1)` (named `--ease-out-expo` in CSS)
- **reveal:** opacity 0→1 + translateY(16px)→0, duration 0.6s, ease-out-expo, stagger 0.08s
- **hover lift:** translateY(-3px) + border → `--border-strong` + shadow deepen, duration 0.25s
- **count-up:** 1.8s, easeOutExpo
- **chart draw-in:** stroke-dashoffset 1000→0 over 1.4s ease-out-expo
- **magnetic button:** cursor pulls button up to 6px within 80px radius, spring stiffness 350, damping 25
- **scroll progress:** top 2px bar, `--accent` → `--gold` gradient, scaleX 0→1 linked to scroll

### 5.7 3D depth strategy
- **Perspective container:** wrap major visual blocks in `<div style={{ perspective: 2000 }}>` and apply `transform: rotateX(6deg) rotateY(-3deg)` to the inner panel, flattening on scroll-out via `useScroll`/`useTransform`.
- **Layered floating cards:** dashboard mockup + 2-3 satellite glass cards offset `translateZ(40-80px)`, each rotated ±1.5°.
- **Never exceed 12deg rotation** — beyond that, readability drops.
- **Use `transform-style: preserve-3d`** on 3D parents. Set `will-change: transform` on animated layers only.

---

## PART 6 · PROJECT LAYOUT (folders, ports, processes)

### 6.1 Folder structure (this sandbox = the landing repo)

```
/home/z/my-project/                          # the landing repo (Next.js)
├── src/
│   ├── app/
│   │   ├── layout.tsx                        # EDIT in Step A1 (fonts + ThemeProvider + metadata + JSON-LD)
│   │   ├── page.tsx                          # EDIT in Step A10 (compose all landing sections)
│   │   ├── globals.css                       # EDIT in Step A1 (design tokens + keyframes + scrollbar)
│   │   ├── proxy.ts                          # CREATE in Step C3 (nonce-based CSP + x-logged-in)
│   │   ├── sitemap.ts                        # CREATE in Step C5
│   │   └── api/
│   │       ├── session/route.ts              # CREATE in Step C1
│   │       ├── cta/route.ts                   # CREATE in Step C2
│   │       └── health/route.ts               # CREATE in Step C1
│   ├── components/
│   │   ├── ui/                               # EXISTING (shadcn/ui, do not touch)
│   │   ├── bits/                             # CREATE in Step A2 (reusable bits)
│   │   ├── charts/                           # CREATE in Step A3 (6 chart components)
│   │   └── landing/                          # CREATE in Step A4-A9 (16 section components)
│   └── lib/
│       ├── landing-data.ts                   # CREATE in Step A2 (all mock data)
│       ├── use-chat-cycle.ts                 # CREATE in Step A2 (zustand store)
│       └── utils.ts                          # EXISTING
├── public/
│   ├── tokens.css                            # CREATE in Step B (extracted from globals.css)
│   ├── robots.txt                            # EDIT in Step C5
│   ├── og-cover.png                          # GENERATE in Step A11 (image-gen skill)
│   ├── founder-avatar-{1..6}.jpg             # GENERATE in Step A11
│   └── logo.svg                              # EXISTING
├── Caddyfile                                 # EDIT in Step D (drop-in replacement from APPENDIX A)
├── Caddyfile.dev                             # CREATE in Step F (local dev routing, APPENDIX E)
├── app-public/                               # CREATE in Step E (copy of the existing app, for local dev)
│   └── (the existing app's files, untouched)
├── FinCopilot_MASTER_PROMPT.md              # THIS FILE
└── worklog.md                                # EXISTING — APPEND your work record at the end
```

### 6.2 Ports

| Service | Port | Purpose |
|---|---|---|
| Next.js landing (dev) | 3000 | `bun run dev` |
| Static HTML app (dev, optional) | 8080 | `bun serve app-public -p 8080` (only if you want a separate dev server) |
| App's own backend (if any) | 8080 | only if the app has a Node/Python backend |
| Caddy (dev) | 80 | `caddy run --config Caddyfile.dev` (mirrors prod routing) |
| Caddy (prod, this sandbox) | 81 | the existing gateway — DO NOT change the listener port |

### 6.3 Processes (dev)

1. `bun run dev` (Next.js, `:3000`) — always running in background.
2. `caddy run --config Caddyfile` (`:81`) — the existing sandbox gateway (already running). After Step D, `caddy reload` to pick up the new config.
3. (Optional) `bun serve app-public -p 8080` — only if testing the app through its own server. Otherwise Caddy serves it directly from `./app-public/`.

---

## PART 7 · FILE & COMPONENT ARCHITECTURE

### 7.1 Directory tree to create (landing side)

```
src/
  app/
    layout.tsx, page.tsx, globals.css, proxy.ts, sitemap.ts
    api/{session,cta,health}/route.ts
  components/
    ui/                     # EXISTING — shadcn/ui, do not touch
    landing/
      nav.tsx               # sticky top nav + mobile sheet + theme toggle
      scroll-progress.tsx   # top 2px scroll progress bar
      hero.tsx              # hero section (headline, CTAs, live chat demo, 3D dashboard)
      trust-marquee.tsx     # press logos + stats strip
      problem.tsx           # "money is messy" pain points
      how-it-works.tsx      # 3-step connect → categorize → copilot
      bento-features.tsx    # 7-tile bento feature grid
      ai-copilot-deepdive.tsx  # full chat demo + example queries + insight cards
      chart-showcase.tsx    # 3D animated chart gallery (6 chart types)
      dashboard-preview.tsx # browser-framed full app mockup + floating cards
      integrations.tsx      # bank/brokerage/crypto connection grid
      security.tsx          # SOC2 / AES-256 / read-only / no-sell-data
      testimonials.tsx      # 6 quantified-outcome testimonial cards
      pricing.tsx           # 3-tier + monthly/annual toggle
      faq.tsx               # 8-question accordion
      final-cta.tsx         # big centered CTA
      footer.tsx            # sticky footer (mt-auto), sitemap, badges, social
    charts/
      spending-area.ts      # animated area chart (hero)
      net-worth-line.ts      # net worth line chart (dashboard preview)
      cashflow-bar.ts        # monthly cash flow bar chart
      allocation-donut.ts    # portfolio allocation donut
      spending-treemap.tsx   # spending-by-category treemap
      forecast-combo.ts      # forecast: actual + projected band (chart showcase)
      mini-sparkline.tsx     # tiny inline sparkline (used in insight cards)
    bits/
      aurora.tsx            # reusable aurora background blobs
      magnetic-button.tsx    # magnetic CTA button
      count-up.tsx          # count-up number on in-view
      insight-card.tsx      # glass insight card (chart + headline + CTA)
      chat-demo.tsx          # the self-cycling AI chat demo (reused in hero + deepdive)
      ticker.tsx            # infinite-scroll stock ticker strip
      section-heading.tsx   # eyebrow + h2 + subtitle composition
      glass-card.tsx        # base glass surface wrapper
  lib/
    landing-data.ts         # ALL mock data (copy, stats, features, testimonials, faq, chat examples)
    use-chat-cycle.ts       # zustand store + hook for the chat demo cycle
```

### 7.2 Composition rule for `page.tsx`
`page.tsx` is a **server component** that imports the client section components and composes them in order. Mark client components with `'use client'` at the top of their file. The root wrapper:

```tsx
// page.tsx (server component)
import { Nav } from "@/components/landing/nav";
// ...import all sections...
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <ScrollProgress />
      <Nav />
      <main className="flex-1">
        <Hero />
        <TrustMarquee />
        <Problem />
        <HowItWorks />
        <BentoFeatures />
        <AICopilotDeepDive />
        <ChartShowcase />
        <DashboardPreview />
        <Integrations />
        <Security />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
```

### 7.3 Image assets — generate via the image-generation skill
Generate these images (use the `image-generation` skill / CLI). Store in `public/`:
1. `public/og-cover.png` — 1200×630 social share cover: dark charcoal canvas, emerald aurora glow, large "FinCopilot" wordmark in Plus Jakarta Sans, a subtle gold underline, faint chart line. No text other than the wordmark.
2. `public/founder-avatar-1.jpg` … `public/founder-avatar-6.jpg` — 6 testimonial avatars (96×96), diverse, professional headshots, neutral studio background.
3. `public/press-logo-*.svg` — inline SVGs preferred (TechCrunch, Forbes, The Verge, Bloomberg, Wired, Product Hunt) — build as monochrome wordmark SVGs (grayscale, colorize to `--accent` on hover). Do NOT scrape real logos; create tasteful text-based wordmark stand-ins with the publication name in their distinctive type style.
4. `public/integration-logo-*.svg` — same approach for bank/brokerage/crypto integrations (Chase, Bank of America, Fidelity, Vanguard, Robinhood, Coinbase, Wise, Apple Card, Amex, Schwab). Monochrome SVG wordmarks, hover colorize.
5. `public/security-badges.svg` — inline SOC 2 / ISO 27001 / AES-256 / Plaid badge set (monochrome shield/lock glyphs + label).
6. **The dashboard mockup is NOT an image** — it is built in HTML/CSS/recharts for crispness and so the charts can animate.

If the image-generation skill is unavailable, construct all visuals with CSS + SVG inline. **No broken images allowed.**

---

## PART 8 · SECTION-BY-SECTION LANDING BUILD SPEC (16 SECTIONS)

> Every section below specifies: **purpose · layout · exact copy · components · animations · data · responsive behavior**. Follow precisely.

### SECTION 1 · STICKY NAVIGATION (`nav.tsx`)

**Purpose:** Persistent brand + primary nav + CTA + theme toggle + mobile menu.

**Layout (desktop):** `position: sticky; top: 0; z-50`. Full-width translucent bar: `bg-[var(--bg)]/70 backdrop-blur-xl border-b border-[var(--border)]`. Height `h-16`. Inner: `max-w-7xl mx-auto px-5 sm:px-8 h-full flex items-center justify-between`.

**Left:** Logo — a custom inline SVG mark: a rounded-square `14×14` with emerald→gold gradient fill, inside a minimalist "₵" (c-style copilot glyph) in charcoal. Wordmark "FinCopilot" next to it in Plus Jakarta Sans 700, `text-[17px]`, tracking -0.01em. Clickable (scrolls to top).

**Center (desktop ≥ lg):** nav links — `Features` · `How it works` · `Pricing` · `Reviews` · `Security`. Style: `text-[14px] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors`. Each link smooth-scrolls (`scroll-behavior: smooth` + `scroll-mt-16` on targets) to its section.

**Right:** theme toggle (sun/moon lucide icon, `IconButton`), "Log in" ghost text button (links to `/app/login.html` — the existing app's login), primary CTA **"Start free"** — links to `/api/cta?dest=signup&source=nav` (server-side redirect to `/app/signup.html`). `MagneticButton` with emerald background `bg-[var(--accent)] text-[#0A0F0D] font-semibold text-[13px] px-4 py-2 rounded-[10px] hover:bg-[var(--accent-bright)]`.

**Mobile (< lg):** center nav hidden; right shows theme toggle + hamburger (`Menu` lucide). Hamburger opens a shadcn `Sheet` (right side) with the nav links stacked, each `py-3`, plus the "Start free" CTA full-width at the bottom.

**Behavior:** On scroll past 80px, add a subtle shadow `shadow-[0_1px_0_var(--border)]` and increase opacity to `bg-[var(--bg)]/85`. Use `useScroll` + `useMotionValueEvent` to toggle a state.

**SSR login detection (for hybrid integration):** The nav reads `headers().get("x-logged-in")` (set by `proxy.ts`). If `"1"`, render "Go to dashboard" (`href="/app/dashboard.html"`) instead of "Start free" + "Log in". Add a client `<NavSessionSync />` that calls `fetch("/api/session")` on mount to update the CTA client-side if the SSR guess was wrong.

**Microcopy under CTA (desktop only, tiny):** `text-[10px] text-[var(--text-muted)]` — "No credit card".

### SECTION 2 · HERO (`hero.tsx`) — the centerpiece

**Purpose:** Above-the-fold value prop + live AI chat demo + 3D floating dashboard. This single section carries 60% of the conversion weight.

**Layout:** Full-width section, `min-h-[100svh]` on desktop, `pt-28 pb-20 md:pt-32 md:pb-24`. Background: dark canvas + 2 aurora blobs (emerald top-left, gold bottom-right) drifting slowly (`aurora.tsx`, 18s linear infinite, `blur-[80px] opacity-50`). A faint dotted grid overlay (`bg-[radial-gradient(circle,_var(--border)_1px,_transparent_1px)] bg-[length:24px_24px] opacity-30`) for texture.

**Inner grid:** `max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center`.

**Left column (lg:col-span-6):**
1. **Eyebrow badge** — a pill: `inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-secondary)]`. Content: a pulsing emerald dot (`w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse`) + "Now with FinCopilot AI v2".
2. **Headline** — `font-display text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.03em] font-bold`. Two lines:
   - Line 1: "Your money,"
   - Line 2: a `motion.span` that **rotates** through 3 phrases every 3.5s (fade+slide, `AnimatePresence`): "intelligently organized." / "on autopilot." / "answered." Each phrase rendered in a gradient text (`bg-gradient-to-r from-[var(--accent-bright)] via-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent`).
3. **Subhead** — `text-[17px] sm:text-[18px] text-[var(--text-secondary)] leading-[1.65] max-w-[34rem]`. Copy: "FinCopilot tracks your spending, builds smart budgets, forecasts cash flow, and answers your money questions — all in one beautiful place."
4. **CTA row** — `flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-2`:
   - Primary: `MagneticButton` "Start free" wrapped in `<a href="/api/cta?dest=signup&source=hero">` (emerald). Icon `ArrowRight` inside, `ml-2`.
   - Secondary: ghost button "See how it works" — `border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--surface-2)] text-[13px] px-4 py-2 rounded-[10px]`. Plays a `Play` icon. Links to `#how-it-works`.
5. **Trust microcopy** — below CTAs, `text-[12px] text-[var(--text-muted)] flex flex-wrap items-center gap-x-4 gap-y-1 mt-3`. Three items separated by `·`: "No credit card required" · "Bank-level 256-bit AES" · "SOC 2 Type II". Each item has a tiny `ShieldCheck`/`Lock` lucide icon.
6. **Inline stat row** — `mt-6 flex items-center gap-6`. Three `CountUp` stats stacked horizontally: "**$2.4B+** tracked" · "**250K+** users" · "**4.9★** App Store". Each stat: number in `text-[20px] font-bold font-mono text-[var(--text)]`, label in `text-[11px] text-[var(--text-muted)] uppercase tracking-wider`.

**Right column (lg:col-span-6):** the **3D dashboard + chat demo composition**.
- A `relative` wrapper with `perspective: 2000px`.
- **Main dashboard panel** (`glass-card`): tilted `rotateX(6deg) rotateY(-3deg)`, `transform-style: preserve-3d`, `rounded-[var(--radius-xl)]`. Contains a mini dashboard:
  - Top bar: a faux window chrome (3 dots + a pill reading `app.fincopilot.ai`).
  - Body: a 2-column mini-grid:
    - Left tile: "Net worth" label + big count-up number `$48,217` (count-up on in-view) + a `mini-sparkline` (emerald, upward).
    - Right tile: "This month" donut chart (`allocation-donut`) showing 4 categories.
  - Below: a thin `spending-area` recharts area chart (emerald gradient fill) animating draw-in.
- **Floating satellite cards** (3 of them, absolute-positioned around the panel, each a `glass-card` `p-3`, slightly rotated, `translateZ`):
  - Top-left: "Dining" — `$487` + `↑22% vs avg` in `--danger` + tiny sparkline.
  - Top-right: "Unused subscriptions" — "Found 3" + a `Cancel` ghost chip.
  - Bottom-right: "Forecast" — "Savings goal hit **Mar 14**" + a confidence sparkline.
- **Chat demo** (`chat-demo.tsx`) embedded as the bottom strip of the panel. The chat demo self-cycles through 4 example Q&A pairs (see PART 10.2). User bubble right-aligned emerald; AI bubble left-aligned glass with a typing indicator (3 bouncing dots) then a typed response with an inline `mini-sparkline`.

**Animation "first paint" timeline (desktop, in-view triggered):**
- 0ms: aurora blobs begin drifting (always running).
- 100ms: eyebrow badge fades in (0.5s).
- 250ms: headline line 1 fades in + line 2 starts rotating phrase loop.
- 400ms: subhead fades in (0.6s).
- 550ms: CTA row slides up (translateY 12→0, 0.5s).
- 700ms: dashboard panel fades + scales 0.96→1 (0.7s ease-out-expo), net-worth count-up starts.
- 900ms: area chart stroke draws in (1.4s).
- 1100ms: 3 satellite cards stagger in (120ms apart).
- 1400ms: chat demo first user bubble slides in.
- 2600ms: chat demo AI typing indicator → typed response (fade-in-by-sentence).
- 8000ms: chat cycles to next example.

**Mobile (< lg):** single column, headline first, then CTAs, then the dashboard composition below (scale down the 3D tilt to `rotateX(3deg)` to avoid clipping; reduce floating cards to 2; chat demo becomes a stacked card under the dashboard, not overlaid).

### SECTION 3 · TRUST MARQUEE (`trust-marquee.tsx`)

**Purpose:** Press strip + stats band — immediate social proof.

**Layout:** `py-14 border-y border-[var(--border)] bg-[var(--bg)]`. Two stacked rows.

**Row 1 (press):** centered eyebrow "AS FEATURED IN" (`eyebrow` style) + a single-row infinite marquee of press wordmark SVGs (8-10 logos). Marquee: `flex gap-12 animate-[marquee_30s_linear_infinite]`, duplicate the list for seamless loop, `pause on hover`. Logos grayscale `opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition`.

**Row 2 (stats):** `grid grid-cols-2 md:grid-cols-5 gap-6 mt-10`. Five `CountUp` stats:
- "$2.4B+" — "money tracked"
- "250K+" — "active users"
- "4.9★" — "App Store rating"
- "99.99%" — "uptime"
- "SOC 2" — "Type II certified"

Each: number `text-[28px] font-bold font-mono`, label `text-[12px] uppercase tracking-wider text-[var(--text-muted)]`. Add `whileInView` count-up trigger.

**Animation:** marquee runs continuously; stats count up on in-view.

### SECTION 4 · THE PROBLEM (`problem.tsx`)

**Purpose:** Name the pain. Empathize. Set up the solution.

**Layout:** `py-20 md:py-28`. `SectionHeading` centered: eyebrow "THE PROBLEM" + h2 "Money is messy. Your bank app isn't helping." + subtitle "You juggle 6 apps, 3 cards, 2 brokerages — and still can't answer 'can I afford this?'"

**Body:** a 3-column grid (`md:grid-cols-3 gap-4`) of pain-point cards. Each card: `glass-card p-5`, top a `lucide` icon in a `w-9 h-9 rounded-[10px] bg-[var(--accent-dim)] text-[var(--accent)]` tile, then an h4 + body-sm. Cards:
1. **Icon `CreditCard`** — "Scattered accounts" — "Your money lives across 6+ apps. Net worth? A spreadsheet you update twice a year."
2. **Icon `Bell`** — "Surprise charges" — "That $89 annual fee hits like a jump scare. Subscriptions quietly drain $200+/month."
3. **Icon `Brain`** — "No real answers" — "Your bank shows transactions, not insight. 'Can I afford a vacation?' is a 20-minute calculation."

**Animation:** cards stagger reveal (80ms), hover lifts + border brightens.

### SECTION 5 · HOW IT WORKS (`how-it-works.tsx`)

**Purpose:** Demystify onboarding in 3 steps.

**Layout:** `py-20 md:py-28`. `SectionHeading`: eyebrow "HOW IT WORKS" + h2 "Live in 3 minutes, not 3 weeks." + subtitle "Connect once. FinCopilot does the rest — forever."

**Body:** 3 horizontal steps on desktop (`md:grid-cols-3 gap-6`), vertical on mobile. Each step is a `relative` card with a big number watermark in the background (`text-[120px] font-display font-bold text-[var(--surface-2)] absolute -top-4 -left-2 select-none`). Foreground: icon tile + h3 + body-sm. Between steps (desktop), a connector line with an `ArrowRight` lucide.

Steps:
1. **`Link2` icon** — "Connect" — "Securely link your banks, cards, brokerages, and wallets via read-only Plaid. 12,000+ institutions supported."
2. **`Tags` icon** — "Categorize" — "FinCopilot AI auto-tags every transaction with smart, learning categories. No manual sorting, ever."
3. **`Sparkles` icon** — "Copilot" — "Ask anything. Get answers, forecasts, and one-tap actions — in plain English."

**Animation:** steps reveal in sequence (250ms apart), the number watermark fades in last.

### SECTION 6 · BENTO FEATURES (`bento-features.tsx`)

**Purpose:** Dense, premium feature showcase in a bento grid. This is the "wow" density moment.

**Layout:** `py-20 md:py-28`. `SectionHeading`: eyebrow "EVERYTHING IN ONE PLACE" + h2 "A full financial OS, not another tracker." + subtitle "Seven pillars. One screen. Zero spreadsheets."

**Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` with a custom 6-col spanning pattern on lg:
```
[ AI Copilot (lg:col-span-2, row-span-2) ] [ Smart Budgeting ] [ Net Worth ]
                                          [ Cash Flow ]        [ Subscriptions ]
[ Investment Insights (lg:col-span-2) ]   [ Anomaly Alerts (lg:col-span-1) ]
```
(The AI Copilot tile is the 2×2 hero tile — largest. Use `lg:col-span-2 lg:row-span-2`.)

Each tile: `glass-card p-5 group relative overflow-hidden`. On hover: lift 3px, border → `--border-strong`, a subtle emerald radial glow appears in the corner. Each tile has: small icon tile (as in §4), h3 title, body-sm description, and a **verb-CTA** link at the bottom (`text-[13px] text-[var(--accent)] hover:text-[var(--accent-bright)]` with `ArrowRight`). All verb-CTAs link to `/api/cta?dest=signup&source=bento-<feature>`.

**Tile specs:**
1. **AI Copilot (large tile)** — Icon `Sparkles` (emerald). Title "Ask your money anything." Desc "FinCopilot AI answers in plain English — with charts, forecasts, and one-tap actions." Inside the tile, embed a **mini live chat demo** (a compact variant of `chat-demo.tsx`, 2 cycling examples). Verb-CTA "Try a question".
2. **Smart Budgeting** — Icon `Wallet`. "Budgets that adapt to you." "AI sets realistic budgets from your real spending, rolls over unspent amounts, and flags drift." Verb "Track my spending".
3. **Net Worth** — Icon `TrendingUp`. "All your money, one number." "Banks, cards, brokerage, crypto, real estate — aggregated and updated daily." Verb "See my net worth".
4. **Cash Flow Forecast** — Icon `LineChart`. "See 90 days ahead." "AI projects your cash flow, predicts shortfalls, and surfaces safe-to-spend amounts." Verb "Forecast my cash".
5. **Subscriptions** — Icon `Repeat`. "Find the $200 you forgot." "FinCopilot flags unused subscriptions and cancels them in one tap." Verb "Manage my subscriptions".
6. **Investment Insights** — Icon `PieChart`. "Know if you're diversified." "Allocation, risk, fees, and drift — explained without the jargon." Verb "Analyze my portfolio".
7. **Anomaly Alerts** — Icon `ShieldAlert`. "We watch so you don't." "Double charges, fraud spikes, unusual categories — pushed before you notice." Verb "Set my alerts".

**Animation:** tiles reveal with stagger (60ms), the AI Copilot large tile scales in slightly larger (0.98→1). The mini chat demo inside tile 1 starts cycling on in-view.

### SECTION 7 · AI COPILOT DEEP-DIVE (`ai-copilot-deepdive.tsx`)

**Purpose:** Full-bleed showcase of the AI chat capability with multiple example queries and rich response cards.

**Layout:** `py-20 md:py-28`. Full-width dark section with an emerald aurora. `SectionHeading`: eyebrow "FINCOPILOT AI" + h2 "Talk to your money. It talks back." + subtitle "No bank-speak. Just answers, charts, and one-tap actions."

**Body:** `grid lg:grid-cols-12 gap-8 items-center`.
- **Left (lg:col-span-5):** a tall `chat-demo.tsx` instance showing a fuller conversation — 4 alternating Q&A pairs visible (not cycling, but the full transcript scrollable in a `max-h-[520px] overflow-y-auto` panel with custom scrollbar). Above the transcript: an "Ask FinCopilot" input bar (non-functional, with rotating placeholder via `useEffect`). Below: a row of example query chips (clickable → would insert into the bar; on click, scroll the transcript to that answer).
- **Right (lg:col-span-7):** a 2×2 grid of `insight-card` examples showing the **rich response card types**:
  - **InsightCard** — "Dining" — `$487 this month, 22% above your 3-mo avg` + a small bar chart + "Set a $400 budget" CTA.
  - **ForecastCard** — "Vacation goal" — sparkline + "At your current rate, you'll hit $2,000 on Aug 14" + confidence badge "92%".
  - **ActionCard** — "Unused subscriptions" — list of 3 (`🎬 Streamly $19.99`, `💪 FitForge $79.99`, `🍔 BiteClub $24.99`) + "Cancel all →".
  - **AlertCard** — "Unusual charge" — red severity dot + "Uber $48 — 3× your typical. Flag?" + "Review / Dismiss".

**Example queries (use these, in the transcript and as chips):**
1. "How much did I spend on dining out last month?"
2. "Can I afford a $2,000 vacation in August?"
3. "What subscriptions am I paying for that I don't use?"
4. "When will I hit my $10k savings goal?"
5. "Why did my net worth drop this week?"
6. "Find me $200 I can save this month."

**Animation:** transcript lines fade-in-by-sentence on in-view (stagger 200ms). Insight cards reveal stagger 100ms.

### SECTION 8 · CHART SHOWCASE (`chart-showcase.tsx`) — the 3D chart gallery

**Purpose:** Flex the data-viz muscle. Six animated, 3D-tilted chart cards in a gallery.

**Layout:** `py-20 md:py-28`. `SectionHeading`: eyebrow "DATA, BEAUTIFULLY RENDERED" + h2 "Every number tells a story." + subtitle "Six interactive views of your money — animated, 3D, and real-time."

**Body:** `grid sm:grid-cols-2 lg:grid-cols-3 gap-4`. Six cards, each a `glass-card p-5` with a 3D tilt (`rotateX(4deg) rotateY(-2deg)` baseline, flattens to 0 on hover via `useTransform` on hover state). Each card: h3 + a `recharts` chart filling the card + a small legend. Cards:
1. **`spending-area`** — "Spending trend" — 30-day area chart, emerald gradient fill, animated draw-in.
2. **`net-worth-line`** — "Net worth" — 12-month line, gold stroke, animated draw-in.
3. **`cashflow-bar`** — "Monthly cash flow" — 12-bar income vs expense, emerald + rose.
4. **`allocation-donut`** — "Portfolio allocation" — donut, 5 segments using `--chart-1..5`.
5. **`spending-treemap`** — "Where it goes" — treemap by category (recharts `Treemap`), sized by spend.
6. **`forecast-combo`** — "Cash flow forecast" — actual line (solid emerald) + projected band (faint emerald area) for next 90 days.

**Animation:** on in-view, each chart draws in (stroke-dashoffset for lines/area; bars scale-y 0→1; donut via recharts `animationBegin`/`isAnimationActive`). Tilt flattens on hover. Cards reveal stagger 80ms.

**Performance:** all charts `isAnimationActive` true, `animationDuration` 1400, single-shot. Wrap each in a `React.memo` to avoid re-render storms.

### SECTION 9 · DASHBOARD PREVIEW (`dashboard-preview.tsx`)

**Purpose:** Show the actual product. Browser-framed full-app mockup with floating insight cards.

**Layout:** `py-20 md:py-28`. `SectionHeading`: eyebrow "THE PRODUCT" + h2 "One screen. Your whole financial life." + subtitle "No more tab-hopping. This is FinCopilot at a glance."

**Body:** a centered `relative` container, `max-w-6xl mx-auto`, `perspective: 2000px`. Inside:
- A **browser frame** wrapper: rounded top with 3 traffic-light dots + an address bar pill reading `🔒 app.fincopilot.ai/dashboard`. Inside the frame, the **dashboard** is built in HTML/CSS (NOT an image):
  - A left sidebar (faux): logo + nav icons (Overview, Transactions, Budgets, Investments, Copilot, Settings) with active state on "Overview".
  - Main area: a 12-col grid:
    - Top row: 4 KPI tiles (Net worth `$48,217 ↑3.2%`, Cash `+$/-$` this month, Investments `$19,840 ↑1.4%`, Savings goal `64%`).
    - Middle: a wide `net-worth-line` chart (12 months) spanning 8 cols + a `allocation-donut` in 4 cols.
    - Bottom: a `cashflow-bar` chart spanning full width (12 months).
  - Right sidebar (faux): a "Copilot" panel showing the mini chat demo (compact).
- **Floating satellite cards** around the frame (3-4), `translateZ`, slightly rotated:
  - Top-right: "Goal hit" celebratory card with confetti dots.
  - Bottom-left: "Anomaly" alert card (rose accent).
  - Bottom-right: "Forecast" card with sparkline.
- Behind the frame: a large emerald radial glow `radial-gradient(circle, var(--accent-glow), transparent 70%)` blurred, lifting the frame off the page.

**Animation:** on in-view, the frame fades+lifts (translateY 24→0), KPI numbers count-up, charts draw-in, satellite cards stagger in (120ms). On scroll-out, tilt flattens (`useScroll` linked `rotateX` 6deg → 0deg).

**Mobile:** stack — sidebar hidden, KPI tiles 2×2, charts full width, satellite cards reduced to 2 and repositioned to not overlap.

### SECTION 10 · INTEGRATIONS (`integrations.tsx`)

**Purpose:** Show breadth of connections (banks, brokerages, crypto).

**Layout:** `py-20 md:py-28`. `SectionHeading`: eyebrow "CONNECT EVERYTHING" + h2 "12,000+ institutions. Read-only. Always." + subtitle "Plaid-powered, bank-grade, read-only. We can't move your money — only understand it."

**Body:** a `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3` of integration tiles (10-12 logos). Each tile: `glass-card p-4 flex items-center gap-3`. Logo (monochrome SVG wordmark) + name. On hover: border → accent, logo colorize to accent, slight lift. Below the grid, a centered line: "Don't see your bank? We support 12,000+ — search on signup." + a `Plus` icon.

**Animation:** tiles reveal stagger 40ms (fast — it's a logo wall). Hover micro-interaction as above.

### SECTION 11 · SECURITY & TRUST (`security.tsx`)

**Purpose:** Address the "is it safe?" objection head-on, right before pricing.

**Layout:** `py-20 md:py-28`. Two-column `lg:grid-cols-2 gap-12 items-center`.
- **Left:** `SectionHeading` (left-aligned): eyebrow "SECURITY & TRUST" + h2 "Your money is sacred. We treat it that way." + subtitle. Then 4 trust items, each a row with an icon tile + h4 + body-sm:
  - `Lock` — "256-bit AES encryption" — "Bank-grade encryption at rest and in transit."
  - `EyeOff` — "Read-only access" — "We can see your data. We cannot move your money. Ever."
  - `FileCheck` — "SOC 2 Type II" — "Independently audited annually. Report available on request."
  - `HandCoins` — "We never sell your data" — "Not to advertisers, not to anyone. Your data is yours."
- **Right:** a `glass-card p-6` containing the badge set (SOC 2, ISO 27001, AES-256, Plaid) in a 2×2 grid, each badge a `w-16 h-16` rounded tile with the `security-badges.svg` glyph + label. Below: a faint quote "Independently audited by Coalfire, 2025." and a "Read the security overview →" link.

**Animation:** left items stagger reveal, right badges pop in with a subtle scale.

### SECTION 12 · TESTIMONIALS (`testimonials.tsx`)

**Purpose:** Quantified social proof — every testimonial has an outcome metric.

**Layout:** `py-20 md:py-28`. `SectionHeading`: eyebrow "LOVED BY PEOPLE WHO HATE THEIR BANK APP" + h2 "Real users. Real outcomes. Real numbers." + subtitle.

**Body:** `grid sm:grid-cols-2 lg:grid-cols-3 gap-4`. Six testimonial cards. Each card: `glass-card p-5`. Top: a large outcome metric in `font-mono text-[24px] font-bold text-[var(--accent)]` + a tiny label. Then the quote (`text-[14px] text-[var(--text-secondary)] italic`). Then the author row: avatar (`public/founder-avatar-N.jpg`, `w-9 h-9 rounded-full`) + name + role + a star row (5 `Star` lucide icons filled gold).

**The 6 testimonials (exact copy):**
1. "**$4,200** saved in 3 months" — "FinCopilot found three subscriptions I forgot I had. That alone paid for a decade." — **Sarah K.**, Product Designer, Brooklyn — ★★★★★
2. "**31%** net worth growth in a year" — "I finally see everything in one place. No more spreadsheet Sundays." — **Mike R.**, Software Engineer, Austin — ★★★★★
3. "**14 hours** saved per month" — "It answers the questions I used to spend an hour calculating." — **Priya M.**, Marketing Lead, Toronto — ★★★★★
4. "**$2,000** vacation funded on autopilot" — "The rollover budgets made saving painless. I didn't even notice." — **Diego A.**, Teacher, Madrid — ★★★★★
5. "**0** surprise charges since joining" — "Anomaly alerts caught a duplicate charge within an hour." — **Aisha B.**, Founder, Dubai — ★★★★★
6. "**92%** of goals hit on time" — "The forecasts are weirdly accurate. It just gets how I spend." — **Tom L.**, Analyst, London — ★★★★★

**Animation:** cards reveal stagger 100ms, hover lifts + the metric number scales 1.05.

### SECTION 13 · PRICING (`pricing.tsx`)

**Purpose:** Convert. 3-tier, monthly/annual toggle, Pro as "Most Popular".

**Layout:** `py-20 md:py-28`. `SectionHeading`: eyebrow "PRICING" + h2 "Simple pricing that grows with you." + subtitle "Start free. Upgrade when FinCopilot becomes essential."

**Toggle:** centered, above the cards. `inline-flex` pill: "Monthly" / "Yearly (Save 39%)". Active side: `bg-[var(--accent)] text-[#0A0F0D]`. Inactive: `text-[var(--text-secondary)]`. Stored in `useState`. The "Save 39%" text is in `--gold`.

**Cards:** `grid md:grid-cols-3 gap-4 max-w-5xl mx-auto`. 3 tiers:
1. **Free — $0** — "Everything you need to start." Button "Get started" (links to `/api/cta?dest=signup&source=pricing-free`). Features (8):
   - Link up to 2 accounts · Auto-categorization · Monthly spending summary · Net worth tracking · 1 AI question / day · 30-day history · iOS & Android apps · Community support
2. **Plus — $8/mo** (or $5/mo billed yearly) — "For people serious about their money." Button "Get started" (accent border). Features (10): everything in Free +
   - Unlimited accounts · Unlimited AI questions · Cash flow forecasting · Subscription management · Rollover budgets · Anomaly alerts · 90-day history · Email + chat support · Custom categories
3. **Pro — $13/mo** (or $8/mo billed yearly) — "Most Popular" badge (gold, top-right ribbon). Slightly larger card (scale 1.03, `shadow-glow` emerald border). Button "Get started" (accent fill). Features (12): everything in Plus +
   - Investment insights & drift alerts · Real estate tracking · Tax optimization hints · Priority chat with AI · Custom categories & rules · Unlimited history · Export & API access · Shared household views · Priority support · Early access to new features · Annual financial review

**Below cards:** a centered reassurance line `text-[12px] text-[var(--text-muted)]`: "All plans: Bank-level 256-bit AES · SOC 2 Type II · No ads · Cancel anytime · 14-day free trial on paid plans".

**Animation:** toggle animates with a `layoutId` slide. Prices count-up/swap on toggle. Pro card has a gentle continuous emerald glow pulse (`animate-pulse` on a `::before` radial). Cards reveal stagger 120ms.

### SECTION 14 · FAQ (`faq.tsx`)

**Purpose:** Answer the top objections. Use shadcn `Accordion`.

**Layout:** `py-20 md:py-28`. `SectionHeading`: eyebrow "FAQ" + h2 "Questions, answered." + subtitle. Then `max-w-3xl mx-auto` shadcn `Accordion` (type="single", collapsible). 8 items:

1. **"Is FinCopilot safe to connect to my bank?"** — "Yes. We use Plaid (the same infrastructure trusted by Venmo, Robinhood, and Acorns) to connect read-only. We can see your data; we cannot move your money. Connections are 256-bit AES encrypted and we're SOC 2 Type II audited."
2. **"Can I try it free?"** — "Yes. The Free plan is free forever, no credit card. Paid plans have a 14-day free trial — cancel anytime, keep your data."
3. **"Do you sell my data?"** — "Never. Not to advertisers, not to data brokers, not to anyone. Our only revenue is your subscription. Your data is yours."
4. **"What if my bank isn't supported?"** — "We support 12,000+ institutions across 20 countries via Plaid. If yours isn't listed, search on signup — we add new connections weekly."
5. **"How is FinCopilot different from Mint / Copilot / YNAB?"** — "Three things: (1) the AI copilot — ask any money question in plain English; (2) forecasts, not just history; (3) an interface that doesn't feel like a 2010 banking app."
6. **"Can I cancel anytime?"** — "Yes. One tap in settings. You keep your historical data and can export it."
7. **"Does it work for couples / shared finances?"** — "Pro plan includes shared household views. Multi-user with granular permissions is on the roadmap."
8. **"Why isn't FinCopilot free?"** — "Because we don't sell your data or show ads. Your subscription is our only revenue — which means our incentives stay aligned with yours."

**Animation:** accordion items expand/collapse with the shadcn built-in motion. Reveal on in-view.

### SECTION 15 · FINAL CTA (`final-cta.tsx`)

**Purpose:** Last conversion push. Big, centered, glowing.

**Layout:** `py-24 md:py-32 relative overflow-hidden`. Background: a large emerald+gold aurora blob behind a centered content block. Content (centered, `max-w-2xl mx-auto text-center`):
- Eyebrow "START TODAY"
- H2 (display, large): "Your money, on autopilot." with "autopilot" in gradient text.
- Subhead: "Join 250,000+ people who stopped worrying about money. Free forever to start."
- CTA row: primary "Start free" (large magnetic button, emerald, links to `/api/cta?dest=signup&source=final-cta`) + secondary "Talk to us" (ghost, for enterprise, links to `/app/contact.html`).
- Microcopy: "No credit card · 14-day trial on paid plans · Cancel anytime".

**Animation:** aurora drifts; headline + CTAs fade-in on in-view; CTA buttons have the magnetic hover. A subtle confetti-like emerald particle drift on the background (CSS only, `animate-[float_6s_ease-in-out_infinite]`).

### SECTION 16 · FOOTER (`footer.tsx`) — sticky to bottom

**Purpose:** Sitemap, legal, security badges, social. Sticky to bottom via `mt-auto`.

**Layout:** `border-t border-[var(--border)] bg-[var(--bg)] pt-14 pb-8`. `max-w-7xl mx-auto px-5 sm:px-8`.
- **Top row:** 4 columns (`grid sm:grid-cols-2 lg:grid-cols-4 gap-8`):
  - Col 1: Logo + tagline "The AI co-pilot for your money." + 3 social icons (Twitter/X, LinkedIn, GitHub) as `IconButton`s.
  - Col 2: "Product" — Features, Pricing, Security, Integrations, Changelog.
  - Col 3: "Company" — About, Careers, Blog, Press, Contact.
  - Col 4: "Legal" — Privacy, Terms, Cookies, Security overview, Data promise.
  - Links: `text-[13px] text-[var(--text-secondary)] hover:text-[var(--text)]`.
- **Middle row:** the security badge strip (SOC 2, ISO 27001, AES-256, Plaid) — grayscale, small, centered, `mt-10 pt-8 border-t border-[var(--border)]`.
- **Bottom row:** `flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 text-[12px] text-[var(--text-muted)]`. Left: "© 2025 FinCopilot, Inc. All rights reserved." Right: "Made with care · Not a bank · Not financial advice".

**Animation:** none (static). Just ensure `mt-auto` keeps it pinned to the bottom on short pages and pushed down on long pages.

---

## PART 9 · ANIMATION & INTERACTION SYSTEM

### 9.1 Keyframes to add in `globals.css`

```css
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes aurora-drift {
  0%,100% { transform: translate(0,0) scale(1); }
  50%     { transform: translate(40px,-30px) scale(1.1); }
}
@keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes bounce-dot {
  0%,80%,100% { transform: translateY(0); opacity: 0.5; }
  40% { transform: translateY(-4px); opacity: 1; }
}
@keyframes glow-pulse {
  0%,100% { box-shadow: 0 0 30px var(--accent-glow); }
  50% { box-shadow: 0 0 50px var(--accent-glow), 0 0 80px var(--accent-glow); }
}
@keyframes particle-drift {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-120px) translateX(20px); opacity: 0; }
}
```

### 9.2 Reusable components (the `bits/`)

- **`MagneticButton`** — wraps shadcn `Button`. Uses framer-motion `useMotionValue` for x/y + `useSpring`. Cursor within 80px pulls up to 6px. On leave, springs back. Props: `children`, `variant`, `size`, `className`, `asChild`.
- **`CountUp`** — props: `value: number`, `format?: 'currency' | 'plain' | 'percent'`, `duration?: number` (default 1800), `suffix?`, `prefix?`. Uses `useInView` + `requestAnimationFrame` + easeOutExpo. Renders a `<span>`. Format currency → `$48,217`.
- **`Aurora`** — props: `variant: 'emerald' | 'gold' | 'mixed'`. Renders 2-3 absolutely-positioned blurred radial divs. `pointer-events-none`, `-z-10`, parent must be `relative overflow-hidden`.
- **`InsightCard`** — props: `type`, `title`, `value`, `delta?`, `chart?: ReactNode`, `action?`. Glass card layout per SECTION 7.
- **`ChatDemo`** — props: `variant: 'hero' | 'compact' | 'full'`, `autoCycle?: boolean` (default true), `cycleMs?: number` (default 8000). Self-cycles through the example Q&A in PART 10.2 via zustand store (`use-chat-cycle.ts`).
- **`Ticker`** — infinite-scroll stock ticker strip. Props: `items: {symbol, change}[]`. Duplicated list, `animate-[marquee_30s_linear_infinite]`, `pause on hover`. Green/red `change` colors.
- **`SectionHeading`** — props: `eyebrow`, `title`, `subtitle?`, `align?: 'center' | 'left'`. Renders the eyebrow + h2 + subtitle composition used by every section.
- **`GlassCard`** — base glass surface wrapper. Adds `glass-card` class + optional `glass-card-hover` for hover lift.

### 9.3 Scroll-linked animations (framer-motion)
- **Scroll progress bar** — `useScroll` → `scaleX` motion on a fixed 2px top bar, gradient `--accent` → `--gold`.
- **Dashboard tilt flatten** — `useScroll({ target: dashboardRef, offset: ['start end', 'end start'] })` → `rotateX` 6deg → 0deg via `useTransform`.
- **Section reveals** — `whileInView` with `viewport={{ once: true, margin: '-80px' }}`, `initial={{ opacity: 0, y: 16 }}`, `animate`/`whileInView` `{{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}`.

### 9.4 Micro-interactions checklist (apply everywhere)
- All buttons: hover lift 2px + bg shift + shadow.
- All cards: hover border → `--border-strong` + lift 3px + corner glow.
- All links: color shift `--text-secondary` → `--text`.
- All CTAs: magnetic hover (primary CTAs only — don't over-apply).
- All stat numbers: count-up on in-view.
- All charts: draw-in on in-view, single-shot.
- Nav: shadow appears after 80px scroll.
- Theme toggle: icon crossfade sun↔moon.

---

## PART 10 · MOCK DATA SPEC

### 10.1 All copy & data lives in `src/lib/landing-data.ts`
Export typed consts: `navLinks`, `pressLogos`, `stats`, `painPoints`, `howItWorksSteps`, `bentoFeatures`, `chatExamples`, `insightCards`, `chartShowcaseItems`, `dashboardKpis`, `integrations`, `trustItems`, `securityBadges`, `testimonials`, `pricingTiers`, `faqItems`, `footerColumns`, `tickerItems`. Types defined inline. This keeps `page.tsx` and components clean and the data swappable.

### 10.2 Chat example Q&A pairs (the script the demo cycles)

```ts
export const chatExamples = [
  {
    q: "How much did I spend on dining out last month?",
    a: "$487 across 23 transactions. That's 22% above your 3-month average of $399.",
    card: { type: "insight", metric: "$487", delta: "+22%", chart: "mini-bar", action: "Set a $400 budget" },
  },
  {
    q: "Can I afford a $2,000 vacation in August?",
    a: "Yes — with a 92% confidence. At your current saving rate, you'll have $2,140 by Aug 1, leaving $140 buffer.",
    card: { type: "forecast", metric: "Aug 14", chart: "forecast-spark", confidence: 92, action: "Create vacation goal" },
  },
  {
    q: "What subscriptions am I paying for that I don't use?",
    a: "I found 3 subscriptions with no activity in 90 days — totaling $124.97/month.",
    card: { type: "action", list: [
      { emoji: "🎬", name: "Streamly", price: "$19.99" },
      { emoji: "💪", name: "FitForge", price: "$79.99" },
      { emoji: "🍔", name: "BiteClub", price: "$24.99" },
    ], action: "Cancel all" },
  },
  {
    q: "Find me $200 I can save this month.",
    a: "Three opportunities: raise dining budget adherence ($90), pause unused subs ($125), switch phone plan ($40). Total potential: $255.",
    card: { type: "insight", metric: "$255", chart: "mini-bar", action: "Apply all" },
  },
];
```

### 10.3 Ticker items (stock ticker strip, used in dashboard preview sidebar)
`AAPL +1.91%, MSFT +1.64%, RIVN -1.52%, VTI +1.47%, GOOGL +0.82%, NVDA +3.14%, TSLA -0.74%, AMZN +0.55%` — green for positive, rose for negative.

### 10.4 Dashboard KPIs
- Net worth: `$48,217`, delta `+3.2%` (emerald)
- This month cash: `+$1,240` (emerald)
- Investments: `$19,840`, delta `+1.4%` (emerald)
- Savings goal: `64%` (gold progress ring)

### 10.5 Chart datasets
- **spending-area**: 30 days, values ranging $20-$120/day, emerald gradient.
- **net-worth-line**: 12 months, $42k → $48k, gold stroke.
- **cashflow-bar**: 12 months, income (~$6k) vs expense (~$4.8k), emerald + rose.
- **allocation-donut**: Equity 45%, Crypto 12%, ETF 25%, Cash 13%, Real estate 5%.
- **spending-treemap**: categories: Rent $1,800, Groceries $640, Dining $487, Transport $310, Shopping $290, Subs $125, Utilities $180, Other $210.
- **forecast-combo**: 6 months actual + 3 months projected band.

---

## PART 11 · RESPONSIVE & LAYOUT RULES

### 11.1 Breakpoints (Tailwind defaults)
`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.

### 11.2 Per-section responsive rules

| Section | Mobile (<640) | Tablet (640-1024) | Desktop (≥1024) |
|---|---|---|---|
| Nav | hamburger sheet | hamburger | full nav |
| Hero | single col, dashboard below, 2 satellite cards, tilt 3deg | single col | 2-col 12-grid, full 3D |
| Trust marquee | 2-col stats | 3-col stats | 5-col stats |
| Problem / Bento | 1 col | 2 col | bento spans |
| AI deepdive | stacked | stacked | 12-col split |
| Chart showcase | 1 col | 2 col | 3 col |
| Dashboard preview | sidebar hidden, KPIs 2×2 | partial sidebar | full |
| Integrations | 2 col | 3 col | 4 col |
| Security | stacked | stacked | 2-col |
| Testimonials | 1 col | 2 col | 3 col |
| Pricing | 1 col stacked | 3 col | 3 col |
| FAQ | full width | full width | max-w-3xl |
| Footer | stacked cols | 2-col | 4-col |

### 11.3 Hard layout rules
- **No horizontal scroll at any breakpoint.** Every section: `overflow-x-hidden`. Aurora/blob parents: `overflow-hidden`.
- **No content clipping.** Floating cards: ensure `position: absolute` cards have negative offsets only where the parent has `overflow: visible` AND the section wrapper has `overflow-x: hidden` to contain bleed.
- **Touch targets ≥ 44px** on all interactive elements (mobile).
- **Container max-widths:** `max-w-7xl` for most, `max-w-5xl` for pricing/FAQ, `max-w-3xl` for FAQ accordion, `max-w-2xl` for final CTA.
- **Section vertical rhythm:** alternate background subtly — most sections use `--bg`; one or two (security, final CTA) use a faint `--bg-aurora-1` to create rhythm without harsh contrast.

### 11.4 Custom scrollbar styling (add to `globals.css`)
```css
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--surface-3); border-radius: 8px; border: 2px solid var(--bg); }
::-webkit-scrollbar-thumb:hover { background: var(--accent-dim); }
.scrollbar-thin::-webkit-scrollbar { width: 6px; }
```

---

## PART 12 · ACCESSIBILITY, SEO & PERFORMANCE

### 12.1 Accessibility
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Every section has an `aria-labelledby` pointing to its h2 `id`.
- Nav links: `aria-current` on active. Mobile menu button: `aria-expanded`, `aria-controls`.
- Theme toggle: `aria-label="Toggle theme"`.
- All icons decorative: `aria-hidden="true"`. All icon buttons: `aria-label`.
- Charts: each chart card has an `sr-only` text summary of the data (e.g. "Spending trend over 30 days, ranging $20 to $120 per day, trending upward").
- Color contrast: text on dark meets WCAG AA. `--text` (92% white) on `--bg` (#0A0F0D) = ~16:1. `--text-secondary` (#9BA8A2) on `--bg` = ~7:1. Pass.
- Focus visible: `outline: 2px solid var(--accent); outline-offset: 2px;` on `:focus-visible` globally (add to `globals.css` base layer).
- Reduced motion: `@media (prefers-reduced-motion: reduce)` — disable count-up, chart draw-in, marquee, aurora drift, magnetic hover. Keep reveals as instant opacity. Wrap framer-motion animations in a `useReducedMotion()` check.
- Keyboard: tab order follows visual order. Accordion, sheet, dialog use shadcn defaults (already accessible).

### 12.2 SEO
- `layout.tsx` `metadata`: title "FinCopilot — The AI co-pilot for your money", description "FinCopilot tracks your spending, builds smart budgets, forecasts cash flow, and answers your money questions — all in one beautiful place.", keywords, openGraph (with `public/og-cover.png`), twitter card.
- Add `export const metadata` with `metadataBase`, canonical URL, robots `index,follow`.
- Add JSON-LD structured data (`<script type="application/ld+json">`) for `SoftwareApplication` with name, applicationCategory "FinanceApplication", offers (the free tier), aggregateRating (4.9 from 250k reviews).
- Each section `id` for anchor nav: `#features`, `#how-it-works`, `#pricing`, `#reviews`, `#security`. Add `scroll-mt-20` to each.
- `public/robots.txt` (PART 13 Step C5 / APPENDIX F): disallow `/app/` and `/api/` (app is `noindex` anyway).
- `src/app/sitemap.ts` (APPENDIX F): landing-only (`/` only for single-page).

### 12.3 Performance
- All client components that are heavy (chat demo, charts, dashboard preview) — lazy-load with `next/dynamic` where they're below the fold. Actually keep SSR for SEO on text sections; only the heavy interactive islands below the fold can be dynamic.
- Images: avatars via `next/image` with `width/height`. OG cover served statically.
- Fonts: Geist + Plus Jakarta Sans via `next/font` (already optimized, no layout shift).
- Charts: `React.memo` each chart component. `isAnimationActive` true but single-shot. Use `ResponsiveContainer` from recharts.
- Avoid layout shift: all animated transforms only (transform/opacity), never width/height/top/left. `will-change: transform` on animated layers.
- Bundle: keep `z-ai-web-dev-sdk` out of the client bundle entirely (don't import it).
- Target: LCP < 2.5s, CLS < 0.1, TBT < 200ms on the hero.

---

## PART 13 · HYBRID INTEGRATION (tokens, API, Caddy, app patches)

### 13.1 Step B — Extract design tokens (5 min)

Goal: produce a single `public/tokens.css` that both stacks can import, so colors/fonts/radii match exactly.

1. From `/home/z/my-project`, run:
   ```bash
   awk '/^:root/,/^}/' src/app/globals.css > public/tokens.css
   awk '/^\.light/,/^}/' src/app/globals.css >> public/tokens.css
   ```
2. **Append `@font-face` declarations** for self-hosted fonts (so the app loads identical woff2 files, no FOUT). Add to the bottom of `tokens.css`:
   ```css
   @font-face {
     font-family: 'Plus Jakarta Sans';
     src: url('/fonts/PlusJakartaSans-Variable.woff2') format('woff2-variations');
     font-weight: 500 700;
     font-display: swap;
   }
   @font-face {
     font-family: 'Geist';
     src: url('/fonts/Geist-Variable.woff2') format('woff2-variations');
     font-weight: 100 900;
     font-display: swap;
   }
   @font-face {
     font-family: 'Geist Mono';
     src: url('/fonts/GeistMono-Variable.woff2') format('woff2-variations');
     font-weight: 100 900;
     font-display: swap;
   }
   ```
   Then download the woff2 files and place them at `/home/z/my-project/public/fonts/`. If exact variable woff2 extraction is hard, fall back to the standard Google Fonts `<link>` in the app (acceptable trade-off; document it in worklog).
3. Verify `curl http://localhost:3000/tokens.css` returns the CSS (Next.js serves `public/` at root).

### 13.2 Step C — Add integration routes to the landing (20 min)

These three routes are the bridge between the landing and the app.

#### C1 · `/api/session` and `/api/health`
Create `src/app/api/session/route.ts` per APPENDIX C — reads `session` cookie, verifies server-side, returns `{loggedIn, user}` with `Cache-Control: no-store`.
Create `src/app/api/health/route.ts` per APPENDIX C — returns `{ok: true, ts}`.

#### C2 · `/api/cta` (conversion tracking + cookie pre-seed + redirect)
Create `src/app/api/cta/route.ts` per APPENDIX C — server-side analytics fire, sets `landing_ref` cookie (`Path=/`, `SameSite=Lax`, 30 days), 302-redirects to `/app/${dest}.html`.
Wire every landing CTA to use this route: `<a href="/api/cta?dest=signup&source=hero">Start free</a>`, `…&source=nav`, `…&source=pricing`, `…&source=final-cta`.

#### C3 · `src/proxy.ts` (nonce-based CSP + logged-in header for SSR nav)
Create `src/proxy.ts` per APPENDIX B. It:
- Generates a per-request nonce.
- Sets a strict CSP on the landing (`/`) using the nonce (so Next.js inline runtime scripts work).
- Reads the `session` cookie and sets an `x-logged-in` request header so the landing's server components can SSR the right nav CTA.
- **Matcher excludes `/app/*`, `/api/*`, `/_next/static/*`, `/tokens.css`, `/robots.txt`** — those are served by Caddy or are static, not by Next.js middleware.

#### C4 · Update nav to read login state (SSR + client fallback)
In `src/components/landing/nav.tsx`:
- Make it a server component that reads `headers().get("x-logged-in")` (set by `proxy.ts`). If `"1"`, render "Go to dashboard" (`href="/app/dashboard.html"`) + avatar; else render "Start free" + "Log in".
- Add a client component `<NavSessionSync />` that calls `fetch("/api/session")` on mount and updates the CTA client-side if the SSR guess was wrong.

#### C5 · `robots.txt` + `sitemap.ts`
- Edit `public/robots.txt` per APPENDIX F (disallow `/app/` and `/api/`, allow `/`, sitemap URL).
- Create `src/app/sitemap.ts` per APPENDIX F (landing only — just `/` for the single-page landing).

**Verify after Step C:** `curl http://localhost:3000/api/health` → `{"ok":true}`. `curl http://localhost:3000/api/session` → `{"loggedIn":false}`. `curl -I "http://localhost:3000/api/cta?dest=signup&source=hero"` → 302 to `/app/signup.html`. `curl -I http://localhost:3000/` → CSP header present, `x-logged-in: 0` present.

### 13.3 Step D — Update the Caddyfile (10 min)

Replace `/home/z/my-project/Caddyfile` with the drop-in from **APPENDIX A**. It:
- Keeps `:81` listener (the sandbox gateway) — **DO NOT change this**.
- Keeps the existing `@transform_port_query` / `XTransformPort` block — **DO NOT remove this**.
- **Adds** `/app/api/*` block (if the app has its own backend) → strip `/app`, reverse-proxy to `localhost:8080`.
- **Adds** `handle_path /app/*` block → `file_server` from `./app-public/` (local dev) or `/var/www/app/` (prod). Static asset caching. Permissive CSP for vanilla JS.
- **Keeps** the final `handle` → reverse-proxy to `localhost:3000` with `lb_try_duration 5s` (so Next.js dev restarts don't 502).
- **Adds** `handle_errors` block for custom 502 page.

After editing, run `caddy reload --config /home/z/my-project/Caddyfile` (zero-downtime reload). Verify with `caddy validate --config /home/z/my-project/Caddyfile`.

### 13.4 Step E — Prepare the app folder (THE CRITICAL SAFETY STEP — 15 min)

> **This is where you must not break anything.** The existing app's source lives somewhere — find it first. If it's not in the repo, ask the user where it is. For this prompt, we assume it's at `/path/to/existing-app/`.

1. **Copy (never move) the existing app** to `./app-public/`:
   ```bash
   cp -r /path/to/existing-app /home/z/my-project/app-public
   ```
   Keep the original untouched. We work on the copy.

2. **Inspect the copy.** Find every `index.html`:
   ```bash
   find app-public -name "*.html"
   ```
   If the app is a SPA with one `index.html` + client-side routing, you need `try_files {path} /app/index.html` in the Caddyfile (APPENDIX A — uncomment if needed). If it's a multi-page app (most vanilla apps), leave `try_files` off so Caddy returns real 404s.

3. **Inspect asset paths.** Run:
   ```bash
   grep -rn 'src="/\|href="/' app-public --include="*.html"
   ```
   This lists every absolute path. Examples: `<script src="/js/main.js">`, `<link href="/css/style.css">`.

4. **Apply the THREE additive patches** to each HTML file (idempotent script in APPENDIX D):

   **Patch 1 — `<base href="/app/">`** in `<head>` (before any other `<link>` or `<script>`). This rewrites all *relative* URLs in the document to resolve under `/app/`. Absolute paths starting with `/` need an additional rewrite (see APPENDIX D Strategy 1 vs 2).

   **Patch 2 — design tokens stylesheet** (in `<head>`, after `<base href>`, before the app's own CSS):
   ```html
   <link rel="stylesheet" href="/app/tokens.css">
   ```

   **Patch 3 — SEO meta** (in `<head>`):
   ```html
   <meta name="robots" content="noindex, nofollow">
   <link rel="canonical" href="https://example.com/app/THIS_PAGE.html">
   ```

5. **Favicon:** add `<link rel="icon" href="/app/favicon.ico">` to each HTML `<head>`.

6. **Verify the app still works in isolation:**
   ```bash
   cd app-public && bun serve . -p 8080
   # Open http://localhost:8080/ — app should render EXACTLY as it did before.
   # No broken assets (check DevTools Network tab — all 200s).
   ```
   If anything is broken, your path-rewriting was too aggressive. Restore from the original copy and redo more carefully.

7. **Now verify through Caddy:**
   ```bash
   curl -I http://localhost:81/app/              # → 200, Content-Type: text/html
   curl -I http://localhost:81/app/signup.html   # → 200
   curl http://localhost:81/app/ | head -20      # HTML content
   ```

8. **Document in worklog:** which path-rewrite strategy you used, how many HTML files you patched, any app-specific quirks.

### 13.5 Step F — Dev workflow setup (5 min)

1. Create `Caddyfile.dev` per APPENDIX E (local mirror of prod routing — `:80` listener, `/app/*` → `file_server`, `/` → `localhost:3000`). Do NOT replace the prod `Caddyfile`.
2. Document the 3-terminal dev workflow in worklog (APPENDIX E).

---

## PART 14 · EVERY EDGE CASE & MITIGATION

> The AI agent must anticipate every one of these. Each has a specific mitigation.

### 14.1 Click-flow failures

| Edge case | Mitigation |
|---|---|
| User clicks "Start free" but app is down (Caddy 502 on `/app/*`) | `handle_errors` block in Caddyfile serves custom 502 page (APPENDIX A). Plus: landing's `/api/cta` can check app health first via `/api/health` and fall back to a "we'll be right back" message. |
| Session expired mid-flow | App's backend redirects to `/app/login.html?return_to=/app/dashboard.html`. After re-auth, app redirects back. Landing's `<NavSessionSync>` re-checks `/api/session` on focus/visibilitychange and swaps CTA back to "Start free" if 401. |
| Email magic-link points to `/app/auth?token=...` but user opens in fresh browser | Works fine — token is in URL. App's backend verifies, sets cookie, redirects to `/app/dashboard.html`. If token expired, app shows "request a new link" UI. |

### 14.2 404 handling

| Path | Who handles | Result |
|---|---|---|
| `/app/nonexistent.html` | Caddy `file_server` | Real 404 (not Next.js's 404). Customize via `handle_errors`. |
| `/nonexistent` | Next.js | Next.js 404 page. |
| `/app/nonexistent` (if SPA fallback enabled) | Caddy `try_files` → serves `/app/index.html` with 200 | Soft-404 risk — only enable `try_files` if app truly uses HTML5 history routing. |

### 14.3 Asset path issues (the #1 hybrid gotcha)

- **App uses absolute paths (`<script src="/js/main.js">`):** Breaks at `/app/*` because the browser requests `/js/main.js` which hits Next.js (404).
  - **Fix Strategy 1 (preferred):** Add `<base href="/app/">` AND rewrite absolute paths to relative (`/js/main.js` → `js/main.js`). Careful sed: only target paths starting with `/` but not `//` (protocol-relative) and not `/_next/`.
  - **Fix Strategy 2:** Rewrite absolute paths to prefixed-absolute (`/js/main.js` → `/app/js/main.js`). Verbose but predictable.
- **App uses relative paths (`./js/main.js`):** Works automatically with `<base href="/app/">`. No rewrites.
- **CSS `url(...)` references:** Resolve relative to the CSS file's own URL. `url(./foo.png)` in `/app/css/main.css` → `/app/css/foo.png`. No `<base href>` needed for CSS.
- **App's `fetch('/api/...')`:** Hits Next.js's `/api/*` (the landing's routes). If the app has its own backend, mount it at `/app/api/*` and rewrite the app's fetches to `/app/api/...`.
- **App's `<a href="/">`:** Goes to the landing. ✅ (intended)
- **App's `<a href="/pricing">`:** Goes to landing's `/pricing` — but landing has no `/pricing` route. Fix to `/#pricing`.

### 14.4 Cookies & auth edge cases

| Scenario | Behavior |
|---|---|
| Cookie `Path=/` set by app backend at `/app/api/login` | Sent on all requests to `example.com/*` including landing's `/api/session`. ✅ |
| Cookie `Path=/app` set by app backend | Only sent on `/app/*` — landing's `/api/session` won't see it. ❌ Don't use `Path=/app` for shared auth. Always `Path=/`. |
| `SameSite=Lax` (default) | Cross-site POSTs don't carry the cookie (CSRF protection). Same-site GETs and top-level navigations do. ✅ Correct for Pattern A. |
| `SameSite=None; Secure` | Needed only for cross-site (e.g. third-party iframes). Don't use in Pattern A. |
| `HttpOnly` cookie and WebSocket handshake | Sent if same-origin (Pattern A). ✅ |
| JWT in cookie > 4KB | Browser drops it. Put only the session ID in the cookie, look up the rest server-side. |
| > 50 cookies per domain | Browser drops oldest. Consolidate cookies. |

### 14.5 Font loading flash (FOUT/FOIT)

- Landing uses `next/font` (FOIT-with-swap, self-hosted). App uses Google Fonts `<link>` (FOUT, Google CDN). User navigating landing → app sees a brief font swap.
- **Fix:** Self-host the same woff2 files in `app-public/fonts/` and `@font-face` them in `tokens.css` with `font-display: swap`. Both stacks load identical font files with identical loading behavior → no swap. (APPENDIX D covers this.)
- If exact woff2 extraction is too time-consuming, accept the FOUT and document it. Not a blocker.

### 14.6 Redirect loops

- Caddy `handle_path /app/* { reverse_proxy localhost:8080 }` where `:8080` redirects `/app/foo` back to `/app/foo` — prefix mismatch loop. Fix: app server either (a) serves from a `/app/` folder (so it's prefix-aware) or (b) Caddy strips the prefix and app doesn't redirect using the prefixed URL.
- Next.js `basePath: '/app'` + Caddy `handle_path /app/*` → double-prefix. **Don't use both.** (We use neither — landing stays at `/`, app uses on-disk `/app/` folder.)

### 14.7 Hot reload breaking Caddy routing

- Next.js dev restarts on config change → port 3000 unavailable ~1s → Caddy 502s. Fix: `lb_try_duration 5s` + `lb_try_interval 100ms` on the Next.js reverse_proxy block (APPENDIX A includes this).
- `live-server` reloads on file save → port 8080 briefly unavailable → same 502 risk. Same fix. For `file_server` (serving from disk directly), no restart risk.

### 14.8 Analytics across the boundary

- Pattern A (same origin): same GA4 / PostHog / Mixpanel snippet + same cookie works on both. No `linker` config. ✅
- Server-side conversion tracking at `/api/cta` (APPENDIX C) is most reliable — no ad-blocker loss.

### 14.9 Caddy-specific quirks

- `handle` blocks are mutually exclusive — first match wins. Order: `/app/api/*` → `/app/*` → fallback `/`. ✅ (APPENDIX A is in this order.)
- `handle_path /app/*` strips `/app` for the matched block's internal routing. The `root * /var/www/app` + `file_server` then serves `/var/www/app/<stripped-path>`. So URL `/app/css/main.css` → stripped to `/css/main.css` → served from `/var/www/app/css/main.css`. ✅
- `try_files {path} /app/index.html` — the fallback is a URL path (re-resolved by Caddy). Only enable if app uses SPA routing.
- `file_server -redirects` — disable auto redirect of `/app/foo/` ↔ `/app/foo` if it causes loops. Default behavior is usually fine.
- HTTP/2 to upstream breaks WebSockets — use `http://` (default) for `reverse_proxy`, not `h2c://`. Caddy's default is HTTP/1.1 to upstream.
- `caddy reload` is zero-downtime. Use it for config changes.

### 14.10 Next.js-specific quirks

- `basePath` is build-time only — changing requires rebuild. Don't use it. ✅
- `assetPrefix` for CDN — don't use it for this project. ✅
- `output: 'standalone'` (already in `next.config.ts`) — correct for self-hosting. NOT `output: 'export'` (which would break `/api/*` routes).
- `next/image` with external images needs `images.remotePatterns` config. For this landing, use `next/image` only for avatars (local), or set `images.unoptimized: true`.

### 14.11 Cross-stack quirks

- Landing's `<a href="/app/foo">` → works (same origin, full-page nav). ✅
- App's `<a href="/">` → goes to landing. ✅
- App's `<a href="/pricing">` → 404 (landing has no `/pricing` route). Fix to `/#pricing`.
- Landing's `fetch('/app/api/foo')` → works but conceptually weird (landing calling app's backend). Better: app's backend at `/app/api/*` (APPENDIX A), landing's API at `/api/*`. Both have their own namespaces.
- Service worker on the landing can intercept `/app/*` (same origin). Scope the SW to `start_url: '/'` and only cache landing routes. Don't cache `/app/*` from the SW.

### 14.12 Obscure but real

- `X-Forwarded-For` trust — if a CDN is in front of Caddy, configure `trusted_proxies` to the CDN's IP ranges.
- `localStorage` quota ~5MB per origin — use IndexedDB for larger.
- Browser back button after `/api/cta` 302 → goes to previous landing page (not the API route). ✅
- `POST` form across boundary (Pattern A) — same origin, no CORS preflight, cookie sent. ✅
- `<iframe>` of app inside landing — same origin, full DOM access. Only if you want to embed; otherwise full-page nav is cleaner.
- `robots.txt` at `/robots.txt` — served by Next.js (`public/robots.txt`). Caddy's `/app/*` block doesn't intercept. ✅
- `favicon.ico` at `/favicon.ico` — served by Next.js. App's HTML should `<link rel="icon" href="/app/favicon.ico">` to show the app's own favicon on app pages.
- `<base href="/app/">` affects `<form action="">` — empty action becomes `/app/`. Usually fine, verify form submissions.
- `<base href="/app/">` affects `<a href="#anchor">` — becomes `/app/#anchor`, not `/app/current-page.html#anchor`. Usually fine for in-page anchors.

---

## PART 15 · BUILD ORDER (execute top to bottom)

> Each step depends on the previous. Verify each before moving on. Total estimated time: 6-8 hours focused.

### STEP 0 · Prep (5 min)
- Read this entire prompt. Re-read PART 2 (hard rules) and PART 5 (design system).
- `cat /home/z/my-project/worklog.md` to see prior context.
- Confirm `bun run dev` is running on port 3000 (`tail -f dev.log`).

### STEP A · Build the landing page (3-4 hours)

- **A1 · Foundation (15 min):** Edit `src/app/globals.css` (design tokens PART 5.1, 5.2, keyframes PART 9.1, scrollbar PART 11.4, base layer). Edit `src/app/layout.tsx` (add Plus Jakarta Sans via `next/font`, add `ThemeProvider` from `next-themes` with `attribute="class" defaultTheme="dark"`, update `metadata` per PART 12.2, add JSON-LD `SoftwareApplication` schema). Verify page loads, dark theme active, no console errors.
- **A2 · Data + bits (20 min):** Create `src/lib/landing-data.ts` (ALL mock data — PART 10). Create `src/lib/use-chat-cycle.ts` (zustand store). Create `src/components/bits/`: `aurora.tsx`, `magnetic-button.tsx`, `count-up.tsx`, `glass-card.tsx`, `section-heading.tsx`, `ticker.tsx`, `insight-card.tsx`, `chat-demo.tsx` (self-cycling AI chat demo with 4 example Q&A pairs per PART 10.2).
- **A3 · Charts (20 min):** Create `src/components/charts/`: `mini-sparkline.tsx`, `spending-area.tsx`, `net-worth-line.tsx`, `cashflow-bar.tsx`, `allocation-donut.tsx`, `spending-treemap.tsx`, `forecast-combo.tsx`. Each `React.memo`, `ResponsiveContainer`, `isAnimationActive`, our palette, 1.4s draw-in.
- **A4 · Nav + scroll progress (15 min):** `src/components/landing/nav.tsx` (sticky, theme toggle, mobile Sheet, scroll shadow, microcopy strip). `src/components/landing/scroll-progress.tsx` (top 2px gradient bar).
- **A5 · Hero (30 min):** `src/components/landing/hero.tsx` — rotating headline (3 phrases via `AnimatePresence`), live `ChatDemo`, 3D tilted dashboard with browser chrome + mini KPIs + area chart, 3 floating satellite glass cards, scroll-linked tilt flatten, count-up stats, emerald+gold aurora.
- **A6 · Sections 3-6 (40 min):** `trust-marquee.tsx` (press logos infinite marquee + 5 stats count-up), `problem.tsx` (3 pain points), `how-it-works.tsx` (3 steps with watermark numbers), `bento-features.tsx` (7 tiles, AI Copilot large tile with mini chat inside, hover corner glow).
- **A7 · Sections 7-9 (40 min):** `ai-copilot-deepdive.tsx` (full chat transcript + 4 rich response card types: Insight/Forecast/Action/Alert), `chart-showcase.tsx` (6 animated 3D-tilted chart cards), `dashboard-preview.tsx` (browser-framed full app mockup with sidebar + KPIs + charts + floating insight cards + radial glow).
- **A8 · Sections 10-12 (25 min):** `integrations.tsx` (10-12 bank/brokerage SVG wordmarks grid), `security.tsx` (4 trust items + 4 badge tiles + quote), `testimonials.tsx` (6 quantified-outcome cards with avatars).
- **A9 · Sections 13-16 (30 min):** `pricing.tsx` (3-tier with monthly/annual `layoutId` toggle, Pro "Most Popular" gold ribbon + emerald glow pulse), `faq.tsx` (8 items shadcn `Accordion`), `final-cta.tsx` (big glowing CTA), `footer.tsx` (4 cols + badges + legal, `mt-auto` sticky).
- **A10 · Compose (10 min):** `src/app/page.tsx` is a server component that composes all 16 sections in order. Root wrapper `min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`. Footer `mt-auto`.
- **A11 · Assets (15 min):** Generate `public/og-cover.png` (1200×630 dark charcoal + emerald aurora + "FinCopilot" wordmark) and 6 testimonial avatars via the `image-generation` skill. Create inline SVG wordmarks for press + integrations (monochrome, colorize to `--accent` on hover). No broken images.

**Verify after Step A:** Run `agent-browser open http://localhost:3000/`. Full page renders, all 16 sections in order, no overlap, no console errors, theme toggle works, mobile menu opens, charts animate, chat demo cycles. Run `bun run lint` — clean.

### STEP B · Extract design tokens (5 min) — see PART 13.1

### STEP C · Add integration routes to the landing (20 min) — see PART 13.2

### STEP D · Update the Caddyfile (10 min) — see PART 13.3

### STEP E · Prepare the app folder (15 min — CRITICAL SAFETY) — see PART 13.4

### STEP F · Dev workflow setup (5 min) — see PART 13.5

### STEP G · QA with agent-browser (30 min — MANDATORY)

> "It compiles" is not done. Browser-verified interactivity is the standard.

1. **Open the landing:** `agent-browser open http://localhost:3000/`. Wait for full load. Screenshot desktop (1440×900) and mobile (390×844). Check: 16 sections render in order, no overlap, no white screen, no error boundary, no hydration mismatch in console.

2. **Test landing interactions:** Click nav links (smooth-scroll), theme toggle (palette switches), pricing monthly/annual toggle (prices swap + count-up), FAQ accordion (expands), mobile menu (sheet opens), magnetic CTAs (cursor pull), chat demo (cycles through 4 examples). Verify count-up stats animate on scroll. Verify charts draw-in on scroll.

3. **Test the hybrid boundary:**
   - Click "Start free" on the landing → should navigate to `/app/signup.html` (via `/api/cta` 302). Verify the app page renders correctly (same fonts, no broken assets). Check Network tab: zero CORS errors, zero 404s, all assets 200.
   - In the app, click any "Back to home" / logo link → should return to `/` (landing). Verify the landing's nav now shows "Go to dashboard" if the app set a session cookie during the flow (or "Start free" if not).
   - Check `document.cookie` in the console on both sides — the `landing_ref` cookie set by `/api/cta` is readable on both landing and app (same origin, `Path=/`).
   - Check `localStorage` — set a key on the landing, read it on the app. Works (same origin).

4. **Test edge cases (PART 14):**
   - `/app/nonexistent.html` → 404 (Caddy's `file_server` returns real 404, not Next.js's 404).
   - `/nonexistent` → Next.js 404 page.
   - `/api/health` → `{"ok":true}`.
   - `/api/session` → `{"loggedIn":false}` (or true if cookie set).
   - `/robots.txt` → landing's robots.txt content (disallow `/app/`).
   - `/sitemap.xml` → landing-only sitemap.
   - `/tokens.css` → CSS content (200).
   - Restart Next.js → during the ~1s restart, `/` returns 502 briefly; Caddy's `lb_try_duration 5s` should retry and recover within 5s.

5. **Run `bun run lint`:** Must be clean (zero errors, zero warnings).

6. **Check `dev.log`** for any errors/warnings introduced by your changes.

7. **Lighthouse (optional but recommended):** Target: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on the landing.

### STEP H · Deploy runbook (documented, not executed in sandbox)

1. **Build the landing:**
   ```bash
   cd /home/z/my-project
   bun run build         # produces .next/standalone/server.js + .next/static
   cp -r .next/static .next/standalone/.next/
   cp -r public .next/standalone/
   ```

2. **Sync design tokens to app:**
   ```bash
   cp public/tokens.css /var/www/app/tokens.css
   ```

3. **Deploy the app** (no build):
   ```bash
   rsync -avz --delete /path/to/existing-app/ /var/www/app-new/
   # Apply the 3 HTML patches to /var/www/app-new/ (script it)
   ln -sfn /var/www/app-new /var/www/app   # atomic symlink swap — zero downtime
   ```

4. **Deploy the landing:**
   ```bash
   cp -r .next/standalone /var/www/landing
   systemctl restart landing   # the `bun /var/www/landing/server.js` process
   ```

5. **Reload Caddy:**
   ```bash
   caddy validate --config /etc/caddy/Caddyfile
   caddy reload --config /etc/caddy/Caddyfile
   ```

6. **Verify prod:**
   ```bash
   curl -I https://example.com/         # 200, CSP header, x-logged-in
   curl -I https://example.com/app/     # 200, Cache-Control, CSP
   curl https://example.com/api/health  # {"ok":true}
   ```

7. **Rollback if needed:**
   ```bash
   ln -sfn /var/www/app-prev /var/www/app
   systemctl restart landing
   ```

---

## PART 16 · QUALITY GATES (MUST PASS BEFORE "DONE")

### Landing (Step A)
- [ ] Dark mode default; light mode toggles cleanly (no flash).
- [ ] NO blue, NO indigo anywhere (`grep -rn "blue-\|indigo-\|#3B82F6\|#6366f1" src/` → zero).
- [ ] Hero headline rotates through 3 phrases smoothly.
- [ ] Every primary CTA is emerald; gold reserved for Pro/highlights only.
- [ ] Charts use only the 5-color chart palette.
- [ ] Compact spacing — no section uses `py-32`+, no card uses `p-8`+.
- [ ] Footer sticks to bottom on short viewport; pushes down on long pages.

### Hybrid integration (Steps B-E)
- [ ] `public/tokens.css` exists and `curl http://localhost:3000/tokens.css` returns CSS.
- [ ] `/api/session` returns `{"loggedIn":false}` (or true with cookie).
- [ ] `/api/cta?dest=signup&source=hero` returns 302 to `/app/signup.html` and sets `landing_ref` cookie.
- [ ] `/api/health` returns `{"ok":true}`.
- [ ] `src/proxy.ts` sets CSP header with nonce on `/` and `x-logged-in` header.
- [ ] `public/robots.txt` disallows `/app/` and `/api/`.
- [ ] `src/app/sitemap.ts` lists `/` only.
- [ ] Caddyfile updated (APPENDIX A); `caddy validate` passes; `caddy reload` succeeds.
- [ ] App copied to `./app-public/` (original untouched).
- [ ] App HTML patched (3 additive patches per Step E); app loads at `/app/` through Caddy with zero broken assets.
- [ ] App's existing functionality works exactly as before.

### Code quality
- [ ] `bun run lint` — zero errors, zero warnings.
- [ ] `bun run dev` — zero console errors, zero hydration warnings in `dev.log`.
- [ ] No `any` types, no `@ts-ignore`, no `TODO` (except documented `verifyJwt` TODO), no `Lorem ipsum`.
- [ ] No broken images; all SVGs render.
- [ ] No `z-ai-web-dev-sdk` in client components.
- [ ] All client components marked `'use client'`.
- [ ] `page.tsx` is a server component composing client islands.

### Accessibility
- [ ] Keyboard: tab through nav, CTAs, accordion, toggle, theme — all reachable, focus visible.
- [ ] `prefers-reduced-motion` disables animations.
- [ ] All images have `alt`; all icon-only buttons have `aria-label`.
- [ ] Lighthouse a11y ≥ 95.

### agent-browser verification (MANDATORY)
- [ ] Landing renders fully (no white screen, no error boundary, no hydration crash).
- [ ] Desktop screenshot shows all 16 sections in order, no overlap.
- [ ] Mobile screenshot shows clean single-column stack.
- [ ] "Start free" in nav/hero/pricing/final-CTA all navigate to `/app/signup.html` (via 302).
- [ ] Nav links smooth-scroll.
- [ ] Theme toggle switches palette.
- [ ] Pricing toggle swaps prices.
- [ ] FAQ expands.
- [ ] Chat demo cycles.
- [ ] App at `/app/` renders correctly with same fonts as landing (no FOUT visible).
- [ ] Navigating landing → app → back to landing works; nav CTA updates based on cookie.
- [ ] `dev.log` shows no new errors after the visit.

---

## PART 17 · WORKLOG & HANDOVER PROTOCOL

### 17.1 Before starting
Read `/home/z/my-project/worklog.md` (prior research + decisions).

### 17.2 During work
Append progress to `worklog.md` after each major step (A, C, D, E, G). Don't wait until the end — avoid progress loss.

### 17.3 After completion
Append a final section to `worklog.md` using this template (start with `---`):

```markdown
---
Task ID: <next number>
Agent: <agent name>
Task: Execute FinCopilot_MASTER_PROMPT.md — build landing + integrate with existing HTML/CSS/JS app

Work Log:
- <concrete step 1>
- <concrete step 2>
- ...

Stage Summary:
- Landing: <status — built? sections complete? agent-browser verified?>
- Hybrid integration: <status — tokens.css extracted? /api/* routes? Caddyfile? app-public/ prepared?>
- Path-rewrite strategy used: <which option from Step E>
- App files patched: <count>
- Edge cases encountered: <list>
- Unresolved issues / risks for next phase: <list>
- Deploy runbook location: <link to worklog section>
```

### 17.4 Worklog three-section structure (recommended)
1. **Current project status** — what's built, what's integrated, what works.
2. **Current goals / completed modifications / verification results** — what you changed, what you verified, what passes/fails the quality gates.
3. **Unresolved issues or risks, priority recommendations for next phase** — what's left, what to do next.

---

## APPENDIX A · FULL CADDYFILE (drop-in)

> Replace `/home/z/my-project/Caddyfile` with this. Keeps the existing `:81` listener and `XTransformPort` mechanism. Adds `/app/api/*`, `/app/*`, custom error pages. Uses `./app-public` as the app root (local dev). For prod, change to `/var/www/app`.

```caddy
:81 {
    encode zstd gzip

    # --- (0) Existing sandbox mechanism: XTransformPort query routing to any mini-service port.
    # KEEP THIS BLOCK UNCHANGED — used by the sandbox gateway for mini-services.
    @transform_port_query {
        query XTransformPort=*
    }
    handle @transform_port_query {
        reverse_proxy localhost:{query.XTransformPort} {
            header_up Host {host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
            header_up X-Real-IP {remote_host}
        }
    }

    # --- (1) Optional: the app's own backend, if it has one. Strip /app prefix.
    # If the app is purely static, DELETE this block. Otherwise, set the upstream port.
    @appApi path /app/api/*
    handle @appApi {
        uri strip_prefix /app
        reverse_proxy localhost:8080 {
            header_up Host {host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
            header_up X-Real-IP {remote_host}
            lb_try_duration 5s
            lb_try_interval 100ms
        }
    }

    # --- (2) The static HTML/CSS/JS app at /app/*
    # Files physically live at ./app-public/ (local dev) or /var/www/app/ (prod).
    handle_path /app/* {
        root * /home/z/my-project/app-public

        # Multi-page app: serve the file or 404 (no SPA fallback).
        # If the app uses HTML5 history routing, uncomment the next line:
        # try_files {path} /app/index.html
        file_server

        # Caching: short TTL for static (no content hashing in vanilla app)
        @static path *.css *.js *.woff *.woff2 *.png *.jpg *.jpeg *.webp *.avif *.svg *.ico
        header @static Cache-Control "public, max-age=86400"
        @html path *.html /
        header @html Cache-Control "no-cache, must-revalidate"

        # Security headers (permissive CSP for vanilla JS)
        header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.posthog.com https://www.google-analytics.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
        header X-Frame-Options "DENY"
        header X-Content-Type-Options "nosniff"
        header Referrer-Policy "strict-origin-when-cross-origin"
        header Permissions-Policy "camera=(), microphone=(), geolocation=()"
    }

    # --- (3) Everything else → Next.js landing (existing behavior, preserved)
    handle {
        reverse_proxy localhost:3000 {
            header_up Host {host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
            header_up X-Real-IP {remote_host}
            lb_try_duration 5s
            lb_try_interval 100ms
        }
    }

    # --- (4) Custom error pages (so 502 doesn't show Caddy's default)
    handle_errors {
        @502 expression {err.status_code} == 502
        handle @502 {
            root * /home/z/my-project/public/errors
            rewrite /502.html
            file_server
        }
    }
}
```

> **For production** (real domain with auto-TLS), replace `:81 {` with `example.com {` and Caddy auto-provisions Let's Encrypt. Keep the body identical.

---

## APPENDIX B · FULL proxy.ts (Next.js middleware)

> Next.js 16 uses `proxy.ts` (formerly `middleware.ts`). If your version still expects `middleware.ts`, name the file that — same content.

```ts
// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' blob: data: https:`,
    `font-src 'self' https://fonts.gstatic.com`,
    `connect-src 'self' https://api.posthog.com https://www.google-analytics.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-nonce", nonce);
  reqHeaders.set("Content-Security-Policy", csp);

  // Read session cookie and set x-logged-in for SSR nav rendering
  const session = req.cookies.get("session");
  reqHeaders.set("x-logged-in", session ? "1" : "0");

  const res = NextResponse.next({ request: { headers: reqHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  // Run on everything EXCEPT: Next.js internals, static, api, app, tokens.css, robots.txt
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|app|tokens.css|robots.txt|sitemap.xml).*)"],
};
```

---

## APPENDIX C · API ROUTE SPECS

### C1 · `GET /api/session`

```ts
// src/app/api/session/route.ts
import { cookies } from "next/headers";

export async function GET() {
  const c = (await cookies()).get("session");
  if (!c) {
    return Response.json({ loggedIn: false }, {
      headers: { "Cache-Control": "no-store" },
    });
  }
  try {
    const user = await verifyJwt(c.value); // { email, name, id }
    return Response.json({ loggedIn: true, user }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ loggedIn: false }, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}

// NOTE: verifyJwt must match the app's session format.
// If the app uses an opaque session ID stored in DB, look it up here.
// If the app uses a JWT, verify with the same secret the app uses.
async function verifyJwt(token: string) {
  // TODO(app): implement — see worklog Task 3 §4.2
  return { email: "demo@fincopilot.ai", name: "Demo", id: "demo" };
}
```

### C2 · `GET /api/cta`

```ts
// src/app/api/cta/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const dest = req.nextUrl.searchParams.get("dest") || "signup";
  const source = req.nextUrl.searchParams.get("source") || "unknown";

  // 1. Server-side analytics (no ad-blocker loss). Wire to GA4 MP / Mixpanel / PostHog.
  // await fetch(`https://www.google-analytics.com/mp/collect?...`, { ... });

  // 2. Cookie pre-seed (the app can read this to personalize onboarding)
  const res = NextResponse.redirect(new URL(`/app/${dest}.html`, req.url), 302);
  res.cookies.set("landing_ref", source, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
```

### C3 · `GET /api/health`

```ts
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ ok: true, ts: Date.now() });
}
```

---

## APPENDIX D · tokens.css EXTRACTION + APP HTML PATCH SCRIPT

### D1 · Extract (Step B)

```bash
cd /home/z/my-project
awk '/^:root/,/^}/' src/app/globals.css > public/tokens.css
awk '/^\.light/,/^}/' src/app/globals.css >> public/tokens.css
# Then manually append @font-face declarations (see PART 13.1)
```

### D2 · Copy to app

```bash
cp /home/z/my-project/public/tokens.css /home/z/my-project/app-public/tokens.css
```

### D3 · Patch app HTML (Step E 4) — idempotent script

For each `*.html` in `app-public/`, insert into `<head>` (after `<head>` tag, before any `<title>`):

```bash
for f in $(find /home/z/my-project/app-public -name "*.html"); do
  name=$(basename "$f")
  # Skip if already patched (idempotent)
  if grep -q '<base href="/app/"' "$f"; then continue; fi
  # Insert after <head> (case-insensitive)
  sed -i -E "s|<head>|<head>\n  <base href=\"/app/\">\n  <link rel=\"stylesheet\" href=\"/app/tokens.css\">\n  <meta name=\"robots\" content=\"noindex, nofollow\">\n  <link rel=\"canonical\" href=\"https://example.com/app/$name\">\n  <link rel=\"icon\" href=\"/app/favicon.ico\">|i" "$f"
done
```

### D4 · Path rewrite (Step E 4 — choose ONE strategy)

**Strategy 1 (if app uses absolute paths `/js/main.js`):** rewrite to prefixed-absolute:
```bash
# Careful: only single-slash absolute paths, not protocol-relative //
# And not /_next/, /api/, /app/ (already prefixed)
for f in $(find /home/z/my-project/app-public -name "*.html"); do
  sed -i -E 's|src="/(js/|css/|img/|fonts/|assets/)|src="/app/\1|g' "$f"
  sed -i -E 's|href="/(js/|css/|img/|fonts/|assets/|favicon)|href="/app/\1|g' "$f"
done
```
Adjust the `(js/|css/|img/|...)` group to match the app's actual asset folder names.

**Strategy 2 (if app uses relative paths `./js/main.js` or `js/main.js`):** `<base href="/app/">` handles it. No rewrite needed.

**Verify after:** Open `app-public/index.html` in a browser via `http://localhost:81/app/`. DevTools Network tab — all asset requests are 200, none are 404 to `/js/...` (without `/app/`).

---

## APPENDIX E · DEV CADDYFILE + RUNBOOK

> `Caddyfile.dev` is for the user's local dev outside the sandbox. The sandbox already uses `Caddyfile` (`:81`).

```caddy
# Caddyfile.dev — local dev mirror of prod routing
{
    auto_https off
}

:80 {
    handle_path /app/* {
        root * ./app-public
        file_server
    }

    handle {
        reverse_proxy localhost:3000 {
            header_up Host {host}
            lb_try_duration 5s
            lb_try_interval 100ms
        }
    }
}
```

Run:
```bash
# Terminal 1
cd /home/z/my-project && bun run dev

# Terminal 2 (optional, for app hot reload)
cd /home/z/my-project/app-public && npx live-server --port=8080

# Terminal 3
caddy run --config /home/z/my-project/Caddyfile.dev
# Open http://localhost/ → landing; http://localhost/app/ → app
```

---

## APPENDIX F · robots.txt + sitemap.ts

### F1 · `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /app/
Disallow: /api/

Sitemap: https://example.com/sitemap.xml
```

### F2 · `src/app/sitemap.ts`

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://example.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Add more landing routes here if you add them in the future.
    // Do NOT add /app/* routes — they're noindex.
  ];
}
```

---

## APPENDIX G · ONE-LINE BRIEF

> Build the FinCopilot landing page per PARTS 5-10 (16 sections, dark-mode-first, charcoal+emerald+gold, NO blue). Then make it coexist with the existing vanilla HTML/CSS/JS app on the **same domain via subpath**: `example.com/` = Next.js landing (port 3000), `example.com/app/*` = static app served by Caddy's `file_server` from `./app-public/` (copy of the existing app, original untouched). Extract `public/tokens.css` from `globals.css` so both stacks share design tokens. Add `/api/session`, `/api/cta` (302 redirect + cookie pre-seed + analytics), `/api/health` routes. Add `proxy.ts` for nonce-based CSP + `x-logged-in` SSR header. Update `Caddyfile` (drop-in from APPENDIX A) — keep `:81` + `XTransformPort`, add `/app/api/*` + `/app/*` blocks. Patch the app's HTML with three additive lines (`<base href="/app/">`, `<link href="/app/tokens.css">`, `<meta name="robots" content="noindex">` + canonical) — no existing app code modified. Same auth cookie `Path=/` `SameSite=Lax` shared by both. Verify end-to-end with agent-browser. Write worklog to `/home/z/my-project/worklog.md`.

---

## APPENDIX H · DO-NOT-FORGET LIST

1. ❌ Don't modify existing app source (except 3 additive HTML patches). ✅ Copy to `./app-public/` first.
2. ❌ Don't use `basePath` or `assetPrefix` on Next.js. ✅ Landing at `/`.
3. ❌ Don't use `output: 'export'` (breaks `/api/*`). ✅ Keep `output: 'standalone'`.
4. ❌ Don't remove the `:81` listener or `XTransformPort` block from Caddyfile. ✅ Keep them, add new blocks.
5. ❌ Don't use `SameSite=None`. ✅ `SameSite=Lax` (default).
6. ❌ Don't use `Path=/app` for auth cookie. ✅ `Path=/`.
7. ❌ Don't put JWT/API keys in client JS. ✅ Server-side only.
8. ❌ Don't use blue/indigo. ✅ Emerald + gold + charcoal.
9. ❌ Don't use `bun run build` for dev. ✅ `bun run dev`.
10. ❌ Don't say "it compiles = done". ✅ agent-browser verification mandatory.
11. ❌ Don't mix path-rewrite strategies (base href + prefixed-absolute). ✅ Pick one, document it.
12. ❌ Don't forget `lb_try_duration 5s` on the Next.js reverse_proxy. ✅ Smooths dev restarts.
13. ❌ Don't enable `try_files` SPA fallback unless the app actually uses HTML5 history routing. ✅ Real 404s for multi-page apps.
14. ❌ Don't forget `noindex` on every app HTML page. ✅ Belt + suspenders with `robots.txt Disallow: /app/`.
15. ❌ Don't forget to extract `tokens.css` and link it in the app. ✅ Design consistency.
16. ❌ No pure black. ✅ #0A0F0D charcoal.
17. ❌ No pure white text. ✅ rgba(255,255,255,0.92).
18. ❌ No `py-32`+ / `p-8`+ padding. ✅ Compact.
19. ❌ No `z-ai-web-dev-sdk` in client. ✅ Mock data only.
20. ❌ No `TODO`/placeholder/lorem. ✅ Real copy from this doc.

---

**END OF MASTER UNIFIED PROMPT.** Now go execute PART 15 (Build Order) in order. No shortcuts. No improvisation on the architecture or design system. Make it work end-to-end, verify with agent-browser, write the worklog. The existing app must come out the other side unchanged in behavior — only additive patches in its HTML head. The landing must be premium, animated, and conversion-ready. Both must feel like one product.
