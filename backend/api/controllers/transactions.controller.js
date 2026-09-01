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
            const { accountId, category, startDate, endDate, direction, limit = 50, offset = 0 } = req.query;
            
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

            const filterStr = filters.length > 0 ? 'AND ' + filters.join(' AND ') : '';
            
            // Add limit and offset
            params.push(Number.parseInt(limit, 10), Number.parseInt(offset, 10));
            const limitIndex = params.length - 1;
            const offsetIndex = params.length;

            const query = `
                SELECT 
                    transaction_id, account_id, amount_paise, direction, currency,
                    merchant_normalized, observed_at, transaction_type, duplicate_status, posting_status
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
        try {
            const userId = req.user.userId;
            const txId = req.params.id;
            const { transaction_type, merchant_normalized } = req.body;

            if (!transaction_type && !merchant_normalized) {
                return res.status(400).json({ error: 'No update fields provided' });
            }

            const setParts = [];
            const params = [txId, userId];
            let paramIndex = 3;

            if (transaction_type) {
                setParts.push(`transaction_type = $${paramIndex}`);
                params.push(transaction_type);
                paramIndex++;
            }
            if (merchant_normalized) {
                setParts.push(`merchant_normalized = $${paramIndex}`);
                params.push(merchant_normalized);
                paramIndex++;
            }

            const query = `
                UPDATE transactions
                SET ${setParts.join(', ')}
                WHERE transaction_id = $1 AND user_id = $2 AND is_deleted = false
                RETURNING *
            `;

            const result = await dbClient.query(query, params);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Transaction not found or unauthorized' });
            }

            // Phase 13 Telemetry Hook
            const { Telemetry } = await import('../../utils/telemetry.js');
            Telemetry.trackEvent(userId, 'TRANSACTION_CORRECTION', {
                tx_id: txId,
                fields_updated: Object.keys(req.body)
            });

            res.status(200).json(result.rows[0]);
        } catch (error) {
            next(error);
        }
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

            if (!amount_paise || amount_paise <= 0) {
                return res.status(400).json({ error: 'Valid split amount is required' });
            }

            const { dbClient } = await import('../../db/client.js');
            const client = await dbClient.pool.connect();

            try {
                await client.query('BEGIN');

                const txResult = await client.query(
                    'SELECT * FROM transactions WHERE transaction_id = $1 AND user_id = $2 AND is_deleted = false',
                    [txId, userId]
                );

                if (txResult.rowCount === 0) {
                    await client.query('ROLLBACK');
                    return res.status(404).json({ error: 'Transaction not found' });
                }

                const originalTx = txResult.rows[0];

                if (amount_paise >= originalTx.amount_paise) {
                    await client.query('ROLLBACK');
                    return res.status(400).json({ error: 'Split amount must be less than original amount' });
                }

                const remainder = originalTx.amount_paise - amount_paise;

                // Update original
                await client.query(
                    `UPDATE transactions SET amount_paise = $1, transaction_type = $2, is_split = true WHERE transaction_id = $3`,
                    [remainder, category1 || originalTx.transaction_type, txId]
                );

                // Insert split part
                const insertResult = await client.query(
                    `INSERT INTO transactions (
                        user_id, account_id, amount_paise, direction, currency,
                        observed_at, merchant_original, merchant_normalized, transaction_type,
                        posting_status, duplicate_status, is_split
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true) RETURNING *`,
                    [
                        userId, originalTx.account_id, amount_paise, originalTx.direction, originalTx.currency,
                        originalTx.observed_at, originalTx.merchant_original, merchant_normalized || originalTx.merchant_normalized,
                        category2 || originalTx.transaction_type, originalTx.posting_status, originalTx.duplicate_status
                    ]
                );

                // Phase 13 Telemetry Hook
                const { Telemetry } = await import('../../utils/telemetry.js');
                Telemetry.trackEvent(userId, 'TRANSACTION_SPLIT', {
                    tx_id: txId,
                    split_ratio: amount_paise / originalTx.amount_paise
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
