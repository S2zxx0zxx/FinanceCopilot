## What

Brief description of the changes.

## Why

Why are these changes needed and what user problem do they solve?

## How to Test

Steps to verify the changes work:

1. ...
2. ...

## Data / Deployment Impact

- Database migration: [none / describe]
- External provider credentials required: [none / describe]
- Environment/config changes: [none / describe]
- Backward compatibility considerations: [none / describe]

## Related Issue

Closes #___ (or link the issue this addresses).

## Checklist

- [ ] Backend lint/type/tests pass (`ruff check .`, `ty check .`, `pytest`)
- [ ] Migration chain is valid when migrations changed
- [ ] Frontend lints clean (`npm run lint`)
- [ ] Frontend production build passes (`npm run build`)
- [ ] Docker/Helm configuration was checked when deployment files changed
- [ ] User-facing copy and navigation remain FinCopilot-consistent
- [ ] No secrets or real provider credentials were committed
- [ ] Documentation/environment examples were updated when setup changed
- [ ] For a large/core change, scope was aligned in a repository issue first
