-- Migration 010: Phase 8 Forecast Schema
-- Creates all forecasting domain tables.
-- All money in BIGINT (paise). All timestamps TIMESTAMPTZ.
-- Version: 010
-- Date: 2026-08-27

BEGIN;

-- ============================================================
-- 1. FORECAST MODEL REGISTRY
-- Registry of approved models (baselines, residuals)
-- ============================================================
CREATE TABLE IF NOT EXISTS forecast_models (
    model_id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_type              TEXT NOT NULL CHECK (model_type IN ('baseline_rolling_median', 'baseline_naive', 'probabilistic_es', 'deterministic')),
    target                  TEXT NOT NULL CHECK (target IN ('daily_net_cash', 'daily_ending_balance', '7d_ending_balance', '30d_ending_balance', '90d_ending_balance')),
    horizon_days            INTEGER NOT NULL,
    hyperparameters         JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'experimental'))
);

-- Seed basic models
INSERT INTO forecast_models (model_type, target, horizon_days, hyperparameters) VALUES
    ('baseline_rolling_median', '30d_ending_balance', 30, '{"window_days": 90}'::jsonb),
    ('probabilistic_es', '30d_ending_balance', 30, '{"alpha": 0.2, "beta": 0.1}'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. FORECAST VERSIONS
-- Versioning for feature extraction rules, known-event policies, etc.
-- ============================================================
CREATE TABLE IF NOT EXISTS forecast_rule_versions (
    version_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain                  TEXT NOT NULL,        -- 'feature_extraction', 'calibration', 'known_events'
    version                 TEXT NOT NULL,        -- e.g. 'v1.0.0'
    description             TEXT,
    is_current              BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (domain, version)
);

INSERT INTO forecast_rule_versions (domain, version, description, is_current) VALUES
    ('feature_extraction', 'v1.0.0', 'Extracts 90d cash buffer + confirmed commitments', TRUE),
    ('calibration',        'v1.0.0', 'Nominal 80% interval via rolling empirical residual variance', TRUE),
    ('known_events',       'v1.0.0', 'Deterministic confirmed Phase-7 commitments', TRUE)
ON CONFLICT (domain, version) DO NOTHING;

-- ============================================================
-- 3. FORECAST SNAPSHOTS
-- Persisted outputs of the forecasting engine
-- ============================================================
CREATE TABLE IF NOT EXISTS forecast_snapshots (
    forecast_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    as_of                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    horizon_days            INTEGER NOT NULL CHECK (horizon_days IN (7, 30, 90)),
    
    financial_state_version TEXT,
    planning_state_version  TEXT,
    
    model_id                UUID REFERENCES forecast_models(model_id),
    feature_version         TEXT NOT NULL,
    rule_version            TEXT NOT NULL,
    
    currency                TEXT NOT NULL DEFAULT 'INR',
    point_estimate_paise    BIGINT,
    lower_bound_paise       BIGINT,
    upper_bound_paise       BIGINT,
    interval_level          NUMERIC(4,3) CHECK (interval_level BETWEEN 0.000 AND 1.000),
    
    trust_state             TEXT NOT NULL CHECK (trust_state IN ('HIGH', 'MEDIUM', 'LOW', 'UNAVAILABLE', 'LIMITED_HISTORY')),
    coverage_score          NUMERIC(4,3),
    freshness_score         NUMERIC(4,3),
    
    drivers                 JSONB NOT NULL DEFAULT '[]'::jsonb,
    pressure_points         JSONB NOT NULL DEFAULT '[]'::jsonb,
    assumptions             JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forecast_snapshots_user ON forecast_snapshots(user_id, as_of DESC);

-- ============================================================
-- 4. FORECAST EVALUATIONS
-- Temporal validation metrics
-- ============================================================
CREATE TABLE IF NOT EXISTS forecast_evaluations (
    eval_id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id                UUID NOT NULL REFERENCES forecast_models(model_id),
    dataset_identity        TEXT NOT NULL,
    data_cutoff             TIMESTAMPTZ NOT NULL,
    horizon_days            INTEGER NOT NULL,
    
    mae                     NUMERIC,
    rmse                    NUMERIC,
    interval_coverage       NUMERIC(4,3),
    interval_width          NUMERIC,
    
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
