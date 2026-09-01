import { ApiClient } from '../services/api.js';

function formatCurrency(paise) {
    if (paise == null) return '\u2014';
    return '₹' + (Number(paise) / 100).toLocaleString('en-IN');
}

function formatChange(paise) {
    if (paise == null) return null;
    const abs = Math.abs(Number(paise)) / 100;
    const formatted = '₹' + abs.toLocaleString('en-IN');
    const direction = paise > 0 ? 'less' : 'more';
    return { text: `${formatted} ${direction} than last month`, isPositive: paise > 0 };
}

function categoryIcon(name) {
    const icons = {
        'food': '🍕', 'food & dining': '🍕', 'dining': '🍕',
        'groceries': '🛒', 'grocery': '🛒',
        'transport': '🚗', 'transportation': '🚗', 'cab': '🚕', 'uber': '🚕',
        'shopping': '🛍️', 'retail': '🛍️',
        'entertainment': '🎬', 'movies': '🎬', 'subscriptions': '📺',
        'bills': '📄', 'utilities': '💡', 'electricity': '⚡',
        'health': '🏥', 'medical': '💊', 'pharmacy': '💊',
        'education': '📚', 'learning': '📚',
        'travel': '✈️',
        'rent': '🏠', 'housing': '🏠',
        'insurance': '🛡️',
        'emi': '🏦', 'loan': '🏦',
        'transfer': '↔️', 'transfers': '↔️',
        'investment': '📈', 'investments': '📈',
        'salary': '💰', 'income': '💰',
        'refunds': '↩️', 'refund': '↩️',
        'cash': '💵', 'atm': '🏧', 'withdrawal': '🏧',
    };
    return icons[name.toLowerCase().trim()] || '💳';
}

function renderCategoryRow(cat, totalPaise) {
    const amount = Number(cat.amount_paise || 0);
    const pct = totalPaise > 0 ? Math.round((amount / totalPaise) * 100) : 0;
    return `
        <a href="/category-detail/${encodeURIComponent(cat.name)}" data-link
           class="card card-flat flex items-center gap-4 py-4 px-5 animate-slide-up">
            <span class="text-h2 flex-shrink-0 w-10 text-center">${categoryIcon(cat.name)}</span>
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-body font-medium truncate">${cat.name}</span>
                    <span class="text-body font-semibold tabular-nums flex-shrink-0 ml-3">${formatCurrency(amount)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width:${pct}%"></div>
                </div>
                <span class="text-caption text-tertiary mt-1 block">${pct}% of total spend</span>
            </div>
        </a>`;
}

function renderBackLink() {
    return `<a href="/money" data-link class="btn btn-icon btn-ghost" aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
    </a>`;
}

function renderPageHeader() {
    return `<header class="flex items-center gap-3 mb-8">
        ${renderBackLink()}
        <h1 class="text-h1">Spending Story</h1>
    </header>`;
}

export async function SpendingStoryPage() {
    let data;
    try {
        data = await ApiClient.get('/financial-state/spending-story');
    } catch (error) {
        return `
            <div class="page">
                ${renderPageHeader()}
                <div class="card card-flat p-6 text-center">
                    <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <p class="text-body text-secondary mt-4">Unable to load spending data. Please try again.</p>
                </div>
            </div>`;
    }

    const spending = data.spending || {};
    const effectivePaise = Number(spending.effective_spending_paise || 0);
    const categories = data.categories || [];
    const hasData = effectivePaise > 0 || categories.length > 0;
    const change = formatChange(data.change_vs_last_month_paise);

    if (!hasData) {
        return `
            <div class="page">
                ${renderPageHeader()}
                <div class="empty-state mt-8">
                    <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    <h3 class="empty-state-title">No spending data yet</h3>
                    <p class="empty-state-description">Spending insights will appear here once transactions are imported for the current month.</p>
                </div>
            </div>`;
    }

    const categoryTotal = categories.reduce((sum, c) => sum + Number(c.amount_paise || 0), 0);
    const categoryRows = categories.map(cat => renderCategoryRow(cat, categoryTotal)).join('');

    return `
        <div class="page animate-fade-in" aria-label="Spending Story">
            ${renderPageHeader()}

            <div class="card card-hero p-6 mb-8 animate-slide-up">
                <div class="flex items-center justify-between mb-3">
                    <span class="badge badge-default">${data.period || 'This Month'}</span>
                    ${change
                        ? `<span class="badge ${change.isPositive ? 'badge-positive' : 'badge-negative'}">${change.isPositive ? '↓' : '↑'} ${change.text}</span>`
                        : ''}
                </div>
                <h2 class="text-h2 text-negative tabular-nums">-${formatCurrency(effectivePaise)}</h2>
                <p class="text-caption text-secondary mt-2">Effective spending excluding transfers and offsets</p>
            </div>

            ${categories.length > 0 ? `
                <section class="mb-8 animate-slide-up">
                    <div class="section-header mb-4">
                        <h2 class="section-header-title">Category Breakdown</h2>
                    </div>
                    <div class="flex flex-col gap-3 stagger-children">
                        ${categoryRows}
                    </div>
                </section>
            ` : `
                <div class="card card-flat p-6 animate-slide-up">
                    <div class="empty-state">
                        <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                        <h3 class="empty-state-title">Category breakdown unavailable</h3>
                        <p class="empty-state-description">Detailed categories will appear as your transactions are categorized.</p>
                    </div>
                </div>
            `}
        </div>`;
}
