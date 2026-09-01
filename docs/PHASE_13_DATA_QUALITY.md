# Phase 13 — Data Quality

## Metrics to Track (Real Beta Users)
| Metric | Definition |
|--------|-----------|
| freshness | Age of latest sync per user (hours) |
| coverage | % of known accounts with recent data |
| connection_success | Successful connections / attempts |
| sync_completed | Successful syncs / started |
| parse_success | Parsed rows / total rows |
| stale_rate | Accounts not synced in > 24h |
| normalization_review | Records requiring manual review |
| reconciliation_conflicts | Active conflicts needing resolution |

## Endpoint
GET /api/v1/internal/data-quality — requires new_trust_dashboard flag.
Returns aggregate connection health from `user_connections` table.

## Privacy Rule
No user-level sensitive payload in generic analytics. Aggregated counts only.

## Current Status
INSUFFICIENT_EVIDENCE — N = 0 real users.
