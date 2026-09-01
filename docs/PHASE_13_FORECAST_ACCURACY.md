# Phase 13 — Forecast Accuracy (Real-World)

## Phase 8 vs Phase 13 Distinction
Phase 8 synthetic evaluation DOES NOT prove production forecast performance.
Phase 13 requires real users to generate actual forecast origins and actual outcomes.

## Forecast Evaluation Protocol
```
forecast_generated_at T
→ actual_outcome_observed_at T+H
```
Where H = 7d, 30d, 90d (policy-dependent).

## Eligibility Requirements (§23)
A forecast origin is valid only if:
- Required historical data exists
- Forecast was actually generated and stored
- Target outcome becomes observable
- No future data leakage
- State/version references preserved

Invalid origins must be classified: INVALID_ORIGIN (not silently dropped).

## 90-Day Policy
Phase 8 policy: FORECAST_UNAVAILABLE for low-trust long horizons.
This behavior is RETAINED in Phase 13. It must not be relaxed to generate more metrics.

## Metrics to Compute (on eligible real data)
```
N
MAE (Mean Absolute Error)
RMSE (Root Mean Square Error)
BIAS (signed systematic error)
Coverage (% actuals within prediction interval)
Interval Width (mean)
Forecast Availability Rate
```

Segmented by: horizon, history depth, coverage, volatility, income stability.

## Current Status
7-DAY: N-A (no real users)
30-DAY: N-A (no real users)
90-DAY: UNAVAILABLE_BY_POLICY
All metrics: INSUFFICIENT_EVIDENCE
