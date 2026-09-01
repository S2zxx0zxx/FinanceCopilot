# ADR-009 — Observability and SLO Policy

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**PRD Reference:** Sections 51, 52  

---

## Decision

### Observability Stack (Adapter-Based)
All observability via `ObservabilityProvider` adapter. No vendor SDK directly in domain code.

### Required Context on Every Request
```
request_id, trace_id, user_scope (pseudonymous), endpoint, method, timestamp
```

### Log Policy
- Structured JSON logs always
- No raw financial values in any log
- DEBUG level: development only
- Production: INFO, WARN, ERROR only

### SLO Hypotheses (V1 Starting Points)
Treated as hypotheses until measured in production:
- API availability: 99.9% monthly
- Common read p95: < 500ms
- Core transaction view success: 99.9%
- Import pipeline: 99% jobs within 5 minutes
- AI eligible request availability: 99%

### Error Budget Policy
- Healthy: normal releases
- 70–100% consumed: slow non-critical releases
- Breached: feature freeze (security/incident fixes only)
- Recovery: post-incident review required

### Financial Correctness Gate
Financial correctness (zero balance errors, zero double-counts) is a SEPARATE release gate from availability SLOs. Never trade one for the other.

---

## Compliance

- Logging policy enforced via code review + CI checks
- SLOs reviewed monthly
- Error budget tracked weekly
- Finance correctness failures block release regardless of SLO status
