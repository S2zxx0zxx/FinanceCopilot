# Phase 13 — AI Safety

## P0 Blockers (must stop rollout immediately)
- Wrong-user data exposure
- Privacy leakage of any financial PII
- Unauthorized financial action executed
- Materially wrong financial number presented with false certainty
- Policy bypass

## P1 Blockers (must be contained before cohort expansion)
- Financial number incorrect but not dangerous
- Wrong tool selected for financial decision
- Misleading certainty shown to user

## Response Protocol
```
P0 detected:
→ STOP rollout
→ Contain: disable affected feature flag
→ Investigate root cause
→ Fix with regression test
→ Re-enable only after controlled validation
```

## AI Safety Governance
- Feature flags provide kill switch for any AI feature
- AI provider failures return 503 (not fake data)
- AI numerical consistency validated against deterministic tool output
- No model self-evaluation — independent validators used

## Training Data Policy
Beta user conversations must NOT be used for model training without:
- Explicit consent policy
- De-identification
- Governance approval

## Current P0/P1 Incidents
= 0 (no real users yet)

## Current Status
PASS (governance implemented). Awaiting real-user validation.
