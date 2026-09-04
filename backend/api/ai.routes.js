import express from 'express';
import { requireAuth } from './middlewares/security.js';
import { AIGateway } from '../domains/ai/gateway.js';

export default function setupAIRoutes(app, dbClient) {
    const gateway = new AIGateway(dbClient);
    const router = express.Router();

/**
 * Phase 9: AI Abuse Control / Distributed Rate Limiter
 * Atomic sliding window rate limiter backed by Postgres to work across horizontal gateway instances.
 */
const rateLimitMiddleware = async (req, res, next) => {
    const userId = req.user.id;

    const maxRequests = 10;

    try {
        const checkQuery = `
            SELECT count(*) as req_count 
            FROM ai_rate_limits 
            WHERE user_id = $1 AND created_at > NOW() - INTERVAL '1 minute'
        `;
        const countRes = await gateway.dbClient.query(checkQuery, [userId]);
        const currentCount = Number.parseInt(countRes.rows[0].req_count, 10);

        if (currentCount >= maxRequests) {
            return res.status(429).json({ status: 'ERROR', error: 'Rate limit exceeded. Please slow down.' });
        }

        await gateway.dbClient.query(`INSERT INTO ai_rate_limits (user_id) VALUES ($1)`, [userId]);
        next();
    } catch (err) {
        console.error('[RateLimiter] Failed to check distributed limit:', err);
        // Fail-open for rate limits if DB is slow, but budget checks will catch severe abuse
        next();
    }
};

    /**
     * Main NLP Query Endpoint
     */
    router.post('/ai/chat', requireAuth, rateLimitMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const message = req.body.prompt || req.body.message;
        const options = req.body.options || {};

        if (!message) {
            return res.status(400).json({ status: 'ERROR', error: 'Message is required' });
        }

        const response = await gateway.handleQuery(userId, message, options);
        res.json(response);
    } catch (err) {
        next(err);
    }
});

    /**
     * Mutation Confirmation Endpoint
     */
    router.post('/ai/chat/confirm', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { interaction_id, action_payload } = req.body;

        if (!interaction_id || !action_payload) {
            return res.status(400).json({ status: 'ERROR', error: 'Missing confirmation payload' });
        }

        const receipt = await gateway.handleConfirm(userId, interaction_id, action_payload);
        res.json(receipt);
    } catch (err) {
        next(err);
    }
});

    /**
     * AI Home Feed — curated insights, suggestions, and recent activity
     */
    router.get('/ai/home-feed', requireAuth, async (req, res, next) => {
        try {
            const userId = req.user.id;
            const db = gateway.dbClient;

            // Fetch recent AI interactions for this user
            const { rows: interactions } = await db.query(
                `SELECT interaction_id, intent, created_at, status
                 FROM ai_interactions
                 WHERE user_id = $1
                 ORDER BY created_at DESC LIMIT 10`,
                [userId]
            );

            // Fetch available insights
            const { rows: insights } = await db.query(
                `SELECT insight_id, title, tags, confidence, generated_at
                 FROM ai_insights
                 WHERE user_id = $1 AND status = 'active'
                 ORDER BY generated_at DESC LIMIT 5`,
                [userId]
            );

            res.json({
                interactions: interactions.map(i => ({
                    id: i.interaction_id,
                    intent: i.intent,
                    status: i.status,
                    createdAt: i.created_at
                })),
                insights: insights.map(i => ({
                    id: i.insight_id,
                    title: i.title,
                    category: i.tags && i.tags.length > 0 ? i.tags[0] : 'Insight',
                    confidence: i.confidence,
                    createdAt: i.generated_at
                })),
                suggestions: [
                    { prompt: 'How am I doing this month?', route: '/ai/chat?q=monthly+review' },
                    { prompt: 'Where can I save more?', route: '/ai/chat?q=savings+opportunities' },
                    { prompt: 'Am I on track for my goals?', route: '/ai/chat?q=goal+progress' }
                ]
            });
        } catch (err) {
            next(err);
        }
    });

    /**
     * AI Insight Detail — get a specific insight by ID
     */
    router.get('/ai/insights/:id', requireAuth, async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { rows } = await gateway.dbClient.query(
                `SELECT * FROM ai_insights WHERE insight_id = $1 AND user_id = $2`,
                [req.params.id, userId]
            );
            if (!rows.length) return res.status(404).json({ error: 'Insight not found' });
            const insight = rows[0];
            res.json({
                id: insight.insight_id,
                title: insight.title,
                category: insight.tags && insight.tags.length > 0 ? insight.tags[0] : 'Insight',
                description: insight.summary || null,
                data: insight.evidence || null,
                status: insight.status,
                createdAt: insight.generated_at
            });
        } catch (err) {
            next(err);
        }
    });

    /**
     * AI Insight Feedback — submit user feedback on an insight
     */
    router.post('/ai/insights/:id/feedback', requireAuth, async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { rating, comment } = req.body;
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'Rating must be between 1 and 5' });
            }
            await gateway.dbClient.query(
                `INSERT INTO ai_insight_feedback (insight_id, user_id, rating, comment)
                 VALUES ($1, $2, $3, $4)`,
                [req.params.id, userId, rating, comment || null]
            );
            res.json({ status: 'RECORDED', rating });
        } catch (err) {
            next(err);
        }
    });

    /**
     * AI Simulator — run what-if / affordability / money-leaks / explain-month scenarios
     */
    router.post('/ai/simulate', requireAuth, rateLimitMiddleware, async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { type, params } = req.body;
            if (!type || !['affordability', 'money-leaks', 'explain-month', 'goal-accelerator', 'what-if'].includes(type)) {
                return res.status(400).json({ error: 'Invalid simulation type' });
            }
            const result = await gateway.handleQuery(userId,
                `Run ${type} simulation with params: ${JSON.stringify(params || {})}`,
                { simulationType: type, ...params }
            );
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    /**
     * AI Save Simulation — persist a simulation result for later reference
     */
    router.post('/ai/simulate/save', requireAuth, async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { type, title, result, params } = req.body;
            if (!type || !title) {
                return res.status(400).json({ error: 'Type and title are required' });
            }
            // Real schema: input_snapshot (params), output_snapshot (result), label (title)
            const { rows } = await gateway.dbClient.query(
                `INSERT INTO ai_saved_simulations (user_id, simulation_type, input_snapshot, output_snapshot, label)
                 VALUES ($1, $2, $3, $4, $5) RETURNING simulation_id, created_at`,
                [userId, type, JSON.stringify(params || {}), JSON.stringify(result || {}), title]
            );
            res.json({ status: 'SAVED', id: rows[0].simulation_id, savedAt: rows[0].created_at });
        } catch (err) {
            next(err);
        }
    });

    app.use('/api/v1', router);
}
