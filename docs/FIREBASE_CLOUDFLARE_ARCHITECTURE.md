# Firebase + Cloudflare Architecture

This document describes the canonical infrastructure architecture for FinCopilot.

## Core Infrastructure Boundary
- **Firebase**: Identity and Notification layer. Exclusively used for Authentication (JWT tokens) and FCM (Push Notifications).
- **Cloudflare Edge (Workers)**: Acts as an API Gateway/BFF. Handles CORS, Edge Security (WAF), trace generation, and proxying.
- **Node.js Monolith**: The authoritative domain application handling all business logic, financial calculations, and DB access.
- **PostgreSQL (Neon)**: The authoritative financial database/ledger.
- **Cloudflare R2**: Private object storage for statements and receipts.
- **Cloudflare Queues**: Background job bus for import processing and reconciliation.

## Traffic Flow
1. **User (Web/Mobile)** authenticates via Firebase Auth.
2. User sends HTTPS request to `api.fincopilot.example.com` with `Bearer <ID_TOKEN>`.
3. **Cloudflare Worker** intercepts request:
    - Preflight CORS handling.
    - Edge Rate Limiting / Bot Protection.
    - Inject `X-Trace-ID`.
    - Proxy request to Node.js backend (`origin.fincopilot.example.com`).
4. **Node.js Backend**:
    - Middleware verifies ID_TOKEN via Firebase Admin SDK.
    - Maps Firebase UID to local DB `user_id`.
    - Handles request using strict authorization.
5. **Storage Flow (R2)**:
    - Backend generates a pre-signed S3-compat upload URL.
    - Client uploads directly to R2 using the signed URL.
    - Client confirms upload to Backend.
    - Backend publishes job to Cloudflare Queues.
6. **Async Flow (Queues)**:
    - Queue consumer claims job.
    - Downloads file from R2.
    - Parses, Normalizes, and Reconciles into PostgreSQL.
