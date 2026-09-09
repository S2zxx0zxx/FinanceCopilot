-- Migration 027 — Data-driven FinCopilot achievement engine
--
-- Product goals:
-- 1. Badge / milestone definitions live in the database, not in the React page.
-- 2. User progress is calculated from authoritative FinCopilot domain data.
-- 3. Unlocks are durable and idempotent. Once earned, an achievement stays earned.
-- 4. Legacy per-user seeded badge/milestone tables are left intact for backwards
--    compatibility, but the V2 API does not trust client-side progress mutations.

CREATE TABLE IF NOT EXISTS gamification_levels (
    level               INTEGER PRIMARY KEY CHECK (level > 0),
    level_name          VARCHAR(80) NOT NULL,
    xp_floor            INTEGER NOT NULL CHECK (xp_floor >= 0),
    sort_order          INTEGER NOT NULL,
    UNIQUE (xp_floor)
);

INSERT INTO gamification_levels (level, level_name, xp_floor, sort_order) VALUES
    (1, 'Beginner',       0,     1),
    (2, 'Money Saver',    500,   2),
    (3, 'Finance Tracker',1500,  3),
    (4, 'Money Master',   2500,  4),
    (5, 'Wealth Wizard',  5000,  5),
    (6, 'Finance Guru',   10000, 6)
ON CONFLICT (level) DO UPDATE SET
    level_name = EXCLUDED.level_name,
    xp_floor = EXCLUDED.xp_floor,
    sort_order = EXCLUDED.sort_order;

CREATE TABLE IF NOT EXISTS gamification_badge_definitions (
    badge_key           VARCHAR(80) PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    description         TEXT NOT NULL,
    metric_key          VARCHAR(100) NOT NULL,
    target              NUMERIC(12,3) NOT NULL CHECK (target > 0),
    unit                VARCHAR(40) NOT NULL,
    icon_key            VARCHAR(60) NOT NULL,
    tier                VARCHAR(30) NOT NULL CHECK (tier IN ('core','advanced','elite')),
    tone                VARCHAR(30) NOT NULL CHECK (tone IN ('amber','emerald','azure','violet','rose','cyan')),
    sort_order          INTEGER NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO gamification_badge_definitions
    (badge_key, name, description, metric_key, target, unit, icon_key, tier, tone, sort_order)
VALUES
    ('money_mapper',
     'Money Mapper',
     'Build a complete money map by keeping at least three active financial accounts in FinCopilot.',
     'active_account_count', 3, 'accounts', 'money-map', 'advanced', 'cyan', 1),
    ('budget_ninja',
     'Budget Ninja',
     'Create and actively manage three category budgets.',
     'active_budget_count', 3, 'budgets', 'budget-shield', 'advanced', 'emerald', 2),
    ('streak_keeper',
     'Streak Keeper',
     'Maintain a 30-day money-tracking streak.',
     'tracking_streak_days', 30, 'days', 'streak-flame', 'elite', 'amber', 3),
    ('ai_explorer',
     'AI Explorer',
     'Complete 25 successful conversations with the FinCopilot AI.',
     'successful_ai_interaction_count', 25, 'AI chats', 'ai-orbit', 'advanced', 'violet', 4),
    ('goal_getter',
     'Goal Getter',
     'Fully complete your first financial goal.',
     'completed_goal_count', 1, 'goal', 'goal-flag', 'elite', 'rose', 5),
    ('smart_saver',
     'Smart Saver',
     'Reach or exceed 100% of your current verified savings pace.',
     'savings_pace_percent', 100, '% pace', 'smart-saver', 'elite', 'azure', 6)
ON CONFLICT (badge_key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    metric_key = EXCLUDED.metric_key,
    target = EXCLUDED.target,
    unit = EXCLUDED.unit,
    icon_key = EXCLUDED.icon_key,
    tier = EXCLUDED.tier,
    tone = EXCLUDED.tone,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE,
    updated_at = NOW();

CREATE TABLE IF NOT EXISTS gamification_milestone_definitions (
    milestone_key       VARCHAR(80) PRIMARY KEY,
    title               VARCHAR(140) NOT NULL,
    description         TEXT NOT NULL,
    metric_key          VARCHAR(100) NOT NULL,
    target              NUMERIC(12,3) NOT NULL CHECK (target > 0),
    unit                VARCHAR(40) NOT NULL,
    icon_key            VARCHAR(60) NOT NULL,
    sort_order          INTEGER NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO gamification_milestone_definitions
    (milestone_key, title, description, metric_key, target, unit, icon_key, sort_order)
VALUES
    ('first_account',
     'First Account Connected',
     'Bring your first active financial account into your money map.',
     'active_account_count', 1, 'account', 'link', 1),
    ('first_25_transactions',
     '25 Transactions Tracked',
     'Build enough verified history for FinCopilot to start seeing patterns.',
     'posted_transaction_count', 25, 'transactions', 'ledger', 2),
    ('first_100_transactions',
     'Century Ledger',
     'Track 100 posted, non-duplicate transactions.',
     'posted_transaction_count', 100, 'transactions', 'stack', 3),
    ('seven_day_rhythm',
     '7-Day Rhythm',
     'Keep your money-tracking streak alive for seven consecutive days.',
     'tracking_streak_days', 7, 'days', 'spark', 4),
    ('thirty_day_momentum',
     '30-Day Momentum',
     'Build a full month of consistent money-tracking momentum.',
     'tracking_streak_days', 30, 'days', 'flame', 5),
    ('first_budget',
     'First Budget Built',
     'Create your first active category budget.',
     'active_budget_count', 1, 'budget', 'budget', 6),
    ('first_goal',
     'Goal on the Board',
     'Create your first active financial goal.',
     'goal_count', 1, 'goal', 'target', 7),
    ('goal_halfway',
     'Halfway There',
     'Fund any active or completed goal to at least 50%.',
     'max_goal_progress_percent', 50, '% funded', 'halfway', 8),
    ('first_goal_completed',
     'First Goal Completed',
     'Take one financial goal all the way to completion.',
     'completed_goal_count', 1, 'goal', 'flag', 9),
    ('ten_ai_conversations',
     'Copilot Regular',
     'Complete 10 successful, audited AI conversations.',
     'successful_ai_interaction_count', 10, 'AI chats', 'orbit', 10)
ON CONFLICT (milestone_key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    metric_key = EXCLUDED.metric_key,
    target = EXCLUDED.target,
    unit = EXCLUDED.unit,
    icon_key = EXCLUDED.icon_key,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE,
    updated_at = NOW();

CREATE TABLE IF NOT EXISTS gamification_achievement_unlocks (
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_type    VARCHAR(20) NOT NULL CHECK (achievement_type IN ('badge','milestone')),
    achievement_key     VARCHAR(80) NOT NULL,
    earned_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, achievement_type, achievement_key)
);

CREATE INDEX IF NOT EXISTS idx_achievement_unlocks_user
    ON gamification_achievement_unlocks (user_id, achievement_type, earned_at DESC);

COMMENT ON TABLE gamification_badge_definitions IS
    'Product-owned badge catalog. Progress is derived from authoritative user financial metrics; clients cannot grant badges.';
COMMENT ON TABLE gamification_milestone_definitions IS
    'Product-owned milestone catalog. Targets and labels are data-driven so the UI has no seeded milestone copy.';
COMMENT ON TABLE gamification_achievement_unlocks IS
    'Idempotent durable record of achievements whose real metric reached its configured target.';
