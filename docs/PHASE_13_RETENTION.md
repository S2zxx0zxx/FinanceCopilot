# Phase 13 — Retention

## Definitions
| Metric | Definition |
|--------|-----------|
| D1 | Return within 24h of activation |
| D7 | Return within 7 days of activation |
| D30 | Return within 30 days of activation |

**Activation:** FIRST_TRUSTED_FINANCIAL_RESULT_VIEWED (server-side verified)
**Return:** Any meaningful product event (not just app open)

## Denominator Definition (§27)
```
N_eligible = users who reached activation within measurement window
activation_date = date of FIRST_TRUSTED_FINANCIAL_RESULT_VIEWED event
return_window = [activation_date + 0, activation_date + D]
excluded_users = test accounts, developer accounts, synthetic traffic
```

## Meaningful Return Reasons to Track
- AI usage
- Planning action
- Goal progress review
- New data sync triggered
- Financial review (balance/spending check)
- Forecast review

## Statistical Discipline
For every reported retention metric include:
- N eligible
- N retained
- Definition version
- Observation window
- Release/feature flag state
- Cohort

Do NOT interpret raw app opens as retained product value.

## Current Status
INSUFFICIENT_EVIDENCE — N = 0 real users.
