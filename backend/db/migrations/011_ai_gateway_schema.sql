-- Phase 9: AI Gateway Schema
-- Ensures all AI interactions, tool usages, and costs are strictly audited and isolated.

CREATE TABLE IF NOT EXISTS ai_interactions (
    interaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    intent TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    context_scope JSONB NOT NULL DEFAULT '{}'::jsonb,
    provider_id TEXT NOT NULL,
    model_id TEXT NOT NULL,
    tokens_in INTEGER DEFAULT 0,
    tokens_out INTEGER DEFAULT 0,
    estimated_cost_paise BIGINT DEFAULT 0,
    latency_ms INTEGER DEFAULT 0,
    status TEXT NOT NULL,
    safety_state TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_tool_invocations (
    invocation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interaction_id UUID NOT NULL REFERENCES ai_interactions(interaction_id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    tool_id TEXT NOT NULL,
    tool_version TEXT NOT NULL,
    policy_decision TEXT NOT NULL,
    minimized_arguments JSONB NOT NULL DEFAULT '{}'::jsonb,
    latency_ms INTEGER DEFAULT 0,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_audit_events (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interaction_id UUID REFERENCES ai_interactions(interaction_id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    details JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying user interactions quickly
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user ON ai_interactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tool_invocations_interaction ON ai_tool_invocations(interaction_id);
