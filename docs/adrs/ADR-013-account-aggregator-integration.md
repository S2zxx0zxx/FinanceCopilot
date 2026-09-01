# ADR-013 — Account Aggregator Integration Strategy

**Date:** 2026-08-31
**Status:** ACCEPTED

---

## Context

FinCopilot requires automated, real-time ingestion of financial data. In India, the Account Aggregator (AA) ecosystem provides a regulated, secure framework for Financial Information Users (FIUs) to pull data from Financial Information Providers (FIPs) based on user consent.

As outlined in ADR-007, the portable import (PDF/CSV) strategy is the primary fallback for V1. This ADR formalizes the integration of the AA framework as an extension.

## Decision

We will integrate with the Account Aggregator ecosystem using a Technology Service Provider (TSP) / Sandbox for the initial phase, specifically adhering to the FIU (Financial Information User) architecture.

### Architectural Boundaries

1.  **Consent Flow**:
    *   Initiate consent via the FIU adapter.
    *   Redirect user to the AA client (web/app) to grant consent.
    *   Receive consent approval webhooks.
2.  **Data Flow**:
    *   Upon consent approval, request a data session.
    *   The FIP pushes encrypted data to the AA, which pushes it to our FIU webhook.
3.  **Decryption**:
    *   Data is end-to-end encrypted using ECDH (Elliptic Curve Diffie-Hellman).
    *   The FIU must decrypt the data using the matching private key before passing it to the internal `ingestion` domain.
    *   *Decision*: We will implement a modular `AccountAggregatorAdapter` that encapsulates the decryption logic, allowing us to swap between internal decryption or a TSP's decryption service if necessary.

### Component Changes

*   **Adapter (`account-aggregator.adapter.js`)**: Handles AA network communication (Setu Sandbox as the initial target), payload signing, and ECDH decryption.
*   **Domain (`aa.service.js`)**: Orchestrates the AA consent and data fetch flow. It translates AA concepts into our internal `import_job` pipeline.
*   **Consent (`consent.service.js`)**: Extended to track `consent_handle` and `consent_id` issued by the AA network.
*   **Routes (`aa.routes.js`)**: Exposes webhooks for the AA network to push consent status and FI data.

## Rationale

*   Provides users with seamless, real-time data sync.
*   Keeps the complexity of the AA framework isolated in adapters and domain services without leaking into the core ledger logic.
*   Retains the V1 portable import flow as a fallback (as mandated by ADR-007).

## Consequences

*   We must securely manage FIU ECDH keypairs for data decryption.
*   We must implement and expose public-facing webhooks that adhere to the ReBIT/Sahamati API specifications for receiving notifications.
*   A strict separation between encrypted incoming data and decrypted internal state must be maintained.
