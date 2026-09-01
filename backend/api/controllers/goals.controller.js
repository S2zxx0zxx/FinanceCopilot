/**
 * Goals Controller — Phase 7
 * Full CRUD + contributions + simulation
 */
import { GoalsService } from '../../domains/planning/goals/goals.service.js';

export class GoalsController {

    /** GET /api/v1/goals */
    static async listGoals(req, res, next) {
        try {
            const userId = req.user.userId;
            const goals = await GoalsService.listGoals(userId);
            res.status(200).json({ goals, total: goals.length });
        } catch (err) { next(err); }
    }

    /** POST /api/v1/goals */
    static async createGoal(req, res, next) {
        try {
            const userId = req.user.userId;
            const goal = await GoalsService.createGoal(userId, req.body);
            res.status(201).json(goal);
        } catch (err) { next(err); }
    }

    /** GET /api/v1/goals/:goalId */
    static async getGoalDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const { goalId } = req.params;
            const goal = await GoalsService.getGoalDetail(userId, goalId);
            res.status(200).json(goal);
        } catch (err) { next(err); }
    }

    /** PATCH /api/v1/goals/:goalId */
    static async updateGoal(req, res, next) {
        try {
            const userId = req.user.userId;
            const { goalId } = req.params;
            const goal = await GoalsService.updateGoal(userId, goalId, req.body);
            res.status(200).json(goal);
        } catch (err) { next(err); }
    }

    /** DELETE /api/v1/goals/:goalId */
    static async archiveGoal(req, res, next) {
        try {
            const userId = req.user.userId;
            const { goalId } = req.params;
            const result = await GoalsService.archiveGoal(userId, goalId);
            res.status(200).json(result);
        } catch (err) { next(err); }
    }

    /**
     * POST /api/v1/goals/:goalId/contributions
     * Headers: Idempotency-Key required
     * Body: { amount_paise, contribution_date?, source_type?, account_id?, notes? }
     */
    static async addContribution(req, res, next) {
        try {
            const userId = req.user.userId;
            const { goalId } = req.params;
            const idempotencyKey = req.headers['idempotency-key'];

            if (!idempotencyKey) {
                return res.status(400).json({ error: 'Idempotency-Key header is required for contributions' });
            }

            const result = await GoalsService.addContribution(userId, goalId, {
                ...req.body,
                idempotency_key: idempotencyKey
            });

            res.status(result?.idempotent ? 200 : 201).json(result);
        } catch (err) { next(err); }
    }

    /** GET /api/v1/goals/:goalId/contributions */
    static async listContributions(req, res, next) {
        try {
            const userId = req.user.userId;
            const { goalId } = req.params;
            // Verify goal belongs to user
            const goal = await GoalsService.getGoalDetail(userId, goalId);
            res.status(200).json({ contributions: goal.contributions, goal_id: goalId });
        } catch (err) { next(err); }
    }

    /**
     * POST /api/v1/goals/:goalId/simulate
     * Body: { higher_monthly_paise: number }
     * Pure calculation — NEVER mutates real goal.
     */
    static async simulateAcceleration(req, res, next) {
        try {
            const userId = req.user.userId;
            const { goalId } = req.params;
            const { higher_monthly_paise } = req.body;

            if (!higher_monthly_paise) {
                return res.status(400).json({ error: 'higher_monthly_paise is required' });
            }

            const result = await GoalsService.simulateAcceleration(userId, goalId, higher_monthly_paise);
            res.status(200).json(result);
        } catch (err) { next(err); }
    }
}
