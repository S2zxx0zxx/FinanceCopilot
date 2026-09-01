-- ═══════════════════════════════════════════════════════════════
-- Migration 001 v2 — CANONICAL FOUNDATION SCHEMA (Phase 0 Remediation)
-- Finding F-B1/F-P2/B11 · ADR-001/002/003/006/013
-- CHANGE NOTE (Zero-Silent-Change): v1 of this file created a users table
-- (id/email/status/deleted_at) that CONTRADICTED the canonical domain model.
-- It was NEVER APPLIED anywhere: repository has zero commits, no runner, no DB.
-- v1 content is preserved in control/remediation-register.yaml → F-B1_before_state_note.
-- Scope: foundation subset only (users, consent_records). Remaining 19 entities
-- land as numbered migrations with their phases (TASK-1001+), each carrying its
-- own constraints/indexes per control/schema-contract.yaml.
-- Enum vocabulary: control/domain-enums.yaml (do not invent values here).
-- Money rule (ADR-003): BIGINT paise only. Timestamps: TIMESTAMPTZ only.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE users (
    user_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid    TEXT NOT NULL,
    email           TEXT,
    display_name    TEXT,
    phone_number    TEXT,
    locale          TEXT NOT NULL DEFAULT 'en-IN',
    currency        TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR')),
    timezone        TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    onboarding_step TEXT NOT NULL DEFAULT 'welcome',
    onboarding_done BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,          -- ADR-006 soft delete, 30-day grace
    deleted_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_users_firebase_uid UNIQUE (firebase_uid)
);

CREATE INDEX idx_users_firebase_uid ON users (firebase_uid);
-- Partial unique index allows at most ONE live account per email while preserving
-- historical rows after soft-delete (email is nullable for phone-auth futures).
CREATE UNIQUE INDEX uq_users_email_live ON users (lower(email)) WHERE is_deleted = FALSE AND email IS NOT NULL;

CREATE TABLE consent_records (
    consent_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(user_id),
    consent_type TEXT NOT NULL CHECK (char_length(consent_type) BETWEEN 3 AND 100), -- policy_id e.g. privacy_policy/terms/data_usage/ai_processing
    version      TEXT NOT NULL CHECK (version ~ '^\d{4}-\d{2}-\d{2}$'),            -- effective-date semantics (ADR-013/P0-B4)
    consented    BOOLEAN NOT NULL,
    ip_hash      TEXT,                                                             -- sha256(salt:ip); RAW IP FORBIDDEN (P0-B4)
    user_agent   TEXT,
    granted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at   TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consent_user_type ON consent_records (user_id, consent_type, granted_at DESC);
COMMENT ON COLUMN consent_records.ip_hash IS 'Privacy: only salted SHA-256 of client IP may be stored here.';

-- updated_at maintenance trigger
CREATE OR REPLACE FUNCTION fn_touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_touch BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION fn_touch_updated_at();
