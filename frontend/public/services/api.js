// API Service — with explicit dev mode fallback
import { AuthService } from './auth.js';
/* eslint-env browser */

// DEV_MODE is only true on localhost / 127.0.0.1 / no hostname (file://).
// In production (any real hostname) the mock fallback is DISABLED and real
// network errors surface to the UI as ErrorState, per 04_DESIGN_SYSTEM 10.13.
const DEV_MODE = !window.location.hostname
    || window.location.hostname === 'localhost'
    || window.location.hostname === '127.0.0.1'
    || window.location.hostname === '0.0.0.0';

let _devMockWarned = false;

export class ApiClient {
    static async request(method, endpoint, body, extraHeaders) {
        try {
            let token = await AuthService.getToken();
            const headers = { 'Content-Type': 'application/json', ...extraHeaders };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else if (DEV_MODE) {
                // Dev mode only: dev-bypass headers the backend accepts when AUTH_MODE=mock.
                // In production, no token = the request is anonymous and the backend
                // returns 401, which surfaces as an ErrorState (no silent mock).
                headers['X-Dev-Bypass'] = 'true';
                headers['X-Dev-User-Id'] = 'dev-test-user';
            }

            const options = { method, headers };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(`/api/v1${endpoint}`, options);

            if (!response.ok) {
                // DEV ONLY: fall back to mock on 401 so the UI is usable without auth.
                // Production: throw real error → ErrorState renders retry CTA.
                if (DEV_MODE && response.status === 401) {
                    if (!_devMockWarned) {
                        console.warn('[FinCopilot] DEV MODE: backend returned 401 — using mock data. This NEVER happens in production.');
                        _devMockWarned = true;
                    }
                    return ApiClient.getMockData(endpoint);
                }
                let errorMessage = 'API request failed';
                try {
                    const error = await response.json();
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            // DEV ONLY: network error → mock so the UI works without a running backend.
            // Production: surface the error.
            if (DEV_MODE && error.name !== 'AbortError') {
                if (!_devMockWarned) {
                    console.warn('[FinCopilot] DEV MODE: backend unreachable — using mock data. This NEVER happens in production.');
                    _devMockWarned = true;
                }
                return ApiClient.getMockData(endpoint);
            }
            console.error(`[API ${method}] ${endpoint} failed:`, error);
            throw error;
        }
    }

    /**
     * Returns realistic mock data for development without backend.
     * Covers all major endpoints used by the frontend.
     */
    static getMockData(endpoint) {
        const mocks = {
            '/financial-state/home': {
                available_balance_paise: 2450000,
                currency: 'INR',
                total_accounts: 3,
                synced_accounts: 2,
                this_month_spending_paise: 3420000,
                this_month_income_paise: 8500000,
                safe_to_spend_paise: 5080000,
                recent_transactions: []
            },
            '/financial-state/money': {
                net_position: {
                    available_balance_paise: 2450000,
                    posted_balance_paise: 2500000,
                    pending_balance_paise: -50000,
                    currency: 'INR'
                },
                coverage: {
                    total_accounts: 3,
                    synced_accounts: 2
                }
            },
            '/accounts': {
                accounts: [
                    { 
                        account_id: 'acc-1', 
                        account_type: 'savings', 
                        institution_name: 'HDFC Bank', 
                        account_number_last4: '1234',
                        balances: { available_balance_paise: 1800000 }, 
                        currency: 'INR', 
                        is_active: true,
                        last_synced_at: new Date().toISOString()
                    },
                    { 
                        account_id: 'acc-2', 
                        account_type: 'current', 
                        institution_name: 'ICICI Bank', 
                        account_number_last4: '5678',
                        balances: { available_balance_paise: 650000 }, 
                        currency: 'INR', 
                        is_active: true,
                        last_synced_at: new Date().toISOString()
                    }
                ]
            },
            '/transactions': {
                transactions: [],
                total: 0,
                page: 1,
                has_more: false
            },
            '/goals': {
                goal_id: 'goal-123',
                name: 'Emergency Fund',
                goal_type: 'emergency_fund',
                status: 'in_progress',
                current_amount_paise: 5000000,
                target_amount_paise: 10000000,
                pace: { progress_pct: 50, status: 'on_track', remaining_days: 120 },
                target_date: '2026-12-31T00:00:00Z',
                monthly_contribution_paise: 500000
            },
            '/ai/insight': {
                insight_id: 'insight-456',
                title: 'High Subscription Spend Detected',
                summary: 'Your subscription spend increased by 20% this month.',
                tags: ['warning', 'subscriptions'],
                confidence: 90,
                generated_at: new Date().toISOString(),
                evidence: 'Found 3 new recurring payments totaling ₹4,500.',
                actions: [
                    { type: 'link', label: 'Review Subscriptions', href: '/transactions?q=subscriptions' }
                ]
            },
            '/ai/home-feed': {
                suggestions: ['How am I doing this month?', 'Any money leaks?', 'Can I afford a new phone?'],
                insights: []
            },
            '/users/me/profile': {
                display_name: 'Dev User',
                email: 'dev@fincopilot.com',
                phone: '+91 98765 43210',
                created_at: '2026-01-15T10:00:00Z'
            },
            '/users/me/privacy': {
                data_retention_days: 365,
                marketing_consent: false,
                analytics_consent: true
            }
        };
        // Return mock if available, otherwise empty object
        for (const [key, value] of Object.entries(mocks)) {
            if (endpoint.startsWith(key)) return value;
        }
        return {};
    }

    static async get(endpoint) { return this.request('GET', endpoint); }
    static async post(endpoint, body, extraHeaders) { return this.request('POST', endpoint, body, extraHeaders); }
    static async put(endpoint, body, extraHeaders) { return this.request('PUT', endpoint, body, extraHeaders); }
    static async patch(endpoint, body, extraHeaders) { return this.request('PATCH', endpoint, body, extraHeaders); }
    static async delete(endpoint) { return this.request('DELETE', endpoint); }
}

/**
 * Wrapper that adds timeout + error fallback to API calls.
 * Returns { data, error } — data is null on failure.
 */
export async function safeFetch(endpoint, options = {}) {
    const { timeout = 8000, fallback = null } = options;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        const data = await ApiClient.get(endpoint);
        clearTimeout(timer);
        return { data, error: null };
    } catch (err) {
        clearTimeout(timer);
        console.warn(`[safeFetch] ${endpoint} failed:`, err.message);
        return { data: fallback, error: err.message };
    }
}