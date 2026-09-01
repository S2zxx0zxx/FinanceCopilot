# ADR-012 — Production Release Approval Matrix

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**PRD Reference:** Section 57  

---

## Decision

### Release Approval Tiers

| Change Type | Approval Required | Autonomy Level |
|-------------|------------------|----------------|
| UI-only non-breaking changes | Agent auto (with evidence) | L2 |
| New non-financial API endpoint | Agent auto (with evidence) | L2 |
| New financial calculation | User approval + finance regression | L7 |
| Security boundary change | User approval + security review | L7 |
| DB schema migration (safe) | Agent auto + rollback tested | L5 |
| DB schema migration (risky) | User approval + staging validated | L7 |
| Destructive migration | User approval + ADR | L7 |
| New AI tool (READ_ONLY) | Agent with evidence | L5 |
| New AI tool (mutation) | User approval + ADR | L7 |
| Feature flag enable (AI/forecast) | User approval | L6 |
| Production secret rotation | User approval | L7 |
| V1 scope change | User approval + ADR + PRD update | L7 |
| Architecture change | User approval + ADR | L7 |

### Release Pipeline Requirements

All releases must pass:
1. Lint + Static + Secrets scan
2. Unit tests
3. API contract tests
4. Finance fixture replay (all 22 scenarios)
5. Security scan (dependency + static)
6. Build

High-impact releases additionally:
7. AI evaluation suite
8. E2E on staging
9. Performance comparison
10. Canary (5%, 30 min monitoring)
11. Gradual rollout (25% → 50% → 100%)

### Finance Correctness Gate
This is a SEPARATE gate from the standard release pipeline.
Any change that could affect financial calculations must:
- Pass all finance regression fixtures
- Have an explicit finance correctness review
- Be signed off before going beyond 5% canary

### Blocking Conditions
These block any release regardless of other gates:
- Finance regression fixture failure
- Critical security finding
- Evidence of cross-user data leakage
- AI evidence validator failure
- Missing rollback documentation for risky change

---

## Compliance

- Release checklist in `25_RELEASE_POLICY.md`
- Finance fixture results must be attached to every release
- All L7 approvals logged in `27_DECISION_LOG.md`
