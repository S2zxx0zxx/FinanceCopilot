-- AI Insights (generated insights surfaced to user)
CREATE TABLE IF NOT EXISTS ai_insights (
    insight_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    interaction_id      UUID REFERENCES ai_interactions(interaction_id) ON DELETE SET NULL,
    title               TEXT NOT NULL,
    summary             TEXT NOT NULL,
    evidence            JSONB NOT NULL DEFAULT '{}'::jsonb,
    tags                TEXT[] NOT NULL DEFAULT '{}',
    confidence          INTEGER NOT NULL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 100),
    status              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','dismissed','expired')),
    generated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ
);
CREATE INDEX idx_ai_insights_user ON ai_insights(user_id, generated_at DESC);

-- AI Insight Feedback (thumbs up/down + comments)
CREATE TABLE IF NOT EXISTS ai_insight_feedback (
    feedback_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_id          UUID NOT NULL REFERENCES ai_insights(insight_id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating              INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment             TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ai_insight_feedback_insight ON ai_insight_feedback(insight_id);

-- AI Saved Simulations (what-if scenarios user saved)
CREATE TABLE IF NOT EXISTS ai_saved_simulations (
    simulation_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    interaction_id      UUID REFERENCES ai_interactions(interaction_id) ON DELETE SET NULL,
    simulation_type     TEXT NOT NULL CHECK (simulation_type IN ('affordability','money-leaks','explain-month','goal-accelerator','what-if')),
    input_snapshot      JSONB NOT NULL,
    output_snapshot     JSONB NOT NULL,
    label               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ai_saved_simulations_user ON ai_saved_simulations(user_id, created_at DESC);
