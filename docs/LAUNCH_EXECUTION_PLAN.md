# FinanceCopilot completion plan

Status: IN PROGRESS. Existing layouts and features must be improved, not removed to conceal incomplete functionality. Main already contains the recovered upgrades. Compilation alone does not establish launch readiness.

## Completion rules
- A user action is complete only when ownership/authentication, persistence, response mapping, loading/error/empty states and retry behavior are handled.
- Monetary values use integer paise, explicit dates/timezones and traceable records. Missing data is not zero or a fabricated confidence score.
- Preserve desktop/mobile cards and navigation. Review keyboard access, narrow widths, reduced motion and long content.
- Changes stay in C:/Fincopilot. Commit reviewable checkpoints; never reset existing changes.
- External-service readiness needs observed evidence, not the existence of environment variables. Never record secrets in this document.

## Execution order and acceptance checklist
| ID | Workstream | Concrete remaining deliverables | Completion evidence | Status |
| --- | --- | --- | --- | --- |
| F01 | Plan | Restore substantial planning dashboard; correct recurring/budget/forecast contracts; separate resource failures; actual goal progress and upcoming dates; useful action links | Type check, real contract review, responsive preview | Active |
| F02 | Activity | Owned import-job progress, retry/review states, transaction details and corrections, explicit posted/review inclusion | Import-to-reviewed-ledger isolated flow | Open |
| F03 | Accounts and home | Opening-balance model with effective date, validation and user controls; no double counting; truthful safe-to-spend dependencies and sync freshness | Boundary/ownership/aggregation checks | Open |
| F04 | Spending and budgets | Category detail contract; current-period recalculation; edit/delete lifecycle and period boundaries | Refund/review/timezone checks | Open |
| F05 | Goals and bills | Contribution retry validation; lifecycle feedback and details; unknown amount handling | Owned mutation and retry checks | Open |
| F06 | Copilot | Insight detail, proposed-action confirmations, purchase/savings tools, consent enforcement and provider failures | Actual provider/config readiness plus bounded contract checks | Open |
| F07 | Forecast and health | Reliable feature queries, unavailable inputs, scenario explorer, remove fabricated backend peer comparisons | Calculation/insufficient-data evidence | Open |
| F08 | Data confidence | Source coverage and reconciliation, honest record provenance, actionable missing-data states | Data-to-screen mapping | Open |
| S01 | Export | Generate actual bounded export artifacts, owned download, lifecycle status, retries and expiry | Request-to-download round trip | Open |
| S02 | Privacy and deletion | Retention enforcement; deletion worker and full related-data/object cleanup; truthful completion status | Isolated deletion with tenant isolation | Open |
| S03 | Preferences/security | Notification event preferences enforced by delivery; auth-switch safety, sessions and integrations readiness | Delivery filter and ownership checks | Open |
| U01 | UI/UX | All sidebar destinations, landing links, mobile/desktop layout, focus/keyboard, reduced motion, existing assets | Route/viewport checklist with observed results | Open |
| B01 | Workers | Normalization lease recovery, retry/DLQ behavior, crash recovery and idempotent persistence | Isolated crash/retry checks | Open |
| B02 | Security/audit | Reconcile all original findings; credential rotation/history response, dependency advisories, PII logs, atomic AI rate limiting | Finding-by-finding status and evidence | Open |
| B03 | Database | Fresh migrations and upgrade path, constraints/indexes, connection pools, production backup/restore and migration plan | Isolated checks first; production results separately recorded | Open |
| L01 | Launch | Resolve Docker/Vercel output mismatch; identify existing deployment target; service config, migration, health, rollback, custom domain | Deployed URL and actual health evidence | External target unresolved |

## Checks already established
- Recovered work merged and pushed through 30a665e.
- Previous merged frontend production build passed; latest UI changes passed TypeScript.
- Isolated PostgreSQL: 25 migrations, ingestion/normalization, deduplication, ownership, cashflow periods and month-end aggregation passed.
- Production database migration, export delivery and live deployment have NOT been established.

## Audit closure
Original audit findings remain the coverage baseline. Each finding must be mapped to a patch, a demonstrated nonissue or an explicit unresolved prerequisite. No broad checkbox closes multiple unreviewed findings.

