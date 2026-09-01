# ADR-002 — Reconciliation Invariants

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**PRD Reference:** Section 21  

---

## Context

Reconciliation is the process of transforming raw imported transactions into financially-correct meaning. Without enforced invariants, bugs in this layer lead to incorrect balances, double-counted expenses, and lost transactions.

---

## Decision

The following invariants are non-negotiable and must be enforced by both application logic AND test suite:

```
INV-001: Raw source records are immutable — raw_data column is never updated
INV-002: Every financial mutation is logged to audit_events
INV-003: Corrections preserve both old_value and new_value in corrections table
INV-004: Own-account transfers are excluded from income and spending totals
INV-005: Card settlements are not double-counted when purchase record exists
INV-006: Duplicate records are never deleted — only marked with duplicate_status
INV-007: Low-confidence outcomes become review tasks — never silently applied
INV-008: All reconciliation is idempotent — re-running produces same output
INV-009: Conflicts surface to review queue — never silently resolved
INV-010: Financial period calculations are timezone-explicit (Asia/Kolkata for India)
```

Additionally:
- Reconciliation never deletes source truth
- If both legs of a transfer are not found, record as PARTIAL_TRANSFER (still included in spending until resolved)
- Card settlement matching only when purchase is present — if purchase missing, show as expense

---

## Consequences

### Positive
- Financial correctness guaranteed by invariants
- Reconciliation can be safely re-run on any data
- User trust maintained through audit trail

### Negative
- More complex reconciliation queries
- Must test all invariants explicitly

---

## Compliance

Every reconciliation engine implementation must have property tests that verify each invariant cannot be violated.
