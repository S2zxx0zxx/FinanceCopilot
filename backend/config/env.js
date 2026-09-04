/**
 * Centralized Configuration Module
 * 
 * Enforces startup validation of required secrets.
 * Fails closed if critical config is missing.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env file from the root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredVars = [
    'DATABASE_URL',
    'CLERK_SECRET_KEY'
];

function validateEnv() {
    // In production, fail-closed if critical vars are missing.
    // In development, only WARN — allows testing the landing + SPA + auth flow
    // without a real PostgreSQL/Firebase setup (mock auth + mock data kick in).
    const missing = requiredVars.filter(key => !process.env[key]);
    if (missing.length === 0) return;

    const isProd = process.env.NODE_ENV === 'production';
    const msg = `[CONFIG] Missing required environment variables: ${missing.join(', ')}`;
    if (isProd) {
        console.error('[CRITICAL] ' + msg);
        console.error('[CRITICAL] System shutting down to prevent unsafe operation in production.');
        process.exit(1);
    } else {
        console.warn('[WARN] ' + msg);
        console.warn('[WARN] Running in dev mode — backend will start but DB-backed endpoints will fail. Set the env vars or use AUTH_MODE=mock + dev-mock data.');
    }
}

// Call validation immediately on load
validateEnv();

export const config = {
    env: process.env.NODE_ENV || 'development',
    // Default to 3001 so the backend doesn't conflict with the Next.js landing on 3000.
    // Override with BACKEND_PORT or PORT env var.
    port: parseInt(process.env.BACKEND_PORT || process.env.PORT || '3001', 10),
    db: {
        url: process.env.DATABASE_URL
    },
    clerk: {
        secretKey: process.env.CLERK_SECRET_KEY,
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY,
    },
    auth: {
        mode: process.env.AUTH_MODE || 'production',
    },
    ai: {
        omniRouterKey: process.env.OMNIROUTER_API_KEY
    },
    storage: {
        r2AccountId: process.env.R2_ACCOUNT_ID,
        r2AccessKey: process.env.R2_ACCESS_KEY_ID,
        r2SecretKey: process.env.R2_SECRET_ACCESS_KEY,
        r2BucketName: process.env.R2_BUCKET_NAME,
        // FIX (audit P1 #30): R2StorageAdapter reads R2_ENDPOINT_URL at boot
        // but env.js never declared it — the adapter silently skipped client
        // construction in any environment that relied on the central config
        // schema. Surface it here so config validation / debug pages pick it up.
        r2EndpointUrl: process.env.R2_ENDPOINT_URL
    },
    queue: {
        apiToken: process.env.CF_QUEUE_API_TOKEN,
        accountId: process.env.CF_ACCOUNT_ID,
        name: process.env.CF_QUEUE_NAME
    },
    setu: {
        baseUrl: process.env.SETU_BASE_URL || 'https://sandbox.setu.co',
        fiuId: process.env.SETU_FIU_ID,
        apiKey: process.env.SETU_API_KEY,
        apiSecret: process.env.SETU_API_SECRET
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*'
    }
};
