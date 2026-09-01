# PHASE 5 FINANCIAL STATE DATA CONTRACT

## 1. Input Contract
Phase 5 consumes data from:
- `transactions` (Filtered for `duplicate_status != 'duplicate'`, `is_deleted = false`)
- `financial_accounts`
- `financial_commitments`
- `safe_to_spend_configurations`

## 2. Output Contract
Phase 5 produces data to:
- `financial_snapshots`

## 3. Financial Snapshot Object
```json
{
  "snapshot_id": "UUID",
  "user_id": "UUID",
  "calculation_type": "safe_to_spend",
  "calculation_version": "v1.0.0",
  "result_paise": 2600000,
  "currency": "INR",
  "freshness_score": "fresh",
  "coverage_score": "full",
  "confidence_level": "high",
  "input_snapshot": {
     "formula": "...",
     "inputs": {
         "available_cash_paise": 3900000,
         "expected_income_paise": 0,
         "upcoming_commitments_paise": 800000,
         "essential_spending_paise": 0,
         "safety_buffer_paise": 500000
     },
     "horizon_days": 30,
     "rulebook_version": "v1.0.0"
  },
  "computed_at": "TIMESTAMPTZ"
}
```
