import crypto from 'node:crypto';
import { AppError } from '../../utils/errors.js';
import { requireAuth } from '../middlewares/security.js';

function timingSafeEqualText(a, b) {
    const left = Buffer.from(String(a || ''));
    const right = Buffer.from(String(b || ''));
    if (left.length !== right.length || left.length === 0) return false;
    return crypto.timingSafeEqual(left, right);
}

/**
 * Setu Account Aggregator routes.
 * User-initiated routes use Clerk auth. Setu server-to-server notifications
 * cannot use a user's Clerk token, so the webhook uses a dedicated secret
 * configured in the Bridge callback URL/header and additionally correlates
 * consent IDs against FinCopilot's DB in AccountAggregatorService.
 */
export function setupAARoutes(app, aaService, options = {}) {
    const webhookSecret = options.webhookSecret || process.env.SETU_WEBHOOK_SECRET;

    function requireSetuWebhook(req, _res, next) {
        if (!webhookSecret) {
            return next(new AppError('Setu webhook secret is not configured.', 503, true, 'SETU_WEBHOOK_NOT_CONFIGURED'));
        }
        const supplied = req.headers['x-fincopilot-setu-webhook-token'] || req.query.token;
        if (!timingSafeEqualText(supplied, webhookSecret)) {
            return next(new AppError('Unauthorized Setu webhook.', 401, false, 'SETU_WEBHOOK_UNAUTHORIZED'));
        }
        next();
    }

    app.post('/api/v1/aa/consent/initiate', requireAuth, async (req, res, next) => {
        try {
            const { vua, from, to, redirectUrl } = req.body || {};
            const result = await aaService.initiateConsent(req.user.id, vua, { from, to, redirectUrl });
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    });

    app.get('/api/v1/aa/consent/:consentId', requireAuth, async (req, res, next) => {
        try {
            res.json(await aaService.getConsentStatus(req.user.id, req.params.consentId));
        } catch (error) {
            next(error);
        }
    });

    app.post('/api/v1/aa/consent/:consentId/revoke', requireAuth, async (req, res, next) => {
        try {
            res.json(await aaService.revokeConsent(req.user.id, req.params.consentId));
        } catch (error) {
            next(error);
        }
    });

    app.post('/api/v1/aa/data/sync', requireAuth, async (req, res, next) => {
        try {
            const { consentId, dataRange } = req.body || {};
            if (!consentId) throw new AppError('consentId is required.', 400, false, 'CONSENT_ID_REQUIRED');
            const result = await aaService.triggerDataSync(req.user.id, consentId, dataRange || null);
            res.status(202).json({ status: 'SYNC_REQUESTED', ...result });
        } catch (error) {
            next(error);
        }
    });

    // Configure this exact endpoint in Setu Bridge. Query-token support is
    // provided because Setu's public AA notification docs do not document a
    // provider signature/header verification contract. Prefer the custom header
    // if your Setu configuration/support arrangement can inject it.
    app.post('/api/v1/aa/webhook', requireSetuWebhook, async (req, res, next) => {
        try {
            const result = await aaService.handleWebhook(req.body);
            res.status(200).json({ status: 'OK', ...result });
        } catch (error) {
            next(error);
        }
    });
}
