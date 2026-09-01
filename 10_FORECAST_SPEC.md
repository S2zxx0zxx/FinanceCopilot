# Forecast Specification

**Version:** 1.0  
**Status:** Phase 0 — Defined, Not Implemented  
**PRD Reference:** Sections 24, 27  
**ADR Reference:** ADR-008  
**Last Updated:** 2026-08-22

---

## 1. Forecast Philosophy

> **Never show false precision.**  
> Always show a range, not a single number.  
> Always show confidence and data coverage.  
> Always show assumptions explicitly.  
> Forecasts never overwrite source financial truth.  
> Store model/rule versions on every snapshot.  
> Compare predictions against actual outcomes.

---

## 2. Forecast Horizons

| Horizon | Days | Use Case |
|---------|------|---------|
| Short-term | 7 days | Immediate cash pressure |
| Medium-term | 30 days | Monthly planning |
| Quarterly | 90 days | Quarterly goals |

Longer horizons (6m, 1yr) only when:
- Sufficient historical data exists (≥ 6 months of reconciled data)
- Confidence is explicitly labeled
- Assumptions are fully transparent

---

## 3. Forecast Engine — V1 Rule-Based Engine

The V1 forecast is a **deterministic rule-based engine**.  
It does NOT use ML models in V1.  
ML forecast is a future enhancement (post-Phase 8).

### Input Sources

All inputs come from the **canonical reconciled financial state**. Never from raw/unreconciled data.

| Input | Source | Notes |
|-------|--------|-------|
| Current liquid balance | `financial_accounts` | Credit accounts excluded |
| Credit card outstanding | `financial_accounts` (credit type) | Subtracted from liquid |
| Confirmed upcoming income | `recurring_series` (income type) | User-confirmed or high-confidence only |
| Known fixed commitments | `commitments` table | Bills, EMIs, subscriptions due in horizon |
| Variable essential spending | Historical category averages | Rolling 3-month average per category |
| Irregular commitments | `commitments` (one-off) | User-entered or detected |
| Goal contributions | `goals` (monthly_contribution) | If user has active goal |
| Safety buffer | User preference | Default: ₹5,000 |
| Pending transactions | `transactions` where posting_status = 'pending' | Applied with discount factor |

---

## 4. Forecast Algorithm (v1.0)

```
For horizon H days:

projected_cash =
  current_liquid_balance_paise
  + sum(confirmed_income_in_H_days)           # from recurring_series (income)
  - sum(fixed_commitments_in_H_days)          # from commitments table
  - estimated_variable_spending(H)             # historical average × (H/30)
  - goal_contributions(H)                      # if active goals
  - pending_debits × 0.9                       # 90% discount for pending
  + pending_credits × 0.7                      # 70% discount for pending credits

Range:
  low  = projected_cash × (1 - variance_factor)
  mid  = projected_cash
  high = projected_cash × (1 + variance_factor)

variance_factor = based on:
  - spending variability (CV of last 3 months), CONCRETE BANDS [ADR-013 D7]:
      CV < 0.25            -> variance_factor = 0.05
      0.25 <= CV < 0.50    -> variance_factor = 0.10
      CV >= 0.50           -> variance_factor = 0.20
  - income consistency
  - coverage score
  - number of unknown upcoming items
```

---

## 5. Confidence Calculation

```
confidence = 1.0   # start point; only subtract penalties below (no dead upper clamp)

# Deductions
if coverage < 0.80:           confidence -= 0.20
if income_confirmed < 0.70:   confidence -= 0.15
if data_age > 7 days:         confidence -= 0.10
if spending_variance_high:    confidence -= 0.10
if has_pending_items:         confidence -= 0.05
if has_data_gaps:             confidence -= 0.10

confidence = max(0.0, confidence)   # floor only; upper clamp removed (dead code, F-B8)
```

---

## 6. Coverage Calculation

```
denominator = sum of balance_paise from ALL accounts
if denominator == 0:
    coverage = 0        # GUARD [F-B8/ADR-013]: zero-denominator yields 0, never NaN
else:
    coverage = (sum of balance_paise from FRESH accounts) / denominator

If no accounts have fresh data: coverage = 0
```

FRESH = last synced within 24 hours.

---

## 7. Forecast Snapshot Storage

Every forecast stores (immutable after creation):

