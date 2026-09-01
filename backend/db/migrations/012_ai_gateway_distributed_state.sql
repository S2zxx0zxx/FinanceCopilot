-- Phase 9: AI Gateway Distributed State
-- Fixes F9-01 (Rate Limiting) and F9-03 (Cost Governance) by storing state atomically in Postgres

-- 1. Distributed User Budget (Cost Governance)
CREATE TABLE IF NOT EXISTS ai_user_budgets (
    user_id TEXT PRIMARY KEY,
    budget_limit_paise BIGINT NOT NULL DEFAULT 5000,
    consumed_paise BIGINT NOT NULL DEFAULT 0,
    period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Distributed Rate Limit State (Sliding Window via Timestamp Log)
-- For high throughput systems this is better in Redis, but Postgres is acceptable for this architecture scale.
CREATE TABLE IF NOT EXISTS ai_rate_limits (
    request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_rate_limits_user_time ON ai_rate_limits(user_id, created_at DESC);
