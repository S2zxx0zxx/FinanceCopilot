import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { globalErrorHandler } from './api/middlewares/error.js';
import { apiRateLimiter } from './api/middlewares/security.js';
import { performanceMiddleware } from './api/middlewares/performance.js';
import { testAuthMiddleware } from './api/middlewares/test-auth.js';
import { ClerkAuthAdapter } from './adapters/auth/clerk.adapter.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { setupRoutes } from './api/routes.js';
import setupAIRoutes from './api/ai.routes.js';
import { dbClient } from './db/client.js';
import { IngestionService } from './domains/ingestion/ingestion.service.js';
import { R2StorageAdapter } from './adapters/storage/r2.adapter.js';
import { CloudflareQueuesAdapter } from './adapters/queue/cf-queues.adapter.js';
import { IngestionRepo, ConsentRepo, AuditRepo } from './db/repositories.js';
import { AccountAggregatorAdapter } from './adapters/account-aggregator/account-aggregator.adapter.js';
import { AccountAggregatorService } from './domains/ingestion/aa.service.js';
import { ConsentService } from './domains/consent/consent.service.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * FinCopilot API Server Foundation (Phase 1)
 */

const app = express();

// 1. Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://clerk.com", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
            connectSrc: ["'self'", "https://clerk.com", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
            imgSrc: ["'self'", "data:", "https://*"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
        }
    }
}));

// 2. CORS (Strictly controlled for frontend)
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-dev-user-id', 'x-dev-bypass']
}));

// 3. Body Parsing & Size Limits
app.use(express.json({ limit: '100kb' })); // Prevent large payload attacks

// 3.1 Cookie parsing — tiny inline parser (no extra dependency).
// Parses Cookie header into req.cookies as { name: value }. Used by /api/v1/auth/verify.
app.use((req, _res, next) => {
    const header = req.headers.cookie;
    req.cookies = {};
    if (header) {
        header.split(';').forEach(pair => {
            const eq = pair.indexOf('=');
            if (eq < 0) return;
            const k = pair.slice(0, eq).trim();
            const v = pair.slice(eq + 1).trim();
            if (k) req.cookies[k] = decodeURIComponent(v);
        });
    }
    next();
});

// 4. Rate Limiting Middleware
app.use('/api', apiRateLimiter);

// 4.1 Performance Middleware (Phase 13)
app.use(performanceMiddleware);

// 5. Auth Middleware
const realAuthAdapter = new ClerkAuthAdapter(process.env);
app.use((req, res, next) => {
    req.authAdapter = realAuthAdapter;
    next();
});

// Dev/Test Mock Auth Adapter (Conditionally injected, never active in production)
if (process.env.NODE_ENV !== 'production' && process.env.AUTH_MODE === 'mock') {
    app.use(testAuthMiddleware);
}

// 6. API Routes Scaffold
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy', env: config.env });
});

// 6.1 PUBLIC Clerk config endpoint (no auth required).
// Returns Clerk publishable key for the frontend to init Clerk client SDK.
app.get('/api/v1/auth/config', (req, res) => {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY;

    if (!publishableKey) {
        return res.status(404).json({
            configured: false,
            message: "Clerk publishable key not set. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to enable real auth.",
        });
    }
    return res.status(200).json({
        configured: true,
        publishableKey,
    });
});

// 6.2 SESSION VERIFICATION — called by the landing's /api/session route.
// Reads the `session` cookie (contains the Clerk session token),
// verifies it via ClerkAuthAdapter, and returns the user's public profile.
app.get('/api/v1/auth/verify', async (req, res) => {
    const sessionCookie = req.cookies?.session || req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!sessionCookie) {
        return res.status(200).json({ loggedIn: false });
    }
    try {
        const user = await realAuthAdapter.verifyToken(sessionCookie);
        return res.status(200).json({
            loggedIn: true,
            user: {
                id: user.uid,
                email: user.email || null,
                name: user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
                emailVerified: !!user.emailVerified,
            },
        });
    } catch {
        // Invalid/expired token — not logged in. Don't leak error details.
        return res.status(200).json({ loggedIn: false });
    }
});

// Dependency Injection
let storageAdapter = null;
try {
    storageAdapter = new R2StorageAdapter(process.env);
} catch (e) {
    console.warn('[BOOT] R2 storage disabled — file uploads will not work:', e.message);
}
const queueAdapter = new CloudflareQueuesAdapter();
const ingestionService = new IngestionService(storageAdapter, queueAdapter, IngestionRepo);

// Real DB repos for Consent Service
const consentService = new ConsentService(ConsentRepo, AuditRepo);

const aaAdapter = new AccountAggregatorAdapter({ baseUrl: 'https://sandbox.setu.co', fiuId: 'fiu-1', apiKey: 'mock' });
const aaService = new AccountAggregatorService(aaAdapter, consentService, IngestionRepo);

const dependencies = { ingestionService, aaService };

// Mount Canonical Routes
setupRoutes(app, dependencies);
setupAIRoutes(app, dbClient);
// setupAARoutes(app, aaService); // AA disabled for V1 launch

// 6. Serve Frontend Static Files
const frontendPath = path.join(__dirname, '../frontend/public');
app.use(express.static(frontendPath));

// Catch-all route for SPA (Single Page Application)
// Must be placed after API routes and static files
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next(); // Let the global error handler catch 404 for APIs
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// 6. Global Error Handler (Must be last)
app.use(globalErrorHandler);

// Startup
app.listen(config.port, () => {
    logger.info(`Server foundation initialized on port ${config.port} in ${config.env} mode.`);
});
