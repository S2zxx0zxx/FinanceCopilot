# Infrastructure Resource Inventory

This document tracks all external cloud infrastructure (Cloudflare, Firebase, Neon) required for the FinCopilot Pre-Phase 7 Platform.

## 1. Cloudflare Resources
**Account Hierarchy**: Cloudflare Account -> Workers & Pages / R2 / Queues

| Resource Type | Deterministic Name | Environment | Purpose | Status |
|---|---|---|---|---|
| Worker | `fincopilot-edge-dev` | dev | API Gateway / BFF / Proxy | PREPARED |
| Worker | `fincopilot-edge-staging` | staging | API Gateway / BFF / Proxy | PREPARED |
| Worker | `fincopilot-edge-production` | production | API Gateway / BFF / Proxy | PREPARED |
| R2 Bucket | `fincopilot-dev-documents` | dev | Private statement storage | PREPARED |
| R2 Bucket | `fincopilot-staging-documents` | staging | Private statement storage | PREPARED |
| R2 Bucket | `fincopilot-prod-documents` | production | Private statement storage | PREPARED |
| Queue | `fincopilot-dev-imports` | dev | Async import job bus | PREPARED |
| Queue | `fincopilot-staging-imports` | staging | Async import job bus | PREPARED |
| Queue | `fincopilot-prod-imports` | production | Async import job bus | PREPARED |

## 2. Firebase Identity Resources
**Project Hierarchy**: Firebase Project -> Authentication -> Users

| Service | Environment | Purpose | Status |
|---|---|---|---|
| Authentication | dev | Identity Layer (JWT) | VERIFIED |
| Authentication | staging | Identity Layer (JWT) | DEFERRED |
| Authentication | production | Identity Layer (JWT) | DEFERRED |
| Firestore / RTDB | all | Financial Data Storage | NOT APPLICABLE (Banned) |
| Cloud Functions | all | Backend Services | DECOMMISSIONED (Replaced by CF Workers/Node) |

## 3. Database Resources (Neon PostgreSQL)

| Resource Type | Environment | Purpose | Status |
|---|---|---|---|
| Postgres DB | dev | Authoritative Financial Ledger | ACTIVE |
| Postgres DB | staging | Authoritative Financial Ledger | PREPARED |
| Postgres DB | production | Authoritative Financial Ledger | PREPARED |

## Drift Rules
- **No `cloudfunctions.net` logic**: All old Firebase cloud functions have been identified and banned.
- **R2 is strictly private**: No public object exposure. Signed URL access ONLY.
- **Queues**: Payloads contain references (job_id, storage_key), NEVER raw document bytes.
