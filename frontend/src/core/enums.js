/**
 * Code mirror of control/domain-enums.yaml (CANONICAL).
 * Drift-checked by backend/tests/unit/enums.test.js — update BOTH together.
 */
export const ENUMS = Object.freeze({
  transaction_type: ['expense','income','transfer_out','transfer_in','refund','reversal','card_settlement','emi','interest','fee','cash_withdrawal','unknown'],
  posting_status: ['pending','posted','reversed'],
  duplicate_status: ['unique','primary','duplicate','pending_review'],
  transfer_role: ['source','destination','partial_transfer'],
  settlement_role: ['purchase','settlement'],
  refund_role: ['full','partial'],
  reversal_role: ['pre_posting','post_posting'],
  direction: ['debit','credit'],
});
export const FORBIDDEN_VALUES = ['purchase_only']; // removed phantoms must never reappear
