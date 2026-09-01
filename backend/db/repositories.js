import { dbClient } from './client.js';

export const ConsentRepo = {
    async saveConsent({ user_id, consent_type, version, ip_hash, user_agent, granted_at }) {
        const text = `
            INSERT INTO consent_records (user_id, consent_type, version, consented, ip_hash, user_agent, granted_at)
            VALUES ($1, $2, $3, true, $4, $5, $6)
            RETURNING *;
        `;
        const res = await dbClient.query(text, [user_id, consent_type, version, ip_hash, user_agent, granted_at]);
        return res.rows[0];
    },

    async getLatestConsent(userId, policyId) {
        const text = `
            SELECT * FROM consent_records 
            WHERE user_id = $1 AND consent_type = $2 
            ORDER BY granted_at DESC LIMIT 1;
        `;
        const res = await dbClient.query(text, [userId, policyId]);
        return res.rows[0] || null;
    },

    async revokeConsent(userId, policyId, revokedAt) {
        const text = `
            UPDATE consent_records 
            SET revoked_at = $3 
            WHERE user_id = $1 AND consent_type = $2 AND revoked_at IS NULL
            RETURNING *;
        `;
        const res = await dbClient.query(text, [userId, policyId, revokedAt]);
        return res.rows[0] || null;
    }
};

