# PHASE 3 DATABASE VERIFICATION

## Overview
This document serves as proof of database schema verification during Phase 3. It confirms that the underlying PostgreSQL schema strictly enforces Phase 3 requirements, primarily idempotency and constraint safety.

## 1. Idempotency Constraint (`006_transactions_idempotency.sql`)
Phase 3 requires that the same raw record under the same normalization ruleset deterministicly produces exactly ONE canonical record.

- **Constraint Added**: `uq_tx_source_version UNIQUE (source_record_id, normalization_version)`
- **Behavior**: The normalization worker's upsert (`ON CONFLICT (source_record_id, normalization_version) DO NOTHING`) guarantees that historical normalization runs cannot accidentally duplicate canonical records.

## 2. Immutability of Source Records (`005_source_records_schema.sql`)
Phase 2 created the `source_records` table. Phase 3 relies on this table but **never mutates its raw values**.
- The worker executes `UPDATE source_records SET status = 'normalized' WHERE source_record_id = $1`.
- Raw fields (`raw_amount_text`, `raw_date_text`, etc.) are left strictly untouched.

## 3. Worker Concurrency Safety
The worker polls `source_records` using:
```sql
SELECT source_record_id FROM source_records
WHERE status = 'raw'
ORDER BY created_at ASC
FOR UPDATE SKIP LOCKED
LIMIT 50;
```
- **Proof**: `SKIP LOCKED` ensures that if multiple normalization workers operate concurrently on the same tenant, they claim disjoint subsets of the queue.

## 4. Foreign Key Safety (`003_core_ledger_schema.sql`)
- `account_id` references `financial_accounts(account_id)`.
- If an account cannot be resolved, `account_id` is left `NULL` and `needs_review = true` is set, rather than inserting a fake/mock ID.
