# ADR-001 — Canonical Financial Ledger Model

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**Deciders:** User + Agent  
**PRD Reference:** Section 17, Section 22  

---

## Context

The financial ledger is the core truth of this product. Every balance, every spending total, every Safe-to-Spend calculation, and every forecast input depends on the ledger being correct.

Key questions that must be answered by this ADR:
1. What is the canonical representation of a transaction?
2. How is the source of truth for a transaction established?
3. How are corrections handled without destroying provenance?
4. How are multiple import sources reconciled?

---

## Decision

### 1. Immutable Source Records
All imported data is stored as immutable `source_records` rows. The `raw_data` column is NEVER updated after creation. Source records serve as the provenance chain.

### 2. Canonical Transactions
A separate `transactions` table holds the normalized, reconcilable view. This is derived from source records but can be updated (via versioned corrections). The connection to the original source record (`source_record_id`) is always preserved.

### 3. Corrections Are Additive
User corrections create entries in the `corrections` table. The original `transactions` row is updated with the new value, but the correction record preserves both `old_value` and `new_value`. Nothing is ever silently deleted.

### 4. Financial Truth Hierarchy
```
1. source_records (immutable)
2. transactions (canonical, correctable)
3. reconciled view (dedup/transfer/settlement applied)
4. financial state (deterministic calculations)
5. AI intelligence
```

### 5. Accounting for Reconciliation
The "reconciled view" is not a separate table — it is a query that applies:
- Excludes transactions with `duplicate_status = 'duplicate'`
- Excludes transfer legs appropriately
- Excludes double-counted card settlements

---

## Consequences

### Positive
- Full audit trail always available
- Reprocessing is safe (source truth preserved)
- User corrections don't destroy financial history
- Reconciliation bugs can be fixed and re-run without data loss

### Negative / Trade-offs
- More complex query layer (filters for reconciliation)
- More storage (keeping source records + canonical records)
- Slightly more complex correction workflow

### Risks
- Query complexity must be carefully managed (correct indexes)
- "Immutable" source records require application-level enforcement (not just DB)

---

## Compliance

Implementation MUST:
- Never execute UPDATE on `source_records.raw_data`
- Always preserve `source_record_id` in `transactions`
- Always write to `corrections` table for user corrections
- Apply reconciliation filters in every balance/spending query
