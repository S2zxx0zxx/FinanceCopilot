# PHASE 5 FINANCIAL RULEBOOK

## Pending Money Policy
- **Version**: v1.0.0
- **Debits (Expenses/Transfers Out)**: 100% weight. A pending debit immediately reduces your `available_balance`.
- **Credits (Income/Transfers In)**: 0% weight. A pending credit does NOT artificially inflate your `available_balance` until it posts.

## Math & Precision
- **Data Type**: `BIGINT`
- **Unit**: Paise (1/100th of INR)
- **Rounding Strategy**: None. Exact integer arithmetic is strictly enforced.

## Double Counting Prevention
- `duplicate_status = 'duplicate'` rows are hard-excluded from all aggregates.
- `transaction_type = 'transfer_out'` and `card_settlement` are hard-excluded from spending calculations.
- `transaction_type = 'refund'` strictly reduces the spending aggregate rather than treating it as income.
