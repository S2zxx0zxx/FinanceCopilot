# Ledger & Reconciliation Specification

**Version:** 1.0  
**Status:** BASELINE (Phase 0)  
**PRD Reference:** Sections 3, 21, 22, 23  
**ADR Reference:** ADR-001, ADR-002, ADR-003  
**Last Updated:** 2026-08-22

---

## 1. Financial Truth Hierarchy

```
1. Immutable source records + provenance         (source_records table)
2. Normalized canonical records                  (transactions table)
3. Reconciled financial meaning                  (reconciliation engines)
4. Deterministic financial state                 (ledger + safe_to_spend)
5. AI intelligence / forecast                    (ai_interactions, forecast_snapshots)
6. User decision                                 (user approval)
7. Observed outcome                              (actuals vs forecast)
```

**Rule:** No lower layer may silently overwrite a higher layer.  
**Rule:** LLM output is NEVER a source of financial truth.

---

## 2. Ingestion Pipeline

Every import passes through these stages in order:

```
SOURCE (pdf/csv/excel/ocr/manual/voice)
        ↓
INGEST
  - Validate file: type, size, encoding, safety
  - Reject: macros, formulas, embedded content, oversized
  - Create import_job record
  - Upload raw file to object storage (R2)
        ↓
VALIDATE
  - File structure validation
  - Encoding validation
  - Malformed row detection
  - Formula injection check (for CSV/Excel)
        ↓
PARSE
  - Extract raw rows/records
  - Store each as source_record (raw_data IMMUTABLE)
  - Tag: parse_version, import_job_id
        ↓
RAW IMMUTABLE STORE
  - source_records.raw_data — never updated
  - File kept in object storage for reprocessing
        ↓
CANONICALIZE
  - Map raw fields → canonical transaction fields
  - observed_at, amount_paise, direction, merchant_raw, reference_id
  - Apply normalization_version tag
        ↓
MERCHANT RESOLUTION
  - Look up merchant_raw in merchant aliases table
  - Fuzzy match against known merchant canonical names
  - If found: link merchant_id, use canonical display name
  - If not found: create tentative merchant record, flag for review
        ↓
CATEGORY CLASSIFICATION
  - Apply deterministic rules first (MCC, keyword)
  - If rule matches with high confidence: apply category
  - If ambiguous: AI classification (via ai-gateway, async)
  - Store confidence score, mark low-confidence for review
        ↓
ACCOUNT / INSTRUMENT MAPPING
  - Map transaction to financial_account and payment_instrument
  - Match by account number hash, instrument last4, UPI ID hash
        ↓
DUPLICATE DETECTION
  - Check: reference_id + account_id + date + amount
  - Check: fuzzy amount + date window + merchant
  - Mark duplicates: duplicate_group_id, duplicate_status
  - NEVER silently destroy a record — mark as duplicate
        ↓
TRANSFER DETECTION
  - Detect: matching debit/credit pairs within time window
  - Same user, different accounts, matching amounts
  - Assign transfer_group_id to both legs
  - Mark: transfer_role = 'source' | 'destination'
        ↓
CARD SETTLEMENT MATCHING
  - Match credit card purchases with settlement payments
  - Assign settlement_group_id
  - Mark settlement_role = 'purchase' | 'settlement'
        ↓
CONFIDENCE SCORING
  - Compute overall_confidence per transaction
  - Low confidence → needs_review = TRUE
  - Populate review_reason[]
        ↓
REVIEW QUEUE
  - Transactions with needs_review = TRUE go to review queue
  - Surfaced to user via "Needs Attention" items
        ↓
RECONCILED VIEW
  - Query layer excludes duplicates (non-primary), own-account transfers
  - Includes settled card purchases but not double-counted settlements
        ↓
FINANCIAL STATE
  - Deterministic balance calculation
  - Safe-to-Spend computation
        ↓
INTELLIGENCE / FORECAST
  - Inputs come ONLY from reconciled financial state
  - AI never reads raw unreconciled source records for computation
```

### Pipeline Properties

Every stage must be:
- **Observable** — structured logs, metrics per stage
- **Retryable** — idempotent operations
- **Idempotent** — re-running with same input produces same output
- **Auditable** — every state transition logged

Failed records → dead-letter queue with structured error + recovery path

---

## 3. Duplicate Detection Rules

### Rule D1 — Exact Match
```
Same: reference_id + account_id + amount_paise + currency
→ Mark as DUPLICATE
```

### Rule D2 — Near-Duplicate
```
Same: account_id + amount_paise ± 0 + merchant_normalized
Within: 3 calendar days
→ Flag for REVIEW (needs_review = TRUE)
```

