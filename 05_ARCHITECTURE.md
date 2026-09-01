# Architecture — AI Financial Life Manager

**Version:** 1.0  
**Status:** APPROVED BASELINE  
**PRD Reference:** Sections 12, 15, 16, 17, 34, 56, 89  
**Last Updated:** 2026-08-22

---

## 1. Architecture Decision

**Modular Monolith + Adapter-based Infrastructure**

### Rationale
- Fastest path to correctness at V1 scale
- Single deployment artifact (lower operational complexity)
- Domain boundaries enforced by code structure, not network
- Provider adapters enable future migration without domain rewrites
- No premature splitting until evidence requires it (PRD Section 56)

### What This Means
- All backend domains live in a single process / deployment unit
- Domains communicate via in-process function calls through interfaces
- External providers are accessed only through adapter interfaces
- Database is a single PostgreSQL instance with schema-level isolation
- Worker jobs run as separate processes but share the same codebase

---

## 2. Master Architecture Diagram

```
┌─────────────────────────────────────────────┐
│ EXPERIENCE PLANE                            │
│ HTML • CSS • JS ES Modules                  │
│ Pages / Views / Components / Feature Mods  │
│ State Layer • API Client • Analytics        │
│ Offline / Freshness / Skeleton States       │
└──────────────────────┬──────────────────────┘
                       │ HTTPS only
                       ↓
┌─────────────────────────────────────────────┐
│ API / BFF / AUTH BOUNDARY                   │
│ Auth Middleware • Authorization             │
│ Schema Validation • Rate Limiting           │
│ Request ID • Correlation ID • Tracing       │
│ Error Normalization • Pagination            │
│ Idempotency Keys (mutations)                │
└──────────────────────┬──────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────┐
│ FINANCE / DATA PLANE (Modular Monolith)     │
│                                             │
│  identity   consent   ingestion             │
│  normalization   merchant   categorization  │
│  reconciliation  ledger  financial-state    │
│  recurring  commitments  goals  forecast    │
│                                             │
│ Domain interfaces (no direct DB from UI)    │
└──────────────────────┬──────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────┐
│ AI / AGENT PLANE                            │
│ Intent Classifier • Risk Classifier         │
│ Context Planner • Tool Registry             │
│ Policy Engine • Model Router (OmniRouter)   │
│ Evidence Validator • Safety Validator       │
│ Cost Governor • Memory Boundaries           │
│ ai-gateway domain module                    │
└──────────────────────┬──────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────┐
│ IDENTITY / CONSENT PLANE                    │
│ identity domain • consent domain            │
│ Sessions • Permissions • Privacy            │
│ Export / Delete Workflows • Audit           │
└──────────────────────┬──────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────┐
│ CONTROL PLANE                               │
│ Requirements • Tasks • ADRs • Flags         │
│ Releases • Budgets • Docs • Agent Govern.   │
│ /control/*.yaml • execution-log.jsonl       │
└──────────────────────┬──────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────┐
│ OPERATIONS / OBSERVABILITY                  │
│ Structured Logs • Metrics • Traces          │
│ Alerts • SLOs • Audit Events • Cost         │
│ Incidents • Backups • Runbooks              │
└──────────────────────┬──────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────┐
│ DATA INFRASTRUCTURE                         │
│ PostgreSQL (canonical financial state)      │
│ Object Storage / R2 (raw uploaded files)    │
│ Queue / Workers (async jobs)                │
│ Optional: Read Models / Search Index        │
└──────────────────────┬──────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────┐
│ PROVIDER ADAPTERS                           │
│ AuthProvider (Firebase adapter)             │
│ AIProvider (OmniRouter adapter)             │
│ StorageProvider (Cloudflare R2 adapter)     │
│ QueueProvider (Cloudflare Queues adapter)   │
│ NotificationProvider (adapter)             │
│ ObservabilityProvider (adapter)            │
└─────────────────────────────────────────────┘
```

---

## 3. Frontend Architecture

### Structure

