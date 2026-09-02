import express from 'express';
import { requireAuth } from './middlewares/security.js';
import { IngestionController } from './controllers/ingestion.controller.js';
import { FinancialController } from './controllers/financial.controller.js';
import { AccountsController } from './controllers/accounts.controller.js';
import { TransactionsController } from './controllers/transactions.controller.js';
import { SearchController } from './controllers/search.controller.js';
// Phase 7 — Planning
import { RecurringController } from './controllers/recurring.controller.js';
import { UpcomingController } from './controllers/upcoming.controller.js';
import { GoalsController } from './controllers/goals.controller.js';
import { PlanController } from './controllers/plan.controller.js';
import { FinancialHealthController } from './controllers/financial_health.controller.js';
// Phase 8 — Forecast
import * as ForecastController from './controllers/forecast.controller.js';
// Phase 11 — Trust & Operations
import { TrustController } from './controllers/trust.controller.js';
import { requireFeatureFlag } from './middlewares/feature-flag.js';
import { DataQualityController } from './controllers/data_quality.controller.js';
// Phase v988 — New Features
import { BudgetsController } from './controllers/budgets.controller.js';
import { NotificationsController } from './controllers/notifications.controller.js';
import { GamificationController } from './controllers/gamification.controller.js';
import { InsightsController } from './controllers/insights.controller.js';

// Internal webhook validation — rejects requests without a valid service token
function validateInternalWebhook(req, res, next) {
    const token = req.headers['x-internal-token'];
    if (!token || token !== (process.env.INTERNAL_WEBHOOK_TOKEN || 'fincopilot-internal-2024')) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
}

/**
 * API Router Setup
 *
 * Mounts all controllers to their specific routes.
 * Every route requires Firebase authentication unless marked [PUBLIC].
 * Owner is ALWAYS resolved from req.user — never from request body/params.
 */
