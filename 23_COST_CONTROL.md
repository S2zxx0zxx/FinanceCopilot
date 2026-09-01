# Cost Control Specification

**Version:** 1.0  
**Status:** Phase 0 — Defined  
**PRD Reference:** Sections 33, 56  
**Last Updated:** 2026-08-22

---

## 1. Cost Philosophy

> Never sacrifice correctness for cost.  
> Never add infrastructure merely to look like a giant company.  
> Use OmniRouter capacity efficiently, not wastefully.  
> Start simple. Scale with evidence.

---

## 2. AI Cost Controls

### Budget Hierarchy

```
Organization Monthly Budget (hard cap)
  ↓
Feature Budget (per feature type)
  ↓
Per-User Daily Budget
  ↓
Per-Request Cost Limit
```

### Default Limits (V1 Starting Points)

| Budget Level | Default | Hard Stop |
|-------------|---------|-----------|
| Per-user daily | $0.10 | $0.50 |
| Per-feature daily | $5.00 | $20.00 |
| Organization monthly | $100 | $500 |
| Per-request max tokens | 16K input / 2K output | 32K total |

### AI Cost Routing (via OmniRouter)

| Intent | Model | Reason |
|--------|-------|--------|
| Simple classification | Small/fast model | Low cost, sufficient quality |
| Financial query (read) | Small/medium model | Bounded context |
| Complex financial planning | Stronger model + tools | Correctness required |
| Document parsing | Async extraction | Batch, not real-time |
| High-risk response | Strongest + validators | Quality gates |
| Financial arithmetic | Deterministic engine (no model) | $0 AI cost |

### Cost Reduction Techniques

| Technique | Description |
|-----------|-------------|
| Deterministic computation | Run math server-side — no LLM tokens |
| Response caching | Cache safe deterministic reads with TTL |
| Batching | Bundle low-priority insight generation |
| Context minimization | Send minimum-necessary context |
| Model routing | Use smallest sufficient model |
| Hard context limits | Never exceed configured token limits |

### Token Accounting

Every AI interaction records:
- `input_token_count`
- `output_token_count`
- `cost_usd_micro` (× 1,000,000 for integer storage)
- `model_used`
- `model_route`

### Budget Exhaustion Behavior

```
Per-user budget hit:
→ Switch to smaller model if acceptable
→ If still over: return "AI temporarily limited"
→ Core financial data still available

Organization budget warning (80%):
→ Alert sent to admin
→ Switch to conservative routing

Organization budget hit (100%):
→ AI disabled for new requests
→ Serve last-cached insights where available
→ Core financial features unaffected
→ Alert: P1
```

---

## 3. Infrastructure Cost Controls

### Do Not Build Until Evidence Requires

| Infrastructure | When to Add |
|---------------|------------|
| Multiple database replicas | When read latency > SLO |
| CDN/edge caching | When static asset performance < target |
| Worker auto-scaling | When queue backlog > threshold |
| Dedicated search index | When full-text search performance < target |
| Separate AI service | When AI traffic isolation required |

**Never add Kubernetes, Kafka, or multiple microservices without measurable evidence.**

### Storage Cost

- Raw uploaded files: R2 (Cloudflare) — low cost
- Retention: per `24_DATA_LIFECYCLE.md`
- Delete raw files after successful reconciliation (configurable)
- Export files: time-limited (24h) and deleted after download

---

## 4. Cost Observability

Track weekly:
- Total AI spend vs budget
- Per-feature AI spend breakdown
- Per-model spend breakdown
- Storage growth rate
- Worker execution cost
- Database connection pool utilization

Monthly review:
- Cost trend vs user growth
- Cost per active user
- Budget vs actual
- Top cost drivers
- Optimization opportunities
