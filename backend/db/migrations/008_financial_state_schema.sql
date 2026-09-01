-- Migration 008 - FINANCIAL STATE (PHASE 5)
-- Establishes the authoritative financial state engine tables.

CREATE TABLE financial_commitments (
    commitment_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL REFERENCES users(user_id),
    account_id           UUID REFERENCES financial_accounts(account_id),
    commitment_type      TEXT NOT NULL CHECK (commitment_type IN ('emi', 'recurring_bill', 'subscription', 'manual_plan', 'debt_payment')),
    status               TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'due', 'paid', 'overdue', 'cancelled')),
    
    amount_paise         BIGINT NOT NULL CHECK (amount_paise > 0),
    currency             TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR')),
    
    due_date             DATE NOT NULL,
    recurrence_rule      TEXT,
    
    source_transaction_id UUID REFERENCES transactions(transaction_id),
    confidence           NUMERIC(4,3) NOT NULL DEFAULT 1.000 CHECK (confidence BETWEEN 0 AND 1),
    
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_commitments_user ON financial_commitments(user_id, due_date, status);

CREATE TABLE safe_to_spend_configurations (
    config_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL REFERENCES users(user_id) UNIQUE,
    
    safety_buffer_paise  BIGINT NOT NULL DEFAULT 500000, -- Default ₹5,000.00 buffer
    buffer_currency      TEXT NOT NULL DEFAULT 'INR' CHECK (buffer_currency IN ('INR')),
    
    essential_category_ids UUID[], -- Array of category_ids considered essential
    horizon_days         INTEGER NOT NULL DEFAULT 30, -- Safe to spend horizon
    
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE financial_snapshots (
    snapshot_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL REFERENCES users(user_id),
    
    calculation_type     TEXT NOT NULL CHECK (calculation_type IN ('safe_to_spend', 'balance_check', 'affordability')),
    calculation_version  TEXT NOT NULL,
    
    result_paise         BIGINT NOT NULL,
    currency             TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR')),
    
    horizon_start        TIMESTAMPTZ,
    horizon_end          TIMESTAMPTZ,
    
    -- Trust & Explainability
    freshness_score      TEXT NOT NULL CHECK (freshness_score IN ('fresh', 'recent', 'stale', 'unknown')),
    coverage_score       TEXT NOT NULL CHECK (coverage_score IN ('full', 'partial', 'no_coverage', 'unknown')),
    confidence_level     TEXT NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low', 'unknown')),
    
    input_snapshot       JSONB NOT NULL, -- The exact variables used (Available Cash, Expected Income, Commitments, Buffer)
    
    computed_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_snapshots_user_type ON financial_snapshots(user_id, calculation_type, computed_at DESC);
