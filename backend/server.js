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
import { setupAARoutes } from './api/routes/aa.routes.js';
import { dbClient } from './db/client.js';
import { IngestionService } from './domains/ingestion/ingestion.service.js';
import { R2StorageAdapter } from './adapters/storage/r2.adapter.js';
import { CloudflareQueuesAdapter } from './adapters/queue/cf-queues.adapter.js';
import { IngestionRepo, ConsentRepo, AuditRepo } from './db/repositories.js';
import { SetuAARepo } from './db/setu-aa.repository.js';
import { AccountAggregatorAdapter } from './adapters/account-aggregator/account-aggregator.adapter.js';
import { AccountAggregatorService } from './domains/ingestion/aa.service.js';
import { ConsentService } from './domains/consent/consent.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://clerk.com", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
            connectSrc: ["'self'", "https://clerk.com", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
            imgSrc: ["'self'", "data:", "https://img.clerk.com", "https://images.clerk.dev", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
        }
    }
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : ['http://localhost:3000', 'http://localhost:3002'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-dev-user-id', 'x-dev-bypass', 'x-fincopilot-setu-webhook-token']
}));

// Setu Auto-Fetch may post an entire decrypted FI data set. The current
// Gateway docs/examples are materially larger than ordinary API requests, so
// allow up to 2 MiB while still keeping a bounded request body.
app.use(express.json({ limit: '2mb' }));

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

app.use('/api', apiRateLimiter);
app.use(performanceMiddleware);

const realAuthAdapter = new ClerkAuthAdapter(process.env);
app.use((req, res, next) => {
    req.authAdapter = realAuthAdapter;
    next();
});

if (process.env.NODE_ENV !== 'production' && process.env.AUTH_MODE === 'mock') {
    app.use(testAuthMiddleware);
}

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        env: config.env,
        accountAggregator: config.setu.enabled ? 'enabled' : 'disabled'
    });
});

app.get('/api/v1/auth/config', (req, res) => {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY;
    if (!publishableKey) {
        return res.status(404).json({
            configured: false,
            message: 'Clerk publishable key not set. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to enable real auth.',
        });
    }
    return res.status(200).json({ configured: true, publishableKey });
});

app.get('/api/v1/auth/verify', async (req, res) => {
    const sessionCookie = req.cookies?.session || req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!sessionCookie) return res.status(200).json({ loggedIn: false });
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
        return res.status(200).json({ loggedIn: false });
    }
});

let storageAdapter = null;
try {
    storageAdapter = new R2StorageAdapter(process.env);
} catch (e) {
    console.warn('[BOOT] R2 storage disabled — file uploads will not work:', e.message);
}
const queueAdapter = new CloudflareQueuesAdapter();
const ingestionService = new IngestionService(storageAdapter, queueAdapter, IngestionRepo);
const consentService = new ConsentService(ConsentRepo, AuditRepo);

let aaService = null;
if (config.setu.enabled) {
    const aaAdapter = new AccountAggregatorAdapter({
        baseUrl: config.setu.baseUrl,
        authUrl: config.setu.authUrl,
        apiPrefix: config.setu.apiPrefix,
        clientId: config.setu.clientId,
        clientSecret: config.setu.clientSecret,
        productInstanceId: config.setu.productInstanceId,
        accessToken: config.setu.accessToken
    });
    aaService = new AccountAggregatorService(aaAdapter, consentService, SetuAARepo, {
        autoFetch: config.setu.autoFetch,
        redirectUrl: config.setu.redirectUrl
    });
}

const dependencies = { ingestionService, aaService };
setupRoutes(app, dependencies);
setupAIRoutes(app, dbClient);
if (aaService) {
    setupAARoutes(app, aaService, { webhookSecret: config.setu.webhookSecret });
}

const frontendPath = path.join(__dirname, '../frontend/public');
app.use(express.static(frontendPath));

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use(globalErrorHandler);

app.listen(config.port, () => {
    logger.info(`Server foundation initialized on port ${config.port} in ${config.env} mode.`);
});
