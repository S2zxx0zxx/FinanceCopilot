import { dbClient } from '../../db/client.js';

function numberValue(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function toLocalDateString(date, timeZone = 'Asia/Kolkata') {
    try {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    } catch {
        return date.toISOString().slice(0, 10);
    }
}

function dayDistance(fromDate, toDate) {
    const [fy, fm, fd] = fromDate.split('-').map(Number);
    const [ty, tm, td] = toDate.split('-').map(Number);
    return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000);
}

/**
 * AchievementService
 *
 * V2 gamification read model. Badge and milestone copy/targets are stored in
 * database definition tables, while progress is derived from authoritative
 * FinCopilot domain tables. The browser cannot grant or advance achievements.
 */
export class AchievementService {
    constructor(database = dbClient) {
        this.db = database;
    }

    async ensureState(userId) {
        await this.db.query(
            `INSERT INTO gamification_state
                (user_id, tracking_streak_days, longest_streak_days, level, level_name, xp, xp_to_next_level)
             VALUES ($1, 0, 0, 1, 'Beginner', 0, 500)
             ON CONFLICT (user_id) DO NOTHING`,
            [userId]
        );
    }

    /**
     * Records one real app-tracking day in the user's configured timezone.
     * Idempotent for repeated reads/refreshes and serialized for concurrent tabs.
     */
    async recordDailyActivity(userId) {
        await this.ensureState(userId);

        const client = await this.db.connect();
        try {
            await client.query('BEGIN');
            const stateResult = await client.query(
                `SELECT gs.*, COALESCE(u.timezone, 'Asia/Kolkata') AS timezone
                 FROM gamification_state gs
                 JOIN users u ON u.user_id = gs.user_id
                 WHERE gs.user_id = $1
                 FOR UPDATE OF gs`,
                [userId]
            );
            const current = stateResult.rows[0];
            if (!current) throw new Error('Gamification state could not be initialized');

            const timeZone = current.timezone || 'Asia/Kolkata';
            const today = toLocalDateString(new Date(), timeZone);
            const lastActive = current.last_active_date
                ? toLocalDateString(new Date(current.last_active_date), timeZone)
                : null;

            if (lastActive === today) {
                await client.query('COMMIT');
                return {
                    recorded: false,
                    streak: numberValue(current.tracking_streak_days),
                    longest_streak: numberValue(current.longest_streak_days),
                    xp_awarded: 0
                };
            }

            const currentStreak = numberValue(current.tracking_streak_days);
            const diff = lastActive ? dayDistance(lastActive, today) : null;
            let newStreak = 1;
            let xpAwarded = 10;

            if (diff === 1) {
                newStreak = currentStreak + 1;
            } else if (diff !== null && diff > 1) {
                newStreak = 1;
                xpAwarded = 5;
            } else if (diff !== null && diff <= 0) {
                // Clock/timezone anomalies must never inflate progress.
                newStreak = Math.max(1, currentStreak);
                xpAwarded = 0;
            }

            const newLongest = Math.max(newStreak, numberValue(current.longest_streak_days));
            const newXp = Math.max(0, numberValue(current.xp)) + xpAwarded;
            const totalActions = Math.max(0, numberValue(current.total_actions)) + 1;

            await client.query(
                `UPDATE gamification_state
                 SET tracking_streak_days = $2,
                     longest_streak_days = $3,
                     last_active_date = $4,
                     xp = $5,
                     total_actions = $6,
                     updated_at = NOW()
                 WHERE user_id = $1`,
                [userId, newStreak, newLongest, today, newXp, totalActions]
            );

            if (xpAwarded > 0) {
                await client.query(
                    `INSERT INTO xp_events (user_id, action_type, xp_awarded, description)
                     VALUES ($1, 'daily_tracking', $2, $3)`,
                    [userId, xpAwarded, `Daily tracking streak: ${newStreak} days`]
                );
            }

            await client.query('COMMIT');
            return {
                recorded: true,
                streak: newStreak,
                longest_streak: newLongest,
                xp_awarded: xpAwarded,
                total_xp: newXp
            };
        } catch (error) {
            try { await client.query('ROLLBACK'); } catch { /* no-op */ }
            throw error;
        } finally {
            client.release();
        }
    }

