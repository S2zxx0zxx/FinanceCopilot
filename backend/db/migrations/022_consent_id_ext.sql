-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 022 — consent_records.consent_id_ext
-- ─────────────────────────────────────────────────────────────────────────────
-- Background: Migration 018 added consent_handle + status but the AA flow also
-- needs to persist the FINAL consentId issued by the AA once the user
-- confirms via the AA app. The canonical PK on consent_records is
-- `consent_id` (a server-generated UUID). We must NOT overwrite it with the
-- AA's identifier — store the AA consentId in a separate column.
--
-- This migration is idempotent and safe to run multiple times.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE consent_records
    ADD COLUMN IF NOT EXISTS consent_id_ext TEXT;

CREATE INDEX IF NOT EXISTS idx_consent_records_ext_id
    ON consent_records (consent_id_ext)
    WHERE consent_id_ext IS NOT NULL;

COMMENT ON COLUMN consent_records.consent_id_ext IS
    'External consentId issued by the Account Aggregator (Setu) once the user confirms. Stored separately from the canonical PK to avoid collision.';