```
src/
├── pages/                    # Top-level page entry points
│   ├── home.js
│   ├── money.js
│   ├── plan.js
│   ├── ai.js
│   ├── you.js
│   └── onboarding/
│       ├── splash.js
│       ├── welcome.js
│       ├── trust.js
│       ├── goal-setup.js
│       ├── data-connection.js
│       ├── connection-flow.js
│       ├── first-sync.js
│       └── first-value.js
│
├── components/               # Reusable UI components (see Design System)
│   ├── hero-financial-state.js
│   ├── safe-to-spend.js
│   ├── money-metric-card.js
│   ├── attention-item.js
│   ├── transaction-row.js
│   ├── transaction-detail.js
│   ├── account-card.js
│   ├── insight-card.js
│   ├── goal-card.js
│   ├── forecast-chart.js
│   ├── spending-story.js
│   ├── evidence-block.js
│   ├── confidence-badge.js
│   ├── freshness-badge.js
│   ├── coverage-badge.js
│   ├── data-state-badge.js
│   ├── sync-status.js
│   ├── bottom-sheet.js
│   ├── action-sheet.js
│   ├── filter-sheet.js
│   ├── search.js
│   ├── skeleton.js
│   ├── empty-state.js
│   ├── error-recovery.js
│   ├── toast.js
│   ├── modal.js
│   └── confirmation.js
│
├── layouts/
│   ├── app-shell.js          # Bottom nav, safe areas
│   ├── page-layout.js        # Standard page wrapper
│   └── auth-layout.js        # Unauthenticated pages
│
├── features/                 # Feature-level modules
│   ├── onboarding/
│   ├── home/
│   ├── money/
│   │   ├── accounts/
│   │   ├── transactions/
│   │   └── spending/
│   ├── plan/
│   │   ├── goals/
│   │   ├── recurring/
│   │   └── forecast/
│   ├── ai/
│   │   ├── conversation/
│   │   ├── insights/
│   │   └── tools/
│   ├── profile/
│   │   ├── privacy/
│   │   ├── security/
│   │   └── settings/
│   └── shared/
│
├── state/                    # Client-side state management
│   ├── auth.state.js         # Auth state (user, session)
│   ├── ui.state.js           # UI state (active tab, modals)
│   ├── draft.state.js        # Draft/form state
│   └── server-cache.js       # Response cache with freshness
│
├── api/                      # API client — ONLY way UI talks to backend
│   ├── client.js             # Base HTTP client (auth headers, error norm)
│   ├── financial.api.js      # Financial state endpoints
│   ├── transactions.api.js   # Transaction endpoints
│   ├── import.api.js         # Import endpoints
│   ├── ai.api.js             # AI Gateway endpoints
│   ├── goals.api.js          # Goals endpoints
│   ├── forecast.api.js       # Forecast endpoints
│   ├── accounts.api.js       # Account endpoints
│   └── user.api.js           # User/profile endpoints
│
├── services/                 # Non-API client services
│   ├── router.js             # Client-side routing
│   ├── analytics.js          # Analytics (pseudonymous)
│   ├── notifications.js      # Push notification client
│   └── offline.js            # Offline detection / cache
│
├── utils/
│   ├── format-money.js       # Indian number format (₹ lakhs)
│   ├── format-date.js        # Date formatting (IST)
│   ├── format-number.js      # Tabular number formatting
│   └── dom.js                # DOM utilities
│
├── security/
│   ├── csp.js                # Content Security Policy helpers
│   └── sanitize.js           # Input sanitization (display only)
│
├── analytics/
│   └── events.js             # Event schema (pseudonymous, no raw finance)
│
├── styles/
│   ├── tokens.css            # ALL CSS custom properties
│   ├── base.css              # Reset, html/body, font-face
│   ├── typography.css        # Text utility classes
│   ├── components.css        # Shared component styles
│   ├── utilities.css         # Spacing, layout utilities
│   └── animations.css        # Keyframes, transitions
│
├── config/
│   ├── env.js                # Environment config (public vars only)
│   ├── feature-flags.js      # Feature flag reader
│   └── constants.js          # App-level constants
│
├── assets/
│   ├── icons/                # SVG icons
│   └── fonts/                # Self-hosted fonts (Inter)
│
└── tests/
    ├── components/
    ├── features/
    └── utils/
```

### Frontend Rules (NON-NEGOTIABLE)

