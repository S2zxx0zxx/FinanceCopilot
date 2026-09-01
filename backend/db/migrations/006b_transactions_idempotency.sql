-- Migration 006 - PHASE 3 - TRANSACTIONS IDEMPOTENCY
-- Enforces the invariant: A source record can only have one canonical transaction per normalization version.
-- This prevents the normalization worker from creating duplicates if re-run against the same source with the same ruleset.

ALTER TABLE transactions
ADD CONSTRAINT uq_tx_source_version UNIQUE (source_record_id, normalization_version);
