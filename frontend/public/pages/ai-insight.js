// ═══════════════════════════════════════════════════════════════════════
// FinCopilot — AI Insight Detail (SCR-30)
// Deep detail on a single AI insight with evidence and actions
// ═══════════════════════════════════════════════════════════════════════

import { ApiClient } from '../services/api.js';
import { Badge, ErrorState, Skeleton, FreshnessBadge } from '../components/ui.js';

const formatCurrency = (paise) => {
    if (paise == null) return '—';
    return (Number(paise) / 100).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });
};

const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
};

const getTagVariant = (tag) => {
    const t = (tag || '').toLowerCase();
    if (t.includes('warning') || t.includes('risk') || t.includes('leak') || t.includes('overspend')) return 'warning';
    if (t.includes('positive') || t.includes('savings') || t.includes('good') || t.includes('opportunity')) return 'positive';
    if (t.includes('negative') || t.includes('alert') || t.includes('critical') || t.includes('danger')) return 'negative';
    return 'neutral';
};

const getConfidenceLabel = (confidence) => {
    if (confidence == null) return null;
    if (confidence >= 80) return 'High confidence';
    if (confidence >= 50) return 'Medium confidence';
    return 'Low confidence';
};

const getConfidenceVariant = (confidence) => {
    if (confidence == null) return null;
    if (confidence >= 80) return 'neutral';
    if (confidence >= 50) return 'warning';
    return 'negative';
};

export async function AIInsightPage() {
    return `
    <div class="page" aria-label="AI Insight Detail">
        <!-- Header -->
        <header class="flex items-center gap-3 mb-6 animate-fade-in">
            <button class="btn btn-ghost btn-icon" aria-label="Go back" id="ai-insight-back">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <h1 class="text-h2">Insight Detail</h1>
        </header>

        <!-- Loading Skeleton -->
        <div id="ai-insight-content" aria-live="polite">
            <div class="flex items-center gap-2 mb-6">${Skeleton({ type: 'text', className: 'shrink-0' })}</div>
            <div class="mb-6">${Skeleton({ type: 'text', lines: 3 })}</div>
            <div class="mb-6">${Skeleton({ type: 'text', lines: 2 })}</div>
            <div class="card mb-6 p-5">${Skeleton({ type: 'text', lines: 4 })}</div>
            <div class="card mb-6 p-5">${Skeleton({ type: 'text', lines: 3 })}</div>
        </div>
    </div>`;
}

