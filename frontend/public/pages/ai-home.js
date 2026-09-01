// ═══════════════════════════════════════════════════════════════════════
// FinCopilot — AI Home (SCR-28)
// AI insight feed and quick AI actions hub
// ═══════════════════════════════════════════════════════════════════════

import { ApiClient } from '../services/api.js';
import { SectionHeader, Card, Badge, Skeleton, EmptyState, ErrorState, FreshnessBadge } from '../components/ui.js';

const AI_STATUS = {
    AI_AVAILABLE: 'AI_AVAILABLE',
    AI_UNAVAILABLE: 'AI_UNAVAILABLE',
    LOW_CONFIDENCE: 'LOW_CONFIDENCE',
    INSUFFICIENT_DATA: 'INSUFFICIENT_DATA'
};

const QUICK_ACTIONS = [
    {
        label: 'Ask AI',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
        href: '/ai/chat'
    },
    {
        label: 'Money Leaks',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        href: '/ai/leaks'
    },
    {
        label: 'Can I Afford',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
        href: '/ai/afford'
    },
    {
        label: 'Forecast',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
        href: '/ai/what-if'
    }
];

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

const getConfidenceVariant = (confidence) => {
    if (confidence >= 80) return 'neutral';
    if (confidence >= 50) return 'warning';
    return 'negative';
};

const getTagVariant = (tag) => {
    const t = (tag || '').toLowerCase();
    if (t.includes('warning') || t.includes('risk') || t.includes('leak')) return 'warning';
    if (t.includes('positive') || t.includes('savings') || t.includes('good') || t.includes('opportunity')) return 'positive';
    if (t.includes('negative') || t.includes('alert') || t.includes('critical')) return 'negative';
    return 'neutral';
};

export async function AIHomePage() {
    return `
    <div class="page" aria-label="AI Copilot">
        <!-- Header with AI Status -->
        <header class="mb-6 animate-fade-in">
            <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-inverse"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <div>
                        <h1 class="text-h1">AI Copilot</h1>
                    </div>
                </div>
                <div id="ai-home-status" class="flex items-center gap-2" aria-live="polite">
                    <div class="live-dot"></div>
                    <span class="live-dot-text" id="ai-home-status-text">Loading</span>
                </div>
            </div>
            <p class="text-body text-secondary">Understand your money with AI-powered insights.</p>
        </header>

        <!-- Premium Search/Composer Bar -->
        <div class="mb-8 animate-slide-up" aria-label="Search AI">
            <button
                class="card card-interactive w-full flex items-center gap-3 p-4 group"
                id="ai-home-search-bar"
                role="search"
                aria-label="Ask AI a question"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary shrink-0"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span class="text-body text-tertiary flex-1 text-left">Ask your money anything...</span>
                <div class="w-8 h-8 rounded-md bg-surface-subtle flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-inverse transition-colors-fast">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </div>
            </button>
        </div>

        <!-- Quick Action Cards Grid (2x2) -->
        <section class="mb-8 animate-slide-up" aria-label="Quick Actions">
            <div class="grid grid-cols-2 gap-3">
                ${QUICK_ACTIONS.map((action, i) => `
                    <a href="${action.href}" class="card card-interactive card-flat flex flex-col items-center gap-3 py-5 px-3 text-center group" aria-label="${action.label}">
                        <div class="w-12 h-12 rounded-xl bg-surface-subtle flex items-center justify-center group-hover:bg-primary group-hover:text-inverse transition-colors-fast">
                            ${action.icon}
                        </div>
                        <span class="text-caption font-medium text-secondary">${action.label}</span>
                    </a>
                `).join('')}
            </div>
        </section>

        <!-- Suggested Prompts (horizontal scrollable chips) -->
        <section class="mb-8 animate-slide-up" aria-labelledby="ai-suggestions-heading">
            <div class="section-header">
                <span class="section-header-title">Suggested for you</span>
            </div>
            <div id="ai-home-suggestions" class="flex gap-2 overflow-x-auto scrollbar-none pb-1" role="list" aria-label="Suggested prompts">
                ${Array.from({ length: 4 }, () => Skeleton({ type: 'text', className: 'shrink-0' })).map(s => `<div class="shrink-0">${s}</div>`).join('')}
            </div>
        </section>

        <!-- Recent Insights Feed -->
        <section aria-labelledby="ai-insights-heading">
            <div class="section-header">
                <span class="section-header-title">Recent Insights</span>
            </div>
            <div id="ai-home-insights" class="flex flex-col gap-3">
                ${Skeleton({ type: 'card' })}
                ${Skeleton({ type: 'card' })}
                ${Skeleton({ type: 'card' })}
            </div>
        </section>
    </div>`;
}

