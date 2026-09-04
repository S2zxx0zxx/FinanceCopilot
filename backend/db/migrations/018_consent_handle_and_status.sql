-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 018 — Consent handle + status columns + users.firebase_uid nullable
-- ─────────────────────────────────────────────────────────────────────────────
-- Background: The ConsentRepo methods (trackPendingConsent, getConsentByHandle,
-- activateConsent, revokeConsentById) reference columns that did not exist on
-- consent_records. The Account Aggregator (Setu) flow needs to track a
-- `consent_handle` (the handle returned by the AA) and a `status` of the
-- consent lifecycle (pending → active → revoked).
--
-- Also: `users.firebase_uid` was NOT NULL because the original auth provider
-- was Firebase. After the migration to Clerk (ClerkAuthAdapter), the firebase
-- uid is no longer authoritative — Clerk users have no firebase_uid. Make the
-- column nullable so Clerk-only users can be inserted without a placeholder.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Add `consent_handle` (the handle returned by the AA / Setu) to consent_records.
ALTER TABLE consent_records
    ADD COLUMN IF NOT EXISTS consent_handle TEXT;

-- Index for fast AA-callback lookup by handle (high cardinality, equality scan).
CREATE INDEX IF NOT EXISTS idx_consent_records_handle
    ON consent_records (consent_handle)
    WHERE consent_handle IS NOT NULL;

-- 2. Add `status` (lifecycle of the consent request).
-- Default 'pending' for newly created consent records before AA confirmation.
ALTER TABLE consent_records
    ADD COLUMN IF NOT EXISTS status TEXT
    NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'revoked'));

-- Backfill existing rows: any consent row with `consented = TRUE` and no
-- `revoked_at` is considered active; any consent with `revoked_at` set is revoked.
UPDATE consent_records
    SET status = 'active'
    WHERE status = 'pending' AND consented = TRUE AND revoked_at IS NULL;

UPDATE consent_records
    SET status = 'revoked'
    WHERE status = 'pending' AND revoked_at IS NOT NULL;

-- 3. Make users.firebase_uid nullable (Clerk migration — Clerk users have no FB uid).
ALTER TABLE users
    ALTER COLUMN firebase_uid DROP NOT NULL;

-- Drop the unique constraint/index on firebase_uid since it can no longer be NOT NULL,
-- but keep a partial unique index for the rows where it IS NOT NULL (legacy FB users).
DROP INDEX IF EXISTS idx_users_firebase_uid;
DROP INDEX IF EXISTS uq_users_firebase_uid;

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_firebase_uid_live
    ON users (firebase_uid)
    WHERE firebase_uid IS NOT NULL;

COMMENT ON COLUMN consent_records.consent_handle IS
    'Handle returned by the Account Aggregator (Setu) when a consent request is raised. Used to correlate AA callbacks.';
COMMENT ON COLUMN consent_records.status IS
    'Consent lifecycle: pending (requested, not yet confirmed by AA), active (confirmed by user via AA), revoked (user revoked via AA or in-app).';
