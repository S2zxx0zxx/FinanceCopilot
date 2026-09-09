import { dbClient } from '../../db/client.js';

export class TransactionsController {
    /**
     * GET /api/v1/transactions
     * Returns a paginated list of transactions.
     * Supports basic filtering: accountId, limit, offset.
     */
    static async getTransactions(req, res, next) {
        try {
            const userId = req.user.userId;
            const { accountId, category, startDate, endDate, direction, needsReview, limit = 50, offset = 0 } = req.query;
            
            if (!/^\d+$/.test(String(limit)) || !/^\d+$/.test(String(offset)) || !Number.isSafeInteger(Number(offset)) || Number(limit)<1 || Number(limit)>100 || (direction && !['credit','debit'].includes(direction))) {
                return res.status(422).json({error:'Use a limit from 1 to 100, a nonnegative offset and a valid direction.'});
            }
            if (needsReview !== undefined && !["true","false"].includes(needsReview)) return res.status(422).json({error:"needsReview must be true or false."});
            const params = [userId];
            const filters = [];
            
            if (accountId) {
                params.push(accountId);
                filters.push(`account_id = $${params.length}`);
            }
            if (category) {
                params.push(category);
                filters.push(`transaction_type = $${params.length}`);
            }
            if (direction) {
                params.push(direction);
                filters.push(`direction = $${params.length}`);
            }
            if (startDate) {
                params.push(startDate);
                filters.push(`observed_at >= $${params.length}`);
            }
            if (endDate) {
                params.push(endDate);
                filters.push(`observed_at <= $${params.length}`);
            }

            if (needsReview !== undefined) { params.push(needsReview === "true"); filters.push(`needs_review = $${params.length}`); }
            const filterStr = filters.length > 0 ? 'AND ' + filters.join(' AND ') : '';
            
            // Add limit and offset
            params.push(Number.parseInt(limit, 10), Number.parseInt(offset, 10));
            const limitIndex = params.length - 1;
            const offsetIndex = params.length;

            const query = `
                SELECT 
                    transaction_id, account_id, amount_paise, direction, currency,
                    merchant_normalized, observed_at, transaction_type, duplicate_status, posting_status, needs_review
                FROM transactions
                WHERE user_id = $1
                  AND is_deleted = false
                  ${filterStr}
                ORDER BY observed_at DESC
                LIMIT $${limitIndex} OFFSET $${offsetIndex}
            `;
            
            const result = await dbClient.query(query, params);
            
            // Get total count for pagination metadata
            const countParams = [userId];
            const countFilters = [];
            
            if (accountId) {
                countParams.push(accountId);
                countFilters.push(`account_id = $${countParams.length}`);
            }
            if (category) {
                countParams.push(category);
                countFilters.push(`transaction_type = $${countParams.length}`);
            }
            if (direction) {
                countParams.push(direction);
                countFilters.push(`direction = $${countParams.length}`);
            }
            if (startDate) {
                countParams.push(startDate);
                countFilters.push(`observed_at >= $${countParams.length}`);
            }
            if (endDate) {
                countParams.push(endDate);
                countFilters.push(`observed_at <= $${countParams.length}`);
            }

            if (needsReview !== undefined) { countParams.push(needsReview === "true"); countFilters.push(`needs_review = $${countParams.length}`); }
            const countFilterStr = countFilters.length > 0 ? 'AND ' + countFilters.join(' AND ') : '';

            const countQuery = `
                SELECT COUNT(*) as total
                FROM transactions
                WHERE user_id = $1 AND is_deleted = false ${countFilterStr}
            `;
            const countResult = await dbClient.query(countQuery, countParams);
            const total = Number.parseInt(countResult.rows[0].total, 10);

            res.status(200).json({
                data: result.rows,
                pagination: {
                    total,
                    limit: Number.parseInt(limit, 10),
                    offset: Number.parseInt(offset, 10)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/transactions/:id
     * Returns detail for a specific transaction.
     */
    static async getTransactionDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const txId = req.params.id;

            const query = `
                SELECT *
                FROM transactions
                WHERE user_id = $1 AND transaction_id = $2 AND is_deleted = false
            `;
            const result = await dbClient.query(query, [userId, txId]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Transaction not found or unauthorized' });
            }

            res.status(200).json(result.rows[0]);
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/v1/transactions/:id
     * Manual correction workflow for a transaction.
     */
    static async updateTransaction(req, res, next) {
        const allowedTypes = ['expense','income','transfer_out','transfer_in','refund','reversal','card_settlement','emi','interest','fee','cash_withdrawal','unknown'];
        const { transaction_type, merchant_normalized, reviewed } = req.body ?? {};
        if (Object.keys(req.body ?? {}).some(key => !['transaction_type','merchant_normalized','reviewed'].includes(key)) ||
            (transaction_type !== undefined && !allowedTypes.includes(transaction_type)) ||
            (merchant_normalized !== undefined && (typeof merchant_normalized !== 'string' || !merchant_normalized.trim() || merchant_normalized.length > 200)) ||
            (reviewed !== undefined && reviewed !== true) ||
            (transaction_type === undefined && merchant_normalized === undefined && reviewed === undefined)) {
            return res.status(422).json({ error: 'Provide a valid transaction type, merchant name or explicit review confirmation.' });
        }
        let client;
        try {
            client = await dbClient.connect();
            await client.query('BEGIN');
            const existing = await client.query('SELECT * FROM transactions WHERE transaction_id=$1 AND user_id=$2 AND is_deleted=false FOR UPDATE', [req.params.id,req.user.userId]);
            const previous = existing.rows[0];
            if (!previous) { await client.query('ROLLBACK'); return res.status(404).json({error:'Transaction not found.'}); }
            const type = transaction_type ?? previous.transaction_type;
            if (reviewed && (type === 'unknown' || !Number.isSafeInteger(Number(previous.amount_paise)) || Number(previous.amount_paise) <= 0 ||
                previous.currency !== 'INR' || !['unique','primary'].includes(previous.duplicate_status) || previous.posting_status === 'reversed')) {
                await client.query('ROLLBACK');
                return res.status(422).json({error:'Resolve the transaction type, duplicate status, currency or reversal before completing review.'});
            }
            if (reviewed && ((['income','refund','transfer_in'].includes(type) && previous.direction !== 'credit') ||
                (['expense','transfer_out','fee','emi','cash_withdrawal'].includes(type) && previous.direction !== 'debit'))) {
                await client.query('ROLLBACK');
                return res.status(422).json({error:'The selected transaction type does not match the recorded money direction.'});
            }
            const result = await client.query(`UPDATE transactions SET transaction_type=$3,
                merchant_normalized=$4,
                needs_review=CASE WHEN $5 THEN false ELSE needs_review END,
                review_reason=CASE WHEN $5 THEN ARRAY[]::text[] ELSE review_reason END,
                posting_status=CASE WHEN $5 AND needs_review AND posting_status='pending' THEN 'posted' ELSE posting_status END
                WHERE transaction_id=$1 AND user_id=$2 RETURNING *`,
                [req.params.id,req.user.userId,type,merchant_normalized?.trim() ?? previous.merchant_normalized,reviewed === true]);
            await client.query(`INSERT INTO audit_events(event_type,entity_type,entity_id,actor,metadata)
                VALUES($1,'transaction',$2,$3,$4)`, [reviewed ? 'TRANSACTION_REVIEWED' : 'TRANSACTION_CORRECTED',req.params.id,req.user.userId,
                {fields_updated:Object.keys(req.body),previous_type:previous.transaction_type,new_type:type}]);
            await client.query('COMMIT');
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            if (client) await client.query('ROLLBACK');
            next(error);
        } finally { client?.release(); }
    }

    /**
     * POST /api/v1/transactions/:id/split
     * Splits a transaction into two separate transactions.
     */
    static async splitTransaction(req, res, next) {
        try {
            const userId = req.user.userId;
            const txId = req.params.id;
            const { amount_paise, category1, category2, merchant_normalized } = req.body;

            if (!Number.isSafeInteger(amount_paise) || amount_paise <= 0) {
                return res.status(400).json({ error: 'Valid split amount is required' });
            }

            const { dbClient } = await import('../../db/client.js');
            const client = await dbClient.connect();

            try {
                await client.query('BEGIN');

                const txResult = await client.query(
                    'SELECT * FROM transactions WHERE transaction_id = $1 AND user_id = $2 AND is_deleted = false FOR UPDATE',
                    [txId, userId]
                );

                if (txResult.rowCount === 0) {
                    await client.query('ROLLBACK');
                    return res.status(404).json({ error: 'Transaction not found' });
                }

                const originalTx = txResult.rows[0];

                // FIX (audit P1 #26): Postgres BIGINT columns return as STRINGS.
                // The old `amount_paise >= originalTx.amount_paise` comparison
                // was lexicographic string comparison ('2' > '100' is TRUE),
                // which silently rejected valid splits. Coerce to Number for
                // all arithmetic / comparison.
                const origPaise = Number(originalTx.amount_paise);
                const splitPaise = Number(amount_paise);
                if (!Number.isSafeInteger(origPaise) || !Number.isSafeInteger(splitPaise)) {
                    await client.query('ROLLBACK');
                    return res.status(400).json({ error: 'Invalid amount' });
                }
                if (splitPaise >= origPaise) {
                    await client.query('ROLLBACK');
                    return res.status(400).json({ error: 'Split amount must be less than original amount' });
                }

                const remainder = origPaise - splitPaise;

                // Update original — schema has merchant_raw (not merchant_original), no is_split column, observed_at (not posting_date)
                await client.query(
                    `UPDATE transactions SET amount_paise = $1, transaction_type = $2 WHERE transaction_id = $3`,
                    [remainder, category1 || originalTx.transaction_type, txId]
                );

                // Insert split part — uses merchant_raw (schema column), drops non-existent is_split
                const insertResult = await client.query(
                    `INSERT INTO transactions (
                        user_id, account_id, amount_paise, direction, currency,
                        observed_at, merchant_raw, merchant_normalized, transaction_type,
                        posting_status, duplicate_status
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
                    [
                        userId, originalTx.account_id, splitPaise, originalTx.direction, originalTx.currency,
                        originalTx.observed_at, originalTx.merchant_raw, merchant_normalized || originalTx.merchant_normalized,
                        category2 || originalTx.transaction_type, originalTx.posting_status, originalTx.duplicate_status
                    ]
                );

                // Phase 13 Telemetry Hook
                const { Telemetry } = await import('../../utils/telemetry.js');
                Telemetry.trackEvent(userId, 'TRANSACTION_SPLIT', {
                    tx_id: txId,
                    split_ratio: origPaise > 0 ? splitPaise / origPaise : 0
                });

                await client.query('COMMIT');
                res.status(200).json({ original: remainder, newTransaction: insertResult.rows[0] });
            } catch (txError) {
                await client.query('ROLLBACK');
                throw txError;
            } finally {
                client.release();
            }
        } catch (error) {
            next(error);
        }
    }
}
