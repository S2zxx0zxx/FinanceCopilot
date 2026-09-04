import { QueueInterface } from './queue.interface.js';

/* global AbortController, setTimeout, clearTimeout, fetch */
/**
 * Cloudflare Queues Adapter
 * 
 * In local dev (Option A), PostgreSQL acts as the source-of-truth queue via FOR UPDATE SKIP LOCKED.
 * In production, this adapter pushes a lightweight reference (job_id) to Cloudflare Queues
 * to trigger the edge worker instantly.
 */
export class CloudflareQueuesAdapter extends QueueInterface {
    constructor() {
        super();
        this.cfAccountId = process.env.CF_ACCOUNT_ID;
        // Prefer CF_QUEUE_API_TOKEN (scoped to Queues only); fall back to CF_API_TOKEN for backward compat.
        this.cfApiToken = process.env.CF_QUEUE_API_TOKEN || process.env.CF_API_TOKEN;
    }

    async enqueue(queueName, payload) {
        // We only enqueue lightweight references to avoid hitting the 128KB CF Queue limit.
        // The full state is durably stored in PostgreSQL.
        const message = {
            jobId: payload.jobId,
            enqueuedAt: Date.now()
        };

        if (this.cfAccountId && this.cfApiToken) {
            // Real CF Queues HTTP integration
            const queueNameEncoded = encodeURIComponent(queueName);
            const endpoint = `https://api.cloudflare.com/client/v4/accounts/${this.cfAccountId}/queues/${queueNameEncoded}/messages`;
            
            // #12 Enqueue Timeout Handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.cfApiToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify([{ body: message }]),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errText = await response.text();
                    console.error(`[QUEUE] CF API Error (${response.status}):`, errText);
                    // #12 Enqueue 4xx / 5xx Strict Handling
                    const err = new Error(`Cloudflare Queue API rejected job: ${response.status}`);
                    err.code = response.status >= 500 ? 'QUEUE_UNAVAILABLE' : 'QUEUE_BAD_REQUEST';
                    throw err;
                }
                
                console.log(`[QUEUE] Pushed reference to real CF Queue: ${queueName} -> Job ${message.jobId}`);
            } catch (err) {
                clearTimeout(timeoutId);
                console.error(`[QUEUE] Failed CF integration for Job ${message.jobId}`, err);
                // Fallback to PostgreSQL poller on network failure (but re-throw if it was a configuration/bad request issue)
                if (err.name === 'AbortError' || err.code === 'QUEUE_UNAVAILABLE') {
                    console.log(`[QUEUE] Job ${message.jobId} marked 'queued' in DB fallback (Network/5xx).`);
                } else {
                    throw err; // 4xx errors should fail strictly
                }
            }
        } else {
            // Local Development: Relies on the PostgreSQL Poller Worker
            console.log(`[QUEUE] Local mode. Job ${message.jobId} marked 'queued' in DB. Background worker will poll.`);
        }

        return payload.jobId;
    }
}