export async function AIInsightPageAfterRender(id) {
    const content = document.getElementById('ai-insight-content');
    const backBtn = document.getElementById('ai-insight-back');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
            } else if (window.appInstance) {
                window.appInstance.navigate('/ai');
            }
        });
    }

    if (!content || !id) {
        if (content) {
            content.innerHTML = ErrorState({
                title: 'Insight not found',
                description: 'The insight ID is missing or invalid.',
                onRetry: 'AIInsightPageAfterRender_retry()'
            });
        }
        return;
    }

    const fetchInsight = async () => {
        try {
            const data = await ApiClient.get('/ai/insights/' + id);

            if (!data) {
                content.innerHTML = ErrorState({
                    title: 'Insight not found',
                    description: 'This insight may have been removed or is no longer available.',
                    onRetry: 'AIInsightPageAfterRender_retry()'
                });
                return;
            }

            const tagVariant = getTagVariant(data.tag);
            const confidenceVariant = getConfidenceVariant(data.confidence);
            const confidenceLabel = getConfidenceLabel(data.confidence);
            const timeAgo = formatTimeAgo(data.created_at);

            content.innerHTML = `
                <!-- Tag Badge + AI Origin -->
                <div class="flex items-center gap-2 mb-4 flex-wrap animate-fade-in">
                    ${Badge({ label: 'AI Generated', variant: 'ai' })}
                    ${data.tag ? Badge({ label: data.tag, variant: tagVariant }) : ''}
                    ${confidenceLabel ? Badge({ label: confidenceLabel, variant: confidenceVariant }) : ''}
                </div>

                <!-- Title & Observation -->
                <div class="mb-8 animate-slide-up">
                    <h2 class="text-display mb-4">${data.title}</h2>
                    <p class="text-body text-secondary leading-relaxed">${data.observation || ''}</p>
                    <div class="flex items-center gap-3 mt-4">
                        <div class="flex items-center gap-1.5">
                            ${FreshnessBadge({ status: 'live', timeAgo: timeAgo })}
                        </div>
                        ${data.confidence != null ? `
                        <div class="confidence-bar">
                            <div class="confidence-bar-track" style="width:64px">
                                <div class="confidence-bar-fill ${data.confidence >= 80 ? 'high' : data.confidence >= 50 ? 'medium' : 'low'}" style="width:${data.confidence}%"></div>
                            </div>
                            <span class="confidence-bar-value">${data.confidence}%</span>
                        </div>` : ''}
                    </div>
                </div>

                <!-- Key Drivers -->
                ${data.drivers && data.drivers.length > 0 ? `
                <section class="mb-8 animate-slide-up" aria-labelledby="drivers-heading">
                    <h3 class="text-label text-secondary uppercase mb-4" id="drivers-heading">Key Drivers</h3>
                    <ul class="flex flex-col gap-2">
                        ${data.drivers.map((d, i) => `
                        <li class="card card-flat flex justify-between items-center p-4" style="animation-delay:${i * 50}ms">
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <div class="w-8 h-8 rounded-md ${d.amount > 0 ? 'bg-negative-soft' : 'bg-positive-soft'} flex items-center justify-center shrink-0">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="${d.amount > 0 ? 'text-negative' : 'text-positive'}">
                                        ${d.amount > 0
                                            ? '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>'
                                            : '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>'}
                                    </svg>
                                </div>
                                <span class="text-body font-medium truncate">${d.label}</span>
                            </div>
                            <span class="text-body font-semibold tabular-nums shrink-0 ml-3 ${d.amount > 0 ? 'text-negative' : 'text-positive'}">
                                ${d.amount > 0 ? '+' : ''}${formatCurrency(d.amount)}
                            </span>
                        </li>
                        `).join('')}
                    </ul>
                </section>` : ''}

                <!-- Evidence Section (collapsible) -->
                ${data.evidence ? `
                <section class="mb-8 animate-slide-up" aria-labelledby="evidence-heading">
                    <details class="card card-flat bg-surface-subtle group">
                        <summary class="p-5 cursor-pointer text-body font-medium text-secondary select-none flex items-center justify-between gap-3">
                            <span id="evidence-heading">Evidence & Analysis</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary shrink-0 transition-transform-slow group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </summary>
                        <div class="px-5 pb-5 text-body text-secondary leading-relaxed border-t border-t-subtle pt-4">
                            ${data.evidence}
                        </div>
                    </details>
                </section>` : ''}

                <!-- Impact Section -->
                ${data.impact ? `
                <section class="mb-8 animate-slide-up" aria-labelledby="impact-heading">
                    <h3 class="text-label text-secondary uppercase mb-4" id="impact-heading">Impact</h3>
                    <div class="card p-5 flex gap-4 items-start border-l-2 border-l-negative">
                        <div class="w-10 h-10 rounded-lg bg-negative-soft flex items-center justify-center shrink-0 mt-0.5">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-negative"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        </div>
                        <div class="flex-1">
                            <strong class="text-body font-semibold text-primary block mb-2">${data.impact.title}</strong>
                            <p class="text-body text-secondary leading-relaxed">${data.impact.description}</p>
                        </div>
                    </div>
                </section>` : ''}

                <!-- What You Can Do -->
                ${data.options && data.options.length > 0 ? `
                <section class="mb-8 animate-slide-up" aria-labelledby="actions-heading">
                    <h3 class="text-label text-secondary uppercase mb-4" id="actions-heading">What you can do</h3>
                    <div class="flex flex-col gap-3">
                        ${data.options.map((opt, i) => `
                        <a href="/ai/chat?q=${encodeURIComponent(opt.prompt)}" class="card card-interactive p-5 group" aria-label="${opt.label}" style="animation-delay:${i * 50}ms">
                            <div class="flex items-start gap-3">
                                <div class="w-8 h-8 rounded-md bg-surface-subtle flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-inverse transition-colors-fast">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <strong class="text-body font-semibold text-primary block mb-1">${opt.label}</strong>
                                    <span class="text-caption text-secondary leading-relaxed">${opt.description || ''}</span>
                                </div>
                            </div>
                        </a>
                        `).join('')}
                    </div>
                </section>` : ''}

                <!-- Feedback Section -->
                <div class="text-center pt-6 border-t animate-fade-in">
                    <p class="text-caption text-secondary mb-4">Was this insight helpful?</p>
                    <div class="flex justify-center gap-3">
                        <button class="btn btn-ghost btn-icon" aria-label="Helpful" id="ai-insight-thumb-up">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                        </button>
                        <button class="btn btn-ghost btn-icon" aria-label="Not helpful" id="ai-insight-thumb-down">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                        </button>
                    </div>
                    <p class="text-caption text-tertiary mt-2" id="ai-insight-feedback-count"></p>
                </div>
            `;

            // Attach feedback handlers
            const thumbUp = document.getElementById('ai-insight-thumb-up');
            const thumbDown = document.getElementById('ai-insight-thumb-down');
            const feedbackCount = document.getElementById('ai-insight-feedback-count');

            const sendFeedback = async (value) => {
                try {
                    await ApiClient.post('/ai/insights/' + id + '/feedback', { value });
                    if (thumbUp) thumbUp.disabled = true;
                    if (thumbDown) thumbDown.disabled = true;
                    if (feedbackCount) feedbackCount.textContent = 'Thank you for your feedback!';
                } catch (err) {
                    console.error('Feedback error:', err);
                }
            };

            if (thumbUp) thumbUp.addEventListener('click', () => sendFeedback('positive'));
            if (thumbDown) thumbDown.addEventListener('click', () => sendFeedback('negative'));

        } catch (err) {
            console.error('AI Insight Detail error:', err);
            content.innerHTML = ErrorState({
                title: 'Failed to load insight',
                description: err.message || 'Could not reach the server.',
                onRetry: 'AIInsightPageAfterRender_retry()'
            });
        }
    };

    // Expose retry function globally
    window.AIInsightPageAfterRender_retry = () => {
        if (content) {
            content.innerHTML = `
                <div class="flex items-center gap-2 mb-6">${Skeleton({ type: 'text', className: 'shrink-0' })}</div>
                <div class="mb-6">${Skeleton({ type: 'text', lines: 3 })}</div>
                <div class="mb-6">${Skeleton({ type: 'text', lines: 2 })}</div>
                <div class="card mb-6 p-5">${Skeleton({ type: 'text', lines: 4 })}</div>
            `;
        }
        fetchInsight();
    };

    fetchInsight();
}
