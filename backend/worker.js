import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { IngestionWorker } from './workers/ingestion.worker.js';
import { NormalizationWorker } from './workers/normalization.worker.js';
import { ReconciliationWorker } from './workers/reconciliation.worker.js';
import { dbClient } from './db/client.js';

/**
 * FinCopilot — Background Worker Master Process
 * 
 * Replaces the Cloudflare Edge Workers for local/monolith deployments.
 */

async function startWorkers() {
    logger.info(`Starting FinCopilot Background Workers in ${config.env} mode...`);

    try {
        // Ensure DB connection is active before starting workers
        await dbClient.query('SELECT 1');
        logger.info('Database connection established for workers.');
    } catch (err) {
        logger.error('Failed to connect to database for workers. Exiting...', { error: err.message });
        process.exit(1);
    }

    // 1. Ingestion Worker (Polls for 'queued' jobs like PDF uploads)
    const ingestionWorker = new IngestionWorker();
    ingestionWorker.startPolling(5000); // Poll every 5s

    // 2. Normalization Worker (Polls for 'raw' source records)
    const normalizationWorker = new NormalizationWorker();
    normalizationWorker.startPolling(5000); // Poll every 5s

    // 3. Reconciliation Worker (Simulated Cron since it's tenant-based)
    // Note: In a real system, we'd query active tenants. Here we mock a systemic run.
    logger.info('Reconciliation worker scheduled (Simulated Cron).');
    setInterval(async () => {
        try {
            // Loop over all active users in the system and run reconciliation for each tenant.
            const { rows: users } = await dbClient.query('SELECT user_id FROM users WHERE is_deleted = FALSE');
            for (const user of users) {
                await ReconciliationWorker.startRun(user.user_id);
            }
        } catch (err) {
            logger.error('[RECONCILIATION_CRON] Failed run:', err);
        }
    }, 60000); // Run every 60 seconds

    logger.info('All background polling loops initialized successfully.');
}

startWorkers().catch(err => {
    logger.error('Fatal error starting workers', err);
    process.exit(1);
});
