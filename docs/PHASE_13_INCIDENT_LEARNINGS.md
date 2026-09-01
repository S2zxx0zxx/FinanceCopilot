# Phase 13 — Incident Learnings

## Incident Protocol
```
detect
→ contain (disable feature flag if needed)
→ communicate (internal + user-facing if impacted)
→ recover
→ document
→ prevent recurrence (regression test)
```

## No Silent Fixes
No incident may be silently fixed in production.
Every material fix must be:
- Recorded in incident log
- Linked to a regression test
- Linked to a release

## Incident Privacy Rule
Incident reports must NOT include:
- Full transaction dumps
- Raw AI conversations
- Unnecessary PII
Use sanitized references only.

## AI Failure Taxonomy (§34)
| Class | Description |
|-------|-------------|
| Factual | Wrong information stated as fact |
| Numerical | Wrong financial number |
| Evidence | Claim not grounded in user data |
| Intent | Misunderstood user question |
| Tool | Wrong tool selected |
| Policy | Safety/privacy rule bypassed |
| Hallucination | Invented information |
| Context | Wrong user context used |
| Privacy | PII exposure |
| UX | Confusing output |
| Latency | Timeout/degradation |
| Cost | Abnormal token consumption |

## Current Incidents
P0: 0
P1: 0
Known issues: None
