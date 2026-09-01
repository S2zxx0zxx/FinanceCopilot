# ADR-008 — Forecast Model Versioning

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**PRD Reference:** Section 27  

---

## Decision

### V1 Forecast Engine: Rule-Based (No ML)
The V1 forecast engine is a deterministic rule-based system. No ML models in V1.

Rationale:
- Rule-based engine is verifiable, debuggable, explainable
- ML requires sufficient training data (not available at V1 launch)
- Deterministic rules can be evaluated against actuals
- ML upgrade is a future enhancement via new model_version

### Version Tagging
Every forecast snapshot stores:
- `model_version`: Engine version (e.g., `v1.0.0`)
- `rule_version`: Specific rule set version
- `input_snapshot`: Full input state at time of computation

When forecast logic changes:
1. Bump `model_version`
2. Bump `rule_version`
3. Create amendment to this ADR
4. Re-evaluate last 30 days of snapshots
5. Do NOT retroactively overwrite historical snapshots

### Evaluation
Every forecast is compared against actuals after the horizon passes:
- `actual_balance_paise` is filled in
- `forecast_error_paise` computed
- MAPE tracked over time
- Alert if MAPE consistently > 20%

### Future ML Forecast Path
When ML forecast is ready:
- New model_version (e.g., `v2.0.0`)
- Feature flag: `forecast.ml.enabled`
- A/B test against rule-based engine
- Only replace rule-based when ML MAPE is demonstrably better

---

## Compliance

- All forecast snapshots must store `model_version` and `rule_version`
- Historical snapshots are immutable
- Evaluation backfill must run for all non-evaluated past snapshots