    async collectMetrics(userId) {
        const result = await this.db.query(
            `WITH per_goal_progress AS (
                SELECT
                    g.goal_id,
                    g.status,
                    g.target_amount_paise,
                    COALESCE(SUM(gc.amount_paise) FILTER (WHERE gc.status = 'confirmed'), 0)::bigint
                        AS funded_paise,
                    CASE
                        WHEN g.target_amount_paise > 0 THEN LEAST(
                            100::numeric,
                            COALESCE(SUM(gc.amount_paise) FILTER (WHERE gc.status = 'confirmed'), 0)::numeric
                                * 100::numeric / g.target_amount_paise::numeric
                        )
                        ELSE 0::numeric
                    END AS funded_pct
                FROM goals g
                LEFT JOIN goal_contributions gc
                    ON gc.goal_id = g.goal_id
                   AND gc.user_id = g.user_id
                WHERE g.user_id = $1
                  AND g.is_deleted = FALSE
                  AND g.status IN ('active', 'paused', 'completed')
                GROUP BY g.goal_id, g.status, g.target_amount_paise
            ),
            latest_health AS (
                SELECT savings_pace_ratio
                FROM financial_health_snapshots
                WHERE user_id = $1
                  AND savings_pace_ratio IS NOT NULL
                ORDER BY computed_at DESC
                LIMIT 1
            )
            SELECT
                (SELECT COUNT(*)::int
                   FROM financial_accounts
                  WHERE user_id = $1 AND is_active = TRUE) AS active_account_count,
                (SELECT COUNT(*)::int
                   FROM transactions
                  WHERE user_id = $1
                    AND posting_status = 'posted'
                    AND COALESCE(duplicate_status, 'unique') <> 'duplicate') AS posted_transaction_count,
                COALESCE((SELECT tracking_streak_days FROM gamification_state WHERE user_id = $1), 0)::int
                    AS tracking_streak_days,
                (SELECT COUNT(*)::int
                   FROM budgets
                  WHERE user_id = $1 AND is_active = TRUE) AS active_budget_count,
                (SELECT COUNT(*)::int FROM per_goal_progress) AS goal_count,
                (SELECT COUNT(*)::int
                   FROM per_goal_progress
                  WHERE status = 'completed'
                     OR funded_paise >= target_amount_paise) AS completed_goal_count,
                COALESCE((SELECT ROUND(MAX(funded_pct)) FROM per_goal_progress), 0)::int
                    AS max_goal_progress_percent,
                (SELECT COUNT(*)::int
                   FROM ai_interactions
                  WHERE user_id = $1::text
                    AND UPPER(status) = 'SUCCESS') AS successful_ai_interaction_count,
                COALESCE((
                    SELECT ROUND(GREATEST(0::numeric, savings_pace_ratio) * 100::numeric)
                    FROM latest_health
                ), 0)::int AS savings_pace_percent`,
            [userId]
        );

        const row = result.rows[0] || {};
        return Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key, numberValue(value)])
        );
    }

    async loadDefinitions() {
        const [badges, milestones] = await Promise.all([
            this.db.query(
                `SELECT badge_key AS achievement_key, name AS title, description,
                        metric_key, target, unit, icon_key, tier, tone, sort_order
                 FROM gamification_badge_definitions
                 WHERE is_active = TRUE
                 ORDER BY sort_order ASC`
            ),
            this.db.query(
                `SELECT milestone_key AS achievement_key, title, description,
                        metric_key, target, unit, icon_key, sort_order
                 FROM gamification_milestone_definitions
                 WHERE is_active = TRUE
                 ORDER BY sort_order ASC`
            )
        ]);
        return { badges: badges.rows, milestones: milestones.rows };
    }

    async syncUnlocks(userId, definitions, metrics) {
        const satisfied = [];

        for (const badge of definitions.badges) {
            const current = numberValue(metrics[badge.metric_key]);
            const target = numberValue(badge.target, 1);
            if (current >= target) {
                satisfied.push({ type: 'badge', key: badge.achievement_key });
            }
        }

        for (const milestone of definitions.milestones) {
            const current = numberValue(metrics[milestone.metric_key]);
            const target = numberValue(milestone.target, 1);
            if (current >= target) {
                satisfied.push({ type: 'milestone', key: milestone.achievement_key });
            }
        }

        if (satisfied.length === 0) return;

        const values = [userId];
        const rows = satisfied.map((entry, index) => {
            const typeParam = index * 2 + 2;
            const keyParam = typeParam + 1;
            values.push(entry.type, entry.key);
            return `($1, $${typeParam}, $${keyParam}, NOW())`;
        });

        await this.db.query(
            `INSERT INTO gamification_achievement_unlocks
                (user_id, achievement_type, achievement_key, earned_at)
             VALUES ${rows.join(', ')}
             ON CONFLICT (user_id, achievement_type, achievement_key) DO NOTHING`,
            values
        );
    }

    async loadUnlocks(userId) {
        const result = await this.db.query(
            `SELECT achievement_type, achievement_key, earned_at
             FROM gamification_achievement_unlocks
             WHERE user_id = $1`,
            [userId]
        );
        return new Map(
            result.rows.map(row => [
                `${row.achievement_type}:${row.achievement_key}`,
                row.earned_at
            ])
        );
    }

    async resolveLevel(xp) {
        const result = await this.db.query(
            `SELECT level, level_name, xp_floor
             FROM gamification_levels
             ORDER BY xp_floor ASC`
        );
        const levels = result.rows.map(level => ({
            level: numberValue(level.level, 1),
            level_name: level.level_name,
            xp_floor: numberValue(level.xp_floor)
        }));

        const current = levels.filter(level => xp >= level.xp_floor).at(-1) || levels[0] || {
            level: 1,
            level_name: 'Beginner',
            xp_floor: 0
        };
        const next = levels.find(level => level.xp_floor > xp) || null;
        const span = next ? Math.max(1, next.xp_floor - current.xp_floor) : 1;
        const xpIntoLevel = Math.max(0, xp - current.xp_floor);
        const progressPct = next ? clamp(Math.round((xpIntoLevel / span) * 100), 0, 100) : 100;
        const xpToNext = next ? Math.max(0, next.xp_floor - xp) : 0;

        return {
            level: current.level,
            level_name: current.level_name,
            level_floor_xp: current.xp_floor,
            next_level: next?.level ?? null,
            next_level_name: next?.level_name ?? null,
            next_level_xp: next?.xp_floor ?? null,
            xp_into_level: xpIntoLevel,
            xp_span: next ? span : 0,
            xp_progress_pct: progressPct,
            xp_to_next: xpToNext
        };
    }

    decorateDefinition(definition, type, metrics, unlocks) {
        const target = Math.max(1, numberValue(definition.target, 1));
        const rawProgress = Math.max(0, numberValue(metrics[definition.metric_key]));
        const progress = Math.min(rawProgress, target);
        const earnedAt = unlocks.get(`${type}:${definition.achievement_key}`) || null;
        const earned = Boolean(earnedAt);
        const progressPct = earned ? 100 : clamp(Math.round((progress / target) * 100), 0, 100);

        return {
            key: definition.achievement_key,
            name: definition.title,
            title: definition.title,
            description: definition.description,
            metric_key: definition.metric_key,
            progress,
            raw_progress: rawProgress,
            target,
            unit: definition.unit,
            progress_pct: progressPct,
            remaining: earned ? 0 : Math.max(0, target - rawProgress),
            earned,
            earned_at: earnedAt,
            icon_key: definition.icon_key,
            tier: definition.tier || null,
            tone: definition.tone || null,
            sort_order: numberValue(definition.sort_order)
        };
    }

    async getState(userId, { recordActivity = true } = {}) {
        await this.ensureState(userId);
        if (recordActivity) await this.recordDailyActivity(userId);

        const [stateResult, definitions, metrics, xpEventsResult] = await Promise.all([
            this.db.query(
                `SELECT tracking_streak_days, longest_streak_days, total_actions, xp
                 FROM gamification_state
                 WHERE user_id = $1`,
                [userId]
            ),
            this.loadDefinitions(),
            this.collectMetrics(userId),
            this.db.query(
                `SELECT event_id, action_type, xp_awarded, description, created_at
                 FROM xp_events
                 WHERE user_id = $1
                 ORDER BY created_at DESC
                 LIMIT 10`,
                [userId]
            )
        ]);

        await this.syncUnlocks(userId, definitions, metrics);
        const unlocks = await this.loadUnlocks(userId);

        const state = stateResult.rows[0] || {};
        const xp = Math.max(0, numberValue(state.xp));
        const levelState = await this.resolveLevel(xp);
        const legacyNextLevelThreshold = levelState.next_level_xp ?? xp;

        // Keep the legacy field coherent as an absolute XP threshold. New clients
        // should use xp_to_next + next_level_xp, but older consumers can still
        // safely interpret xp_to_next_level as the next total-XP target.
        await this.db.query(
            `UPDATE gamification_state
             SET level = $2,
                 level_name = $3,
                 xp_to_next_level = $4,
                 updated_at = NOW()
             WHERE user_id = $1
               AND (level IS DISTINCT FROM $2
                 OR level_name IS DISTINCT FROM $3
                 OR xp_to_next_level IS DISTINCT FROM $4)`,
            [userId, levelState.level, levelState.level_name, legacyNextLevelThreshold]
        );

        const badges = definitions.badges.map(definition =>
            this.decorateDefinition(definition, 'badge', metrics, unlocks)
        );
        const milestones = definitions.milestones.map(definition =>
            this.decorateDefinition(definition, 'milestone', metrics, unlocks)
        );

        const incompleteByCloseness = milestones
            .filter(milestone => !milestone.earned)
            .slice()
            .sort((a, b) => b.progress_pct - a.progress_pct || a.sort_order - b.sort_order);
        const recentlyEarned = milestones
            .filter(milestone => milestone.earned)
            .slice()
            .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime());

        return {
            tracking_streak_days: numberValue(state.tracking_streak_days),
            longest_streak_days: numberValue(state.longest_streak_days),
            total_actions: numberValue(state.total_actions),
            xp,
            ...levelState,
            xp_to_next_level: legacyNextLevelThreshold,
            badges,
            milestones,
            featured_milestones: incompleteByCloseness.slice(0, 3),
            latest_milestone: recentlyEarned[0] || null,
            badge_summary: {
                earned: badges.filter(badge => badge.earned).length,
                total: badges.length
            },
            milestone_summary: {
                earned: milestones.filter(milestone => milestone.earned).length,
                total: milestones.length
            },
            metrics,
            recent_xp_events: xpEventsResult.rows.map(event => ({
                event_id: event.event_id,
                action_type: event.action_type,
                xp_awarded: numberValue(event.xp_awarded),
                description: event.description,
                created_at: event.created_at
            }))
        };
    }
}

export const achievementService = new AchievementService();