## Reconciled main checkpoint
- Main fast-forwarded to 3c1dfe0, preserving merged Setu and achievement work. Current changes are local; user will push.
- F01: planning overview, partial resource failures, goal filters and recurring contract mapping implemented; final visual review remains.
- F02: owned latest-30 import progress and failed-only replay implemented. Review/correction workflow remains open.
- B01: normalization leases now actively reclaimed with three-attempt bound; expired workers fenced before ledger writes; audit failure cannot reject a committed transaction. Isolated recovery checks passed.
- F07: fabricated peer cohort/median constants now unavailable explicitly; personal metric calculation review remains open.
- Verification: current main production frontend build passed TypeScript and 34 static pages. Isolated PostgreSQL applied 28 migration files and passed imports, normalization, stale leases, duplicate prevention, tenant isolation, month-end and cashflow checks.
- No production migration, deployment or push was performed in this checkpoint. Export delivery, deletion, opening balances and remaining workstreams above are still open.

## Screen-by-screen visual upgrade scope
Preserve existing features, cards and information. Upgrade layout, spacing, hierarchy, long-text handling, keyboard focus, touch targets, reduced motion and truthful chart data on every route. Balance cards use a shared dimensional account-card design with masked account suffixes and hide/show controls; no invented card details or bank-network affiliation.

- [ ] Today/dashboard: credit-card summary, real cashflow and category charts, responsive quick actions.
- [ ] Money: shared balance treatment; correct balance/coverage semantics and real historical chart.
- [ ] Accounts/list/detail/connect: responsive card collection, account actions and connection states.
- [ ] Activity/detail: responsive record tables, import status, review workflow and transaction evidence.
- [ ] Spending/income: actual category/source charts and accessible numeric alternatives.
- [ ] Plan/budgets/goals/detail/bills: progress, allocation and calendar visualizations from saved records.
- [ ] Forecast/health/liabilities/coverage: distinguish recorded, estimated and unavailable data; readable uncertainty.
- [ ] Copilot/home/chat/insight/purchase/leaks: consistent cards, safe actions and responsive conversation.
- [ ] Search/help: keyboard-friendly results, guides and useful navigation.
- [ ] You/preferences/security/privacy/connections/export: preserve existing rich layouts, consistent action hierarchy.
- [ ] Sign-in/sign-up/onboarding and landing: mobile form/layout, loading/error and navigation review.
- [ ] Final viewport audit: 360px, 768px and desktop; keyboard, reduced motion and long values.

Started: reusable 3D balance-card component with pointer lighting, restrained tilt, reduced-motion handling, private amount toggle, real account suffix and responsive typography; integrated into Account vault while preserving search, filters, creation and statement import.

Visual implementation checkpoint: Today, Money, Accounts, Account detail, Income, Budgets and Goals now use the new balance treatment and/or recorded-value charts. Search, creation, imports, account details and existing goal/budget cards remain. Money now uses auth-scoped resources and explicit partial failure states instead of zero-balance fallbacks. TypeScript passed. Authenticated browser preview requires sign-in; visual viewport review has not been claimed. Remaining screens and backend work remain open.

## Verified continuation checkpoint
- Current main includes the merged premium dashboard at 174f79b; no feature-branch commits discarded.
- Transaction detail maps actual API fields and provides corrections plus explicit review confirmation. Review mutations check ownership/direction/type, preserve source records, and atomically write audit records. Activity exposes a needs-review filter.
- Export delivery is implemented for JSON/CSV records and PDF inventory summaries, with an authenticated owned download, 24-hour artifact expiry, lease recovery, bounded size and record limits. Monetary paise fields export as strings. Requires migration 028_export_delivery.sql and the worker process in the target environment.
- Export status now displays actual byte-derived file size and server failure/expiry feedback.
- Deletion request is atomic and idempotent: queue failure rolls back account disabling. Actual provider/object/database purge and grace-period recovery remain OPEN.
- Isolated PostgreSQL evidence: all 29 migration files applied; import, normalization recovery, review, JSON/CSV/PDF delivery, unauthorized download, expiry cleanup and deletion-request rollback checks passed. Latest TypeScript passed.
- Fresh dependency audit attempt failed because the npm advisory endpoint disconnected. This is NOT an audit pass; the earlier install reported 9 advisories requiring reconciliation.
- Final full-codebase review is still pending until the remaining execution workstreams above are completed. Production migration/deployment and authenticated viewport verification have not been performed.