export function setupRoutes(app, dependencies) {
    const router = express.Router();

    // Initialize Controllers
    const ingestionController = new IngestionController(dependencies.ingestionService);

    // ── Phase 2: Ingestion / Import ───────────────────────────────────────────
    router.post('/import/upload-intent', requireAuth, (req, res) => ingestionController.initiateUpload(req, res));
    router.post('/import/confirm',       requireAuth, (req, res) => ingestionController.confirmUpload(req, res));
    router.post('/import/replay/:job_id', requireAuth, (req, res) => ingestionController.replayJob(req, res));

    // ── Phase 6: Financial State BFF ──────────────────────────────────────────
    router.get('/financial-state/home',           requireAuth, FinancialController.getHomeState);
    router.get('/financial-state/money',          requireAuth, FinancialController.getMoneyState);
    router.get('/financial-state/spending-story', requireAuth, FinancialController.getSpendingStory);
    router.get('/financial-state/income',         requireAuth, FinancialController.getIncome);
    router.get('/financial-state/categories/:id', requireAuth, FinancialController.getCategoryDetail);

    // ── Phase 6: Accounts ─────────────────────────────────────────────────────
    router.get('/accounts',     requireAuth, AccountsController.getAccounts);
    router.get('/accounts/:id', requireAuth, AccountsController.getAccountDetail);

    // ── Phase 6: Transactions ─────────────────────────────────────────────────
    router.get('/transactions',          requireAuth, TransactionsController.getTransactions);
    router.get('/transactions/:id',      requireAuth, TransactionsController.getTransactionDetail);
    router.put('/transactions/:id',      requireAuth, TransactionsController.updateTransaction);
    router.post('/transactions/:id/split', requireAuth, TransactionsController.splitTransaction);

    // ── Phase 6: Search ───────────────────────────────────────────────────────
    router.get('/search', requireAuth, SearchController.search);

    // ── Phase 7: Recurring ────────────────────────────────────────────────────
    // Detection (idempotent — safe to call multiple times)
    router.post('/recurring/detect',        requireAuth, RecurringController.detectPatterns);
    // Summary: monthly + annualized burden
    router.get('/recurring/summary',        requireAuth, RecurringController.getMonthlySummary);
    // List all series (filter: ?status=&frequency=)
    router.get('/recurring',                requireAuth, RecurringController.listSeries);
    // Detail view with evidence
    router.get('/recurring/:seriesId',      requireAuth, RecurringController.getSeriesDetail);
    // Lifecycle: confirm | dismiss | update | pause | resume | end
    router.patch('/recurring/:seriesId',    requireAuth, RecurringController.patchSeries);

    // ── Phase 7: Upcoming ─────────────────────────────────────────────────────
    // ?horizon=7d|30d|90d
    router.get('/upcoming',                 requireAuth, UpcomingController.getUpcoming);

    // ── Phase 7: Cashflow Planning (defined in 08_API_CONTRACTS §6) ───────────
    // Note: matches contract endpoint GET /api/v1/financial/cashflow?period=7d|30d|90d
    router.get('/financial/cashflow',       requireAuth, async (req, res, next) => {
        const { CashflowService } = await import('../domains/planning/cashflow/cashflow.service.js');
        try {
            const userId = req.user.userId;
            const period = req.query.period || '30d';
            const result = await CashflowService.getCashflowPlan(userId, period);
            res.status(200).json(result);
        } catch (err) { next(err); }
    });

    // ── Phase 7: Goals ────────────────────────────────────────────────────────
    router.get('/goals',                          requireAuth, GoalsController.listGoals);
    router.post('/goals',                         requireAuth, GoalsController.createGoal);
    router.get('/goals/:goalId',                  requireAuth, GoalsController.getGoalDetail);
    router.patch('/goals/:goalId',                requireAuth, GoalsController.updateGoal);
    router.delete('/goals/:goalId',               requireAuth, GoalsController.archiveGoal);
    // Contributions (Idempotency-Key header required)
    router.post('/goals/:goalId/contributions',   requireAuth, GoalsController.addContribution);
    router.get('/goals/:goalId/contributions',    requireAuth, GoalsController.listContributions);
    // Goal acceleration simulation (read-only — never mutates real state)
    router.post('/goals/:goalId/simulate',        requireAuth, GoalsController.simulateAcceleration);

    // ── Phase 7: Plan Orchestration ───────────────────────────────────────────
    // Returns goals + upcoming + cashflow + health in one call
    router.get('/plan',                           requireAuth, PlanController.getPlan);

    // ── Phase 7: Financial Health ─────────────────────────────────────────────
    // 4 canonical components: cash_buffer, commitment_load, savings_pace, spending_stability
    router.get('/financial-health',               requireAuth, FinancialHealthController.getHealthSnapshot);

    // ── Phase 8: Forecast (Beta Gated) ────────────────────────────────────────
    router.get('/forecast/outlook',               requireAuth, requireFeatureFlag('ai_forecast_beta'), ForecastController.getOutlook);
    router.post('/forecast/scenario',             requireAuth, requireFeatureFlag('ai_forecast_beta'), ForecastController.runScenario);
    router.get('/forecast/evaluation',            requireAuth, requireFeatureFlag('ai_forecast_beta'), ForecastController.getEvaluationMetrics);

    // ── Phase 11: Trust & Operations ──────────────────────────────────────────
    router.get('/trust/connections',                    requireAuth, TrustController.getConnections);
    router.post('/trust/connections/:id/disconnect',    requireAuth, TrustController.disconnectConnection);
    
    router.get('/trust/privacy/inventory',              requireAuth, TrustController.getPrivacyInventory);
    router.post('/trust/privacy/consent',               requireAuth, TrustController.updatePrivacyConsent);
    
    router.get('/trust/security/sessions',              requireAuth, TrustController.getSecuritySessions);
    router.post('/trust/security/sessions/revoke',      requireAuth, TrustController.revokeSecuritySession);
    
    router.post('/trust/export',                        requireAuth, TrustController.requestExport);
    router.get('/trust/export/status',                  requireAuth, TrustController.getExportStatus);
    router.patch('/internal/export/status',             validateInternalWebhook, TrustController._internalUpdateExportStatus);
    
    router.post('/trust/deletion',                      requireAuth, TrustController.requestDeletion);
    router.get('/trust/deletion/status',                requireAuth, TrustController.getDeletionStatus);
    router.patch('/internal/deletion/status',           validateInternalWebhook, TrustController._internalUpdateDeletionStatus);
    
    router.get('/trust/preferences',                    requireAuth, TrustController.getPreferences);
    router.post('/trust/preferences/update',            requireAuth, TrustController.updatePreferences);
    
    router.get('/trust/notifications/preferences',      requireAuth, TrustController.getNotificationPreferences);
    router.post('/trust/notifications/update',          requireAuth, TrustController.updateNotificationPreferences);

    // ── Frontend path aliases (privacy/trust path alignment) ──────────────
    router.get('/trust/privacy',                        requireAuth, TrustController.getPrivacyInventory);
    router.put('/trust/privacy',                        requireAuth, TrustController.updatePrivacyConsent);
    router.post('/trust/consent',                       requireAuth, TrustController.updatePrivacyConsent);
    router.post('/trust/delete-data',                   requireAuth, TrustController.requestDeletion);

    // ── Phase 13: Beta Data Quality ───────────────────────────────────────────
    router.get('/internal/data-quality',                requireAuth, requireFeatureFlag('new_trust_dashboard'), DataQualityController.getQualityMetrics);
    // Public alias — frontend calls this path
    router.get('/data-quality',                         requireAuth, DataQualityController.getQualityMetrics);

    // ── Auth Profile & Security (frontend expects /auth/* paths) ─────────────
    router.get('/auth/me',                              requireAuth, async (req, res, next) => {
        try {
            const { dbClient } = await import('../../db/client.js');
            const { rows } = await dbClient.query(
                'SELECT user_id, email, display_name, created_at FROM users WHERE user_id = $1',
                [req.user.userId]
            );
            if (!rows.length) return res.status(404).json({ error: 'User not found' });
            res.json(rows[0]);
        } catch (err) { next(err); }
    });

    router.post('/auth/onboarding-complete',           requireAuth, async (req, res, next) => {
        try {
            const { dbClient } = await import('../../db/client.js');
            await dbClient.query(
                'UPDATE users SET onboarding_completed = true, onboarding_completed_at = NOW() WHERE user_id = $1',
                [req.user.userId]
            );
            res.json({ status: 'COMPLETED' });
        } catch (err) { next(err); }
    });

    router.get('/auth/security',                        requireAuth, TrustController.getSecuritySessions);
    router.put('/auth/security',                        requireAuth, async (req, res, next) => {
        try {
            const { action, value } = req.body;
            if (action === 'toggle_2fa') {
                const { dbClient } = await import('../../db/client.js');
                await dbClient.query(
                    'UPDATE users SET two_factor_enabled = $1 WHERE user_id = $2',
                    [value, req.user.userId]
                );
                return res.json({ status: 'UPDATED', twoFactorEnabled: value });
            }
            // Password changes go through Firebase — return guidance
            res.json({ status: 'PASSWORD_CHANGE_REDIRECT', provider: 'firebase' });
        } catch (err) { next(err); }
    });
    router.post('/auth/security/sessions/revoke',      requireAuth, TrustController.revokeSecuritySession);
    router.delete('/auth/account',                      requireAuth, async (req, res, next) => {
        try {
            // Delegate to the existing deletion flow
            await TrustController.requestDeletion(req, res);
        } catch (err) { next(err); }
    });

    // ── Liabilities (frontend calls /financial/liabilities) ───────────────────
    router.get('/financial/liabilities',                requireAuth, async (req, res, next) => {
        try {
            const { dbClient } = await import('../../db/client.js');
            const { rows } = await dbClient.query(
                `SELECT a.account_id, a.account_name, a.account_type,
                        a.posted_balance_paise, a.currency
                 FROM accounts a
                 WHERE a.user_id = $1 AND a.posted_balance_paise < 0 AND a.is_deleted = false
                 ORDER BY a.posted_balance_paise ASC`,
                [req.user.userId]
            );
            const totalLiabilitiesPaise = rows.reduce((sum, r) => sum + Number(r.posted_balance_paise), 0);
            res.json({ liabilities: rows, total_paise: totalLiabilitiesPaise, currency: 'INR' });
        } catch (err) { next(err); }
    });

    // ── BUDGETS (Phase: v988) ─────────────────────────────────────────────────
    router.get('/budgets',                 requireAuth, BudgetsController.listBudgets);
    router.post('/budgets',                requireAuth, BudgetsController.createBudget);
    router.put('/budgets/:id',             requireAuth, BudgetsController.updateBudget);
    router.delete('/budgets/:id',           requireAuth, BudgetsController.deleteBudget);
    router.post('/budgets/recalculate',    requireAuth, BudgetsController.recalculateSpent);

    // ── NOTIFICATIONS (Phase: v988) ───────────────────────────────────────────
    router.get('/notifications',            requireAuth, NotificationsController.listNotifications);
    router.put('/notifications/:id/read',   requireAuth, NotificationsController.markRead);
    router.put('/notifications/read-all',  requireAuth, NotificationsController.markAllRead);
    router.post('/notifications',           requireAuth, NotificationsController.createNotification);
    router.delete('/notifications/:id',    requireAuth, NotificationsController.deleteNotification);

    // ── GAMIFICATION (Phase: v988) ─────────────────────────────────────────────
    router.get('/gamification',                         requireAuth, GamificationController.getGamificationState);
    router.post('/gamification/streak/tick',            requireAuth, GamificationController.tickStreak);
    router.post('/gamification/badges/:badgeName/earn', requireAuth, GamificationController.earnBadge);
    router.post('/gamification/milestones/:id/progress', requireAuth, GamificationController.updateMilestoneProgress);

    // ── INSIGHTS: Peer Comparison, Calendar, Net Worth, Savings Challenges, Preferences ──
    router.get('/peer-comparison',          requireAuth, InsightsController.getPeerComparison);
    router.get('/calendar/events',          requireAuth, InsightsController.getCalendarEvents);
    router.get('/net-worth/history',        requireAuth, InsightsController.getNetWorthHistory);
    router.get('/savings-challenges',        requireAuth, InsightsController.getSavingsChallenges);
    router.post('/savings-challenges/:id/contribute', requireAuth, InsightsController.contributeToChallenge);
    router.get('/preferences',              requireAuth, InsightsController.getPreferences);
    router.put('/preferences',              requireAuth, InsightsController.updatePreferences);

    // ── Mount ─────────────────────────────────────────────────────────────────
    app.use('/api/v1', router);

    console.log('[API] Routes initialized — Phase 8 forecast routes active.');
}

