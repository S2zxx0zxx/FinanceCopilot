import { ApiClient } from '../services/api.js';
import { ErrorState, SectionHeader } from '../components/ui.js';

export async function CategoryDetailPage(categoryId) {
    try {
        const data = await ApiClient.get(`/financial-state/categories/${categoryId}`);
        const totalSpentPaise = data.total_spent_paise;
        const totalSpentRupees = (totalSpentPaise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

        return `
            <main class="page">
                <header class="mb-8 animate-fade-in">
                    <div class="flex items-center gap-3">
                        <button onclick="window.history.back(); return false;" class="btn btn-icon btn-ghost" aria-label="Back">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <h1 class="text-h1 capitalize">${categoryId}</h1>
                    </div>
                </header>

                <div class="card card-hero mb-6 animate-slide-up">
                    <p class="text-label mb-3">${data.period}</p>
                    <h2 class="text-metric text-negative">-${totalSpentRupees}</h2>
                    <p class="text-caption mt-3">Total spent in this category for the period.</p>
                </div>

                <section class="animate-slide-up" style="animation-delay:80ms">
                    ${SectionHeader({ title: 'Actions' })}
                    <a href="/transactions?category=${categoryId}" data-link class="card card-interactive block">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-4">
                                <div class="transaction-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                </div>
                                <div>
                                    <p class="text-body text-primary font-medium">View Transactions</p>
                                    <p class="text-caption">See all activity for this category</p>
                                </div>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </div>
                    </a>
                </section>
            </main>
        `;
    } catch (error) {
        return `
            <main class="page">
                <header class="mb-8">
                    <div class="flex items-center gap-3">
                        <button onclick="window.history.back(); return false;" class="btn btn-icon btn-ghost" aria-label="Back">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <h1 class="text-h1">Error</h1>
                    </div>
                </header>
                ${ErrorState({ title: 'Failed to load Category', description: error.message, onRetry: 'window.appInstance.route()' })}
            </main>
        `;
    }
}
