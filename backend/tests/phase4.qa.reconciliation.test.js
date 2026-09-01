import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ReconciliationPipeline } from '../domains/reconciliation/pipeline/reconciliation.pipeline.js';

import { DuplicateEngine } from '../domains/reconciliation/engine/duplicate.engine.js';
import { TransferEngine } from '../domains/reconciliation/engine/transfer.engine.js';
import { SettlementEngine } from '../domains/reconciliation/engine/settlement.engine.js';
import { RefundEngine } from '../domains/reconciliation/engine/refund.engine.js';
import { PendingEngine } from '../domains/reconciliation/engine/pending.engine.js';

describe('PHASE 4 - RECONCILIATION ENGINE', () => {

    // ---------------------------------------------------------
    // DUPLICATES
    // ---------------------------------------------------------
    describe('Duplicate Engine', () => {
        const baseTx = {
            transaction_id: 'tx-1',
            account_id: 'acc-1',
            amount_paise: 50000,
            direction: 'debit',
            currency: 'INR',
            merchant_normalized: 'uber',
            observed_at: '2026-05-01T10:00:00Z',
            reference_id: 'ref-123'
        };

        it('Should detect exact duplicate by reference', () => {
            const context = [{ ...baseTx, transaction_id: 'tx-2' }];
            const results = DuplicateEngine.evaluate(baseTx, context);
            
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].relationship_type, 'duplicate');
            assert.strictEqual(results[0].status, 'confirmed');
            assert.strictEqual(results[0].confidence_score, 1.0);
        });

        it('Should flag candidate for same amount, merchant, and day', () => {
            const context = [{
                ...baseTx, 
                transaction_id: 'tx-2', 
                reference_id: 'different-ref',
                observed_at: '2026-05-01T15:00:00Z'
            }];
            const results = DuplicateEngine.evaluate(baseTx, context);
            
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].relationship_type, 'duplicate');
            assert.strictEqual(results[0].status, 'candidate');
            assert.strictEqual(results[0].evidence.reason, 'SAME_DAY_IDENTICAL_AMOUNT_MERCHANT');
        });

        it('Should flag needs_review for same amount, merchant within 3 days', () => {
            const context = [{
                ...baseTx, 
                transaction_id: 'tx-2', 
                reference_id: 'different-ref',
                observed_at: '2026-05-03T10:00:00Z'
            }];
            const results = DuplicateEngine.evaluate(baseTx, context);
            
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].status, 'needs_review');
        });

        it('Should NOT match duplicates with different amounts', () => {
            const context = [{
                ...baseTx, 
                transaction_id: 'tx-2', 
                amount_paise: 49900
            }];
            const results = DuplicateEngine.evaluate(baseTx, context);
            assert.strictEqual(results.length, 0);
        });
    });

    // ---------------------------------------------------------
    // TRANSFERS
    // ---------------------------------------------------------
    describe('Transfer Engine', () => {
        const txOut = {
            transaction_id: 'tx-out',
            account_id: 'acc-1',
            amount_paise: 1000000, // 10,000 INR
            direction: 'debit',
            currency: 'INR',
            observed_at: '2026-05-01T10:00:00Z'
        };

        it('Should detect internal transfer candidate', () => {
            const txIn = {
                transaction_id: 'tx-in',
                account_id: 'acc-2', // Different account
                amount_paise: 1000000,
                direction: 'credit', // Opposite direction
                currency: 'INR',
                observed_at: '2026-05-01T14:00:00Z' // Same day
            };

            const results = TransferEngine.evaluate(txOut, [txIn]);
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].relationship_type, 'transfer');
            assert.strictEqual(results[0].status, 'candidate');
        });

        it('Should not match transfers to the same account', () => {
            const txIn = { ...txOut, transaction_id: 'tx-in', direction: 'credit' };
            const results = TransferEngine.evaluate(txOut, [txIn]);
            assert.strictEqual(results.length, 0);
        });
    });

    // ---------------------------------------------------------
    // REFUNDS
    // ---------------------------------------------------------
    describe('Refund Engine', () => {
        const purchase = {
            transaction_id: 'tx-purchase',
            account_id: 'acc-1',
            amount_paise: 150000, // 1500 INR
            direction: 'debit',
            currency: 'INR',
            merchant_normalized: 'amazon',
            observed_at: '2026-05-01T10:00:00Z'
        };

        it('Should detect full refund', () => {
            const refund = {
                transaction_id: 'tx-refund',
                account_id: 'acc-1',
                amount_paise: 150000,
                direction: 'credit',
                currency: 'INR',
                merchant_normalized: 'amazon',
                observed_at: '2026-05-03T10:00:00Z' // 2 days later
            };

            const results = RefundEngine.evaluate(refund, [purchase]);
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].relationship_type, 'refund');
            assert.strictEqual(results[0].status, 'candidate');
            // Edge direction should point Refund -> Purchase
            assert.strictEqual(results[0].source_transaction_id, 'tx-refund');
            assert.strictEqual(results[0].target_transaction_id, 'tx-purchase');
        });

        it('Should detect partial refund candidate', () => {
            const refund = {
                ...purchase,
                transaction_id: 'tx-refund',
                direction: 'credit',
                amount_paise: 50000, // 500 INR partial refund
                observed_at: '2026-05-03T10:00:00Z'
            };

            const results = RefundEngine.evaluate(refund, [purchase]);
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].relationship_type, 'refund');
            assert.strictEqual(results[0].status, 'needs_review'); // Partial requires review
        });
    });

    // ---------------------------------------------------------
    // SETTLEMENT
    // ---------------------------------------------------------
    describe('Settlement Engine', () => {
        const checkingPayment = {
            transaction_id: 'tx-chk',
            account_id: 'acc-checking',
            amount_paise: 5000000,
            direction: 'debit',
            currency: 'INR',
            observed_at: '2026-05-01T10:00:00Z',
            description: 'credit card payment'
        };

        it('Should match settlement payment', () => {
            const ccReceived = {
                transaction_id: 'tx-cc',
                account_id: 'acc-creditcard',
                amount_paise: 5000000,
                direction: 'credit',
                currency: 'INR',
                observed_at: '2026-05-02T10:00:00Z',
                description: 'payment received thank you'
            };

            const results = SettlementEngine.evaluate(checkingPayment, [ccReceived]);
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].relationship_type, 'settlement');
        });
    });

    // ---------------------------------------------------------
    // PENDING/POSTED
    // ---------------------------------------------------------
    describe('Pending Engine', () => {
        const pendingTx = {
            transaction_id: 'tx-pending',
            account_id: 'acc-1',
            amount_paise: 25000,
            direction: 'debit',
            currency: 'INR',
            merchant_normalized: 'starbucks',
            posting_status: 'pending',
            observed_at: '2026-05-01T10:00:00Z'
        };

        it('Should match pending to posted transaction', () => {
            const postedTx = {
                transaction_id: 'tx-posted',
                account_id: 'acc-1',
                amount_paise: 25000,
                direction: 'debit',
                currency: 'INR',
                merchant_normalized: 'starbucks',
                posting_status: 'posted',
                observed_at: '2026-05-03T10:00:00Z'
            };

            const results = PendingEngine.evaluate(postedTx, [pendingTx]);
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].relationship_type, 'posting');
            assert.strictEqual(results[0].status, 'candidate');
            assert.strictEqual(results[0].source_transaction_id, 'tx-pending', 'Source must always be pending transaction');
            assert.strictEqual(results[0].target_transaction_id, 'tx-posted', 'Target must always be posted transaction');
        });

        it('Should flag pre-auth amount difference for review', () => {
            const postedTxDiff = {
                transaction_id: 'tx-posted-diff',
                account_id: 'acc-1',
                amount_paise: 27000, // Pre-auth was 250, final was 270
                direction: 'debit',
                currency: 'INR',
                merchant_normalized: 'starbucks',
                posting_status: 'posted',
                observed_at: '2026-05-03T10:00:00Z'
            };

            const results = PendingEngine.evaluate(postedTxDiff, [pendingTx]);
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].relationship_type, 'posting');
            assert.strictEqual(results[0].status, 'needs_review');
        });
    });

    // ---------------------------------------------------------
    // CONFLICT RESOLUTION
    // ---------------------------------------------------------
    describe('Conflict Resolution', () => {
        it('Should downgrade to CONFLICT if multiple competing relationships found for the same pair', () => {
            // How about Settlement and Transfer?
            // Settlement requires 'credit card payment' text. Transfer just requires opposite direction.
            // Both engines will fire!
            const checkingPayment = {
                transaction_id: 'tx-chk',
                account_id: 'acc-checking',
                amount_paise: 5000000,
                direction: 'debit',
                currency: 'INR',
                observed_at: '2026-05-01T10:00:00Z',
                description: 'credit card payment'
            };

            const ccReceived = {
                transaction_id: 'tx-cc',
                account_id: 'acc-creditcard',
                amount_paise: 5000000,
                direction: 'credit',
                currency: 'INR',
                observed_at: '2026-05-01T14:00:00Z', // same day
                description: 'payment received thank you'
            };

            const results = ReconciliationPipeline.run([checkingPayment], [ccReceived]);
            // Both Settlement and Transfer engine will flag this pair!
            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].status, 'conflict', 'First should be downgraded to conflict');
            assert.strictEqual(results[1].status, 'conflict', 'Second should be downgraded to conflict');
            assert.strictEqual(results[0].evidence.conflict_reason, 'MULTIPLE_RELATIONSHIP_TYPES_DETECTED');
        });
    });
});
