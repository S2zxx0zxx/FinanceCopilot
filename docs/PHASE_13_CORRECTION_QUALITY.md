# Phase 13 — Correction Quality

## Correction Definition
A correction is COMPLETE only when:
1. Backend persists valid correction to canonical state
2. Downstream financial state is updated OR correctly marked stale

A UI click alone is NOT a successful correction.

## Correction Event Model
```
correction_id       UUID
user_scope          anon_user_hash
object_type         transaction | goal | account | category
field               field_name
reason_category     WRONG_CATEGORY | WRONG_MERCHANT | DUPLICATE | OTHER
source              USER_MANUAL
timestamp           ISO8601
downstream_updated  boolean
time_to_correct_ms  integer
```

## Metrics to Compute (on real data)
| Metric | Formula |
|--------|---------|
| correction_rate | corrections / transactions |
| corrections_per_active_user | total corrections / active users |
| repeat_correction_rate | same field corrected > 1 / total |
| time_to_correction | median time_to_correct_ms |
| post_correction_error_rate | new errors after correction / corrections |

## Interpretation Note
High correction rate MAY indicate good user control OR poor auto-classification.
Investigate before labeling as "bad."

## Implementation
Correction telemetry hook active in `transactions.controller.js` via `Telemetry.trackCorrectionCompleted()`.

## Current Status
INSUFFICIENT_EVIDENCE — N = 0 real users.
