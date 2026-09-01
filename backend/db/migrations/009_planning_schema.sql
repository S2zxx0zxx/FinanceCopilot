-- Migration 009: Phase 7 Planning Schema
-- Creates all planning domain tables: Recurring, Commitments, Goals, Health
-- All money in BIGINT (paise). All timestamps TIMESTAMPTZ.
-- Version: 009
-- Date: 2026-08-27

BEGIN;

-- ============================================================
-- 1. PLANNING RULE VERSIONS (version registry — no magic constants)
-- ============================================================
CREATE TABLE IF NOT EXISTS planning_rule_versions (
    version_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain                  TEXT NOT NULL,        -- 'recurring_detection', 'upcoming', 'cashflow', 'goals', 'health'
    version                 TEXT NOT NULL,        -- e.g. 'v1.0.0'
    description             TEXT,
    is_current              BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (domain, version)
);

-- Insert initial versions
INSERT INTO planning_rule_versions (domain, version, description, is_current) VALUES
    ('recurring_detection', 'v1.0.0', 'Initial recurring detection: merchant + amount + cadence evidence', TRUE),
    ('upcoming_rules',      'v1.0.0', 'Generate upcoming from confirmed recurring + commitments', TRUE),
    ('cashflow_planning',   'v1.0.0', 'Known cashflow: current balance + income + confirmed recurring', TRUE),
    ('goal_calculation',    'v1.0.0', 'Goal progress = SUM(confirmed contributions)', TRUE),
    ('financial_health',    'v1.0.0', 'Health: cash_buffer, commitment_load, savings_pace, spending_stability', TRUE),
    ('planning_snapshot',   'v1.0.0', 'Planning snapshot v1', TRUE)
ON CONFLICT (domain, version) DO NOTHING;


-- ============================================================
-- 2. RECURRING SERIES
-- Canonical recurring pattern entity (Domain Model §2.12)
-- ============================================================
CREATE TABLE IF NOT EXISTS recurring_series (
    series_id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    merchant_id             UUID REFERENCES merchants(merchant_id),
    category_id             UUID REFERENCES categories(category_id),

    -- Identity
    series_name             TEXT NOT NULL,
    series_type             TEXT NOT NULL CHECK (series_type IN ('subscription', 'emi', 'salary', 'rent', 'utility', 'insurance', 'other')),
    frequency               TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly', 'annual', 'custom')),

    -- Amount semantics (Phase 7 §10: fixed/variable/bounded_variable/unknown)
    amount_type             TEXT NOT NULL DEFAULT 'unknown' CHECK (amount_type IN ('fixed', 'variable', 'bounded_variable', 'unknown')),
    typical_amount_paise    BIGINT,          -- NULL if unknown
    amount_variance_paise   BIGINT,          -- NULL if fixed
    currency                TEXT NOT NULL DEFAULT 'INR',

    -- Observation window
    first_seen_at           DATE,
    last_seen_at            DATE,
    observation_count       INTEGER NOT NULL DEFAULT 0,
    observation_window_days INTEGER,

    -- Next expected
    next_expected_at        DATE,

    -- Confidence + status
    confidence              NUMERIC(4,3) CHECK (confidence BETWEEN 0.000 AND 1.000),
    detection_version       TEXT NOT NULL DEFAULT 'v1.0.0',

    -- Lifecycle state machine (§11):
    -- DETECTED → REVIEWABLE → CONFIRMED → ACTIVE → PAUSED / ENDED
    status                  TEXT NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'reviewable', 'confirmed', 'active', 'paused', 'ended', 'dismissed')),

    -- User override flags
    is_income               BOOLEAN NOT NULL DEFAULT FALSE,
    is_user_confirmed       BOOLEAN NOT NULL DEFAULT FALSE,
    user_confirmed_at       TIMESTAMPTZ,
    user_dismissed_at       TIMESTAMPTZ,
    dismissal_reason        TEXT,

    -- Deterministic identity key for idempotent upsert (§14)
    deterministic_key       TEXT NOT NULL,   -- hash(user_id + merchant_normalized + frequency)

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, deterministic_key)
);

