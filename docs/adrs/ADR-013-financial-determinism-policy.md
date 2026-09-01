# ADR-013 — Financial Determinism Policy

Status: ACCEPTED (Phase 0 Remediation) | Date: 2026-08-23
Resolves findings: F-B6, F-B7, F-B10, F-B8(partial)
Supersedes: implicit behaviors in 07_LEDGER doc, 10_FORECAST doc

## Context
Money is integer paise, but formulas multiply by fractional factors (0.9 / 0.7 / H/30 / variance bands). Without an explicit rounding stage, the deterministic-engine claim is false. Pending weights were authored differently in three documents; refunds/reversals had no accounting semantics; threshold inclusivity undefined.

## Decisions

D1 ROUNDING
- Storage: minor unit paise, INTEGER/BIGINT only. Float forbidden on authoritative values.
- Intermediate math must be exact-decimal or rational; no binary float.
- Default rounding mode: ROUND_HALF_UP.
- Conservative mode for Safe-to-Spend inputs only: deductions CEIL, inflows FLOOR.
- Rounding happens ONCE at the final assignment of each stored field.

D2 PENDING MONEY (single source)
- Canonical parameters live ONLY in control/sts-engine-config.yaml pending block:
  debit_weight 0.90, credit_weight 0.70.
- Ledger doc and forecast doc REFERENCE this block by name; they must not restate numbers.

D3 THRESHOLD INCLUSIVITY (STS bands, paise)
- SAFE:     sts >= 500000
- MODERATE: 100000 <= sts < 500000
- TIGHT:    sts < 100000
Same convention for forecast Financial Weather Today row.

D4 REFUND ACCOUNTING
- refund = expense offset. It SUBTRACTS from period spending. It is NEVER income.
- net_spending = gross_spending - SUM(refund credits in period).
- Full vs partial recorded via refund_role [full|partial].

D5 REVERSAL ACCOUNTING
- reversal nets the original debit: original excluded from totals once linked reversal exists (reversal_role pre_posting removes pending leg; post_posting excludes posted original).
- Reversal credit itself never enters income.

D6 CHARGEBACK
- Out of V1 scope. If encountered: transaction_type unknown + review_reason chargeback_candidate. Future ADR required.

D7 FORECAST MATH GUARDS (F-B8 partial)
- Coverage denominator = 0 -> coverage = 0 (meaning: no fresh money is visible).
- MAPE undefined when |actual_balance| < 100000 paise (Rs.1,000): use absolute error in paise instead; label metric used per snapshot.
- Confidence formula drops dead upper clamp; floor clamp at 0 retained.
- Spending variability bands made concrete: CV <= 0.25 low, 0.25 < CV <= 0.5 moderate, CV > 0.5 high.
- Safety buffer REMOVED from forecast inputs (it is an STS-only concern). Credit-card outstanding subtraction stays, now explicit in algorithm line.

## Consequences
- All engines must implement one shared money-math util (Phase 5) exposing round(mode) helpers; tests assert determinism across replay.
- Docs may not embed pending/rounding numbers anymore; violations fail enum/policy drift checks.