1. UI never accesses PostgreSQL
2. UI never performs authoritative financial calculations
3. UI never decides authorization
4. UI never calls LLM providers directly
5. UI never implements reconciliation
6. UI never owns provider credentials
7. Server state, auth state, UI state, draft state, derived display state = DISTINGUISHABLE
8. Avoid global mutable state
9. Prefer event delegation
10. Feature-level lazy loading
11. Charts are lazy-loaded
12. Bound all DOM work — no unbounded renders

---

## 4. Backend Architecture

### Structure

```
backend/
├── server.js                 # Entry point
├── app.js                    # Express/CF worker app setup
│
├── api/                      # Route handlers (thin controllers)
│   ├── v1/
│   │   ├── auth.routes.js
│   │   ├── financial-state.routes.js
│   │   ├── transactions.routes.js
│   │   ├── accounts.routes.js
│   │   ├── import.routes.js
│   │   ├── reconciliation.routes.js
│   │   ├── goals.routes.js
│   │   ├── forecast.routes.js
│   │   ├── ai.routes.js
│   │   ├── recurring.routes.js
│   │   ├── notifications.routes.js
│   │   ├── export.routes.js
│   │   └── user.routes.js
│   └── health.routes.js
│
├── middleware/
│   ├── auth.middleware.js     # Token validation
│   ├── authz.middleware.js    # Authorization (scopes, ownership)
│   ├── validate.middleware.js # Schema validation
│   ├── rate-limit.middleware.js
│   ├── request-id.middleware.js  # request_id + trace_id injection
│   ├── error.middleware.js    # Error normalization
│   └── idempotency.middleware.js
│
├── domains/                  # The modular monolith — each domain is isolated
│   ├── identity/
│   │   ├── identity.service.js
│   │   ├── identity.repository.js
│   │   └── identity.errors.js
│   ├── consent/
│   │   ├── consent.service.js
│   │   ├── consent.repository.js
│   │   └── consent.schema.js
│   ├── ingestion/
│   │   ├── ingestion.service.js
│   │   ├── ingestion.pipeline.js
│   │   ├── ingestion.repository.js
│   │   ├── parsers/
│   │   │   ├── pdf.parser.js
│   │   │   ├── csv.parser.js
│   │   │   ├── excel.parser.js
│   │   │   └── ocr.parser.js
│   │   ├── validators/
│   │   │   ├── file.validator.js
│   │   │   └── record.validator.js
│   │   └── ingestion.errors.js
│   ├── normalization/
│   │   ├── normalization.service.js
│   │   ├── normalization.repository.js
│   │   └── normalization.rules.js
│   ├── merchant/
│   │   ├── merchant.service.js
│   │   ├── merchant.repository.js
│   │   └── merchant.resolver.js
│   ├── categorization/
│   │   ├── categorization.service.js
│   │   └── category.taxonomy.js
│   ├── reconciliation/
│   │   ├── reconciliation.service.js
│   │   ├── duplicate.engine.js
│   │   ├── transfer.engine.js
│   │   ├── settlement.engine.js
│   │   ├── pending-posted.engine.js
│   │   ├── reconciliation.repository.js
│   │   └── reconciliation.invariants.js
│   ├── ledger/
│   │   ├── ledger.service.js
│   │   ├── ledger.repository.js
│   │   └── ledger.calculations.js
│   ├── financial-state/
│   │   ├── financial-state.service.js
│   │   ├── safe-to-spend.engine.js
│   │   ├── financial-state.repository.js
│   │   └── financial-state.snapshots.js
│   ├── recurring/
│   │   ├── recurring.service.js
│   │   ├── recurring.detector.js
│   │   └── recurring.repository.js
│   ├── commitments/
│   │   ├── commitments.service.js
│   │   └── commitments.repository.js
│   ├── goals/
│   │   ├── goals.service.js
│   │   └── goals.repository.js
│   ├── forecast/
│   │   ├── forecast.service.js
│   │   ├── forecast.engine.js
│   │   ├── forecast.repository.js
│   │   └── forecast.evaluator.js
│   ├── ai-gateway/
│   │   ├── ai-gateway.service.js
│   │   ├── intent.classifier.js
│   │   ├── risk.classifier.js
│   │   ├── context.planner.js
│   │   ├── tool.registry.js
│   │   ├── policy.engine.js
│   │   ├── evidence.validator.js
│   │   ├── safety.validator.js
│   │   ├── cost.governor.js
│   │   └── memory.manager.js
│   ├── notifications/
│   │   ├── notifications.service.js
│   │   └── notifications.repository.js
│   ├── export/
│   │   ├── export.service.js
│   │   └── export.repository.js
│   ├── deletion/
│   │   ├── deletion.service.js
│   │   └── deletion.policy.js
│   └── audit/
│       ├── audit.service.js
│       └── audit.repository.js
│
├── db/
│   ├── connection.js         # PostgreSQL connection pool
│   ├── migrations/           # Numbered migration files
│   │   └── 001_initial_schema.sql
│   └── seeds/                # Development seed data (never production)
│
├── workers/                  # Background job processors
│   ├── import.worker.js
│   ├── reconciliation.worker.js
│   ├── forecast.worker.js
│   ├── notifications.worker.js
│   └── ai-insight.worker.js
│
├── adapters/                 # Provider adapters — never domain logic here
│   ├── ai/
│   │   ├── ai.interface.js   # interface definition
│   │   └── omnirouter.adapter.js
│   ├── auth/
│   │   ├── auth.interface.js
│   │   └── firebase.adapter.js
│   ├── storage/
│   │   ├── storage.interface.js
│   │   └── r2.adapter.js
│   ├── queue/
│   │   ├── queue.interface.js
│   │   └── cf-queues.adapter.js
│   ├── notifications/
│   │   ├── notifications.interface.js
│   │   └── fcm.adapter.js
│   └── observability/
│       ├── observability.interface.js
│       └── cf-analytics.adapter.js
│
└── tests/
    ├── unit/
    ├── integration/
    ├── fixtures/             # Finance regression fixtures (PRD Section 48)
    └── evals/                # AI evaluation tests
```

