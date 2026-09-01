# Phase 13 — Cohort Design

## Cohort Schema
```
cohort_id          TEXT
eligibility        DEFINED (see below)
entry_date         TIMESTAMPTZ
feature_flags      ai_forecast_beta, automated_corrections, new_trust_dashboard
consent_state      REQUIRED
region             POLICY_REQUIRED
```

## Eligibility Requirements
- Authenticated user ✓
- Valid consent on file ✓
- Not a test/developer account ✓
- betaRegionApproved: POLICY_REQUIRED (blocking enrollment until defined)

## Cohort Assignment
Handled by `backend/utils/beta-cohort.js`:
- INTERNAL: explicit invite (betaRole === 'INTERNAL')
- BETA_COHORT_1: deterministic percentage bucket (< 5%)
- Assignment persisted in `beta_cohort_assignments` table (migration 0020)
- No cohort switching mid-measurement

## Test Traffic Isolation
- isTestAccount flag blocks test users from cohort assignment
- X-Traffic-Class header marks synthetic/load test requests
- TrafficClass enum enforced in Telemetry service

## Current State
Real users enrolled: 0
