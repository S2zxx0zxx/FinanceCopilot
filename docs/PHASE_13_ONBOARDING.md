# Phase 13 — Onboarding Measurement

## Activation Definition
**Selected Definition:** `FIRST_TRUSTED_FINANCIAL_RESULT_VIEWED`
This fires server-side when a user successfully receives a verified financial state response.
It does NOT fire on: app open, sign-in alone, or empty state display.

## Onboarding Funnel Events
Each event fires ONLY after the real server-side condition is met:

| Step | Event | Condition |
|------|-------|-----------|
| 1 | ONBOARDING_BETA_INVITED | Invite sent by admin |
| 2 | ONBOARDING_BETA_ACCEPTED | User clicked accept link |
| 3 | ONBOARDING_SIGNED_IN | Auth token verified server-side |
| 4 | ONBOARDING_CONSENTED | Consent record persisted to DB |
| 5 | ONBOARDING_DATA_SOURCE_CONNECTED | First connection row written |
| 6 | ONBOARDING_FIRST_DATA_READY | First sync completed successfully |
| 7 | ONBOARDING_FIRST_AI_QUERY | AI endpoint responded with result |
| 8 | ONBOARDING_FIRST_USEFUL_RESULT | User marked response helpful |
| 9 | ONBOARDING_FIRST_CORRECTION | Correction persisted + downstream updated |
| 10 | ONBOARDING_FIRST_PLANNING_ACTION | Goal/plan record created |

## Implementation
All funnel events implemented in `Telemetry.trackOnboardingStep()` with step validation.

## Current Metrics
N = 0 real users. INSUFFICIENT_EVIDENCE until onboarding begins.