### Rule D3 — Statement Overlap
```
If two statements cover overlapping periods for the same account:
→ Flag transactions in overlap window for duplicate review
```

### Rule D4 — Cross-Import
```
If same import job uploaded twice (same idempotency_key):
→ Reject second import at job level
```

### Duplicate Invariants
- NEVER delete a source record to resolve a duplicate
- Always keep all records — mark primary/duplicate status
- User can correct duplicate classification
- Correction is auditable

---

## 4. Transfer Detection Rules

### Rule T1 — Same-User, Different-Account Match
```
Debit from account A + Credit to account B
Within: same user, ±1 calendar day
Amount: exact match
→ Mark as transfer pair, transfer_group_id assigned
```

### Rule T2 — UPI Transfer Indicators
```
Description contains: 'transfer to', 'transfer from', 'imps', 'neft', 'rtgs'
Combined with amount/timing match
→ Transfer candidate (high confidence)
```

### Transfer Invariants
- Own-account transfers are NOT counted as spending or income
- Both legs must be present for a transfer to be excluded from spending
- If only one leg exists (e.g., only one account imported): label as PARTIAL_TRANSFER, include in spending until resolved
- User can confirm or override transfer classification
- Correction is auditable

---

## 5. Card Settlement Matching Rules

### Rule CS1 — Credit Card Purchase + Settlement
```
Debit (card purchase) + Credit (card settlement payment) 
within card statement cycle
→ settlement_group_id assigned
→ settlement_role: purchase | settlement
```

### Rule CS2 — Partial Settlement
```
Settlement amount ≠ purchase amount
→ Flag: partial settlement, outstanding balance noted
```

### Card Settlement Invariants
- Card purchase is the real expense event — do not double-count settlement
- If purchase exists and settlement exists → count purchase only in spending
- If only settlement exists (purchase not imported) → show as expense with note
- Settlement should link to liability commitment (card bill due)

---

## 6. Reconciliation Invariants (MUST NEVER VIOLATE)

```
INV-001: Raw source records are immutable
INV-002: Every financial mutation is logged to audit_events
INV-003: Corrections preserve both old_value and new_value
INV-004: Own-account transfers excluded from income and spending totals
INV-005: Card settlements not double-counted when purchase exists
INV-006: Duplicates never silently destroy provenance
INV-007: Low-confidence outcomes become review tasks, never silent
INV-008: All reconciliation is idempotent — re-run safe
INV-009: Conflicts surface to review queue, not silently resolved
INV-010: Financial period calculations are timezone-explicit
```

---

## 7. Ledger Calculation Rules

### Account Balance

```
account_balance =
  opening_balance (from latest statement)
  + SUM(amount_paise FROM credits WHERE
        (posting_status = 'posted')
    AND (duplicate_status IN ('unique','primary'))
    AND ((transfer_role IS NULL) OR (transfer_role = 'destination'))
    AND NOT EXISTS linked reversal excluding this row   -- ADR-013 D5
    )
  - SUM(amount_paise FROM debits WHERE
        (posting_status = 'posted')
    AND (duplicate_status IN ('unique','primary'))
    AND ((transfer_role IS NULL) OR (transfer_role = 'source'))
    AND NOT EXISTS linked reversal excluding this row   -- ADR-013 D5
    )
```
Every compound predicate is fully parenthesized — mixed AND/OR precedence is a defect (INV-FIN-005).

Always show: balance + freshness + coverage + data gaps.

### Spending Total (Period)

```
gross_spending =
  SUM(amount_paise WHERE
      (direction = 'debit')
  AND (posting_status = 'posted')
  AND (duplicate_status IN ('unique','primary'))
  AND ((transfer_role IS NULL) OR (transfer_role = 'partial_transfer'))
  AND ((settlement_role IS NULL) OR (settlement_role = 'purchase'))   -- settlements never double-count
  AND (transaction_type NOT IN ('fee','interest'))   -- configurable via sts-config
  AND (observed_at >= period_start AND observed_at < period_end_exclusive)
  )

refund_offset =
  SUM(amount_paise WHERE
      (direction = 'credit')
  AND (transaction_type = 'refund')
  AND (posting_status = 'posted')
  AND (duplicate_status IN ('unique','primary'))
  AND (observed_at >= period_start AND observed_at < period_end_exclusive)
  )

net_spending = gross_spending - refund_offset        -- ADR-013 D4
```
Reversed transactions: original debit excluded once a linked reversal exists (ADR-013 D5).

### Income Total (Period)

