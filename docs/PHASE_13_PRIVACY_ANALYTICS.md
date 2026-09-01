# Phase 13 — Privacy Analytics

## Core Rules
1. User identifiers are SHA-256 hashed (salted) before any analytics storage
2. PII fields are stripped in `Telemetry.deepStripPII()` — including: balance, amount, accountNumber, rawPrompt, conversation, IBAN, PAN, tokens
3. No raw bank statements, full transaction histories, or complete AI conversations in analytics
4. Test/synthetic traffic is labeled with TrafficClass and excluded from real-user aggregations

## Event Design
Analytics events contain only:
```
event_type        string
feature           string
status            string
latency_ms        integer
traffic_class     REAL_USER | SYNTHETIC | ...
timestamp         ISO8601
```

## AI Conversation Policy (§48)
Beta user conversations must NOT be used for model training without:
- Explicit consent policy
- De-identification approval
- Governance sign-off

Current status: POLICY_REQUIRED — not proceeding with training use.

## Deletion Compliance (§49)
When beta user deletes account:
- Telemetry anon_user hash is re-salted (breaks historical linkage)
- Research data follows 90-day retention policy
- Raw analytics purged per data retention schedule

## Current Status
Privacy controls: PASS
Test traffic isolation: PASS
