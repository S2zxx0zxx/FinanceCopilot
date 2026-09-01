# Phase 13 — Support Loop

## Support Classification
Every real support case is classified:
| Category | Description |
|----------|-------------|
| financial_correctness | Balance, spending, income wrong |
| data_connection | Import/sync issues |
| ai | AI answers wrong, unhelpful, or unsafe |
| privacy | Data access or deletion concern |
| security | Suspected unauthorized access |
| ux | Interface confusion |
| performance | Slowness, timeout |

## Support → Engineering Loop
```
Issue filed
→ Classification + Severity (P0-P3)
→ Owner assigned
→ Root cause investigation
→ Fix implemented
→ Regression test written
→ Controlled release
→ Issue resolved + linked to release
```

## No Silent Hotfixes
No production behavior change without recording:
- The material change
- The reason
- The linked support issue

## P0/P1 Response
- P0: Contain immediately (disable flag), investigate, communicate
- P1: Owner assigned within 1 business day, contained before cohort expansion

## Current Status
Support loop defined. N = 0 issues (no real users yet).
