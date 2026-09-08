# Implementation checkpoint ? 2026-09-08

Workspace: `C:/Fincopilot`, branch `fix/launch-readiness`. User upload changes preserved. Audit baseline remains commit `98f8d023831eed4a4e80960efeafb2316efc9f0c`.

**Not release-ready. Full 76-finding remediation is unfinished. No deployment or push performed.**

## Implemented changes

- Removed landing secret from Git tracking (local file retained). Public source archive and internal audit documents moved to recoverable workspace quarantine. Exposed credential still requires provider rotation; repository history remains affected.
- Restricted demo seed to explicit development flag; development auth bypass now requires explicit flag and existing live user. Deleted users denied access; auth database error details no longer returned.
- Fixed Clerk SDK token/profile calls. Session revocation checks user ownership and preserves current session for all-other requests. Provider failures propagate.
- Exact paise parser, strict calendar validation, debit/credit column handling, malformed CSV rejection, CSV size/row limits, zero-confidence preservation, uncertain unsigned direction review, tighter EMI/transfer recognition.
- Denied/pending/expired/invalid-expiry consent rejected.
- Added missing coverage engine; truthful coverage inputs and safe-to-spend remain open.
- Replaced port-selectable gateway with fixed app/API routing. Added Docker ignore rules; root start/dev/test paths corrected.
- Removed frontend manual token cache and automatic seed-user bypass. CountUp settles on original amount.
- Migration runner uses one released connection and a PostgreSQL advisory lock; runtime concurrency integration test still pending.

## Verification

`node --test tests/launch-sessions.test.js tests/launch-normalization.test.js` from backend: **7 passed, 0 failed**. Tests cover malformed amounts/dates, CSV debit and credit, uncertain direction, zero confidence, denied/expired consent, foreign-session rejection and current-session preservation. Session tests use stub adapters and an explicit unusable local database URL; no live user data mutated.

Frontend `npm run build`: JavaScript compilation passed; TypeScript failed with 41 diagnostics in Money, Plan and You (unknown response envelopes and implicit-any callback parameters). Build checks remain enabled. Full frontend/runtime flow verification pending.

## Next work

1. Replace Plan module-global data and conditional hooks; implement typed API contracts and honest loading/error/empty states across Money/Plan/You. Then rerun production build.
2. Finish import account binding, object verification, replay protection, job leases and idempotent row persistence.
3. Reconciliation inclusion rules and anchored balances; remove fabricated financial calculations and UI fixtures.
4. Finish exports/deletion workers, consent enforcement, goal/recurring mutations, forecast and AI confirmation contracts.
5. Dependency locks/advisories, deployment topology, CI and recovery verification.

The audit F56 claim that connection disconnection must receive a source connection ID needs correction: current controller intentionally accepts an account ID and resolves its connection. Other F56 UI/control issues remain.

## Finding ledger

No grouped finding is marked fully closed without its complete acceptance gate.

