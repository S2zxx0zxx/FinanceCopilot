# FinCopilot — Multi-stage Production Dockerfile
# Builds backend (Node) + frontend (Next.js) + landing (Next.js) in one image.
# Container runs BOTH the backend API (:3001) and the landing server (:3002)
# via a lightweight supervisor so the Caddyfile gateway can route to both.

# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install all deps for each workspace (lockfiles preserved for reproducibility)
COPY package.json package-lock.json ./
COPY backend/package.json backend/package-lock.json ./backend/
COPY frontend/package.json frontend/package-lock.json ./frontend/
COPY fincopilot-landing/package.json fincopilot-landing/package-lock.json ./fincopilot-landing/

RUN npm ci --prefix backend && npm ci --prefix frontend && npm ci --prefix fincopilot-landing

# Copy source
COPY . .

# Build Next.js apps (standalone output)
RUN cd frontend && npx next build
RUN cd fincopilot-landing && npx next build

# ── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
# Backend reads BACKEND_PORT first (falls back to PORT). Landing Next.js reads PORT.
# Setting both ensures backend stays on :3001 while landing runs on :3002.
ENV BACKEND_PORT=3001
ENV PORT=3002
ENV LANDING_PORT=3002

# Install only backend production deps
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev && npm cache clean --force

# Copy backend source
COPY --from=builder /app/backend ./backend

# Copy built Next.js artifacts (standalone)
COPY --from=builder /app/frontend/.next/standalone ./frontend-standalone
COPY --from=builder /app/frontend/public ./frontend-standalone/public
COPY --from=builder /app/frontend/.next/static ./frontend-standalone/.next/static

COPY --from=builder /app/fincopilot-landing/.next/standalone ./landing-standalone
COPY --from=builder /app/fincopilot-landing/public ./landing-standalone/public
COPY --from=builder /app/fincopilot-landing/.next/static ./landing-standalone/.next/static

# Create non-root user
RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Expose both backend (3001) and landing (3002) — the gateway (Caddyfile)
# routes /api/v1/* → :3001 and /* → :3002.
EXPOSE 3001 3002

# Health check the backend (the SPA catch-all lives on the backend).
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Lightweight in-process supervisor: start BOTH the backend (Node :3001) and
# the landing Next.js standalone server (:3002). If either dies, the container
# exits so the orchestrator (Docker / k8s) can restart it.
#
# Uses POSIX `sh` (busybox on alpine) — `wait -n` is bash-only, so we poll with
# `kill -0`. Each child is started with `&`; if either exits, we kill the other
# and exit non-zero so Docker/k8s restarts the container.
CMD ["sh", "-c", "node backend/server.js & P1=$!; node landing-standalone/server.js & P2=$!; while kill -0 $P1 2>/dev/null && kill -0 $P2 2>/dev/null; do sleep 1; done; kill $P1 $P2 2>/dev/null; exit 1"]
