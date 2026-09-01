# ADR-010 — Modular Monolith vs Service Boundaries

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**PRD Reference:** Section 56  

---

## Decision

### V1: Modular Monolith
Build as a single deployable unit with clear module boundaries enforced by code structure.

### Rules for Service Extraction
A domain module may be extracted into a separate service ONLY when there is measurable evidence of:
1. **Independent scaling** — the domain has significantly different traffic patterns
2. **Reliability isolation** — a domain failure must not cascade
3. **Security isolation** — the domain requires different trust boundaries
4. **Compliance need** — regulatory requirement for separation
5. **Team ownership** — separate team owns the domain
6. **Release coupling** — deployment of one domain blocks another
7. **Workload boundary** — fundamentally different runtime requirements

### What NOT to Do
- Do NOT extract services to look like a "giant company"
- Do NOT extract services based on perceived future scale without measurement
- Do NOT introduce Kubernetes until container orchestration is needed
- Do NOT introduce Kafka until message-based decoupling is measured as necessary

### Module Interface Contract
Even in the monolith, domains MUST communicate only through defined interfaces:
```javascript
// Domain A never directly imports Domain B's internals
// Domain A calls Domain B's public interface only
import { computeSafeToSpend } from '../financial-state/financial-state.service.js';
// NOT:
import { rawQuery } from '../financial-state/financial-state.repository.js';
```

---

## Compliance

- No domain may import another domain's repository/internal files
- All cross-domain calls go through the domain's public service interface
- Module coupling tracked in `control/dependencies.yaml`
