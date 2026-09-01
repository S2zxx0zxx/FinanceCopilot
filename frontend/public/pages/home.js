// ═══════════════════════════════════════════════════════════════════════
// FinCopilot — Home Page (Premium Dashboard)
// Ultra-premium financial command center
// ═══════════════════════════════════════════════════════════════════════

import { ApiClient } from '../services/api.js';
import { AuthService } from '../services/auth.js';

const formatCurrency = (paise) => {
    if (paise == null) return '0';
    const rupees = paise / 100;
    if (Math.abs(rupees) >= 10000000) return (rupees / 10000000).toFixed(2) + ' Cr';
    if (Math.abs(rupees) >= 100000) return (rupees / 100000).toFixed(2) + ' L';
    return rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const formatFullCurrency = (paise) => {
    if (paise == null) return '0';
    return '₹' + (paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

export async function HomePage() {
    try {
        const [data, user] = await Promise.all([
            ApiClient.get('/financial-state/home'),
            Promise.resolve(AuthService.getCurrentUser())
        ]);

        const greeting = getGreeting();
        const name = user?.displayName?.split(' ')[0] || 'there';
        const safeToSpend = data.safeToSpend ?? 0;
        const totalBalance = data.totalBalance ?? 0;
        const monthlySpending = data.monthlySpending ?? 0;
        const monthlyIncome = data.monthlyIncome ?? 0;
        const spendingChange = data.spendingChange ?? 0;
        const balanceChange = data.balanceChange ?? 0;
        const recentTransactions = data.recentTransactions || [];
        const topCategories = data.topCategories || [];
        const upcomingCount = data.upcomingCommitmentsCount ?? 0;
        const needsAttention = data.needsAttention || [];
        const aiInsights = data.aiInsights || [];

        return `
        <main class="page animate-fade-in" aria-label="Home Dashboard">
            <!-- Hero Greeting -->
            <header class="mb-6">
                <p class="text-caption text-secondary mb-1">${greeting}</p>
                <h1 class="text-h1">${name}</h1>
            </header>

            <!-- Safe to Spend Hero Card -->
            <article class="card card--premium card-hero animate-slide-up mb-6" style="animation-delay: 50ms">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-positive"></div>
                        <span class="text-caption text-secondary uppercase tracking-widest">Safe to Spend</span>
                    </div>
                    <span class="text-caption text-tertiary">this month</span>
                </div>
                <div class="flex items-end gap-3 mb-4">
                    <span class="text-display text-primary tabular-nums">${formatFullCurrency(safeToSpend)}</span>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <p class="text-caption text-tertiary mb-1">Monthly Income</p>
                        <p class="text-body font-semibold text-positive">+${formatCurrency(monthlyIncome)}</p>
                    </div>
                    <div class="flex-1">
                        <p class="text-caption text-tertiary mb-1">Spent So Far</p>
                        <p class="text-body font-semibold ${monthlySpending > 0 ? 'text-negative' : ''}">${formatCurrency(monthlySpending)}</p>
                    </div>
                    <div class="flex-1">
                        <p class="text-caption text-tertiary mb-1">Commitments</p>
                        <p class="text-body font-semibold">${upcomingCount} pending</p>
                    </div>
                </div>
            </article>

            ${needsAttention.length > 0 ? `
            <!-- Attention Alerts -->
            <section class="mb-6 animate-slide-up" style="animation-delay: 100ms">
                <div class="section-header">
                    <span class="section-header-title">Needs Attention</span>
                </div>
                <div class="flex flex-col gap-3">
                    ${needsAttention.map(item => `
                        <div class="card card-flat flex items-center gap-3 p-4">
                            <div class="w-10 h-10 rounded-lg bg-warning-soft flex items-center justify-center shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-primary truncate">${item.title || item.message || 'Action needed'}</p>
                                <p class="text-caption text-tertiary truncate">${item.description || ''}</p>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <!-- Quick Stats Grid -->
            <section class="mb-6 animate-slide-up" style="animation-delay: 150ms">
                <div class="grid grid-cols-2 gap-3">
                    <a href="/money" class="card card-interactive p-4">
                        <p class="text-caption text-tertiary mb-2">Total Balance</p>
                        <p class="text-h3 text-primary tabular-nums">${formatFullCurrency(totalBalance)}</p>
                        ${balanceChange !== 0 ? `<p class="text-caption mt-1 ${balanceChange >= 0 ? 'text-positive' : 'text-negative'}">${balanceChange >= 0 ? '+' : ''}${((balanceChange / (Math.abs(totalBalance) || 1)) * 100).toFixed(1)}% this month</p>` : ''}
                    </a>
                    <a href="/spending-story" class="card card-interactive p-4">
                        <p class="text-caption text-tertiary mb-2">Monthly Spend</p>
                        <p class="text-h3 text-primary tabular-nums">${formatFullCurrency(Math.abs(monthlySpending))}</p>
                        ${spendingChange !== 0 ? `<p class="text-caption mt-1 ${spendingChange <= 0 ? 'text-positive' : 'text-negative'}">${spendingChange <= 0 ? '' : '+'}${spendingChange.toFixed(0)}% vs last month</p>` : ''}
                    </a>
                </div>
            </section>

            ${topCategories.length > 0 ? `
            <!-- Top Categories -->
            <section class="mb-6 animate-slide-up" style="animation-delay: 200ms">
                <div class="section-header">
                    <span class="section-header-title">Top Categories</span>
                    <a href="/spending-story" class="section-header-action text-caption text-secondary">See All</a>
                </div>
                <div class="card card-flat p-0 overflow-hidden">
                    ${topCategories.map((cat, i) => {
                        const pct = cat.percentage || 0;
                        const barColor = i === 0 ? 'var(--color-primary)' : 'var(--color-border-strong)';
                        return `
                        <div class="flex items-center gap-4 px-4 py-3 ${i < topCategories.length - 1 ? 'border-b border-border-subtle' : ''}">
                            <div class="w-8 h-8 rounded-md bg-surface-subtle flex items-center justify-center shrink-0">
                                <span class="text-caption font-semibold text-secondary">${(cat.emoji || cat.icon || '#')}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-sm font-medium text-primary truncate">${cat.name || cat.category}</span>
                                    <span class="text-sm font-semibold text-primary tabular-nums">${formatFullCurrency(cat.amount_paise || cat.amount || 0)}</span>
                                </div>
                                <div class="h-1 rounded-full bg-surface-subtle overflow-hidden">
                                    <div class="h-full rounded-full" style="width: ${Math.min(pct, 100)}%; background: ${barColor}; transition: width 0.6s var(--ease-spring)"></div>
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </section>
            ` : ''}

            ${recentTransactions.length > 0 ? `
            <!-- Recent Transactions -->
            <section class="mb-6 animate-slide-up" style="animation-delay: 250ms">
                <div class="section-header">
                    <span class="section-header-title">Recent Transactions</span>
                    <a href="/transactions" class="section-header-action text-caption text-secondary">View All</a>
                </div>
                <div class="card card-flat p-0 overflow-hidden">
                    ${recentTransactions.slice(0, 5).map((tx, i) => {
                        const isExpense = tx.direction === 'DEBIT' || (tx.amount_paise || 0) < 0;
                        const amount = Math.abs(tx.amount_paise || 0);
                        return `
                        <a href="/transactions/${tx.transaction_id || tx.id}" class="transaction-row ${i < Math.min(recentTransactions.length, 5) - 1 ? 'border-b border-border-subtle' : ''}">
                            <div class="transaction-icon ${isExpense ? 'bg-negative-soft' : 'bg-positive-soft'}">
                                <span class="text-sm font-bold ${isExpense ? 'text-negative' : 'text-positive'}">${(tx.merchant_normalized || tx.merchant || '?')[0].toUpperCase()}</span>
                            </div>
                            <div class="transaction-info">
                                <span class="transaction-merchant text-sm font-medium text-primary">${tx.merchant_normalized || tx.merchant || 'Unknown'}</span>
                                <span class="transaction-category text-caption text-tertiary">${tx.transaction_type || tx.category || 'Other'} &middot; ${formatDate(tx.observed_at || tx.date)}</span>
                            </div>
                            <span class="transaction-amount text-sm font-semibold tabular-nums ${isExpense ? 'text-negative' : 'text-positive'}">${isExpense ? '-' : '+'}${formatCurrency(amount)}</span>
                        </a>`;
                    }).join('')}
                </div>
            </section>
            ` : ''}

            ${aiInsights.length > 0 ? `
            <!-- AI Insights -->
            <section class="mb-6 animate-slide-up" style="animation-delay: 300ms">
                <div class="section-header">
                    <span class="section-header-title">AI Insights</span>
                    <a href="/ai" class="section-header-action text-caption text-secondary">Explore AI</a>
                </div>
                <div class="flex flex-col gap-3">
                    ${aiInsights.slice(0, 2).map(insight => `
                        <a href="/ai/insight/${insight.id || ''}" class="card card-interactive flex items-start gap-3 p-4">
                            <div class="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0 mt-0.5">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.8"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M18 14l.75 2.25L21 17l-2.25.75L18 20l-.75-2.25L15 17l2.25-.75L18 14z"/></svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-primary mb-1">${insight.title || 'Insight'}</p>
                                <p class="text-caption text-tertiary line-clamp-2">${insight.summary || insight.text || ''}</p>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <!-- Quick Actions -->
            <section class="mb-8 animate-slide-up" style="animation-delay: 350ms">
                <div class="section-header">
                    <span class="section-header-title">Quick Actions</span>
                </div>
                <div class="grid grid-cols-3 gap-3">
                    <a href="/plan" class="card card-flat card-interactive flex flex-col items-center gap-2 py-5">
                        <div class="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                        </div>
                        <span class="text-caption text-secondary">Plan</span>
                    </a>
                    <a href="/ai/chat" class="card card-flat card-interactive flex flex-col items-center gap-2 py-5">
                        <div class="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/></svg>
                        </div>
                        <span class="text-caption text-secondary">Ask AI</span>
                    </a>
                    <a href="/goals" class="card card-flat card-interactive flex flex-col items-center gap-2 py-5">
                        <div class="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                        </div>
                        <span class="text-caption text-secondary">Goals</span>
                    </a>
                </div>
            </section>
        </main>`;
    } catch (error) {
        console.error('Home page error:', error);
        return `
        <main class="page">
            <header class="mb-6">
                <h1 class="text-h1">Dashboard</h1>
            </header>
            <div class="card card-flat p-8 flex flex-col items-center gap-4 text-center">
                <div class="w-16 h-16 rounded-full bg-surface-subtle flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h3 class="text-h3 text-primary">Unable to load dashboard</h3>
                <p class="text-body text-secondary">${error.message || 'Please check your connection and try again.'}</p>
                <button class="btn btn-primary mt-2" onclick="window.appInstance.route()">Retry</button>
            </div>
        </main>`;
    }
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000 && d.getDate() === now.getDate()) return 'Today';
    if (diff < 172800000) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
