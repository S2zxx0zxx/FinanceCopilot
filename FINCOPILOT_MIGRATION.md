# FinCo-Pilot foundation migration

This branch imports the complete Securo source tree from the pinned upstream commit while preserving `fincopilot-landing/` from the pre-migration FinCo-Pilot commit.

## Invariants

1. `fincopilot-landing/` remains untouched unless an explicit landing-page change is requested.
2. Securo functionality is the baseline: backend, frontend app, migrations, providers, agents, MCP, tests, docs, deployment and CI are imported together rather than cherry-picked.
3. AGPL-3.0 and legally required upstream notices are preserved. Product branding may be replaced with FinCo-Pilot branding, but required attribution is not stripped.
4. FinCo-Pilot-specific features are layered on top without silently deleting upstream capabilities.