```yaml
snapshot_id: uuid
user_id: uuid
horizon_days: 30
forecast_date: YYYY-MM-DD
model_version: "v1.0.0"
rule_version: "v1.0.0"

# All input values at time of computation
input_balance_paise: integer
input_coverage: 0.0–1.0
input_snapshot:
  liquid_balance_paise: integer
  confirmed_income_paise: integer
  fixed_commitments_paise: integer
  variable_spending_estimate_paise: integer
  goal_contributions_paise: integer
  pending_debits_paise: integer
  pending_credits_paise: integer
  safety_buffer_paise: integer
  accounts_included: [uuid]
  accounts_stale: [uuid]
  missing_sources: [string]
  computation_timestamp: ISO-8601

# Output
projected_low_paise: integer
projected_mid_paise: integer
projected_high_paise: integer
currency: "INR"
confidence: 0.0–1.0
coverage: 0.0–1.0

drivers:
  - factor: "salary"
    direction: "positive"
    amount_paise: integer
    confidence: 0.9
  - factor: "rent_commitment"
    direction: "negative"
    amount_paise: integer
    confidence: 1.0

assumptions:
  - "Salary income assumed based on 3-month average (confirmed recurring)"
  - "Netflix subscription assumed to continue (₹649/month)"
  - "Variable spending estimated from August average"
  - "No income data from axis-savings-account (not connected)"

data_gaps:
  - "HDFC Credit Card statement not connected"
  - "Income source unconfirmed"

# Evaluation (filled in after horizon passes)
actual_balance_paise: null
evaluated_at: null
forecast_error_paise: null
```

---

## 8. Forecast Display Rules

| Condition | Display |
|-----------|---------|
| `confidence >= 0.80` | Show range + "Based on your data" |
| `0.60 <= confidence < 0.80` | Show range + MODERATE CONFIDENCE badge + assumptions |
| `confidence < 0.60` | Show range + LOW CONFIDENCE badge + data gaps |
| `coverage < 0.60` | Show PARTIAL DATA warning prominently |
| Data age > 72 hours | Show STALE badge on all forecast values |
| Missing key income source | Show specific gap: "Add your salary account" |
| Forecast horizon > 30d with insufficient data | Disable or show ESTIMATE ONLY |

**Never show a single number without range.**  
**Never show a forecast without its confidence, coverage, and freshness.**

---

## 9. Forecast Evaluation

After each horizon passes:

1. Retrieve actual balance from `financial_accounts`
2. Compute `forecast_error_paise = actual - projected_mid_paise`
3. Write back to `forecast_snapshots.actual_balance_paise`
4. Track MAPE (Mean Absolute Percentage Error) over time.
   MAPE GUARD [F-B8/ADR-013]: when |actual_balance_paise| < 100000 paise (Rs.1000),
   skip percentage error and record ABSOLUTE forecast_error_paise instead
   (percentage on tiny balances is meaningless and explodes).
5. Alert if forecast error consistently > 20%

Evaluation triggers:
- Model improvement (if MAPE > threshold)
- Driver recalibration
- User notification: "How accurate was your forecast?" (optional UX)

---

## 10. Financial Weather

Financial Weather is a simplified forward-looking view:

| Horizon | Label | Criteria |
|---------|-------|---------|
| Today | 🟢 Clear | STS > ₹5,000 |
| Today | 🟡 Watch | STS ₹1,000–₹5,000 |
| Today | 🔴 Tight | STS < ₹1,000 |
| 7 days | 🟢 Comfortable | No commitments > 80% STS |
| 7 days | 🟡 Pressure | Some commitments approaching |
| 7 days | 🔴 Critical | Commitment gap identified |
| 30 days | 🟢 On track | Forecast positive |
| 30 days | 🟡 Monitor | Forecast marginal |
| 30 days | 🔴 Alert | Forecast negative |

Weather is derived from the forecast engine — it is NOT independently computed.

---

## 11. Forecast Model Versioning

| Version | Changes | Deployed |
|---------|---------|---------|
| v1.0.0 | Initial rule-based engine | Phase 8 |

Rule: Every time forecast logic changes:
- Bump `model_version`
- Bump `rule_version`
- Create ADR-008 amendment
- Re-evaluate last 30 days of snapshots
- Do not retroactively overwrite historical snapshots
