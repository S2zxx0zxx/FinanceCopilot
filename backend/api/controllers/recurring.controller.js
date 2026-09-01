/**
 * Recurring Controller — Phase 7
 *
 * All endpoints require Firebase authentication (requireAuth middleware).
 * Owner always resolved from req.user.userId — NEVER from request body/params.
 * Audit events written in service layer.
 */
import { RecurringService } from '../../domains/planning/recurring/recurring.service.js';

export class RecurringController {

    /** POST /api/v1/recurring/detect — trigger detection (idempotent) */
    static async detectPatterns(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await RecurringService.detectAndSavePatterns(userId);
            res.status(200).json({
                message:  'Detection complete',
                ...result
            });
        } catch (err) { next(err); }
    }

    /** GET /api/v1/recurring */
    static async listSeries(req, res, next) {
        try {
            const userId = req.user.userId;
            const { status, frequency } = req.query;
            const series = await RecurringService.listSeries(userId, { status, frequency });
            res.status(200).json({ recurring: series, total: series.length });
        } catch (err) { next(err); }
    }

    /** GET /api/v1/recurring/summary — monthly + annualized burden */
    static async getMonthlySummary(req, res, next) {
        try {
            const userId = req.user.userId;
            const summary = await RecurringService.getMonthlySummary(userId);
            res.status(200).json(summary);
        } catch (err) { next(err); }
    }

    /** GET /api/v1/recurring/:seriesId */
    static async getSeriesDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const { seriesId } = req.params;
            const detail = await RecurringService.getSeriesDetail(userId, seriesId);
            res.status(200).json(detail);
        } catch (err) { next(err); }
    }

    /**
     * PATCH /api/v1/recurring/:seriesId
     * Body: { action: 'confirm'|'dismiss'|'update'|'pause'|'resume'|'end', ...patch }
     */
    static async patchSeries(req, res, next) {
        try {
            const userId = req.user.userId;
            const { seriesId } = req.params;
            const { action, reason, ...patch } = req.body;

            if (!action) return res.status(400).json({ error: 'action is required' });

            let result;
            switch (action) {
                case 'confirm':  result = await RecurringService.confirmSeries(userId, seriesId); break;
                case 'dismiss':  result = await RecurringService.dismissSeries(userId, seriesId, reason); break;
                case 'update':   result = await RecurringService.updateSeries(userId, seriesId, patch); break;
                case 'pause':    result = await RecurringService.pauseSeries(userId, seriesId); break;
                case 'resume':   result = await RecurringService.resumeSeries(userId, seriesId); break;
                case 'end':      result = await RecurringService.endSeries(userId, seriesId); break;
                default:
                    return res.status(400).json({ error: `Unknown action: ${action}` });
            }

            res.status(200).json(result);
        } catch (err) { next(err); }
    }
}
