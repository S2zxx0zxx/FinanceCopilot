# AI Financial Life Manager

> A finance-first AI copilot designed for the Indian context.

## Documentation
The source of truth for this project is entirely within the repository.
Start by reading the Phase 0 Control Plane documents:
1. `00_MASTER_PRD.md` — The product and architecture rules
2. `01_PROJECT_CHARTER.md` — Project context and goals
3. `15_TASK_BOARD.md` — Current tasks and status

## Architecture
- **Backend**: Modular monolith (Node.js/Cloudflare)
- **Frontend**: Vanilla semantic HTML/CSS/JS (no framework in V1)
- **Database**: PostgreSQL
- **Key Principle**: Money is always stored in integer `paise`. Floating point arithmetic is forbidden.

See `05_ARCHITECTURE.md` for full details.

## Setup
Currently in Phase 0 (Discovery / Control Plane setup). Source code structure will be initialized in Phase 1.
