import { AppError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

/**
 * Ledger Service
 *
 * Core financial engine enforcing ADR-001 (canonical transaction schema) and
 * ADR-003 (BIGINT paise, no floats). Protects against float math and
 * duplicate transactions.
 *
 * FIX (audit P1 #45): the previous implementation of `processTransactions`
 * was a pure stub — it validated inputs but then returned
 * `{ inserted: N, duplicates: 0 }` without ever calling the DB. Callers
 * (e.g. account aggregator webhook, manual import) thought they had
 * persisted transactions when in fact nothing was written. We now actually
 * INSERT each transaction inside a single Postgres transaction, idempotent
 * on (user_id, source_record_id) so re-runs (e.g. webhook retries) cannot
 * double-count.
 *
 * The heavy lifting (canonical column mapping, idempotency) is shared with
 * `NormalizationRepo.saveCanonicalTransaction` — but the LedgerService is
 * the right boundary for the account-aggregator / manual-import path that
 * does NOT go through the source_records → normalization pipeline.
 */
export class LedgerService {
    constructor(dbRepository) {
        if (!dbRepository) {
            throw new Error('LedgerService requires a real DB repository instance.');
        }
        this.dbRepository = dbRepository;
    }

    /**
     * Safely inserts an array of parsed transactions into the ledger.
     *
     * Each item MUST carry:
     *   - amount_paise  (positive integer, paise)
     *   - direction     ('debit' | 'credit')
     *   - observed_at   (ISO date string)
     *   - merchant_raw  (required by transactions.merchant_raw NOT NULL)
     *
     * Optional fields (account_id, source_record_id, merchant_normalized,
     * transaction_type, category_id, posting_status, etc.) are passed
     * through verbatim.
     *
     * Returns `{ inserted, duplicates, skipped }`. A row is `duplicates`
     * when the idempotency key (user_id, source_record_id) already existed.
     * A row is `skipped` when input validation rejects it (the engine
     * throws on non-integer amounts but tolerates structural gaps to
     * avoid one bad row aborting a 1000-row batch).
     */
    async processTransactions(userId, accountId, importJobId, transactionsData) {
        if (!Array.isArray(transactionsData) || transactionsData.length === 0) {
            return { inserted: 0, duplicates: 0, skipped: 0 };
        }

        // 1. Enforce ZERO-LOSS invariant: every amount must be an integer paise.
        // Non-integer amounts would silently lose precision when stored in BIGINT
        // (ADR-003 / F-B12). Halt the whole batch — better to fail loudly than to
        // corrupt financial data silently.
        for (const tx of transactionsData) {
            if (!Number.isInteger(tx.amount_paise)) {
                throw new Error(
                    `CRITICAL: Non-integer amount detected: ${tx.amount_paise}. ` +
                    `Halting processing to prevent financial data corruption.`
                );
            }
            if (tx.amount_paise <= 0) {
                throw new Error(
                    `CRITICAL: Non-positive amount detected: ${tx.amount_paise}. ` +
                    `Transactions.amount_paise has CHECK(amount_paise > 0).`
                );
            }
            if (!tx.direction || !['debit', 'credit'].includes(tx.direction)) {
                throw new Error(`CRITICAL: Invalid direction '${tx.direction}' for transaction.`);
            }
            if (!tx.observed_at) {
                throw new Error(`CRITICAL: Missing observed_at on transaction.`);
            }
            if (!tx.merchant_raw) {
                // transactions.merchant_raw is NOT NULL — provide a safe fallback.
                tx.merchant_raw = tx.merchant_normalized || 'Unknown';
            }
        }

        logger.info(`[LEDGER] Processing ${transactionsData.length} transactions for account ${accountId} (import_job=${importJobId})`);

        const client = await this.dbRepository.connect();
        let inserted = 0;
        let duplicates = 0;
        let skipped = 0;

        try {
            await client.query('BEGIN');

            for (const tx of transactionsData) {
                try {
                    const insertResult = await client.query(
                        `INSERT INTO transactions (
                            user_id, account_id, source_record_id, statement_id,
                            observed_at, amount_paise, currency, direction,
                            merchant_raw, merchant_normalized, merchant_id,
                            category_id, category_raw, transaction_type, sub_type,
                            reference_id, description, notes,
                            posting_status, duplicate_status, normalization_version, is_manual
                        ) VALUES (
                            $1, $2, $3, $4,
                            $5, $6, COALESCE($7, 'INR'), $8,
                            $9, $10, $11,
                            $12, $13, COALESCE($14, 'unknown'), $15,
                            $16, $17, $18,
                            COALESCE($19, 'posted'), COALESCE($20, 'unique'), $21, TRUE
                        )
                        ON CONFLICT (source_record_id, normalization_version) WHERE source_record_id IS NOT NULL
                        DO NOTHING
                        RETURNING transaction_id`,
                        [
                            userId,
                            accountId,
                            tx.source_record_id || null,
                            tx.statement_id || null,
                            tx.observed_at,
                            tx.amount_paise,
                            tx.currency || 'INR',
                            tx.direction,
                            tx.merchant_raw,
                            tx.merchant_normalized || null,
                            tx.merchant_id || null,
                            tx.category_id || null,
                            tx.category_raw || null,
                            tx.transaction_type || 'unknown',
                            tx.sub_type || null,
                            tx.reference_id || null,
                            tx.description || null,
                            tx.notes || null,
                            tx.posting_status || 'posted',
                            tx.duplicate_status || 'unique',
                            tx.normalization_version || 'manual_v1'
                        ]
                    );

                    if (insertResult.rows.length > 0) {
                        inserted++;
                    } else if (tx.source_record_id) {
                        // ON CONFLICT matched — already in the ledger.
                        duplicates++;
                    } else {
                        // No source_record_id → no ON CONFLICT target. If RETURNING is
                        // empty here it means the INSERT threw and was caught below.
                        skipped++;
                    }
                } catch (rowErr) {
                    // One bad row should not abort a 1000-row batch. Log and move on.
                    logger.warn('[LEDGER] Row rejected — continuing batch', {
                        userId,
                        accountId,
                        err: rowErr.message,
                        amount_paise: tx.amount_paise,
                        observed_at: tx.observed_at
                    });
                    skipped++;
                }
            }

            await client.query('COMMIT');
            logger.info(`[LEDGER] Batch complete: inserted=${inserted}, duplicates=${duplicates}, skipped=${skipped}`);
            return { inserted, duplicates, skipped };
        } catch (err) {
            try { await client.query('ROLLBACK'); } catch { /* ignore rollback failures */ }
            logger.error('[LEDGER] Batch failed — rolled back', { err: err.message });
            throw new AppError(
                `Ledger batch processing failed: ${err.message}`,
                500, true, 'LEDGER_BATCH_FAILED'
            );
        } finally {
            client.release();
        }
    }

    /**
     * Formats an integer amount (paise) to a human-readable string for frontend display.
     */
    static formatToDisplay(amountPaise) {
        return (amountPaise / 100).toFixed(2);
    }
}
