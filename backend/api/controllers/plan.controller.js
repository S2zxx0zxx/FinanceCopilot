/**
 * Plan Controller — Phase 7 §28
 *
 * Orchestration layer — aggregates goals + upcoming + cashflow + financial health.
 * Does NOT duplicate finance calculation logic — reuses domain services.
 *
 * GET /api/v1/plan
 */
import { GoalsService } from '../../domains/planning/goals/goals.service.js';
import { UpcomingEngine } from '../../domains/planning/upcoming/upcoming.engine.js';
import { CashflowService } from '../../domains/planning/cashflow/cashflow.service.js';
import { FinancialHealthService } from '../../domains/planning/health/financial_health.service.js';

export class PlanController {

    /** GET /api/v1/plan */
    static async getPlan(req, res, next) {
        try {
            const userId = req.user.userId;

            // Parallel fetch — all domain services
            const [goals, upcoming, cashflow, health] = await Promise.allSettled([
                GoalsService.listGoals(userId),
                UpcomingEngine.generate(userId, '30d'),
                CashflowService.getCashflowPlan(userId, '30d'),
                FinancialHealthService.computeHealthSnapshot(userId)
            ]);

            const resolveSettled = (result, fallback) =>
                result.status === 'fulfilled' ? result.value : { error: result.reason?.message || 'unavailable', ...fallback };

            res.status(200).json({
                as_of:    new Date().toISOString(),
                goals:    resolveSettled(goals,    { goals: [], total: 0 }),
                upcoming: resolveSettled(upcoming, { items: [], total_count: 0 }),
                cashflow: resolveSettled(cashflow, { error: 'unavailable' }),
                health:   resolveSettled(health,   { error: 'unavailable' }),
                // Note: scenarios (Phase 10) and forecast (Phase 8) not included
                plan_version: 'v1.0.0'
            });
        } catch (err) { next(err); }
    }
}
