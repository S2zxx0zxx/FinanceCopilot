import crypto from 'node:crypto';
import { dbClient } from './client.js';

const ACCOUNT_TYPES = new Map([
    ['SAVINGS', 'savings'],
    ['CURRENT', 'current'],
    ['CREDIT_CARD', 'credit_card'],
    ['LOAN', 'loan'],
    ['INVESTMENT', 'investment'],
    ['WALLET', 'wallet'],
    ['CASH', 'cash']
]);

function last4(masked) {
    const digits = String(masked || '').replace(/\D/g, '');
    return digits.length >= 4 ? digits.slice(-4) : null;
}

function accountTypeFromFI(account) {
    const raw = String(
        account?.summary?.type ||
        account?.accountType ||
        account?.subType ||
        ''
    ).toUpperCase();
    return ACCOUNT_TYPES.get(raw) || null;
}

function stableHash(value) {
    return crypto.createHash('sha256').update(String(value)).digest('hex');
}

/**
 * Persistence boundary for Setu AA data. It deliberately writes AA data into
 * the existing immutable source_records pipeline instead of bypassing
 * normalization/reconciliation and inserting canonical transactions directly.
 */
export const SetuAARepo = {
    async getConsentOwner(externalConsentId) {
        const res = await dbClient.query(
            `SELECT * FROM consent_records
             WHERE consent_id_ext = $1 OR consent_handle = $1
             ORDER BY granted_at DESC NULLS LAST LIMIT 1`,
            [externalConsentId]
        );
        return res.rows[0] || null;
    },

    async updateConsentStatus(externalConsentId, providerStatus) {
        const normalized = String(providerStatus || '').toUpperCase();
        const localStatus = {
            ACTIVE: 'active', PENDING: 'pending', INITIATED: 'pending',
            REJECTED: 'rejected', REVOKED: 'revoked', PAUSED: 'paused', EXPIRED: 'expired'
        }[normalized];
        if (!localStatus) return null;

        const consented = normalized === 'ACTIVE';
        const revoked = normalized === 'REVOKED';
        const res = await dbClient.query(
            `UPDATE consent_records
             SET status = $2,
                 consented = $3,
                 consent_id_ext = COALESCE(consent_id_ext, $1),
                 revoked_at = CASE WHEN $4 THEN COALESCE(revoked_at, NOW()) ELSE revoked_at END,
                 granted_at = CASE WHEN $3 THEN COALESCE(granted_at, NOW()) ELSE granted_at END
             WHERE consent_id_ext = $1 OR consent_handle = $1
             RETURNING *`,
            [externalConsentId, localStatus, consented, revoked]
        );
        return res.rows[0] || null;
    },

    async ensureConnection(userId, fipId) {
        const existing = await dbClient.query(
            `SELECT * FROM source_connections
             WHERE user_id=$1 AND source_type='aggregator_future' AND institution_id=$2
             ORDER BY created_at ASC LIMIT 1`,
            [userId, fipId]
        );
        if (existing.rows[0]) {
            await dbClient.query(
                `UPDATE source_connections SET status='active', last_synced_at=NOW(), updated_at=NOW()
                 WHERE connection_id=$1`,
                [existing.rows[0].connection_id]
            );
            return existing.rows[0];
        }

        const res = await dbClient.query(
            `INSERT INTO source_connections
             (user_id, source_type, institution_id, display_name, status, last_synced_at)
             VALUES ($1, 'aggregator_future', $2, $3, 'active', NOW()) RETURNING *`,
            [userId, fipId, `Account Aggregator · ${fipId}`]
        );
        return res.rows[0];
    },

    async ensureAccount(userId, connectionId, fipId, accountEnvelope) {
        const account = accountEnvelope?.decryptedFI?.account || accountEnvelope?.data?.account || accountEnvelope?.account;
        if (!account) return null;

        const linkedRef = account.linkedAccRef || accountEnvelope.linkRefNumber;
        const masked = account.maskedAccNumber || accountEnvelope.maskedAccNumber;
        const type = accountTypeFromFI(account);
        if (!linkedRef || !type) return null;

        const hash = stableHash(`setu:${fipId}:${linkedRef}`);
        const found = await dbClient.query(
            `SELECT * FROM financial_accounts WHERE user_id=$1 AND account_number_hash=$2 LIMIT 1`,
            [userId, hash]
        );
        if (found.rows[0]) {
            await dbClient.query(
                `UPDATE financial_accounts
                 SET source_connection_id=$2, institution_id=$3,
                     account_number_last4=COALESCE($4, account_number_last4), updated_at=NOW(), is_active=TRUE
                 WHERE account_id=$1`,
                [found.rows[0].account_id, connectionId, fipId, last4(masked)]
            );
            return found.rows[0];
        }

        const res = await dbClient.query(
            `INSERT INTO financial_accounts
             (user_id, account_type, institution_name, institution_id, account_name,
              account_number_last4, account_number_hash, currency, source_connection_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,'INR',$8) RETURNING *`,
            [userId, type, fipId, fipId, `${type.replace('_', ' ')} account`, last4(masked), hash, connectionId]
        );
        return res.rows[0];
    },

    async ingestAccountTransactions({ userId, consentId, sessionId, fipId, accountEnvelope, dataRange }) {
        const account = accountEnvelope?.decryptedFI?.account || accountEnvelope?.data?.account || accountEnvelope?.account;
        if (!account) return { recordsCreated: 0, skipped: 'missing_account' };

        const connection = await this.ensureConnection(userId, fipId);
        const financialAccount = await this.ensureAccount(userId, connection.connection_id, fipId, accountEnvelope);
        if (!financialAccount) return { recordsCreated: 0, skipped: 'unsupported_or_unresolved_account_type' };

        const linkedRef = account.linkedAccRef || accountEnvelope.linkRefNumber;
        const batchId = sessionId || `${consentId}:${dataRange?.from || ''}:${dataRange?.to || ''}`;
        const idempotencyKey = `setu:${stableHash(`${batchId}:${fipId}:${linkedRef}`).slice(0, 48)}`;

        const jobRes = await dbClient.query(
            `INSERT INTO import_jobs
             (user_id, connection_id, account_id, idempotency_key, job_type, status,
              file_ref, original_filename, content_type, correlation_id)
             VALUES ($1,$2,$3,$4,'account_aggregator','normalization',$5,$6,'application/json',$7)
             ON CONFLICT (user_id,idempotency_key) DO UPDATE SET updated_at=NOW()
             RETURNING *`,
            [
                userId, connection.connection_id, financialAccount.account_id, idempotencyKey,
                `setu://${consentId}/${sessionId || 'auto'}/${linkedRef}`,
                `setu-aa-${fipId}-${linkedRef}.json`, consentId
            ]
        );
        const job = jobRes.rows[0];

        const txContainer = account.transactions || {};
        const transactions = Array.isArray(txContainer.transaction)
            ? txContainer.transaction
            : (Array.isArray(txContainer) ? txContainer : []);

        let created = 0;
        for (let index = 0; index < transactions.length; index += 1) {
            const tx = transactions[index] || {};
            const amount = tx.amount == null ? null : String(tx.amount);
            const direction = String(tx.type || '').toLowerCase();
            const date = tx.transactionTimestamp || tx.valueDate || tx.transactionDate || null;
            if (!amount || !date || !['debit', 'credit'].includes(direction)) continue;

            const reference = tx.txnId || tx.transactionId || tx.reference || tx.ref || null;
            const dedupeMaterial = reference || `${date}|${amount}|${direction}|${tx.narration || ''}|${index}`;
            const dedupeKey = stableHash(`setu:${fipId}:${linkedRef}:${dedupeMaterial}`);

            const inserted = await dbClient.query(
                `INSERT INTO source_records
                 (user_id,import_job_id,file_ref,parser_used,parser_version,row_number,provenance_metadata,
                  raw_date_text,raw_amount_text,raw_currency_text,raw_direction_text,raw_merchant_text,
                  raw_description_text,raw_reference_text,extracted_observed_at,extracted_direction,
                  extraction_confidence,dedupe_key)
                 VALUES ($1,$2,$3,'setu-aa','v2', $4,$5,$6,$7,$8,$9,NULL,$10,$11,$12,$13,1.000,$14)
                 ON CONFLICT (user_id,dedupe_key) DO NOTHING RETURNING source_record_id`,
                [
                    userId, job.job_id, `setu://${consentId}/${linkedRef}`, index + 1,
                    JSON.stringify({ consentId, sessionId: sessionId || null, fipId, linkedRef, mode: tx.mode || null }),
                    date, amount, account.summary?.currency || 'INR', direction,
                    tx.narration || tx.description || 'Bank transaction', reference,
                    date, direction, dedupeKey
                ]
            );
            if (inserted.rowCount > 0) created += 1;
        }

        await dbClient.query(
            `UPDATE import_jobs SET records_total=$2, records_parsed=$3, status='normalization', updated_at=NOW()
             WHERE job_id=$1`,
            [job.job_id, transactions.length, created]
        );
        await dbClient.query(
            `UPDATE source_connections SET last_synced_at=NOW(), updated_at=NOW() WHERE connection_id=$1`,
            [connection.connection_id]
        );

        return { jobId: job.job_id, accountId: financialAccount.account_id, recordsCreated: created };
    }
};
