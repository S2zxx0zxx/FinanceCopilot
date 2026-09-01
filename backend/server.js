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
import { setupAARoutes } from './api/routes/aa.routes.js';

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
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://apis.google.com"],
            connectSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com", "wss://*.firebaseio.com", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com", "https://www.gstatic.com"],
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
    allowedHeaders: ['Content-Type', 'Authorization']
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

// 6.1 PUBLIC Firebase web config endpoint (no auth required).
// Returns ONLY the public-safe values needed by the frontend to init Firebase client SDK.
// These are the same values Firebase exposes in its public config — they're safe to ship
// to the browser. They do NOT include service-account private keys.
app.get('/api/v1/auth/config', (req, res) => {
    const apiKey = process.env.FIREBASE_WEB_API_KEY;
    const authDomain = process.env.FIREBASE_AUTH_DOMAIN;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const messagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID;
    const appId = process.env.FIREBASE_APP_ID;

    if (!apiKey || !projectId || !authDomain) {
        // No Firebase web config available → frontend falls back to dev-mock auth with a warning.
        return res.status(404).json({
            configured: false,
            message: "Firebase web config not set. Set FIREBASE_WEB_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID on the backend to enable real auth.",
        });
    }
    return res.status(200).json({
        configured: true,
        apiKey,
        authDomain,
        projectId,
        messagingSenderId: messagingSenderId || "",
        appId: appId || "",
    });
});

// 6.2 SESSION VERIFICATION — called by the landing's /api/session route.
// Reads the `session` cookie (contains the Firebase ID token set by the SPA on login),
// verifies it via FirebaseAuthAdapter, and returns the user's public profile.
// No auth middleware — this IS the auth check. Fail-closed: invalid/missing token → loggedIn:false.
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
    } catch (err) {
        // Invalid/expired token — not logged in. Don't leak error details.
        return res.status(200).json({ loggedIn: false });
    }
});

// Dependency Injection
const storageAdapter = new R2StorageAdapter();
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
setupAARoutes(app, aaService);

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
