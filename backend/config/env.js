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

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredVars = ['DATABASE_URL', 'CLERK_SECRET_KEY'];

function isTrue(value) {
    return String(value || '').toLowerCase() === 'true';
}

function validateEnv() {
    const missing = requiredVars.filter(key => !process.env[key]);
    const isProd = process.env.NODE_ENV === 'production';

    if (isTrue(process.env.SETU_AA_ENABLED)) {
        const setuRequired = [
            'SETU_CLIENT_ID',
            'SETU_CLIENT_SECRET',
            'SETU_PRODUCT_INSTANCE_ID',
            'SETU_WEBHOOK_SECRET'
        ];
        for (const key of setuRequired) {
            if (!process.env[key]) missing.push(key);
        }
    }

    if (missing.length === 0) return;

    const msg = `[CONFIG] Missing required environment variables: ${[...new Set(missing)].join(', ')}`;
    if (isProd) {
        console.error('[CRITICAL] ' + msg);
        console.error('[CRITICAL] System shutting down to prevent unsafe operation in production.');
        process.exit(1);
    }
    console.warn('[WARN] ' + msg);
    console.warn('[WARN] Running in dev mode — DB/provider-backed endpoints may fail until their env vars are set.');
}

validateEnv();

const setuProduction = isTrue(process.env.SETU_PRODUCTION);

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.BACKEND_PORT || process.env.PORT || '3001', 10),
    db: { url: process.env.DATABASE_URL },
    clerk: {
        secretKey: process.env.CLERK_SECRET_KEY,
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY,
    },
    auth: { mode: process.env.AUTH_MODE || 'production' },
    ai: { omniRouterKey: process.env.OMNIROUTER_API_KEY },
    storage: {
        r2AccountId: process.env.R2_ACCOUNT_ID,
        r2AccessKey: process.env.R2_ACCESS_KEY_ID,
        r2SecretKey: process.env.R2_SECRET_ACCESS_KEY,
        r2BucketName: process.env.R2_BUCKET_NAME,
        r2EndpointUrl: process.env.R2_ENDPOINT_URL
    },
    queue: {
        apiToken: process.env.CF_QUEUE_API_TOKEN,
        accountId: process.env.CF_ACCOUNT_ID,
        name: process.env.CF_QUEUE_NAME
    },
    setu: {
        enabled: isTrue(process.env.SETU_AA_ENABLED),
        production: setuProduction,
        baseUrl: process.env.SETU_BASE_URL || (setuProduction ? 'https://fiu.setu.co' : 'https://fiu-sandbox.setu.co'),
        authUrl: process.env.SETU_AUTH_URL || (setuProduction
            ? 'https://prod.setu.co/api/v2/auth/token'
            : 'https://uat.setu.co/api/v2/auth/token'),
        apiPrefix: process.env.SETU_API_PREFIX || '/v2',
        clientId: process.env.SETU_CLIENT_ID,
        clientSecret: process.env.SETU_CLIENT_SECRET,
        productInstanceId: process.env.SETU_PRODUCT_INSTANCE_ID,
        accessToken: process.env.SETU_ACCESS_TOKEN || null,
        webhookSecret: process.env.SETU_WEBHOOK_SECRET,
        autoFetch: process.env.SETU_AUTO_FETCH !== 'false',
        redirectUrl: process.env.SETU_REDIRECT_URL || null
    },
    cors: { origin: process.env.CORS_ORIGIN || '*' }
};
