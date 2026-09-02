import { dbClient } from '../../db/client.js';

/**
 * Gamification Controller — streaks, XP, levels, badges, milestones
 * Gamification ONLY rewards positive financial actions (per 11fs regulatory guidance).
 */
export class GamificationController {
    /**
     * GET /api/v1/gamification
     * Returns the user's complete gamification state: level, XP, streak, badges, milestones.
     */
    static async getGamificationState(req, res, next) {
        try {
            const userId = req.user.userId;

            // 1. Get gamification state (or create if not exists)
            let stateResult = await dbClient.query(
                `SELECT * FROM gamification_state WHERE user_id = $1`, [userId]
            );
            if (stateResult.rowCount === 0) {
                // Initialize gamification state for new user
                await dbClient.query(
                    `INSERT INTO gamification_state (user_id, tracking_streak_days, longest_streak_days, level, level_name, xp, xp_to_next_level)
                     VALUES ($1, 0, 0, 1, 'Beginner', 0, 1000)`, [userId]
                );
                stateResult = await dbClient.query(
                    `SELECT * FROM gamification_state WHERE user_id = $1`, [userId]
                );

                // Seed default badges
                const defaultBadges = [
                    { name: 'Early Adopter', icon: '🚀' },
                    { name: 'Consistent Tracker', icon: '📅' },
                    { name: 'Goal Getter', icon: '🎯' },
                    { name: 'Smart Saver', icon: '💎' },
                    { name: 'AI Explorer', icon: '🧠' },
                    { name: 'Budget Ninja', icon: '🥷' },
                ];
                for (const badge of defaultBadges) {
                    await dbClient.query(
                        `INSERT INTO gamification_badges (user_id, badge_name, icon, earned) VALUES ($1, $2, $3, false)
                         ON CONFLICT (user_id, badge_name) DO NOTHING`,
                        [userId, badge.name, badge.icon]
                    );
                }

                // Seed default milestones
                const defaultMilestones = [
                    { title: 'First Account Connected', description: 'You linked your first bank account', icon: '🔗', target: 1 },
                    { title: '7-Day Tracking Streak', description: 'Tracked your money for 7 consecutive days', icon: '🔥', target: 7 },
                    { title: 'First Goal Created', description: 'You set your first financial goal', icon: '🎯', target: 1 },
                    { title: '30-Day Streak', description: 'Tracked your money for 30 consecutive days', icon: '⚡', target: 30 },
                    { title: '50-Day Streak', description: 'Track your money for 50 consecutive days', icon: '🏆', target: 50 },
                    { title: 'Budget Master', description: 'Stayed under budget for an entire month', icon: '📊', target: 1 },
                    { title: 'Savings Champion', description: 'Saved more than 30% of your income', icon: '💰', target: 1 },
                    { title: 'AI Conversation', description: 'Had your first conversation with FinCopilot AI', icon: '🤖', target: 1 },
                    { title: 'Emergency Fund: 3 Months', description: 'Build a 3-month emergency fund', icon: '🛡️', target: 3 },
                    { title: 'Debt-Free', description: 'Pay off all credit card debt', icon: '✨', target: 1 },
                ];
                for (const ms of defaultMilestones) {
                    await dbClient.query(
                        `INSERT INTO gamification_milestones (user_id, title, description, icon, target)
                         VALUES ($1, $2, $3, $4, $5)`,
                        [userId, ms.title, ms.description, ms.icon, ms.target]
                    );
                }
            }

            const state = stateResult.rows[0];

            // 2. Get badges
            const badgesResult = await dbClient.query(
                `SELECT badge_name, icon, earned, earned_at FROM gamification_badges WHERE user_id = $1 ORDER BY earned DESC, badge_name ASC`, [userId]
            );

            // 3. Get milestones
            const milestonesResult = await dbClient.query(
                `SELECT milestone_id, title, description, icon, achieved, progress, target, achieved_at
                 FROM gamification_milestones WHERE user_id = $1 ORDER BY achieved DESC, title ASC`, [userId]
            );

            // 4. Get recent XP events (last 10)
            const xpEventsResult = await dbClient.query(
                `SELECT event_id, action_type, xp_awarded, description, created_at
                 FROM xp_events WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`, [userId]
            );

            // 5. Calculate XP progress percentage
            const xpProgress = state.xp_to_next_level > 0
                ? Math.round((parseInt(state.xp, 10) / parseInt(state.xp_to_next_level, 10)) * 100)
                : 0;

            res.json({
                tracking_streak_days: parseInt(state.tracking_streak_days, 10),
                longest_streak_days: parseInt(state.longest_streak_days, 10),
                total_actions: parseInt(state.total_actions, 10),
                level: parseInt(state.level, 10),
                level_name: state.level_name,
                xp: parseInt(state.xp, 10),
                xp_to_next_level: parseInt(state.xp_to_next_level, 10),
                xp_progress_pct: xpProgress,
                xp_to_next: parseInt(state.xp_to_next_level, 10) - parseInt(state.xp, 10),
                badges: badgesResult.rows.map(b => ({
                    name: b.badge_name,
                    icon: b.icon,
                    earned: b.earned,
                    earned_at: b.earned_at,
                })),
                milestones: milestonesResult.rows.map(m => ({
                    id: m.milestone_id,
                    title: m.title,
                    description: m.description,
                    icon: m.icon,
                    achieved: m.achieved,
                    progress: parseInt(m.progress, 10),
                    target: parseInt(m.target, 10),
                    achieved_at: m.achieved_at,
                })),
                recent_xp_events: xpEventsResult.rows.map(e => ({
                    action_type: e.action_type,
                    xp_awarded: parseInt(e.xp_awarded, 10),
                    description: e.description,
                    created_at: e.created_at,
                })),
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/v1/gamification/streak/tick
     * Increment the daily tracking streak (called when user opens the app).
     */
    static async tickStreak(req, res, next) {
        try {
            const userId = req.user.userId;
            const today = new Date().toISOString().split('T')[0];

            const state = await dbClient.query(`SELECT * FROM gamification_state WHERE user_id = $1`, [userId]);
            if (state.rowCount === 0) {
                return res.status(404).json({ error: 'Gamification state not initialized' });
            }

            const current = state.rows[0];
            const lastActive = current.last_active_date ? new Date(current.last_active_date).toISOString().split('T')[0] : null;

            let newStreak = parseInt(current.tracking_streak_days, 10);
            let xpAwarded = 0;

            if (lastActive === today) {
                // Already ticked today — no-op
                return res.json({ streak: newStreak, xp_awarded: 0, message: 'Already counted today' });
            }

            if (lastActive) {
                const daysDiff = Math.floor((new Date(today) - new Date(lastActive)) / (1000 * 60 * 60 * 24));
                if (daysDiff === 1) {
                    // Consecutive day — increment streak
                    newStreak += 1;
                    xpAwarded = 10; // +10 XP for daily tracking
                } else if (daysDiff > 1) {
                    // Streak broken — reset
                    newStreak = 1;
                    xpAwarded = 5;
                }
            } else {
                newStreak = 1;
                xpAwarded = 10;
            }

            const newLongest = Math.max(newStreak, parseInt(current.longest_streak_days, 10));
            const newXP = parseInt(current.xp, 10) + xpAwarded;
            const newTotalActions = parseInt(current.total_actions, 10) + 1;

            // Level up check
            let newLevel = parseInt(current.level, 10);
            let newLevelName = current.level_name;
            let newXPToNext = parseInt(current.xp_to_next_level, 10);

            const LEVELS = [
                { level: 1, name: 'Beginner', xpRequired: 0 },
                { level: 2, name: 'Money Saver', xpRequired: 500 },
                { level: 3, name: 'Finance Tracker', xpRequired: 1500 },
                { level: 4, name: 'Money Master', xpRequired: 2500 },
                { level: 5, name: 'Wealth Wizard', xpRequired: 5000 },
                { level: 6, name: 'Finance Guru', xpRequired: 10000 },
            ];

            for (const lvl of LEVELS) {
                if (newXP >= lvl.xpRequired) {
                    newLevel = lvl.level;
                    newLevelName = lvl.name;
                    newXPToNext = (LEVELS.find(l => l.level === lvl.level + 1)?.xpRequired || newXP + 2500) - newXP;
                }
            }

            await dbClient.query(
                `UPDATE gamification_state
                 SET tracking_streak_days = $2, longest_streak_days = $3, last_active_date = $4,
                     xp = $5, level = $6, level_name = $7, xp_to_next_level = $8,
                     total_actions = $9, updated_at = NOW()
                 WHERE user_id = $1`,
                [userId, newStreak, newLongest, today, newXP, newLevel, newLevelName, newXPToNext, newTotalActions]
            );

            // Log XP event
            if (xpAwarded > 0) {
                await dbClient.query(
                    `INSERT INTO xp_events (user_id, action_type, xp_awarded, description)
                     VALUES ($1, 'daily_tracking', $2, $3)`,
                    [userId, xpAwarded, `Daily tracking streak: ${newStreak} days`]
                );
            }

            // Check milestone progress (7, 30, 50 day streaks)
            const streakMilestones = [
                { title: '7-Day Tracking Streak', target: 7 },
                { title: '30-Day Streak', target: 30 },
                { title: '50-Day Streak', target: 50 },
            ];
            for (const ms of streakMilestones) {
                if (newStreak >= ms.target) {
                    await dbClient.query(
                        `UPDATE gamification_milestones SET achieved = true, progress = $3, achieved_at = NOW()
                         WHERE user_id = $1 AND title = $2 AND achieved = false`,
                        [userId, ms.title, ms.target]
                    );
                } else {
                    await dbClient.query(
                        `UPDATE gamification_milestones SET progress = $3
                         WHERE user_id = $1 AND title = $2 AND achieved = false`,
                        [userId, ms.title, newStreak]
                    );
                }
            }

            res.json({
                streak: newStreak,
                longest_streak: newLongest,
                xp_awarded: xpAwarded,
                total_xp: newXP,
                level: newLevel,
                level_name: newLevelName,
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/v1/gamification/badges/:badgeName/earn
     * Earn a badge (called when user achieves a specific action).
     */
    static async earnBadge(req, res, next) {
        try {
            const userId = req.user.userId;
            const { badgeName } = req.params;
            const result = await dbClient.query(
                `UPDATE gamification_badges SET earned = true, earned_at = NOW()
                 WHERE user_id = $1 AND badge_name = $2 AND earned = false
                 RETURNING *`,
                [userId, badgeName]
            );
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'RESOURCE_NOT_FOUND', message: 'Badge not found or already earned' });
            }
            res.json({ badge: result.rows[0] });
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/v1/gamification/milestones/:id/progress
     * Update progress on a milestone.
     */
    static async updateMilestoneProgress(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { progress } = req.body;
            const result = await dbClient.query(
                `UPDATE gamification_milestones SET progress = $3
                 WHERE user_id = $1 AND milestone_id = $2 AND achieved = false
                 RETURNING *`,
                [userId, id, progress]
            );
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'RESOURCE_NOT_FOUND', message: 'Milestone not found or already achieved' });
            }

            // Check if milestone is now complete
            const milestone = result.rows[0];
            if (parseInt(milestone.progress, 10) >= parseInt(milestone.target, 10)) {
                await dbClient.query(
                    `UPDATE gamification_milestones SET achieved = true, achieved_at = NOW()
                     WHERE milestone_id = $1`,
                    [milestone.milestone_id]
                );
                // Award XP for milestone completion
                await dbClient.query(
                    `INSERT INTO xp_events (user_id, action_type, xp_awarded, description)
                     VALUES ($1, 'milestone_achieved', $2, $3)`,
                    [userId, 100, `Milestone achieved: ${milestone.title}`]
                );
                // Add XP to state
                await dbClient.query(
                    `UPDATE gamification_state SET xp = xp + 100, updated_at = NOW() WHERE user_id = $1`,
                    [userId]
                );
            }

            res.json({ milestone: result.rows[0] });
        } catch (err) {
            next(err);
        }
    }
}
