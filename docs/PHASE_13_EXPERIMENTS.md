# Phase 13 — Experiment Governance

## Required Fields Per Experiment
```
hypothesis            string
population            cohort + eligibility
control               description
variant               description
primary_metric        name + definition
secondary_metrics     list
sample_size_rationale why N is sufficient
duration              start + end/review date
stop_criteria         early stop conditions
risk                  potential harms
rollback              how to revert
owner                 name + team
```

## Prohibited A/B Tests
Do NOT A/B test with an unsafe control/variant:
- Security authorization logic
- Deletion safety guarantees
- Financial correctness calculations
- Privacy controls

## Statistical Discipline
- Pre-define metric definitions BEFORE observing results (no metric shopping)
- Report N, effect, uncertainty, limitations with every result
- Do not declare significance from tiny samples
- Label all observational results as OBSERVATIONAL

## Current Status
No experiments running. Framework defined and ready.
