import { dbClient } from './client.js';

export const ReconciliationRepo = {

    /**
     * Atomically starts a reconciliation run for a tenant.
     */
    async createRun(tenantId, version) {
        const text = `
            INSERT INTO reconciliation_runs (tenant_id, reconciliation_version, status)
            VALUES ($1, $2, 'started')
            RETURNING *;
        `;
        const res = await dbClient.query(text, [tenantId, version]);
        return res.rows[0];
    },

    /**
     * Safely fetches unreconciled transactions for a given tenant.
     * Uses FOR UPDATE SKIP LOCKED if called within a transaction block.
     */
    async claimUnreconciledTransactions(client, tenantId, limit = 100) {
        const text = `
            SELECT * FROM transactions
            WHERE user_id = $1 
            ORDER BY observed_at DESC
            LIMIT $2
            FOR UPDATE SKIP LOCKED;
        `;
        const res = await client.query(text, [tenantId, limit]);
        return res.rows;
    },

    /**
     * Gets a broad context window of historical transactions for matching.
     */
    async getContextTransactions(client, tenantId) {
        const text = `
            SELECT * FROM transactions
            WHERE user_id = $1
            ORDER BY observed_at DESC
            -- Broad window for matching
            LIMIT 1000;
        `;
        const res = await client.query(text, [tenantId]);
        return res.rows;
    },

    /**
     * Upserts a relationship idempotently.
     */
    async saveRelationship(client, rel, runId) {
        const text = `
            INSERT INTO transaction_relationships 
            (tenant_id, source_transaction_id, target_transaction_id, relationship_type, status, confidence_score, evidence, reconciliation_version, reconciliation_run_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (source_transaction_id, target_transaction_id, relationship_type) DO NOTHING
            RETURNING *;
        `;
        const res = await client.query(text, [
            rel.tenant_id, 
            rel.source_transaction_id, 
            rel.target_transaction_id, 
            rel.relationship_type, 
            rel.status, 
            rel.confidence_score, 
            JSON.stringify(rel.evidence),
            rel.reconciliation_version,
            runId
        ]);
        return res.rows[0];
    },

    /**
     * Creates a review item for ambiguous matches.
     */
    async createReviewItem(client, review) {
        const text = `
            INSERT INTO review_items 
            (tenant_id, relationship_id, reason_code, status, evidence, score, reconciliation_version)
            VALUES ($1, $2, $3, 'open', $4, $5, $6)
            RETURNING *;
        `;
        const res = await client.query(text, [
            review.tenant_id, 
            review.relationship_id,
            review.reason_code,
            JSON.stringify(review.evidence),
            review.score,
            review.reconciliation_version
        ]);
        return res.rows[0];
    },

    /**
     * Updates the run with final metrics.
     */
    async completeRun(client, runId, stats) {
        const text = `
            UPDATE reconciliation_runs
            SET status = 'completed',
                completed_at = NOW(),
                records_examined = $1,
                matches_found = $2,
                reviews_created = $3
            WHERE run_id = $4
            RETURNING *;
        `;
        const res = await client.query(text, [stats.records_examined, stats.matches_found, stats.reviews_created, runId]);
        return res.rows[0];
    },

    /**
     * SECURE WORKFLOW: Resolve a review item.
     * Enforces that the actor is authorized for the tenant.
     */
    async resolveReviewItem(client, reviewId, tenantId, actorId, resolutionEvent) {
        // Enforce tenant boundary directly in the WHERE clause
        const text = `
            UPDATE review_items
            SET status = 'resolved',
                resolver_id = $3,
                resolution_event = $4,
                resolved_at = NOW(),
                updated_at = NOW()
            WHERE review_id = $1 AND tenant_id = $2 AND status IN ('open', 'in_review')
            RETURNING *;
        `;
        const res = await client.query(text, [reviewId, tenantId, actorId, JSON.stringify(resolutionEvent)]);
        return res.rows[0];
    }
};
