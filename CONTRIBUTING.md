# Contributing to FinCopilot

Thanks for helping improve FinCopilot. This repository contains the FinCopilot product experience, finance services, background workers and deployment tooling.

## Getting started

1. Fork the repository.
2. Clone your fork: `git clone https://github.com/your-username/FinanceCopilot.git`.
3. Copy `.env.example` to `.env` and configure the services you intend to use.
4. Start the stack with `docker compose up --build`, or run the frontend/backend separately.
5. Open `http://localhost:3000`.

For bugs and feature ideas, use the repository issue templates. Large changes should start with an issue so scope, migration impact and product behaviour are clear before implementation.

## Architecture

- `frontend/` — Next.js + React + TypeScript + Tailwind CSS
- `backend/` — FastAPI + SQLAlchemy + Alembic + Celery
- PostgreSQL + pgvector — primary database and agent knowledge vectors
- Redis — background jobs and shared runtime state
- `charts/fincopilot/` — Helm packaging
- Docker Compose — local/self-hosted orchestration
- `fincopilot-landing/` — protected FinCopilot landing application; do not casually modify it as part of finance-app work

The application-facing API contract remains `/api/v1`. Backend domain routers are canonical under `/api`, with the compatibility middleware mapping the FinCopilot prefix to the same implementation.

## Development workflow

1. Create a branch from `main`: `git checkout -b feature/your-feature`.
2. Make focused changes.
3. Add or update tests for behavioural changes.
4. Run the checks below.
5. Open a pull request with the problem, approach and verification steps.

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
python3 scripts/check_migration_chain.py
```

Database migrations are append-only history. New FinCopilot-specific migrations continue after the current Alembic head; do not rewrite an already-shipped migration.

### Frontend

```bash
cd frontend
npm ci
npm run lint
npm run build
npm run dev
```

The current frontend uses the Next.js App Router. Prefer existing FinCopilot design tokens/components and keep responsive, keyboard and screen-reader behaviour intact. Do not introduce a second client-side routing or state architecture for finance features that already fit the existing application shell.

### Containers and Helm

```bash
docker compose config
docker compose -f docker-compose.dev.yml config
docker compose -f docker-compose.prod.yml config
helm lint charts/fincopilot
helm template fincopilot charts/fincopilot >/tmp/fincopilot.yaml
```

## FinCopilot product rules

- Keep product-facing naming and UX consistently FinCopilot.
- Preserve the canonical FinCopilot shell, Personal Hub and protected landing unless a change explicitly targets them.
- Reuse backend domain services rather than duplicating finance logic in compatibility routes.
- Keep Clerk compatibility working for the hosted frontend while preserving optional native auth/OIDC/passkey/TOTP capabilities for supported deployments.
- Never commit real API keys, provider credentials, JWT secrets or private keys.
- Bank/LLM provider work must degrade safely when credentials are not configured.

## Pull request guidelines

- Keep the scope focused and explain user-visible behaviour.
- Include migration notes for schema changes.
- Ensure backend lint/type/tests and frontend lint/build pass.
- Mention any external credential or provider behaviour that could not be exercised locally.
- Update documentation when setup, environment variables, routes or deployment behaviour changes.

## AI-assisted contributions

AI tools are welcome, but the contributor remains responsible for correctness, security, scope and maintainability. Review generated changes, understand the architecture they touch, and run the same validation expected of hand-written code.

## Security

Do not report security vulnerabilities in a public issue. Follow [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions are distributed under the repository's [AGPL-3.0 License](LICENSE). Required open-source provenance is documented separately in `UPSTREAM.md`.
