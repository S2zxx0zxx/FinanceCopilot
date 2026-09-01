import { AppError } from '../../utils/errors.js';

/**
 * Account Aggregator Routes
 * 
 * Defines endpoints for initiating AA flows and receiving network webhooks.
 */
export function setupAARoutes(app, aaService) {
    
    // FIU initiates consent request (Called by FinCopilot Frontend)
    app.post('/api/v1/aa/consent/initiate', async (req, res, next) => {
        try {
            const { vua } = req.body;
            // Assuming auth middleware sets req.user
            const userId = req.user ? req.user.id : 'anonymous'; 

            const result = await aaService.initiateConsent(userId, vua);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    });

    // Webhook called by the AA Network when consent status changes
    app.post('/api/v1/aa/consent/webhook', async (req, res, next) => {
        try {
            // Verify Webhook Signature here in a real implementation
            await aaService.handleConsentWebhook(req.body);
            res.status(200).json({ status: 'OK' });
        } catch (error) {
            next(error);
        }
    });

    // Webhook called by the AA Network when FI data is ready
    app.post('/api/v1/aa/data/webhook', async (req, res, next) => {
        try {
            // Verify Webhook Signature here in a real implementation
            await aaService.handleDataWebhook(req.body);
            res.status(200).json({ status: 'OK' });
        } catch (error) {
            next(error);
        }
    });

    // Manually trigger data sync (Called by FinCopilot Frontend or Cron)
    app.post('/api/v1/aa/data/sync', async (req, res, next) => {
        try {
            const { consentId } = req.body;
            const userId = req.user ? req.user.id : 'anonymous'; 
            
            await aaService.triggerDataSync(userId, consentId);
            res.status(200).json({ status: 'SYNC_QUEUED' });
        } catch (error) {
            next(error);
        }
    });

}
