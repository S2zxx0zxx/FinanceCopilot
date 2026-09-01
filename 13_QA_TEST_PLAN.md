# QA & Test Plan

**Version:** 1.0  
**Status:** Phase 0 — Defined, Not Implemented  
**PRD Reference:** Sections 47, 48, 49  
**Last Updated:** 2026-08-22

---

## 1. Test Pyramid

```
                        ┌─────────────────┐
                        │  Chaos/Recovery  │  (Phase 12)
                       ┌┴─────────────────┴┐
                       │    Performance     │  (Phase 12)
                      ┌┴────────────────────┴┐
                      │   AI Evaluation       │  (Phase 9+)
                     ┌┴──────────────────────┴┐
                     │   Security Tests        │  (Phase 1+)
                    ┌┴────────────────────────┴┐
                    │     E2E Tests             │  (Phase 6+)
                   ┌┴──────────────────────────┴┐
                   │   API Contract Tests        │  (Phase 2+)
                  ┌┴────────────────────────────┴┐
                  │   Integration Tests           │  (Phase 2+)
                 ┌┴──────────────────────────────┴┐
                 │  Domain / Reconciliation Tests  │  (Phase 4+)
                ┌┴────────────────────────────────┴┐
                │   Property / Invariant Tests      │  (Phase 3+)
               ┌┴──────────────────────────────────┴┐
               │        Unit Tests                   │  (Phase 1+)
              ┌┴────────────────────────────────────┴┐
              │      Static / Lint / Types            │  (Phase 0+)
              └──────────────────────────────────────┘
```

---

## 2. Test Types

### 2.1 Static / Lint
- ESLint (financial rule extensions)
- No eval()
- No hardcoded credentials
- No direct DB access from frontend
- No direct AI provider calls from frontend
- Money value type validation (must be integer paise)
- CSS token compliance (no hardcoded values)

### 2.2 Unit Tests
- Pure functions: money formatters, date utilities, currency arithmetic
- Domain logic: category rules, duplicate detection logic, transfer detection
- Validation: file validators, input schemas
- Normalization rules: merchant resolution, canonicalization
- Safe-to-Spend formula components

### 2.3 Property / Invariant Tests
- All reconciliation invariants (INV-001 through INV-010)
- Amount must always be positive integer (paise)
- Transfer pairs must always balance
- Duplicate records must never be deleted
- Safe-to-Spend must be deterministic for same inputs
- Forecast range: low ≤ mid ≤ high always

### 2.4 Domain / Reconciliation Tests
- Finance regression fixture suite (see Section 3)
- Every edge case in `07_LEDGER_RECONCILIATION_SPEC.md`
- Idempotency tests (re-run same import = same output)
- Correction audit trail tests
- Review queue routing tests

### 2.5 Integration Tests
- Import pipeline end-to-end (file → source_record)
- Normalization pipeline (source_record → transaction)
- Reconciliation pipeline (transactions → reconciled state)
- Ledger balance computation
- Safe-to-Spend computation
- Forecast computation
- AI Gateway tool execution
- Notification delivery

### 2.6 API Contract Tests
- Every endpoint in `08_API_CONTRACTS.md`
- Request schema validation
- Response schema validation
- Error response format
- Authorization (missing token → 401, wrong user → 403)
- Rate limit headers present
- Pagination correct
- Idempotency key behavior

### 2.7 E2E Tests
- Onboarding flow (screens 00–07)
- Import and first value flow
- Home screen (all states: fresh, stale, partial, offline)
- Transaction correction flow
- Goal creation and tracking
- AI conversation (basic Q&A)
- Data export flow
- Account deletion flow

