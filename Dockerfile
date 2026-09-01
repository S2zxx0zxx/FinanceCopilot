# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for build
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY backend ./backend
COPY frontend ./frontend

# Production Stage
FROM node:20-alpine AS production

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Security: Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built artifacts from builder
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend ./frontend

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start server
CMD ["node", "backend/server.js"]