```
income_total =
  SUM(amount_paise WHERE
      (direction = 'credit')
  AND (posting_status = 'posted')
  AND (duplicate_status IN ('unique','primary'))
  AND ((transfer_role IS NULL) OR (transfer_role = 'partial_transfer'))
  AND (transaction_type = 'income')          -- salary|bonus|interest|rental are sub_type values
  AND (observed_at >= period_start AND observed_at < period_end_exclusive)
  )
```
Refunds are NEVER income (expense offset — ADR-013 D4). Interest earned is `type=income, sub_type=interest`. Reversal credits never count as income (D5).

---

## 8. Safe-to-Spend Engine

### Formula (Conceptual)

```
Safe-to-Spend =
  Available Cash
  + Expected Income (next N days)
  - Upcoming Commitments (next N days)
  - Expected Essential Spending (next N days, historical)
  - Minimum Safety Buffer
```

### Production Formula (v1)

Pending-money treatment is CANONICAL in `control/sts-engine-config.yaml → pending` (weights debit 0.90 / credit 0.70 per ADR-013 D2). Docs reference it; they do not restate numbers.
```
safe_to_spend_paise =
  available_liquid_cash_paise
  + FLOOR(confirmed_upcoming_income_paise)                 -- inflow rounding, ADR-013 D1
  - CEIL(firm_commitments_paise)                           -- deduction rounding
  - CEIL(estimated_essential_spending_paise)
  - user_safety_buffer_paise
  - CEIL(pending_debits × pending.debit_weight)            -- weight from sts-config
  + FLOOR(pending_credits × pending.credit_weight)         -- weight from sts-config
```
Threshold bands (inclusive bounds): SAFE ≥ 500000p · MODERATE [100000,500000)p · TIGHT < 100000p (ADR-013 D3).

### Required Outputs

Every Safe-to-Spend computation stores:
```yaml
calculation_version: v1.0.0
calculated_at: ISO-8601
horizon_days: 30
available_cash_paise: integer
expected_income_paise: integer
upcoming_commitments_paise: integer
expected_essential_paise: integer
safety_buffer_paise: integer
pending_paise: integer
safe_to_spend_paise: integer  # result
confidence: 0.0–1.0
coverage: 0.0–1.0             # % of accounts/sources with fresh data
freshness_seconds: integer
data_gaps: [string]           # human-readable list of missing sources
is_stale: boolean
input_snapshot: {}            # full input state JSON
```

### Safe-to-Spend Display Rules

- ALWAYS show: amount, horizon, freshness, coverage
- If coverage < 0.8: show PARTIAL badge + explain what's missing
- If data is stale: show STALE badge + last_updated
- If confidence < 0.7: show LOW_CONFIDENCE badge
- Never show a Safe-to-Spend without its horizon label
- Never display false certainty

### Safe-to-Spend Invalidation Triggers

Recompute when:
- New import completes reconciliation
- User manually adds/corrects a transaction
- A commitment is marked paid
- A new recurring series is detected
- User's safety buffer preference changes
- 4 hours have elapsed (time-based staleness)

---

## 9. Reconciliation Edge Cases

| Scenario | Handling |
|----------|---------|
| Same transaction in two statements | Duplicate detection (Rule D1/D2) |
| UPI merchant vs UPI transfer | Direction + description heuristics |
| Refund for past purchase | transaction_type = 'refund', negative impact on spending net |
| Partial refund | Separate transaction_type = 'refund', partial amount |
| Pending → Posted transition | Update posting_status, match by reference_id |
| Reversed transaction | transaction_type = 'reversal', offset original debit |
| Statement page break (missing rows) | Flag statement as INCOMPLETE, surface as data gap |
| OCR error in amount | Low confidence, needs_review = TRUE |
| OCR error in date | Use surrounding context heuristics or flag |
| Missing date | Flag as needs_review, try to infer from statement position |
| Merchant alias mismatch | Merchant aliases table + fuzzy match |
| Changed subscription amount | Recurring series detects variance, flags for review |
| Cash withdrawal | transaction_type = 'cash_withdrawal', treated as expense |
| International transaction | currency field explicit, convert to INR at recorded FX rate |
| Salary + bonus same day | Two separate transactions, both direction='credit', type='income', sub_type='salary'/'bonus' |

---

## 10. Review Queue

Transactions enter review when:
- `needs_review = TRUE`
- `overall_confidence < 0.75`
- `duplicate_status = 'pending_review'`
- `transfer_role` is uncertain
- `settlement_role` is uncertain
- Merchant not recognized
- Category confidence < 0.6

Review surface:
- SCR-08 Home (Needs Attention items)
- SCR-13 Transactions (filter: needs review)
- SCR-14 Transaction Detail (correction UI)

Resolution:
- User confirms or corrects
- Correction written to `corrections` table
- `needs_review` set to FALSE
- `overall_confidence` updated
- Downstream recalculations triggered (balance, Safe-to-Spend)
