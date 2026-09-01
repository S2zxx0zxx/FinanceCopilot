# Competitive Research Notes

**Version:** 1.0  
**Status:** Phase 0 — Initial Notes  
**PRD Reference:** Section 26  
**Last Updated:** 2026-08-22

---

> **Important:** Competitive research informs product decisions but does NOT change the PRD.  
> Any product change based on research requires explicit ADR + user approval.

---

## India-First Financial App Landscape

### Key Players (India)

| App | Category | Key Strength | Key Gap |
|-----|----------|-------------|---------|
| Fi Money | Neobank | Savings + spending insights | Tied to Fi account |
| Jupiter | Neobank | Smart deposits, good UX | Account-locked |
| Niyo | Neobank + FX | International travel | Limited for pure finance mgmt |
| Walnut | Expense tracker | SMS parsing, clean UI | Discontinued |
| Spendee | Expense tracker | Multi-currency | No India-specific reconciliation |
| CRED | Credit card rewards | Large CC user base | Limited to credit cards |
| Groww | Investment + basic expense | Investment-first | Not a financial manager |
| Money View | Loan + credit | Credit access | Not a true financial manager |
| Finart | Financial planning | Planning depth | Limited UX quality |
| ET Money | Mutual funds + expense | MF distribution | Investment-first |

### Our Differentiation

1. **Reconciliation-first** — Other apps don't handle transfers, duplicates, or card settlement correctly
2. **India-first data model** — UPI strings, salary+bonus patterns, EMI handling, Indian lakhs format
3. **Evidence-backed AI** — AI that shows its work vs black-box suggestions
4. **Privacy-first** — Explicit consent, data transparency, export/delete
5. **Multi-source import** — PDF, CSV, Excel, OCR without account aggregator dependency
6. **Not a distribution platform** — We don't sell financial products

### Signals to Watch

- RBI guidelines on Account Aggregator adoption
- DPDP Act implementation timelines
- Fintech licensing requirements for advisory features
- Competitor pricing strategies
- User trust recovery after data breaches in Indian fintech space

---

## Global Reference Products

| App | Category | What to Learn |
|-----|----------|-------------|
| Copilot (US) | AI-first finance | Evidence-based AI responses |
| Monarch Money (US) | Premium personal finance | Clean UX, net worth tracking |
| YNAB (US) | Budgeting | Job-based budgeting philosophy |
| Tiller Money (US) | Spreadsheet-based | Data portability |
| Emma (UK) | Subscription tracking | Money leak detection UX |
| Cleo (UK) | AI assistant | Conversational finance tone |

---

## Research-Driven Observations

1. **Trust is the primary barrier in Indian personal finance apps** — users fear data misuse
2. **UPI creates unique reconciliation challenges** — merchant IDs unreliable, descriptions unstructured
3. **Multi-account aggregation is hard** — no single reliable source; portable import is more practical V1
4. **AI responses without evidence erode trust** — users want to see WHY
5. **Shame is a product-killer** — apps that shame spending lose users quickly
6. **Onboarding friction is high** — the first import experience determines retention

---

> Any product changes influenced by this research require:
> 1. Explicit user approval
> 2. V1 scope check (does it violate locked scope?)
> 3. ADR if architecture is affected
> 4. PRD update if product boundary changes
