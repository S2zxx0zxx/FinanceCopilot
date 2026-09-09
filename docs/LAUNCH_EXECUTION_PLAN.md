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