export const AuditRepo = {
    async logEvent(eventType, entityType, entityId, actor, metadata = {}) {
        const text = `
            INSERT INTO audit_events (event_type, entity_type, entity_id, actor, metadata)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [eventType, entityType, entityId, actor, JSON.stringify(metadata)];
        try {
            const res = await dbClient.query(text, values);
            return res.rows[0];
        } catch (error) {
            console.error('[AUDIT_REPO] Failed to log audit event:', error);
            return null;
        }
    }
};

export const IngestionRepo = {
    /**
     * Creates a new import job (Intent).
     * Now strictly records original_filename, content_type, and correlation_id.
     */
    async createImportJob(data) {
        const { user_id, idempotency_key, job_type, file_ref, original_filename, content_type, correlation_id } = data;
        const text = `
            INSERT INTO import_jobs (user_id, idempotency_key, job_type, file_ref, original_filename, content_type, correlation_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'received')
            ON CONFLICT (user_id, idempotency_key) DO UPDATE SET 
                file_ref = EXCLUDED.file_ref,
                original_filename = EXCLUDED.original_filename,
                content_type = EXCLUDED.content_type,
                correlation_id = EXCLUDED.correlation_id
            RETURNING *;
        `;
        const values = [user_id, idempotency_key, job_type, file_ref, original_filename, content_type, correlation_id];
        const res = await dbClient.query(text, values);
        return res.rows[0];
    },

    /**
     * Explicitly requests a replay of a job (usually from dead_letter state).
     */
    async requestJobReplay(job_id) {
        const text = `
            UPDATE import_jobs
            SET status = 'queued',
                attempt = 0,
                last_error = NULL,
                next_retry_at = NULL,
                updated_at = NOW()
            WHERE job_id = $1
            RETURNING *;
        `;
        const res = await dbClient.query(text, [job_id]);
        return res.rows[0];
    },

    /**
     * Retrieves an import job by ID.
     */
    async getImportJob(job_id) {
        const res = await dbClient.query(`SELECT * FROM import_jobs WHERE job_id = $1`, [job_id]);
        return res.rows[0];
    },

    async updateImportJobStatus(job_id, status, last_error = null) {
        const text = `
            UPDATE import_jobs 
            SET status = $2, last_error = $3, updated_at = NOW() 
            WHERE job_id = $1 
            RETURNING *;
        `;
        const res = await dbClient.query(text, [job_id, status, last_error]);
        return res.rows[0] || null;
    },

    async createSourceRecord(record) {
        const text = `
            INSERT INTO source_records (
                user_id, import_job_id, file_ref, parser_used, parser_version,
                page_number, row_number, provenance_metadata,
                raw_date_text, raw_amount_text, raw_currency_text, raw_direction_text,
                raw_merchant_text, raw_description_text, raw_reference_text,
                extracted_observed_at, extracted_amount_paise, extracted_direction,
                extraction_confidence
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
            )
            RETURNING *;
        `;
        const values = [
            record.user_id, record.import_job_id, record.file_ref, record.parser_used, record.parser_version,
            record.page_number, record.row_number, record.provenance_metadata,
            record.raw_date_text, record.raw_amount_text, record.raw_currency_text, record.raw_direction_text,
            record.raw_merchant_text, record.raw_description_text, record.raw_reference_text,
            record.extracted_observed_at, record.extracted_amount_paise, record.extracted_direction,
            record.extraction_confidence || 1.0
        ];
        const res = await dbClient.query(text, values);
        return res.rows[0];
    },

    // --- PHASE 2.2 ASYNC WORKER METHODS ---

    /**
     * Atomically claims a queued job for processing.
     * Uses FOR UPDATE SKIP LOCKED to prevent concurrent workers from claiming the same job.
     */
    async claimNextJob(specificJobId = null) {
        let condition = `status = 'queued' OR (status = 'processing' AND next_retry_at < NOW())`;
        let params = [];
        if (specificJobId) {
            condition = `job_id = $1 AND (${condition})`;
            params.push(specificJobId);
        }
        const text = `
            UPDATE import_jobs
            SET status = 'processing', updated_at = NOW()
            WHERE job_id = (
                SELECT job_id FROM import_jobs 
                WHERE ${condition}
                ORDER BY created_at ASC
                FOR UPDATE SKIP LOCKED
                LIMIT 1
            )
            RETURNING *;
        `;
        const res = await dbClient.query(text, params);
        return res.rows[0] || null;
    },

    /**
     * Marks a job as failed and schedules a retry if under max_attempts.
     */
    async markJobFailed(job_id, error_message, attempt, max_attempts) {
        const newAttempt = attempt + 1;
        const status = newAttempt >= max_attempts ? 'dead_letter' : 'processing';
        // Exponential backoff: 2^attempt * 5 minutes
        const backoffInterval = newAttempt >= max_attempts ? null : `NOW() + INTERVAL '${Math.pow(2, newAttempt) * 5} minutes'`;
        
        const text = `
            UPDATE import_jobs
            SET status = $2, 
                attempt = $3, 
                last_error = $4, 
                next_retry_at = ${backoffInterval || 'NULL'},
                updated_at = NOW()
            WHERE job_id = $1
            RETURNING *;
        `;
        const res = await dbClient.query(text, [job_id, status, newAttempt, error_message]);
        return res.rows[0];
    },

    /**
     * Explicitly routes a job to the Dead Letter Queue (DLQ) state.
     */
    async markJobDeadLetter(job_id, error_message) {
        const text = `
            UPDATE import_jobs
            SET status = 'dead_letter', 
                last_error = $2, 
                next_retry_at = NULL,
                updated_at = NOW()
            WHERE job_id = $1
            RETURNING *;
        `;
        const res = await dbClient.query(text, [job_id, error_message]);
        return res.rows[0];
    },

    /**
     * Updates the job's checksum upon upload confirmation.
     */
    async updateImportJobChecksum(job_id, file_checksum) {
        const text = `
            UPDATE import_jobs 
            SET file_checksum = $1, updated_at = NOW()
            WHERE job_id = $2
            RETURNING *;
        `;
        const res = await dbClient.query(text, [file_checksum, job_id]);
        return res.rows[0];
    }
};

export const NormalizationRepo = {
    /**
     * Atomically claims raw source records for normalization.
     * Uses SKIP LOCKED for safe concurrent processing.
     */
    async claimNextRawSourceRecords(batchSize = 50) {
        const text = `
            UPDATE source_records
            SET status = 'processing'
            WHERE source_record_id IN (
                SELECT source_record_id FROM source_records
                WHERE status = 'raw'
                ORDER BY created_at ASC
                FOR UPDATE SKIP LOCKED
                LIMIT $1
            )
            RETURNING *;
        `;
        const res = await dbClient.query(text, [batchSize]);
        return res.rows;
    },

    /**
     * Resolves the account_id by traversing source_records -> import_jobs -> source_connections -> financial_accounts
     */
    async getAccountIdForSourceRecord(sourceRecordId) {
        const text = `
            SELECT fa.account_id
            FROM source_records sr
            JOIN import_jobs ij ON sr.import_job_id = ij.job_id
            JOIN source_connections sc ON ij.connection_id = sc.connection_id
            JOIN financial_accounts fa ON sc.connection_id = fa.source_connection_id
            WHERE sr.source_record_id = $1
            LIMIT 1;
        `;
        const res = await dbClient.query(text, [sourceRecordId]);
        return res.rows[0]?.account_id || null;
    },

    /**
     * Idempotently saves a canonical transaction and marks the source record as normalized.
     */
    async saveCanonicalTransaction(transaction, sourceRecordId) {
        const client = await dbClient.connect();
        try {
            await client.query('BEGIN');

            const txInsert = `
                INSERT INTO transactions (
                    user_id, source_record_id, statement_id, account_id, payment_instrument_id,
                    observed_at, amount_paise, currency, direction,
                    merchant_raw, merchant_normalized, merchant_id, merchant_category_code,
                    category_id, category_raw, category_confidence,
                    transaction_type, sub_type, reference_id, description, notes,
                    overall_confidence, needs_review, review_reason,
                    normalization_version, is_manual
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
                )
                ON CONFLICT (source_record_id, normalization_version) DO NOTHING
                RETURNING *;
            `;
            
            const txValues = [
                transaction.user_id, transaction.source_record_id, transaction.statement_id, transaction.account_id, transaction.payment_instrument_id,
                transaction.observed_at, transaction.amount_paise, transaction.currency, transaction.direction,
                transaction.merchant_raw, transaction.merchant_normalized, transaction.merchant_id, transaction.merchant_category_code,
                transaction.category_id, transaction.category_raw, transaction.category_confidence,
                transaction.transaction_type, transaction.sub_type, transaction.reference_id, transaction.description, transaction.notes,
                transaction.overall_confidence, transaction.needs_review, transaction.review_reason,
                transaction.normalization_version, false
            ];

            const txRes = await client.query(txInsert, txValues);

            const sourceUpdate = `
                UPDATE source_records
                SET status = 'normalized'
                WHERE source_record_id = $1;
            `;
            await client.query(sourceUpdate, [sourceRecordId]);

            await client.query('COMMIT');
            return txRes.rows[0];
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },
    
    /**
     * Marks a source record as failed/rejected (e.g. fatal normalization error).
     */
    async markSourceRecordRejected(sourceRecordId, reason) {
        const text = `
            UPDATE source_records
            SET status = 'rejected', rejection_reason = $2
            WHERE source_record_id = $1
            RETURNING *;
        `;
        const res = await dbClient.query(text, [sourceRecordId, reason]);
        return res.rows[0];
    }
};