### 2.8 Security Tests
- SQL injection on all query parameters
- XSS on all text inputs
- CSRF (ensure SameSite cookie)
- Authorization bypass (access other user's data)
- Import file: PDF with embedded script, macro-containing Excel
- AI prompt injection attempts
- Rate limit enforcement
- Session expiry behavior

### 2.9 AI Evaluation Tests
- Financial arithmetic accuracy (deterministic tools)
- Transaction classification accuracy (sample set)
- Merchant classification accuracy
- Transfer detection accuracy
- Reconciliation accuracy
- Evidence attribution (no invented facts)
- Tool selection correctness (right tool for right intent)
- Tool scope adherence (no over-privileged calls)
- Prompt injection resistance
- Safety violations (zero tolerance)
- Latency (p95 < 3000ms for conversation)
- Cost per request (within budget)

### 2.10 Performance Tests
- Home screen load (cold): < 2 seconds
- Transaction list (100 items): < 500ms
- Import job (50-page PDF): < 60 seconds
- Safe-to-Spend computation: < 200ms
- Forecast computation: < 500ms
- API p95 latency targets (see `22_OBSERVABILITY.md`)

### 2.11 Chaos / Recovery Tests
- AI provider outage: core financial features continue
- Database connection lost: retry + queue
- Queue backlog: drain correctly
- Bad import file: parser handles gracefully
- Corrupted migration: rollback works
- Agent kill-switch: works as documented

---

## 3. Finance Regression Fixtures

The finance regression suite is CRITICAL. Must cover all of:

| Scenario | What's Tested |
|----------|--------------|
| Multiple bank accounts | Balance aggregation, dedup across accounts |
| Credit card purchase + settlement | Not double-counted |
| Own-account transfer (NEFT/IMPS) | Excluded from spending + income |
| Refund (full) | Income classification, offset spending |
| Refund (partial) | Partial offset, residual expense |
| Duplicate import (same file twice) | Dedup works, idempotent |
| Same merchant, different raw names | Merchant alias resolution |
| Cash withdrawal | Treated as expense |
| Recurring subscription (changed amount) | Series detects variance, flags |
| Salary + bonus same day | Two separate income records |
| Salary + bonus (combined transfer) | Correctly split or marked |
| UPI merchant strings | Various UPI formats resolved |
| International transaction (USD) | Currency explicit, no conversion error |
| Pending → Posted transition | Status updated, not duplicated |
| Statement page break (missing rows) | Statement flagged INCOMPLETE |
| OCR corruption (unreadable amount) | Low confidence, needs_review |
| Missing transaction date | Handled without crash, flagged |
| Reversal semantics | Reversal offsets original debit |
| Overlapping statement periods | Dedup correctly in overlap |
| EMI vs subscription | Classified correctly |
| Loan repayment (principal + interest) | Handled as commitment |

All fixtures must:
- Be deterministic
- Be re-runnable (idempotent)
- Cover expected outputs exactly
- Be blocked from release if any fail

---

## 4. AI Evaluation Release Gates

Before each AI feature release:

| Gate | Threshold | Severity |
|------|-----------|---------|
| Financial arithmetic accuracy | 100% (deterministic) | BLOCKING |
| No invented transactions/balances | 100% | BLOCKING |
| No unauthorized tool calls | 100% | BLOCKING |
| No unsupported financial claims | 100% | BLOCKING |
| No safety violations | 100% | BLOCKING |
| Classification accuracy (categories) | ≥ 85% | WARNING if < 85%, BLOCK if < 70% |
| Transfer detection accuracy | ≥ 90% | BLOCKING if < 80% |
| Evidence attribution correct | ≥ 95% | BLOCKING if < 90% |
| Prompt injection resistance | 100% of test cases | BLOCKING |

---

## 5. Definition of "Tests Pass"

A test is PASSING when:
- It runs automatically (not manually)
- It fails on regression (not masked)
- It covers the intended behavior (not testing implementation details)
- It has no fake data or hardcoded expectations from a single run
- It is reproducible (not flaky)

A test is NOT passing if:
- It was deleted to make CI green
- It was weakened to match wrong output
- It passes with mocked data that doesn't reflect production shapes
- It is commented out
- It has been skipped in the test runner config

---

## 6. Test Coverage Targets

| Layer | Target |
|-------|--------|
| Financial domain logic | 95% |
| Reconciliation engine | 95% |
| Safe-to-Spend engine | 100% |
| Forecast engine | 90% |
| API controllers | 85% |
| AI Gateway tools | 90% |
| File parsers | 90% |
| Frontend components | 70% (key interactions) |
| Utilities / formatters | 95% |

Coverage is a floor, not a goal. Quality over quantity.

---

## 7. CI Pipeline

Every PR must pass:

```
1. Lint + Static Analysis
2. Unit Tests
3. Property / Invariant Tests
4. Domain / Reconciliation Tests (fixture suite)
5. Integration Tests
6. API Contract Tests
7. Security Scan (dependency + static)
8. Build verification
```

Full E2E + AI Evaluation: on staging before release only.

---

## 8. QA Test File Structure

```
backend/tests/
├── unit/
│   ├── financial/
│   │   ├── safe-to-spend.test.js
│   │   ├── ledger.test.js
│   │   └── forecast.test.js
│   ├── reconciliation/
│   │   ├── duplicate.test.js
│   │   ├── transfer.test.js
│   │   └── settlement.test.js
│   ├── normalization/
│   │   ├── merchant.test.js
│   │   └── categorization.test.js
│   └── utils/
│       ├── money.test.js
│       └── date.test.js
├── integration/
│   ├── import-pipeline.test.js
│   ├── reconciliation-pipeline.test.js
│   └── forecast-pipeline.test.js
├── api/
│   ├── auth.test.js
│   ├── financial-state.test.js
│   ├── transactions.test.js
│   ├── import.test.js
│   └── ai.test.js
├── fixtures/
│   ├── finance-regression/
│   │   ├── credit-card-settlement.fixture.js
│   │   ├── own-account-transfer.fixture.js
│   │   ├── duplicate-import.fixture.js
│   │   └── [all 22 fixtures]
│   └── sample-files/
│       ├── sample-bank-statement.pdf
│       ├── sample-credit-card.csv
│       └── sample-malformed.csv
└── evals/
    ├── ai-arithmetic.eval.js
    ├── ai-classification.eval.js
    ├── ai-injection.eval.js
    └── ai-safety.eval.js

src/tests/
├── components/
│   ├── transaction-row.test.js
│   └── safe-to-spend.test.js
└── utils/
    ├── format-money.test.js
    └── format-date.test.js
```