---

## 5. Database Architecture

**Engine:** PostgreSQL  
**Precision:** All monetary values stored as INTEGER (paise/paisa — 1/100th of ₹)  
**Time Zone:** All timestamps in UTC. Display in IST (UTC+5:30). Timezone explicit everywhere.

See `06_DOMAIN_MODEL.md` for full entity definitions.  
See `control/db-schema-map.yaml` for machine-readable schema state.

### Key Rules
1. Raw imported records are IMMUTABLE
2. Canonical records are auditable
3. Corrections preserve provenance
4. Currency is explicit on every monetary column
5. Floating point is FORBIDDEN for money
6. Timezone is explicit on every timestamp
7. Financial mutations use DB transactions
8. Reprocessing is idempotent (upsert patterns)

---

## 6. API / BFF Architecture

Single versioned API: `/api/v1/`

The BFF is the ONLY boundary the client crosses.

**Responsibilities:**
- Authentication (validate JWT)
- Authorization (check scopes, ownership)
- Schema validation (input)
- Rate limiting (per user, per endpoint)
- Request ID + Correlation ID injection
- Domain service orchestration
- Stable view model assembly
- Error normalization (never expose internals)
- Pagination enforcement
- Idempotency keys (relevant mutations)

See `08_API_CONTRACTS.md` for all endpoint contracts.

---

## 7. Provider Adapter Pattern

Every provider must implement a documented interface:

```javascript
// Example — AI Provider Interface
export const AIProviderInterface = {
  // Required methods
  chat: async (messages, options) => Response,
  classify: async (text, categories) => Classification,
  embed: async (text) => Embedding,

  // Required metadata
  name: String,
  version: String,
  healthCheck: async () => Boolean,
};
```

**Adapter requirements:**
- timeout
- retry policy (bounded — no infinite retries)
- failure mode (graceful degradation)
- observability (latency, errors tracked)
- cost attribution (token counting)
- migration path documented
- exit strategy documented

---

## 8. Queue / Worker Architecture

Job priority tiers:

| Priority | Jobs |
|----------|------|
| HIGH | User import, statement parsing, reconciliation |
| MEDIUM | Forecast refresh, notifications |
| LOW | AI insight generation, analytics, enrichment |

Every job requires:
- `job_id`
- `idempotency_key`
- `attempt`
- `max_attempts`
- `last_error`
- `next_retry_at`
- `correlation_id`
- Dead-letter / replay support

---

