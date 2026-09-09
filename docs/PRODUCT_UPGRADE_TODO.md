# Product upgrade: preserve, improve, connect

User direction: 2026-09-08. Preserve existing layouts, cards, animations, responsiveness and feature sections. Fix or improve existing features instead of removing them. Work in C:/Fincopilot / Antigravity. Frontend first, then settings, backend/database, then commit/push. Deployment and domain setup are explicitly deferred by the user. Keep verification to required build and release checks.

## Current work
- [x] Locate original You design at 98f8d02 and restore its profile hero, achievement cards, badges, milestones, security ring and settings groups.
- [x] Connect restored You growth cards to backend and sign-in checklist to actual Clerk factors.
- [x] Expand sidebar to 26 destinations in four groups; rename navigation with clear descriptions.
- [x] Add keyboard quick search and complete mobile all-tools dialog.
- [x] Persist appearance/density/notification preferences; restore security and connection cards with real actions.
- [x] Account-specific import selection, consistent upload MIME, file size/type checks and auth-ready loading.
- [ ] Complete membership and integration services; current controls explicitly report unavailable services rather than navigating to nonexistent pages.
- [ ] Restore and improve the original Plan card/layout language with per-user data and correct hook order.
- [ ] Restore the richer original settings subsection layouts while retaining new working security/privacy/connection actions.

## Main screens: inspect existing, preserve, extend, wire
- [ ] Dashboard / Today at a glance
- [ ] Money overview
- [ ] Accounts and account details
- [ ] Transactions, import status, review and transaction details
- [ ] Spending lens and category detail
- [ ] Income streams
- [ ] Cashflow pulse
- [ ] Plan and budgets
- [ ] Goals and contributions
- [ ] Bills and recurring confirmations
- [ ] Debt roadmap
- [ ] Forecast and scenario explorer
- [ ] Financial fitness
- [ ] Copilot home, chat, purchase checks and savings analysis
- [ ] Search
- [ ] Data confidence
- [ ] Help and support
- [ ] Onboarding and sign-in transitions

## Settings
- [ ] Profile and achievements visual completion
- [ ] Preferences, theme and notification choices
- [ ] Membership and billing state from real provider evidence
- [ ] Integrations and connection status from actual configured services
- [ ] Privacy consent and inventory
- [ ] Security and sessions
- [ ] Export and deletion flows

## Release integration
- [ ] Landing design, honest feature descriptions, and working CTAs
- [ ] Remaining audit issues: all 76 tracked in original findings.json; no blanket closure
- [ ] Full frontend/backend contract alignment
- [ ] PostgreSQL migrations, worker lifecycle, opening balance anchors and financial inclusion rules
- [ ] Provider setup, credential rotation, dependency advisories and deployment configuration
- [ ] Required build checks and release readiness review
- [ ] Commit, push and merge only verified integrated changes; record actual outcome
- Deployment/domain/hosting: skipped for now at the user's request; do not provision or deploy.

Design references: https://m3.material.io/foundations/layout/canonical-examples/overview and https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html . Use existing emerald/gold identity, responsive density, meaningful icons, visible focus and reduced-motion support.


## Implementation checkpoint: main-screen pass in progress
These are implemented changes, not blanket completion of the sections above.

| Screen | Implemented in the current working tree | Still required before closing the section |
| --- | --- | --- |
| Sidebar | 26 destinations, grouped navigation, keyboard tool finder, short mobile labels, all-tools dialog | Browser review at desktop/mobile widths |
| Dashboard | Nested API contracts, partial-panel failures/retry, real recent-activity chart, working shortcuts; sample alerts removed | Opening balance support, trustworthy safe-to-spend dependencies, visual review |
| Accounts | Real account cards, creation form, search/type filters, per-account imports, account-detail balance contract | Opening balances and verified import freshness |
| Activity journal | Real transaction response adapter, pagination, direction/account filters, current-page search, upload validation | Import job progress and review workflow, transaction detail review |
| Spending lens | Real category aggregation, offsets, searchable category records, original chart retained | Category detail contract and period-boundary verification |
| Income streams | Real source aggregation, posted income total, source record counts, useful actions | Period-boundary verification and visual review |
| Goals | Live cards, safe progress calculation, search/status filters, creation refresh | Goal detail now includes safe progress, manual contribution form and actual history; end-to-end validation remains |
| Bills | Live series mapping, monthly equivalents, status filter, actual detection refresh; original cards retained | Confirm/dismiss/pause actions and unknown amount handling in summary |
| Budgets | Limit adjustments, period selector, usage bars, remaining/over-limit amounts, status overview | Recalculation consistency with ledger, lifecycle actions |
| Copilot | Live insights, true empty states, suggestions, real chat answers/errors, auth-switch result fencing | Insight detail, confirmations, purchase/savings tools, provider readiness |
| Search | Debounced authoritative account-scoped results, stale-request cancellation, real session history, goal search | Server query performance and keyboard/visual review |
| Help | Expandable task guides, working privacy link, issue-template copy, development-only sample-data control | Actual support destination remains unconfigured |

Verification so far: incremental TypeScript checks passed through the main-screen changes preceding the latest account-detail edit; backend syntax checks passed for the financial controller/repository and AI routes. A production frontend build is now being run. No live production database migration, deployment, merge or push has been performed during this pass.

Build checkpoint: production compilation and TypeScript succeeded, but prerendering /ai caught an undefined pre-load list. Fixed the loading-state guards in Copilot and dashboard. Re-running the production build after that correction and the account/goal detail wiring.


## Resume checkpoint: 2026-09-09
- [x] Recover previous implementation: it was committed on fix/launch-readiness (3796f19), while Antigravity had switched to main (9ed44ec).
- [x] Integrate fix/launch-readiness into main without conflicts; preserve main's Vercel-oriented Next.js output setting.
- [x] Build the merged frontend: production compile, TypeScript and all 32 static pages passed.
- [x] Previously isolated PostgreSQL checks: 25 migrations, upload/normalization flow, account binding, lease fencing, deduplication, category/income tenant isolation and India month-end inclusion passed.
- Cashflow history, debt activity, forecast response mapping and financial fitness UI are now included in the recovered branch. Financial fitness retains its cards and peer section; unavailable peer evidence is labelled explicitly.
- [ ] Validate the new cashflow history query against isolated PostgreSQL; not covered by the earlier category/income check.
- [ ] Finish Plan restoration, data confidence, detail/review flows and remaining settings listed above. Do not mark these complete based on successful compilation.
- [ ] Export must stop creating jobs on mount and must distinguish queued exports from ready files; worker delivery remains to be completed.
- [ ] Restore Privacy's original visual structure with actual consent history and clear deletion/retention semantics.
- [ ] Resolve opening balances, provider configuration, audit blockers and deployment readiness before calling the app launch-ready.

No production database migration or live deployment was performed in this resume pass. The merged build is verified; the full product TODO remains open.
