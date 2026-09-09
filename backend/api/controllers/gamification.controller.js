import { dbClient } from '../../db/client.js';
import { achievementService } from '../../domains/gamification/achievement.service.js';

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
    const fromUtc = Date.UTC(fy, fm - 1, fd);
    const toUtc = Date.UTC(ty, tm - 1, td);
    return Math.round((toUtc - fromUtc) / 86400000);
}

/**
 * Gamification Controller
 *
 * V2 contract:
 * - achievement progress is derived from authoritative domain data;
 * - clients cannot grant badges or write milestone progress;
 * - streak ticks remain idempotent per user's configured calendar day;
 * - level thresholds come from gamification_levels, not a controller constant.
 */
export class GamificationController {
    /**
     * GET /api/v1/gamification
     * Returns a complete, data-driven achievement read model.
     */
    static async getGamificationState(req, res, next) {
        try {
            const state = await achievementService.getState(req.user.userId);
            res.json(state);
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/v1/gamification/streak/tick
     * Counts one active tracking day. Repeated calls on the same local date are
     * no-ops, and concurrent requests are serialized with SELECT ... FOR UPDATE.
     */
    static async tickStreak(req, res, next) {
        const userId = req.user.userId;
        let client;
        try {
            client = await dbClient.connect();
            await client.query('BEGIN');

            await client.query(
                `INSERT INTO gamification_state
                    (user_id, tracking_streak_days, longest_streak_days, level, level_name, xp, xp_to_next_level)
                 VALUES ($1, 0, 0, 1, 'Beginner', 0, 500)
                 ON CONFLICT (user_id) DO NOTHING`,
                [userId]
            );

            const stateResult = await client.query(
                `SELECT gs.*, COALESCE(u.timezone, 'Asia/Kolkata') AS timezone
                 FROM gamification_state gs
                 JOIN users u ON u.user_id = gs.user_id
                 WHERE gs.user_id = $1
                 FOR UPDATE OF gs`,
                [userId]
            );
            const current = stateResult.rows[0];
            if (!current) {
                throw new Error('Gamification state could not be initialized');
            }

            const timeZone = current.timezone || 'Asia/Kolkata';
            const today = toLocalDateString(new Date(), timeZone);
            const lastActive = current.last_active_date
                ? toLocalDateString(new Date(current.last_active_date), timeZone)
                : null;

            let newStreak = Number(current.tracking_streak_days) || 0;
            let xpAwarded = 0;

            if (lastActive !== today) {
                if (!lastActive) {
                    newStreak = 1;
                    xpAwarded = 10;
                } else {
                    const diff = dayDistance(lastActive, today);
                    if (diff === 1) {
                        newStreak += 1;
                        xpAwarded = 10;
                    } else if (diff > 1) {
                        newStreak = 1;
                        xpAwarded = 5;
                    } else {
                        // Clock/timezone anomalies must never inflate a streak.
                        newStreak = Math.max(1, newStreak);
                        xpAwarded = 0;
                    }
                }

                const newLongest = Math.max(newStreak, Number(current.longest_streak_days) || 0);
                const newXp = Math.max(0, Number(current.xp) || 0) + xpAwarded;
                const totalActions = Math.max(0, Number(current.total_actions) || 0) + 1;

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
            }

            await client.query('COMMIT');
            client.release();
            client = null;

            // Recalculate level and achievement unlocks from the authoritative state.
            const refreshed = await achievementService.getState(userId);
            res.json({
                streak: refreshed.tracking_streak_days,
                longest_streak: refreshed.longest_streak_days,
                xp_awarded: xpAwarded,
                total_xp: refreshed.xp,
                level: refreshed.level,
                level_name: refreshed.level_name,
                xp_to_next: refreshed.xp_to_next,
                message: lastActive === today ? 'Already counted today' : 'Tracking day recorded'
            });
        } catch (err) {
            if (client) {
                try { await client.query('ROLLBACK'); } catch { /* no-op */ }
                client.release();
            }
            next(err);
        }
    }

    /**
     * Legacy endpoints intentionally remain as explicit 405 responses so older
     * clients fail safely instead of being able to self-award achievements.
     */
    static async earnBadge(_req, res) {
        return res.status(405).json({
            error: 'SERVER_MANAGED_ACHIEVEMENT',
            message: 'Badges are unlocked automatically from verified FinCopilot activity.'
        });
    }

    static async updateMilestoneProgress(_req, res) {
        return res.status(405).json({
            error: 'SERVER_MANAGED_ACHIEVEMENT',
            message: 'Milestone progress is calculated automatically from verified FinCopilot activity.'
        });
    }
}