export function AIHomePageAfterRender() {
    const suggestionsContainer = document.getElementById('ai-home-suggestions');
    const insightsContainer = document.getElementById('ai-home-insights');
    const statusText = document.getElementById('ai-home-status-text');
    const statusBar = document.getElementById('ai-home-status');
    const searchBar = document.getElementById('ai-home-search-bar');

    if (searchBar) {
        searchBar.addEventListener('click', () => {
            if (window.appInstance) {
                window.appInstance.navigate('/ai/chat');
            }
        });
    }

    let aiStatus = AI_STATUS.AI_AVAILABLE;

    const setStatus = (status, label) => {
        aiStatus = status;
        if (statusText) statusText.textContent = label;
        if (statusBar) {
            const dot = statusBar.querySelector('.live-dot');
            if (dot) {
                dot.classList.remove('live-dot');
                if (status === AI_STATUS.AI_AVAILABLE) {
                    dot.classList.add('live-dot');
                } else if (status === AI_STATUS.AI_UNAVAILABLE) {
                    dot.style.background = 'var(--color-negative)';
                } else if (status === AI_STATUS.INSUFFICIENT_DATA) {
                    dot.style.background = 'var(--color-text-disabled)';
                } else if (status === AI_STATUS.LOW_CONFIDENCE) {
                    dot.style.background = 'var(--color-warning)';
                }
            }
        }
    };

    const fetchFeed = async () => {
        try {
            setStatus(AI_STATUS.AI_AVAILABLE, 'Active');
            const data = await ApiClient.get('/ai/home-feed');

            if (!data) {
                setStatus(AI_STATUS.INSUFFICIENT_DATA, 'No data');
                renderInsufficientData();
                return;
            }

            // Render suggestions
            if (data.suggestions?.length > 0) {
                suggestionsContainer.innerHTML = data.suggestions.map((s, i) => `
                    <button
                        class="ai-suggestion-chip shrink-0"
                        data-query="${encodeURIComponent(s)}"
                        role="listitem"
                        aria-label="Ask: ${s}"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        ${s}
                    </button>
                `).join('');

                suggestionsContainer.querySelectorAll('.ai-suggestion-chip').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const q = decodeURIComponent(btn.dataset.query);
                        if (window.appInstance) {
                            window.appInstance.navigate('/ai/chat?q=' + encodeURIComponent(q));
                        }
                    });
                });
            } else {
                suggestionsContainer.innerHTML = '<p class="text-caption text-tertiary py-2">No suggestions available right now.</p>';
            }

            // Render insights
            if (data.insights?.length > 0) {
                insightsContainer.innerHTML = data.insights.map((insight, idx) => {
                    const confidenceVariant = getConfidenceVariant(insight.confidence);
                    const tagVariant = getTagVariant(insight.tag);
                    const isLowConfidence = insight.confidence < 50;

                    return `
                    <a href="/ai/insight/${insight.id}" class="card card-interactive animate-slide-up" aria-label="View insight: ${insight.title}" style="animation-delay: ${idx * 60}ms">
                        <div class="flex items-start gap-3">
                            <div class="ai-insight-icon shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"></path><path d="M18 14l.75 2.25L21 17l-2.25.75L18 20l-.75-2.25L15 17l2.25-.75L18 14z"></path></svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1 flex-wrap">
                                    ${Badge({ label: 'AI', variant: 'ai' })}
                                    ${insight.tag ? Badge({ label: insight.tag, variant: tagVariant }) : ''}
                                    ${isLowConfidence ? Badge({ label: 'Low Confidence', variant: 'warning' }) : ''}
                                </div>
                                <h3 class="text-body font-semibold text-primary mb-1 leading-snug">${insight.title}</h3>
                                <p class="text-caption text-secondary truncate">${insight.preview}</p>
                                <div class="flex items-center gap-3 mt-3">
                                    ${!isLowConfidence ? `
                                    <div class="flex items-center gap-1.5">
                                        ${FreshnessBadge({ status: 'live', timeAgo: formatTimeAgo(insight.created_at) })}
                                    </div>` : ''}
                                    ${insight.evidence_count > 0 ? `<span class="text-caption text-tertiary">${insight.evidence_count} evidence</span>` : ''}
                                    ${insight.confidence != null ? `
                                    <div class="confidence-bar ml-auto">
                                        <div class="confidence-bar-track" style="width:48px">
                                            <div class="confidence-bar-fill ${insight.confidence >= 80 ? 'high' : insight.confidence >= 50 ? 'medium' : 'low'}" style="width:${insight.confidence}%"></div>
                                        </div>
                                        <span class="confidence-bar-value">${insight.confidence}%</span>
                                    </div>` : ''}
                                </div>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary shrink-0 mt-1"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </a>`;
                }).join('');
            } else {
                insightsContainer.innerHTML = EmptyState({
                    title: 'No insights yet',
                    description: 'Connect your accounts and let AI analyze your finances. Insights appear here as they are discovered.',
                    action: '<button class="btn btn-primary" id="ai-home-connect-btn">Connect Data</button>',
                    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-tertiary"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"></path><path d="M18 14l.75 2.25L21 17l-2.25.75L18 20l-.75-2.25L15 17l2.25-.75L18 14z"></path></svg>'
                });

                const connectBtn = document.getElementById('ai-home-connect-btn');
                if (connectBtn) {
                    connectBtn.addEventListener('click', () => {
                        if (window.appInstance) window.appInstance.navigate('/you/connections');
                    });
                }
            }

        } catch (err) {
            console.error('AI Home Feed error:', err);
            setStatus(AI_STATUS.AI_UNAVAILABLE, 'Unavailable');
            suggestionsContainer.innerHTML = ErrorState({
                title: 'Failed to load suggestions',
                description: err.message || 'Could not reach the server.',
                onRetry: 'AIHomePageAfterRender_retry()'
            });
            insightsContainer.innerHTML = ErrorState({
                title: 'Failed to load insights',
                description: err.message || 'Could not reach the server.',
                onRetry: 'AIHomePageAfterRender_retry()'
            });
        }
    };

    const renderInsufficientData = () => {
        insightsContainer.innerHTML = EmptyState({
            title: 'Not enough data yet',
            description: 'AI needs at least 30 days of transaction history to generate meaningful insights. Connect more accounts or wait for data to accumulate.',
            action: '<button class="btn btn-secondary" id="ai-home-connections-btn">View Connections</button>',
            icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-tertiary"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>'
        });

        const btn = document.getElementById('ai-home-connections-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                if (window.appInstance) window.appInstance.navigate('/you/connections');
            });
        }
    };

    // Expose retry function
    window.AIHomePageAfterRender_retry = () => {
        suggestionsContainer.innerHTML = Skeleton({ type: 'text', className: 'shrink-0' });
        insightsContainer.innerHTML = `${Skeleton({ type: 'card' })}${Skeleton({ type: 'card' })}`;
        fetchFeed();
    };

    fetchFeed();
}
