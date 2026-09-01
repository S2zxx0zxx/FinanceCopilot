# PHASE 5 FINANCIAL STATE ARCHITECTURE

## Overview
Phase 5 establishes the authoritative **Level 4 - Financial State**. It consumes reconciled Phase-4 transactions and derives deterministic financial truth.

## Engine Structure
The architecture isolates responsibilities into pure functions:
- **`balances/`**: Derives posted and available balances.
- **`spending/`**: Derives effective spending, subtracting offsets.
- **`income/`**: Derives effective income.
- **`commitments/`**: Extracts upcoming obligations.
- **`freshness/` & `coverage/`**: Evaluates data staleness and account synchronization.
- **`safe-to-spend/`**: Synthesizes all above engines into the core STS metric.
- **`snapshots/`**: Persists explainable traces of how any metric was calculated.

## Guiding Principles
- **Zero Floating Point**: All math is strictly in integers (paise).
- **Single Source of Truth**: Pending policy is centralized in `pending.policy.js`.
- **Stateless Engines**: All complex SQL aggregation is handled in `financial_state.repo.js`, passing raw integer values to the Engines for computation.