| ID | Finding | Status |
|---|---|---|
| F01 | Tracked authentication secret and public source archive | implemented in part; full closure pending |
| F02 | Production-reachable demo seed deletes user financial data | implemented in part; full closure pending |
| F03 | Backend cannot boot: coverage engine is missing | implemented in part; full closure pending |
| F04 | Frontend dependency manifest cannot build its imported components | open |
| F05 | Landing production build fails type checking | open |
| F06 | Docker build references four absent npm lockfiles | open |
| F07 | Container omits app server and workers; gateway targets obsolete SPA | open |
| F08 | Root gateway allows user-selected localhost ports | implemented in part; full closure pending |
| F09 | Clerk adapter and profile lookup use nonexistent SDK members | implemented in part; full closure pending |
| F10 | Session revocation lacks session ownership validation | implemented in part; full closure pending |
| F11 | Denied consent is accepted as granted | implemented in part; full closure pending |
| F12 | Privacy controls are not coherently enforced across ingestion and AI | open |
| F13 | Export and deletion stop at PROCESSING records | open |
| F14 | Soft-deleted users remain authorized; first-login creation races | implemented in part; full closure pending |
| F15 | Deletion schema does not cover all identity-bearing records | open |
| F16 | Import initiation never links the account required by normalization | open |
| F17 | Import confirmation accepts replay and unverified object state | open |
| F18 | Job claims have no safe lease or recovery | open |
| F19 | CSV debit/credit columns can reverse or erase money | implemented in part; full closure pending |
| F20 | UPI merchant purchases are classified as transfers | implemented in part; full closure pending |
| F21 | Invalid dates and malformed amounts become valid transactions | implemented in part; full closure pending |
| F22 | Zero confidence is promoted to certainty and review flags do not reliably gate posting | implemented in part; full closure pending |
| F23 | PDF import is advertised but extraction is unimplemented | open |
| F24 | Partial row persistence and retries lack end-to-end deduplication | open |
| F25 | Spreadsheet/CSV processing lacks resource and completeness limits | implemented in part; full closure pending |
| F26 | Cloudflare Queue request does not match the API contract | open |
| F27 | Symmetric duplicate relationships are labelled conflicts | open |
| F28 | Relationships do not update financial inclusion flags | open |
| F29 | Worker repeatedly scans recent rows and can starve older transactions | open |
| F30 | Refund and transfer matching need stronger money/currency/account evidence | open |
| F31 | Caught row SQL errors can invalidate the enclosing transaction | open |
| F32 | Balances are transaction deltas without opening-balance anchors | open |
| F33 | Safe-to-spend omits essential obligations and invents freshness/coverage | open |
| F34 | Income/spending/category queries apply inconsistent inclusion rules | open |
| F35 | Liabilities and net-worth history use wrong inputs | open |
| F36 | Category assignment and budget recalculation are disconnected | open |
| F37 | Goal mutation contracts lack ownership/idempotency/computed-state consistency | open |
| F38 | Detected recurring series cannot enter the supported confirmation flow | open |
| F39 | Cashflow projects only one future occurrence and can double suppress schedules | open |
| F40 | Health and recurring summaries use inconsistent periods and invented availability | open |
| F41 | Forecast uses arbitrary snapshot types and leaks future information into backtests | open |
| F42 | Forecast arithmetic omits income, risks double-counting commitments and emits numbers on weak data | open |
| F43 | Evaluation metrics and persistence do not support release claims | open |
| F44 | Provider selection/fallback/cancellation are not implemented as configured | open |
| F45 | Context tools and intent routing can answer a different question | open |
| F46 | Confirmation endpoint does not bind action to original user-approved proposal | open |
| F47 | Numerical validator is too narrow and inconsistent with tool field names | open |
| F48 | Budget/rate controls can race and do not reconcile actual cost | open |
| F49 | Sixteen app routes import demo financial/security data | open |
| F50 | Dashboard fabricates insight and chart; Money fabricates positions and exchange rate | open |
| F51 | Plan page violates React hook ordering and assumes incompatible forecast envelope | open |
| F52 | New Goal dialog reports success without making any request | open |
| F53 | Onboarding falsely reports import/connection completion | open |
| F54 | Affordability fallback fabricates a positive recommendation | open |
| F55 | Export page creates jobs on mount and marks unfinished exports ready | open |
| F56 | Security, privacy and connections controls do not perform represented actions | open |
| F57 | App data hook hides failures and triggers excessive unrelated calls | implemented in part; full closure pending |
| F58 | Search mixes mock records with real responses and permits stale-response races | open |
| F59 | Forecast page multiplies an already-paise balance by100 | open |
| F60 | Money animations never settle on the exact amount | implemented in part; full closure pending |
| F61 | Plan savings/debt widgets present assumed outcomes as actual progress | open |
| F62 | Financial formatting, date ranges and chart edge cases are inconsistent | open |
| F63 | Primary controls and transaction browsing are incomplete | open |
| F64 | Custom modal and interactive financial visuals need keyboard/focus/motion support | open |
| F65 | Landing promises capabilities absent from the app | open |
| F66 | Landing CTAs and legal links redirect to nonexistent app paths | open |
| F67 | Peer benchmarks and engagement features lack evidence | open |
| F68 | Preferences and consent update contracts break for new users | open |
| F69 | Telemetry can fail a completed business operation and does not reliably redact PII | open |
| F70 | No executable release pipeline or demonstrated recovery path | open |
| F71 | Existing test runner and reports do not establish current release quality | implemented in part; full closure pending |
| F72 | Architecture/closure reports contradict current implementation | open |
| F73 | Untrusted Excel parser uses an affected SheetJS package line | open |
| F74 | Duplicated UI libraries and inactive infrastructure widen the maintenance surface | open |
| F75 | Fresh dependency resolution reports security advisories beyond the parser | open |
| F76 | Migration runner leaks an initial client and lacks a migration lock | implemented in part; full closure pending |
