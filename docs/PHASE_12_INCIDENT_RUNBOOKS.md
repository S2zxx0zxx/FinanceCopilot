# Phase 12 - Incident Runbooks

## Overview
This document contains the canonical operational procedures for mitigating and recovering from production incidents. It is designed to be executable by any on-call engineer, regardless of whether they authored the original code.

## 1. Database (PostgreSQL) Outage
### Symptoms
- 500 errors across core financial endpoints (`/api/v1/financial-state/*`).
- Spikes in `DatabaseTimeout` logs.
- Connection pool exhaustion warnings.

### Containment
- Verify if the issue is a temporary network blip or full DB crash.
- If Neon PostgreSQL is down, immediately communicate degraded state on Status Page. 

### Recovery
1. Check Neon dashboard for platform-wide outages.
2. If DB is corrupted, initiate Point-in-Time Recovery (PITR) to the last known good state (max RPO: 5 minutes).
3. Scale up Neon compute tier temporarily if the crash was due to resource exhaustion.

---

## 2. AI Provider (Gemini/OpenAI) Outage
### Symptoms
- 503 errors on `/api/v1/forecast/scenario`.
- High `ProviderError` rates in logs.
- AI features in the UI spinning indefinitely or showing fallback messages.

### Containment
- The `globalErrorHandler` automatically masks 503s to prevent frontend crashes.
- Financial ledger features continue to operate normally.

### Recovery
1. Check provider status pages.
2. If prolonged, use the global Kill Switch to disable AI features explicitly across all tenants to save queue processing power.
3. Fallback to deterministic simple projections if enabled.

---

## 3. Queue Backlog (Worker Starvation)
### Symptoms
- Cloudflare worker metrics show high queue depth.
- Delayed background syncs or notifications.

### Containment
- Temporarily rate-limit or disable heavy export/deletion jobs to free up worker capacity.

### Recovery
1. Spin up additional worker instances or increase concurrency limits.
2. Flush the Dead Letter Queue (DLQ) into cold storage for later analysis if they are poison messages causing worker crashes.
