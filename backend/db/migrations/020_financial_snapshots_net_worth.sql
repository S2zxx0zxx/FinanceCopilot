-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 020 — financial_snapshots.calculation_type: add 'net_worth'
-- ─────────────────────────────────────────────────────────────────────────────
-- Background: The net-worth history feature writes rows with
-- calculation_type='net_worth'. Migration 008's CHECK only allowed
-- ('safe_to_spend', 'balance_check', 'affordability'), so the INSERT threw a
-- CHECK violation and net-worth history always returned 0 rows.
--
-- Fix: drop the old CHECK and re-add one that includes 'net_worth'.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE financial_snapshots
    DROP CONSTRAINT IF EXISTS financial_snapshots_calculation_type_check;

ALTER TABLE financial_snapshots
    ADD CONSTRAINT financial_snapshots_calculation_type_check
    CHECK (calculation_type IN ('safe_to_spend', 'balance_check', 'affordability', 'net_worth'));

COMMENT ON COLUMN financial_snapshots.calculation_type IS
    'The kind of snapshot: safe_to_spend, balance_check, affordability, or net_worth (periodic net-worth history).';
