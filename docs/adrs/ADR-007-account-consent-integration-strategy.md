# ADR-007 — Account and Consent Integration Strategy

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**PRD Reference:** Section 2  

---

## Decision

### V1 Data Connection Strategy
**Portable import** is the V1 strategy: PDF, CSV, Excel, receipt/OCR, manual entry.

Account Aggregator (AA) is explicitly a **future integration path**. It must not block V1, and the portable import flow must always remain available even if AA is added later.

### Rationale
- AA ecosystem is still maturing in India (AA framework, FIPs, FIUs)
- Portable import builds user trust before requesting real-time data access
- Avoids regulatory complexity of being an FIU in V1
- Users with limited bank AA coverage still get full value

### Consent Model
- Consent must be recorded for each type of data processing
- Consent types: `privacy_policy`, `terms`, `data_usage`, `ai_processing`
- Consent is versioned (`version` field on consent record)
- If policy changes, new consent must be collected
- Revoking consent triggers data processing stop and deletion workflow

### Authentication
- Firebase Authentication as the identity provider adapter
- Not building custom auth in V1
- Firebase can be swapped via `AuthProvider` interface

---

## Future AA Integration Path
When Account Aggregator integration is added (post-V1):
1. New ADR required
2. V1 portable import must remain as fallback
3. Consent for AA must be separate from basic data_usage consent
4. RBI/SEBI licensing requirements reviewed

---

## Compliance

- AA must not be started until post-beta evidence justifies it
- Portable import must always function independently of AA
- Consent records must be written before any data processing begins
