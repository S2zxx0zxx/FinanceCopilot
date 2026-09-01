# Observability Specification

**Version:** 1.0  
**Status:** Phase 0 — Defined, Not Implemented  
**PRD Reference:** Sections 51, 52  
**ADR Reference:** ADR-009  
**Last Updated:** 2026-08-22

---

## 1. Observability Philosophy

> Every critical behavior must be observable.  
> Never log raw financial values.  
> Optimize for diagnosability, not verbosity.

---

## 2. The Four Pillars

| Pillar | What | Tool (Adapter) |
|--------|------|---------------|
| Logs | Structured JSON events | Cloudflare Analytics / external |
| Metrics | Numeric time-series | Cloudflare Analytics / Prometheus adapter |
| Traces | Distributed request traces | `request_id` + `trace_id` propagation |
| Alerts | Threshold-based notifications | Adapter |

---

## 3. Required Request Context

Every request must carry (injected by middleware):

```json
{
  "request_id": "uuid-v4",
  "trace_id": "uuid-v4",
  "user_id": "pseudonymous-uuid",
  "session_id": "pseudonymous-uuid",
  "endpoint": "/api/v1/financial/summary",
  "method": "GET",
  "timestamp": "ISO-8601",
  "feature_flag_version": "2026-08-23",
  "model_route": null,
  "policy_decision": null
}
```

AI requests additionally:
```json
{
  "model_route": "gemini-flash",
  "intent_class": "FINANCIAL_QUERY",
  "risk_level": "low",
  "policy_decision": "ALLOWED",
  "tool_ids": ["get_spending_by_category"]
}
```

---

## 4. Structured Log Format

```json
{
  "level": "INFO",
  "timestamp": "ISO-8601",
  "request_id": "uuid",
  "trace_id": "uuid",
  "user_scope": "pseudonymous-uuid",
  "service": "fincopilot-api",
  "domain": "financial-state",
  "event": "safe_to_spend_computed",
  "metadata": {
    "calculation_version": "v1.0.0",
    "horizon_days": 30,
    "coverage": 0.92,
    "confidence": 0.85,
    "duration_ms": 145
  }
}
```

**Log Levels:**

| Level | Usage |
|-------|-------|
| `ERROR` | Unhandled errors, critical failures |
| `WARN` | Expected failures, degraded service |
| `INFO` | Key business events (import complete, reconciliation done) |
| `DEBUG` | Development only — never in production |

**NEVER log:**
- Raw balances or amounts
- Account numbers or masked variations
- Transaction descriptions
- Statement content
- Session tokens, API keys
- Stack traces in production (use error codes)

---

## 5. Key Metrics to Track

### API Metrics

| Metric | Description |
|--------|-------------|
| `api.request.total` | Total requests per endpoint |
| `api.request.latency_ms` | Latency per endpoint (p50, p95, p99) |
| `api.request.error_rate` | Error rate per endpoint |
| `api.request.rate_limited` | Rate limit hits |
| `api.auth.failure_rate` | Authentication failure rate |

### Import Pipeline Metrics

| Metric | Description |
|--------|-------------|
| `import.job.queued` | Jobs entering queue |
| `import.job.completed` | Jobs successfully completed |
| `import.job.failed` | Jobs that failed |
| `import.job.duration_ms` | Job processing time |
| `import.records.total` | Total records parsed |
| `import.records.failed` | Records that failed parsing |
| `import.queue.depth` | Current queue backlog |

### Reconciliation Metrics

| Metric | Description |
|--------|-------------|
| `reconciliation.duplicate.detected` | Duplicates found |
| `reconciliation.transfer.detected` | Transfers detected |
| `reconciliation.needs_review.created` | Items needing review |
| `reconciliation.confidence.avg` | Average confidence score |

### Financial State Metrics

| Metric | Description |
|--------|-------------|
| `financial_state.stale_rate` | % of users with stale data |
| `financial_state.coverage.avg` | Average data coverage |
| `safe_to_spend.computed_total` | Safe-to-Spend computations |
| `safe_to_spend.compute_duration_ms` | Computation latency |

### AI Metrics

| Metric | Description |
|--------|-------------|
| `ai.request.total` | Total AI requests |
| `ai.request.latency_ms` | AI response latency |
| `ai.request.error_rate` | AI error rate |
| `ai.cost.tokens_total` | Total tokens consumed |
| `ai.cost.usd_total` | Total cost in USD |
| `ai.tool.invocations_total` | Tool calls per tool ID |
| `ai.policy.blocked_total` | Requests blocked by policy |
| `ai.evidence.validation_failures` | Evidence validation failures |
| `ai.injection.detected_total` | Prompt injection attempts |

### Forecast Metrics

| Metric | Description |
|--------|-------------|
| `forecast.generated_total` | Forecasts generated |
| `forecast.error_rate_avg` | Average MAPE against actuals |
| `forecast.confidence.avg` | Average confidence score |

---

## 6. SLO Hypotheses (Measure Before Committing)

> These are starting hypotheses. Measure in production before formalizing.

| SLO | Hypothesis | Notes |
|-----|-----------|-------|
| API availability | 99.9% monthly | |
| Common read p95 latency | < 500ms | |
| Core transaction view success | 99.9% | |
| Import pipeline completion | 99% within 5 minutes | |
| AI eligible request availability | 99% | |

### Error Budget Policy

| Budget State | Policy |
|-------------|--------|
| Healthy (< 20% consumed) | Normal releases allowed |
| Caution (20–70% consumed) | Slow non-critical releases |
| Warning (70–100% consumed) | Feature freeze except security/incident |
| Breached (> 100% consumed) | Post-incident review required before releases |

**Financial correctness has a separate release gate — never trade it for availability.**

---

## 7. Alerts (Phase 12+)

| Alert | Condition | Severity |
|-------|-----------|---------|
| API error rate spike | > 1% errors in 5 min | P1 |
| Import queue backlog | > 100 jobs in HIGH queue | P2 |
| AI cost spike | > 2× daily average | P2 |
| Reconciliation regression | Finance fixture failures | P0 |
| Prompt injection spike | > 5 detected in 5 min | P1 |
| Database connection pool | > 90% utilization | P1 |
| Stale data rate | > 20% of active users | P2 |

---

## 8. Observability Adapter

All observability calls go through the `ObservabilityProvider` adapter interface:

```javascript
// interface
export const ObservabilityInterface = {
  log: (level, event, metadata) => void,
  metric: (name, value, tags) => void,
  trace: (traceId, span) => void,
  alert: (name, condition, value) => void,
};
```

Domain code never imports a specific observability library.
