# PHASE 5 FRESHNESS AND COVERAGE POLICY

## Freshness Policy
Determines how reliable the financial data is based on the last synchronization timestamp.
- **`fresh`**: Synced within the last 2 days.
- **`recent`**: Synced within the last 7 days.
- **`stale`**: Older than 7 days.
- **`unknown`**: No sync timestamp available.

## Coverage Policy
Protects mathematical integrity from zero-denominators and missing accounts.
- **`full`**: ratio >= 1 (All active accounts are synced).
- **`partial`**: ratio > 0 (Some accounts are synced, others missing).
- **`no_coverage`**: total accounts = 0 OR synced = 0. Prevents `NaN` or `Infinity`.
- **`unknown`**: Data structure is corrupted or unreadable.
