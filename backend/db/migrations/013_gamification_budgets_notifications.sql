-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 013: Gamification, Budgets, Notifications, Peer Comparison,
--                Calendar Events, Net Worth History, Savings Challenges
-- ═══════════════════════════════════════════════════════════════════════════

-- ── BUDGETS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budgets (
    budget_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category           VARCHAR(100) NOT NULL,
    budgeted_paise     BIGINT NOT NULL CHECK (budgeted_paise >= 0),
    spent_paise        BIGINT NOT NULL DEFAULT 0 CHECK (spent_paise >= 0),
    remaining_paise    BIGINT GENERATED ALWAYS AS (budgeted_paise - spent_paise) STORED,
    rollover_paise     BIGINT NOT NULL DEFAULT 0,
    period             VARCHAR(20) NOT NULL DEFAULT 'monthly',
    status             VARCHAR(20) NOT NULL DEFAULT 'on_track',
    is_active          BOOLEAN NOT NULL DEFAULT true,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, category, period)
);
CREATE INDEX idx_budgets_user ON budgets(user_id);
CREATE INDEX idx_budgets_status ON budgets(user_id, status);

-- ── NOTIFICATIONS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    notification_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type               VARCHAR(50) NOT NULL,
    title              VARCHAR(255) NOT NULL,
    description        TEXT,
    severity           VARCHAR(20) DEFAULT 'info',
    action_href        VARCHAR(255),
    action_label       VARCHAR(100),
    is_read            BOOLEAN NOT NULL DEFAULT false,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at            TIMESTAMPTZ
);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ── GAMIFICATION STATE ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gamification_state (
    user_id                  UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    tracking_streak_days     INTEGER NOT NULL DEFAULT 0,
    longest_streak_days      INTEGER NOT NULL DEFAULT 0,
    last_active_date        DATE,
    total_actions            INTEGER NOT NULL DEFAULT 0,
    level                    INTEGER NOT NULL DEFAULT 1,
    level_name               VARCHAR(50) NOT NULL DEFAULT 'Beginner',
    xp                       INTEGER NOT NULL DEFAULT 0,
    xp_to_next_level         INTEGER NOT NULL DEFAULT 1000,
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── GAMIFICATION MILESTONES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gamification_milestones (
    milestone_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title              VARCHAR(255) NOT NULL,
    description        TEXT,
    icon               VARCHAR(10),
    achieved           BOOLEAN NOT NULL DEFAULT false,
    progress           INTEGER NOT NULL DEFAULT 0,
    target             INTEGER NOT NULL DEFAULT 1,
    achieved_at        TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_milestones_user ON gamification_milestones(user_id, achieved);

-- ── GAMIFICATION BADGES ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gamification_badges (
    badge_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    badge_name         VARCHAR(100) NOT NULL,
    icon               VARCHAR(10) NOT NULL,
    earned             BOOLEAN NOT NULL DEFAULT false,
    earned_at          TIMESTAMPTZ,
    UNIQUE(user_id, badge_name)
);

-- ── XP EVENTS (audit trail for gamification) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS xp_events (
    event_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    action_type        VARCHAR(50) NOT NULL,
    xp_awarded         INTEGER NOT NULL,
    description        VARCHAR(255),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_xp_events_user ON xp_events(user_id, created_at DESC);

-- ── PEER COMPARISON SNAPSHOTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS peer_comparison_snapshots (
    snapshot_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    bracket            VARCHAR(100) NOT NULL,
    your_savings_rate  DECIMAL(5,2),
    peer_median_savings_rate DECIMAL(5,2),
    peer_top10_savings_rate  DECIMAL(5,2),
    your_cash_buffer_months DECIMAL(5,1),
    peer_median_cash_buffer DECIMAL(5,1),
    peer_top10_cash_buffer  DECIMAL(5,1),
    your_subscription_count  INTEGER,
    peer_median_subscriptions INTEGER,
    total_peers        INTEGER NOT NULL DEFAULT 0,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_peer_comparison_user ON peer_comparison_snapshots(user_id, created_at DESC);

-- ── CALENDAR EVENTS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calendar_events (
    event_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title              VARCHAR(255) NOT NULL,
    amount_paise       BIGINT NOT NULL DEFAULT 0,
    event_date         DATE NOT NULL,
    event_type         VARCHAR(50) NOT NULL,
    severity           VARCHAR(20) DEFAULT 'low',
    source_type        VARCHAR(50) DEFAULT 'system',
    source_id          VARCHAR(255),
    is_completed       BOOLEAN NOT NULL DEFAULT false,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_calendar_events_user_date ON calendar_events(user_id, event_date);

-- ── NET WORTH SNAPSHOTS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS net_worth_snapshots (
    snapshot_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    total_assets_paise  BIGINT NOT NULL DEFAULT 0,
    total_liabilities_paise BIGINT NOT NULL DEFAULT 0,
    net_worth_paise    BIGINT GENERATED ALWAYS AS (total_assets_paise - total_liabilities_paise) STORED,
    snapshot_date      DATE NOT NULL,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, snapshot_date)
);
CREATE INDEX idx_net_worth_user_date ON net_worth_snapshots(user_id, snapshot_date DESC);

-- ── SAVINGS CHALLENGES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS savings_challenges (
    challenge_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    challenge_type     VARCHAR(50) NOT NULL,
    title              VARCHAR(255) NOT NULL,
    target_paise       BIGINT NOT NULL,
    current_paise      BIGINT NOT NULL DEFAULT 0,
    start_date         DATE NOT NULL,
    end_date           DATE,
    status             VARCHAR(20) NOT NULL DEFAULT 'active',
    weeks_total       INTEGER,
    weeks_completed   INTEGER DEFAULT 0,
    metadata           JSONB,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_savings_challenges_user ON savings_challenges(user_id, status);

-- ── USER PREFERENCES (for /you page settings) ───────────────────────────────
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id            UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    currency           VARCHAR(10) NOT NULL DEFAULT 'INR',
    language           VARCHAR(10) NOT NULL DEFAULT 'en',
    theme              VARCHAR(20) NOT NULL DEFAULT 'dark',
    density            VARCHAR(20) NOT NULL DEFAULT 'comfortable',
    notification_channels JSONB NOT NULL DEFAULT '{"push":true,"email":true,"sms":false}'::jsonb,
    notification_events   JSONB NOT NULL DEFAULT '{"bills":true,"insights":true,"goals":true,"alerts":true,"streaks":true}'::jsonb,
    data_retention_days INTEGER NOT NULL DEFAULT 365,
    ai_sharing_consent BOOLEAN NOT NULL DEFAULT true,
    analytics_consent  BOOLEAN NOT NULL DEFAULT true,
    marketing_consent BOOLEAN NOT NULL DEFAULT false,
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── ADD clerk_uid COLUMN to users table (replaces firebase_uid) ──────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_uid VARCHAR(255) UNIQUE;
