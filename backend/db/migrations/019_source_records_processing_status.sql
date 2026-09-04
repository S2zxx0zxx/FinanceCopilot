-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 019 — source_records.status: add 'processing'
-- ─────────────────────────────────────────────────────────────────────────────
-- Background: The normalization worker writes `status='processing'` to mark a
-- source record as in-flight (locked for normalization). Migration 005's CHECK
-- only allowed ('raw', 'normalized', 'rejected') — so the worker's UPDATE
-- threw a CHECK violation and normalization NEVER completed. Uploaded
-- statements sat as `raw` forever.
--
-- Fix: drop the old CHECK and re-add one that includes 'processing'.
-- PostgreSQL does not support ALTER CONSTRAINT on a CHECK, so we drop + re-add.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE source_records
    DROP CONSTRAINT IF EXISTS source_records_status_check;

ALTER TABLE source_records
    ADD CONSTRAINT source_records_status_check
    CHECK (status IN ('raw', 'processing', 'normalized', 'rejected'));

COMMENT ON COLUMN source_records.status IS
    'Lifecycle: raw (just parsed, awaiting normalization), processing (locked by a worker mid-normalization), normalized (cleaned + canonicalized), rejected (parser gave up).';