CREATE INDEX IF NOT EXISTS idx_recurring_series_user_status ON recurring_series(user_id, status);
CREATE INDEX IF NOT EXISTS idx_recurring_series_user_next ON recurring_series(user_id, next_expected_at);


-- ============================================================
-- 3. RECURRING EVIDENCE
-- Per-transaction evidence backing each series (idempotent via UNIQUE)
-- ============================================================
CREATE TABLE IF NOT EXISTS recurring_evidence (
    evidence_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id               UUID NOT NULL REFERENCES recurring_series(series_id) ON DELETE CASCADE,
    user_id                 UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    transaction_id          UUID NOT NULL REFERENCES transactions(transaction_id),
    observed_at             DATE NOT NULL,
    amount_paise            BIGINT NOT NULL,
    evidence_weight         NUMERIC(4,3) DEFAULT 1.000,   -- contribution to confidence
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (series_id, transaction_id)   -- idempotency: same tx cannot back same series twice
);

CREATE INDEX IF NOT EXISTS idx_recurring_evidence_series ON recurring_evidence(series_id);


-- ============================================================
-- 4. COMMITMENTS
-- Per-period payment instances derived from confirmed recurring (Domain Model §2.13)
-- ============================================================
CREATE TABLE IF NOT EXISTS commitments (
    commitment_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    series_id               UUID REFERENCES recurring_series(series_id),

    commitment_type         TEXT NOT NULL CHECK (commitment_type IN ('bill', 'emi', 'subscription', 'rent', 'insurance', 'loan_payment', 'other')),
    name                    TEXT NOT NULL,
    amount_paise            BIGINT NOT NULL CHECK (amount_paise > 0),
    currency                TEXT NOT NULL DEFAULT 'INR',

    due_date                DATE,
    due_day_of_month        INTEGER CHECK (due_day_of_month BETWEEN 1 AND 31),
    period_start            DATE,
    period_end              DATE,

    account_id              UUID REFERENCES financial_accounts(account_id),
    instrument_id           UUID,

    -- Upcoming state machine (§17)
    status                  TEXT NOT NULL DEFAULT 'expected' CHECK (status IN ('expected', 'due', 'overdue', 'paid', 'cancelled', 'unknown')),
    paid_at                 TIMESTAMPTZ,
    transaction_id          UUID REFERENCES transactions(transaction_id),   -- matched payment

    -- Evidence quality
    confidence              NUMERIC(4,3) DEFAULT 1.000,
    source_type             TEXT NOT NULL DEFAULT 'confirmed' CHECK (source_type IN ('user_confirmed', 'confirmed_recurring', 'inferred_candidate', 'system')),

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commitments_user_status ON commitments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_commitments_user_due ON commitments(user_id, due_date);


-- ============================================================
-- 5. GOALS (Domain Model §2.14)
-- ============================================================
CREATE TABLE IF NOT EXISTS goals (
    goal_id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    goal_type               TEXT NOT NULL CHECK (goal_type IN ('emergency_fund', 'vacation', 'purchase', 'debt_payoff', 'investment_future', 'education', 'home', 'other')),
    name                    TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
    description             TEXT CHECK (char_length(description) <= 500),

    target_amount_paise     BIGINT NOT NULL CHECK (target_amount_paise > 0),
    -- current_amount_paise is DERIVED from SUM(goal_contributions) — NOT stored here
    -- to avoid manual increment bugs (§23)
    currency                TEXT NOT NULL DEFAULT 'INR',

    target_date             DATE,

    status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'abandoned')),
    priority                INTEGER NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 10),

    account_id              UUID REFERENCES financial_accounts(account_id),
    monthly_contribution_paise BIGINT CHECK (monthly_contribution_paise >= 0),

    -- Calculation version for reproducibility
    calculation_version     TEXT NOT NULL DEFAULT 'v1.0.0',

    is_deleted              BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at              TIMESTAMPTZ,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);


