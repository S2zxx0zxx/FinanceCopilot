/* eslint-env browser */
import { ApiClient } from '../services/api.js';
import { Card, SectionHeader, Button, ErrorState, EmptyState } from '../components/ui.js';

export async function TransactionsPage() {
    // Expose filter handler
    window.applyFilters = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const params = new URLSearchParams();
        
        for (const [key, value] of formData.entries()) {
            if (value) params.append(key, value);
        }
        
        window.location.href = window.fcUrl('/transactions') + '?' + params.toString();
    };

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const accountId = urlParams.get('accountId') || '';
        const category = urlParams.get('category') || '';
        const direction = urlParams.get('direction') || '';
        const startDate = urlParams.get('startDate') || '';
        const endDate = urlParams.get('endDate') || '';
        
        let queryParams = new URLSearchParams();
        if (accountId) queryParams.append('accountId', accountId);
        if (category) queryParams.append('category', category);
        if (direction) queryParams.append('direction', direction);
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        
        const data = await ApiClient.get(`/transactions${query}`);
        const formatCurrency = (paise) => (paise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

        const hasActiveFilters = accountId || category || direction || startDate || endDate;
        
        return `
            <main class="page">
                <header class="mb-8 animate-fade-in">
                    <div class="flex items-center gap-3">
                        <button onclick="window.history.back();" class="btn btn-icon btn-ghost" aria-label="Back">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <h1 class="text-h1">Transactions</h1>
                    </div>
                </header>

                <!-- Filters -->
                <div class="card mb-6 animate-slide-up">
                    <form onsubmit="window.applyFilters(event)" class="flex flex-col gap-4">
                        <input type="hidden" name="accountId" value="${accountId}">
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="flex gap-3">
                                <div class="flex-1 input-wrapper">
                                    <label class="input-label">Start Date</label>
                                    <input type="date" name="startDate" value="${startDate}" class="input">
                                </div>
                                <div class="flex-1 input-wrapper">
                                    <label class="input-label">End Date</label>
                                    <input type="date" name="endDate" value="${endDate}" class="input">
                                </div>
                            </div>
                            
                            <div class="flex gap-3">
                                <div class="flex-1 input-wrapper">
                                    <label class="input-label">Direction</label>
                                    <select name="direction" class="select">
                                        <option value="">Any</option>
                                        <option value="debit" ${direction === 'debit' ? 'selected' : ''}>Debit (-)</option>
                                        <option value="credit" ${direction === 'credit' ? 'selected' : ''}>Credit (+)</option>
                                    </select>
                                </div>
                                <div class="flex-1 input-wrapper">
                                    <label class="input-label">Category</label>
                                    <select name="category" class="select">
                                        <option value="">All</option>
                                        <option value="expense" ${category === 'expense' ? 'selected' : ''}>Expense</option>
                                        <option value="income" ${category === 'income' ? 'selected' : ''}>Income</option>
                                        <option value="transfer_in" ${category === 'transfer_in' ? 'selected' : ''}>Transfer In</option>
                                        <option value="transfer_out" ${category === 'transfer_out' ? 'selected' : ''}>Transfer Out</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex justify-end gap-2 pt-4" style="border-top:1px solid var(--color-border-subtle)">
                            ${Button({ label: 'Clear', variant: 'ghost', onClick: "window.fcNavigateTo('/transactions')" })}
                            <button type="submit" class="btn btn-primary">Apply Filters</button>
                        </div>
                    </form>
                </div>

                <!-- Transaction List -->
                <div class="card animate-slide-up" style="animation-delay:80ms;padding:0;overflow:hidden">
                    ${data.data.length > 0 ? `
                        <div class="stagger-children">
                            ${data.data.map(tx => `
                                <a href="/transactions/${tx.transaction_id}" data-link class="transaction-row" style="text-decoration:none">
                                    <div class="transaction-icon">
                                        ${tx.direction === 'credit' 
                                            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>'
                                            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>'
                                        }
                                    </div>
                                    <div class="transaction-info">
                                        <p class="transaction-merchant">${tx.merchant_normalized || tx.description || 'Unknown'}</p>
                                        <p class="transaction-category">${new Date(tx.observed_at).toLocaleDateString()} · <span class="capitalize">${(tx.transaction_type || 'uncategorized').replace('_', ' ')}</span></p>
                                    </div>
                                    <p class="transaction-amount ${tx.direction === 'credit' ? 'income' : 'expense'} tabular-nums">
                                        ${tx.direction === 'credit' ? '+' : '-'}${formatCurrency(tx.amount_paise)}
                                    </p>
                                </a>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="p-8">
                            ${EmptyState({ 
                                title: 'No transactions found', 
                                description: hasActiveFilters ? 'Try adjusting your filters.' : 'No transactions exist yet.',
                                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>'
                            })}
                        </div>
                    `}
                </div>

                ${data.data.length > 0 ? `
                    <div class="flex justify-center mt-6 animate-slide-up" style="animation-delay:160ms">
                        ${Button({ label: 'Load More Transactions', variant: 'secondary' })}
                    </div>
                ` : ''}
            </main>
        `;
    } catch (error) {
        return `
            <main class="page">
                <div class="flex items-center justify-center h-full min-h-screen">
                    ${ErrorState({ title: 'Failed to load Transactions', description: error.message, onRetry: 'window.appInstance.route()' })}
                </div>
            </main>
        `;
    }
}