## 9. Security Architecture Overview

See `11_SECURITY_PRIVACY.md` for full specification.

Key rules:
- No secrets in client bundle
- No secrets in model context
- No raw financial values in ordinary logs
- Server-side authorization on every request
- Rate limiting on all public endpoints
- Encrypted transport (TLS only)
- Encrypted sensitive data at rest

---

## 10. Deployment Architecture

**Phase 0–V1 Target:**

```
Cloudflare Workers / Node.js
    ↓
Single modular monolith deployment
    ↓
PostgreSQL (managed, e.g., Neon / Supabase / PlanetScale / self-hosted)
    ↓
Cloudflare R2 (object storage for uploaded files)
    ↓
Cloudflare Queues (async jobs)
```

**Do NOT introduce** Kubernetes, Kafka, or multiple microservices until measurable evidence requires them (PRD Section 56).

---

## 11. Feature Flag Architecture

Feature flags are managed via `control/feature-flags.yaml`.

Required flags for V1:
- `forecast.enabled`
- `ai.enabled`
- `ai.conversation.enabled`
- `import.pdf.enabled`
- `import.ocr.enabled`
- `import.voice.enabled`
- `money-leaks.enabled`
- `what-if-simulator.enabled`

AI/forecast features must be behind flags to allow safe rollback.

---

## 12. Routing Architecture (Frontend)

Client-side routing via hash or History API.

```
/                    → Home (SCR-08)
/money               → Money Overview (SCR-10)
/money/accounts      → Accounts (SCR-11)
/money/accounts/:id  → Account Detail (SCR-12)
/money/transactions  → Transactions (SCR-13)
/money/transactions/:id → Transaction Detail (SCR-14)
/money/spending      → Spending Story (SCR-17)
/money/income        → Income (SCR-33)
/money/credit        → Credit & Liabilities (SCR-34)
/plan                → Plan (SCR-23)
/plan/goals          → Goals (SCR-24)
/plan/goals/:id      → Goal Detail (SCR-25)
/plan/recurring      → Recurring (SCR-19)
/plan/upcoming       → Upcoming (SCR-20)
/plan/cashflow       → Cashflow (SCR-21)
/plan/forecast       → Forecast (SCR-22)
/plan/health         → Financial Health (SCR-27)
/ai                  → AI Home (SCR-28)
/ai/chat             → AI Conversation (SCR-29)
/ai/afford           → Can I Afford This? (SCR-31)
/ai/leaks            → Money Leaks (SCR-32)
/ai/simulator        → What-if Simulator (SCR-26)
/you                 → Profile (SCR-36)
/you/connections     → Connections (SCR-35)
/you/privacy         → Privacy (SCR-39)
/you/security        → Security (SCR-40)
/you/data            → Data & Export (SCR-41)
/you/notifications   → Notifications (SCR-38)
/you/preferences     → Preferences (SCR-37)
/you/settings        → Settings / About (SCR-47)
/search              → Global Search (SCR-45)
/onboarding/splash   → Splash (SCR-00)
/onboarding/welcome  → Welcome (SCR-01)
/onboarding/trust    → Trust & Privacy (SCR-02)
/onboarding/goals    → Goal Setup (SCR-03)
/onboarding/connect  → Data Connection (SCR-04)
/onboarding/import   → Connection Flow (SCR-05)
/onboarding/syncing  → First Sync (SCR-06)
/onboarding/value    → First Value (SCR-07)
```

---

## 13. Architecture Boundaries — NEVER CROSS

| Rule | Violation |
|------|-----------|
| UI → DB | FORBIDDEN |
| UI → LLM Provider | FORBIDDEN |
| UI → reconciliation | FORBIDDEN |
| UI → financial calc | FORBIDDEN |
| Domain → Provider (direct) | FORBIDDEN |
| AI → financial truth | FORBIDDEN (read-only via tools) |
| Agent → production data without approval | FORBIDDEN |
| V1 external financial side effects | DISABLED |

---

## 14. Architecture Evolution Path

```
V1: Modular monolith
     ↓ (evidence: independent scale needed)
V2: Extract high-load domains (ingestion, AI gateway)
     ↓ (evidence: team/compliance isolation needed)
V3: Full service separation where justified
```

Never split before evidence.
