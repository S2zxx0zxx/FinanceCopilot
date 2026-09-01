-- Phase 13 Beta Cohort Assignment Table
-- Migration: 0020_beta_cohort_assignments.sql
-- Purpose: Persist beta cohort assignments to ensure deterministic, stable membership.
-- No cohort switching mid-measurement window.

CREATE TABLE IF NOT EXISTS beta_cohort_assignments (
    user_id         TEXT         NOT NULL,
    cohort          TEXT         NOT NULL CHECK (cohort IN ('INTERNAL', 'BETA_COHORT_1', 'NOT_ELIGIBLE')),
    assigned_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    assignment_reason TEXT,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    deactivated_at  TIMESTAMPTZ,

    CONSTRAINT pk_beta_cohort_assignments PRIMARY KEY (user_id)
);

-- Index for fast cohort-level analytics queries
CREATE INDEX IF NOT EXISTS idx_bca_cohort ON beta_cohort_assignments (cohort);
CREATE INDEX IF NOT EXISTS idx_bca_assigned_at ON beta_cohort_assignments (assigned_at);

COMMENT ON TABLE beta_cohort_assignments IS
    'Phase 13: Stores stable beta cohort assignments. Never include test/developer accounts.';
COMMENT ON COLUMN beta_cohort_assignments.user_id IS
    'References the authenticated user. NOT a second identity system.';
COMMENT ON COLUMN beta_cohort_assignments.cohort IS
    'Cohort name. INTERNAL = explicit invite. BETA_COHORT_1 = controlled rollout. NOT_ELIGIBLE = excluded.';
