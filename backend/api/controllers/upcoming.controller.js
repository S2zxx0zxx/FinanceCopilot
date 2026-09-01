/**
 * Upcoming Controller — Phase 7
 * GET /api/v1/upcoming?horizon=7d|30d|90d
 */
import { UpcomingEngine } from '../../domains/planning/upcoming/upcoming.engine.js';

export class UpcomingController {
    static async getUpcoming(req, res, next) {
        try {
            const userId = req.user.userId;
            const horizon = req.query.horizon || '30d';
            const result = await UpcomingEngine.generate(userId, horizon);
            res.status(200).json(result);
        } catch (err) { next(err); }
    }
}
