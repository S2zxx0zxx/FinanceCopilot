/**
 * Financial Health Controller — Phase 7
 * GET /api/v1/financial-health
 */
import { FinancialHealthService } from '../../domains/planning/health/financial_health.service.js';

export class FinancialHealthController {
    static async getHealthSnapshot(req, res, next) {
        try {
            const userId = req.user.userId;
            const health = await FinancialHealthService.computeHealthSnapshot(userId);
            res.status(200).json(health);
        } catch (err) { next(err); }
    }
}
