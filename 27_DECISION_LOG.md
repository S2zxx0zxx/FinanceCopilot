# Decision Log

**Version:** 1.0  
**Last Updated:** 2026-08-22

---

> Every material decision that affects product, architecture, or engineering approach is recorded here.  
> Decisions are immutable — they are never deleted, only superseded.

---

## Decision Format

```
DEC-XXX | Date | Decider | Decision | Rationale | Alternatives Considered | Status
```

---

## Decisions

### DEC-001 — Greenfield Build
**Date:** 2026-08-22  
**Decider:** User + Agent  
**Decision:** Build from scratch. The GitHub repository (S2zxx0zxx/FinanceCopilot) contained only a README.md with no code. No existing codebase to reconcile.  
**Rationale:** Repository audit confirmed 100% greenfield. No migration needed.  
**Status:** ACTIVE

---

### DEC-002 — Phase 0 Before Any Code
**Date:** 2026-08-22  
**Decider:** PRD Section 92 (mandated)  
**Decision:** Complete Phase 0 (Discovery / Control Plane) in full before writing any product code. No UI, no backend, no database until control plane is complete.  
**Rationale:** PRD Section 92 explicitly mandates this. Control plane enables traceable, reversible development.  
**Status:** ACTIVE

---

### DEC-003 — PostgreSQL as Canonical Database
**Date:** 2026-08-22  
**Decider:** PRD Lock (Section 2)  
**Decision:** PostgreSQL is the canonical financial state database. Not SQLite, not DynamoDB, not Firestore.  
**Rationale:** Relational integrity is required for financial data. ACID transactions. Native support for BIGINT (paise). Strong consistency.  
**Status:** LOCKED (requires ADR to change)

---

### DEC-004 — Integer Paise for Money Storage
**Date:** 2026-08-22  
**Decider:** PRD + ADR-003  
**Decision:** All monetary values stored as BIGINT paise (1 INR = 100 paise). No DECIMAL, no FLOAT.  
**Rationale:** Floating-point arithmetic accumulates errors that are unacceptable in financial software. Integer arithmetic is exact.  
**Status:** LOCKED

---

### DEC-005 — Modular Monolith Architecture for V1
**Date:** 2026-08-22  
**Decider:** PRD Lock (Section 2, Section 56) + ADR-010  
**Decision:** Build as a modular monolith. No microservices, no Kafka, no Kubernetes until measurable evidence requires them.  
**Rationale:** Fastest path to correctness. Lower operational complexity. Domain boundaries enforced by code, not network.  
**Status:** LOCKED

---

### DEC-006 — Adapter Pattern for All Providers
**Date:** 2026-08-22  
**Decider:** PRD Lock (Section 34) + ADR-004  
**Decision:** Cloudflare, Firebase, OmniRouter, AI providers, storage, queues — all behind adapter interfaces. Domain code never imports provider SDK directly.  
**Rationale:** Providers are replaceable. Domain logic must not be coupled to vendor APIs.  
**Status:** LOCKED

---

### DEC-007 — AI Gateway (No Direct Client-to-LLM Calls)
**Date:** 2026-08-22  
**Decider:** PRD Section 28 (mandated)  
**Decision:** All AI requests from browser go through the backend AI Gateway. The browser never calls OmniRouter, Gemini, or any other AI provider directly.  
**Rationale:** Security (no key exposure), cost control, policy enforcement, evidence validation, prompt injection defense.  
**Status:** LOCKED

---

### DEC-008 — V1 Financial Side Effects DISABLED
**Date:** 2026-08-22  
**Decider:** PRD Section 2 (mandated)  
**Decision:** The `EXTERNAL_SIDE_EFFECT` AI tool class is disabled for V1. No bank transfers, no bill payments, no autonomous money movement.  
**Rationale:** High risk. Regulatory complexity. Trust must be established through read-only intelligence first.  
**Status:** LOCKED (requires explicit ADR to change in future)

---

### DEC-009 — Semantic HTML + Modern CSS + ES Modules (No Framework)
**Date:** 2026-08-22  
**Decider:** PRD Lock (Section 2)  
**Decision:** Frontend uses Semantic HTML, Modern CSS with custom properties, ES Modules. No React, Next.js, Vue, Angular, Tailwind, or TypeScript without explicit ADR.  
**Rationale:** Reduces bundle size, eliminates framework coupling, enables progressive enhancement, longer-term maintainability.  
**Status:** LOCKED

---

### DEC-010 — Indian Paise Arithmetic Throughout
**Date:** 2026-08-22  
**Decider:** ADR-003  
**Decision:** Display format follows Indian numbering system (lakhs, crores). ₹ symbol. Tabular numbers. 2 decimal places always. Server computes, client displays.  
**Status:** LOCKED
