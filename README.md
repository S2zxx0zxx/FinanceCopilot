<p align="center">
  <img src="docs/logo.svg" width="210" alt="FinCopilot" />
</p>

<h1 align="center">FinCopilot</h1>
<p align="center"><strong>AI Financial Life Manager</strong></p>
<p align="center">One private workspace for accounts, spending, planning, investments, reporting, automation and AI-assisted money management.</p>

<p align="center">
  <a href="https://github.com/S2zxx0zxx/FinanceCopilot/actions/workflows/ci.yml"><img src="https://github.com/S2zxx0zxx/FinanceCopilot/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.gnu.org/licenses/agpl-3.0"><img src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg" alt="AGPL-3.0" /></a>
</p>

## What FinCopilot includes

### Money core
- Multi-account management with running balances and account summaries
- Transaction search, filtering, editing, splitting, transfers and attachments
- Statement imports for OFX, QIF, CAMT and CSV
- Payees, categories, category groups and automatic categorization rules
- Recurring transactions, subscriptions and projected transactions
- Budgets, goals and savings progress
- Credit-card bill handling and installment-aware transaction data
- Multi-currency balances and FX conversion

### Wealth and reporting
- Assets and investments with valuation tracking
- Asset groups and collections
- Net-worth and income-vs-expense reporting
- Dashboard balance history, monthly trends and category breakdowns
- Fiscal data support and market-price provider architecture

### Operations and accounting
- Invoice creation and invoice attachments
- Reconciliation rules, suggestions, groups and reconciliation events
- Import logs and replayable import workflows
- Export and backup-oriented data flows

### Connections
- Bank-provider architecture with Pluggy, Enable Banking and SimpleFIN support
- Connection management and background synchronization
- Extensible provider layer for additional regional integrations

### Security and identity
- FinCopilot Clerk compatibility for the existing product frontend
- Native local authentication
- OIDC / SSO
- Passkeys / WebAuthn
- TOTP two-factor authentication
- Multi-user workspaces, roles and administration controls

### FinCopilot experience
- Existing FinCopilot dashboard and navigation system
- Personal Hub
- Profile avatar studio
- Preferences and density/theme settings
- Gamification, streak and achievement surfaces
- Data-confidence and financial-health surfaces
- Forecasting, planning and Copilot-oriented workflows

### AI and automation
- Optional AI agents
- Multiple LLM provider support
- Tool use through MCP
- Per-agent knowledge base / RAG
- Background Celery workers and scheduled tasks

## Architecture

| Layer | Technology |
|---|---|
| Product frontend | Next.js, React, TypeScript, Tailwind CSS |
| Finance API | FastAPI, SQLAlchemy |
| Database migrations | Alembic |
| Database | PostgreSQL + pgvector |
| Background jobs | Redis + Celery |
| AI tools | MCP + configurable LLM providers |
| Containers | Docker / Docker Compose |
| Kubernetes packaging | Helm |

The FinCopilot frontend keeps its `/api/v1` contract. The API compatibility layer maps that contract into the canonical finance-engine `/api` routes so financial logic is not duplicated.

## Quick start

### Docker Compose

```bash
git clone https://github.com/S2zxx0zxx/FinanceCopilot.git
cd FinanceCopilot
cp .env.example .env
docker compose up --build
```

Frontend: `http://localhost:3000`  
Backend API docs: `http://localhost:8000/api/docs`

## FinCopilot Clerk integration

The existing FinCopilot frontend uses Clerk session tokens. The backend also retains its native authentication options. To enable the Clerk compatibility path, configure the issuer used by your Clerk instance:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_ISSUER=https://your-clerk-issuer.example
# Optional override; otherwise derived from CLERK_ISSUER
CLERK_JWKS_URL=https://your-clerk-issuer.example/.well-known/jwks.json
```

A first authenticated Clerk request provisions the matching internal FinCopilot user and Personal workspace. Native API JWT, OIDC, passkey and TOTP functionality remains available.

## Development

### Backend

```bash
cd backend
pip install -q uv==0.12.10
uv export --frozen --all-extras --no-emit-project -o /tmp/requirements-dev.txt
pip install --require-hashes -r /tmp/requirements-dev.txt
pip install --no-deps -e .
ruff check .
ty check .
pytest
```

### Frontend

```bash
cd frontend
npm ci
npm run lint
npm run build
npm run dev
```

### Migration chain

```bash
python3 backend/scripts/check_migration_chain.py
```

FinCopilot-specific database additions continue after the imported finance-engine migration history, starting with migration `090` for Personal Hub profile data and curated avatars.

## Deployment

Production images are published as:

- `ghcr.io/S2zxx0zxx/fincopilot-backend`
- `ghcr.io/S2zxx0zxx/fincopilot-frontend`

The Helm chart is in `charts/fincopilot/`.

## License and open-source notices

FinCopilot is distributed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. The repository retains the applicable license and open-source provenance records. See `LICENSE` and `UPSTREAM.md` for the legally required source and provenance information.

Product branding, FinCopilot-specific UI/UX and newly authored FinCopilot functionality are maintained in this repository.