-- ============================================================
-- 6. GOAL CONTRIBUTIONS (§24 — durable, idempotent, auditable)
-- ============================================================
CREATE TABLE IF NOT EXISTS goal_contributions (
    contribution_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id                 UUID NOT NULL REFERENCES goals(goal_id) ON DELETE CASCADE,
    user_id                 UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    amount_paise            BIGINT NOT NULL CHECK (amount_paise > 0),
    currency                TEXT NOT NULL DEFAULT 'INR',

    contribution_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    source_type             TEXT NOT NULL DEFAULT 'manual' CHECK (source_type IN ('manual', 'automatic', 'correction')),
    account_id              UUID REFERENCES financial_accounts(account_id),

    -- Idempotency (§24)
    idempotency_key         TEXT NOT NULL,
    actor                   TEXT NOT NULL DEFAULT 'user' CHECK (actor IN ('user', 'system')),

    -- Status
    status                  TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'rejected', 'corrected')),

    notes                   TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (goal_id, idempotency_key)   -- idempotency: same key cannot create two contributions
);

CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal ON goal_contributions(goal_id, status);
CREATE INDEX IF NOT EXISTS idx_goal_contributions_user ON goal_contributions(user_id);


-- ============================================================
-- 7. PLANNING SNAPSHOTS (§33 — reproducible planning state)
-- ============================================================
CREATE TABLE IF NOT EXISTS planning_snapshots (
    snapshot_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    scope                   TEXT NOT NULL DEFAULT 'full',   -- 'full', 'cashflow', 'goals', 'health'
    planning_version        TEXT NOT NULL DEFAULT 'v1.0.0',

    -- Input references (for reproducibility)
    input_financial_state_snapshot_id UUID,                  -- references safe_to_spend_snapshots
    input_snapshot          JSONB NOT NULL,                  -- full input state at time of calc

    -- Outputs
    outputs                 JSONB NOT NULL,

    currency                TEXT NOT NULL DEFAULT 'INR',
    freshness_seconds       INTEGER,
    coverage                NUMERIC(4,3),
    computed_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planning_snapshots_user ON planning_snapshots(user_id, computed_at DESC);


-- ============================================================
-- 8. FINANCIAL HEALTH SNAPSHOTS (§29 — 4 canonical components)
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_health_snapshots (
    health_snapshot_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Cash Buffer: usable_cash / monthly_essential_spending
    cash_buffer_ratio       NUMERIC(8,4),        -- NULL if insufficient data
    cash_buffer_months      NUMERIC(8,4),
    cash_buffer_status      TEXT CHECK (cash_buffer_status IN ('healthy', 'low', 'critical', 'unknown')),

    -- Commitment Load: total_commitments / monthly_income
    commitment_load_ratio   NUMERIC(8,4),
    commitment_load_status  TEXT CHECK (commitment_load_status IN ('healthy', 'moderate', 'high', 'critical', 'unknown')),

    -- Savings Pace: recent_contributions / target_monthly_pace
    savings_pace_ratio      NUMERIC(8,4),
    savings_pace_status     TEXT CHECK (savings_pace_status IN ('on_track', 'below', 'no_goal', 'unknown')),

    -- Spending Stability: coefficient of variation over 8 weeks
    spending_stability_cv   NUMERIC(8,4),        -- lower = more stable
    spending_stability_status TEXT CHECK (spending_stability_status IN ('stable', 'variable', 'volatile', 'unknown')),

    -- Metadata
    health_version          TEXT NOT NULL DEFAULT 'v1.0.0',
    horizon_days            INTEGER NOT NULL DEFAULT 30,
    coverage                NUMERIC(4,3),
    freshness_seconds       INTEGER,
    data_gaps               TEXT[],
    inputs_snapshot         JSONB NOT NULL,      -- what data was used

    computed_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_financial_health_user ON financial_health_snapshots(user_id, computed_at DESC);

COMMIT;
