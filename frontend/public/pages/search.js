import { ApiClient } from '../services/api.js';

export async function SearchPage() {
    // Keep reference to handle inputs
    window.handleSearch = async (event) => {
        const query = event.target.value;
        const resultsDiv = document.getElementById('search-results');
        
        if (query.length < 2) {
            resultsDiv.innerHTML = `
                <div class="text-center py-8">
                    <svg class="mx-auto mb-3" style="width:40px;height:40px;color:var(--color-gray-300)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <p class="text-caption">Type at least 2 characters to search.</p>
                </div>
            `;
            return;
        }

        try {
            resultsDiv.innerHTML = `
                <div class="flex items-center justify-center gap-3 py-8">
                    <div class="spinner spinner-sm"></div>
                    <span class="text-caption">Searching...</span>
                </div>
            `;
            const data = await ApiClient.get(`/search?q=${encodeURIComponent(query)}`);
            
            let html = '';
            
            if (data.accounts.length > 0) {
                html += `
                    <div class="mb-6">
                        <h3 class="text-label mb-3">Accounts</h3>
                        <div class="flex flex-col gap-2">
                            ${data.accounts.map(acc => `
                                <a href="/accounts/${acc.account_id}" data-link class="card card-interactive block cursor-pointer">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3 min-w-0">
                                            <div class="transaction-icon">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                            </div>
                                            <div class="min-w-0">
                                                <p class="transaction-merchant">${acc.institution_name}</p>
                                                <p class="transaction-category capitalize">${acc.account_type}</p>
                                            </div>
                                        </div>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary flex-shrink-0"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </div>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            if (data.transactions.length > 0) {
                html += `
                    <div class="mb-6">
                        <h3 class="text-label mb-3">Transactions</h3>
                        <div class="card" style="padding:0;overflow:hidden">
                            ${data.transactions.map(tx => `
                                <a href="/transactions/${tx.transaction_id}" data-link class="transaction-row" style="text-decoration:none">
                                    <div class="transaction-icon">
                                        ${tx.direction === 'credit' 
                                            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>'
                                            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>'
                                        }
                                    </div>
                                    <div class="transaction-info">
                                        <p class="transaction-merchant">${tx.merchant_normalized || 'Unknown'}</p>
                                        <p class="transaction-category">${new Date(tx.observed_at).toLocaleDateString()} · ${(tx.transaction_type || 'uncategorized').replace('_', ' ')}</p>
                                    </div>
                                    <p class="transaction-amount ${tx.direction === 'credit' ? 'income' : 'expense'} tabular-nums">
                                        ${tx.direction === 'credit' ? '+' : '-'}${(tx.amount_paise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                                    </p>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            if (data.accounts.length === 0 && data.transactions.length === 0) {
                html = `
                    <div class="text-center py-8">
                        <svg class="mx-auto mb-3" style="width:40px;height:40px;color:var(--color-gray-300)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <p class="text-caption">No results found for "${query.replace(/"/g, '&quot;')}".</p>
                    </div>
                `;
            }

            resultsDiv.innerHTML = html;
        } catch (error) {
            resultsDiv.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-negative text-caption">Search failed: ${error.message}</p>
                </div>
            `;
        }
    };

    return `
        <main class="page">
            <header class="mb-8 animate-fade-in">
                <h1 class="text-h1">Search</h1>
                <p class="text-caption mt-1">Find transactions, accounts, and more</p>
            </header>

            <div class="mb-6 animate-slide-up">
                <div class="search-bar">
                    <svg class="search-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                        type="text" 
                        class="search-bar-input" 
                        placeholder="Search merchants, categories, accounts..." 
                        oninput="window.handleSearch(event)"
                        autofocus
                    >
                </div>
            </div>

            <div id="search-results" class="animate-slide-up" style="animation-delay:80ms">
                <div class="text-center py-8">
                    <svg class="mx-auto mb-3" style="width:40px;height:40px;color:var(--color-gray-300)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <p class="text-caption">Type at least 2 characters to search.</p>
                </div>
            </div>
        </main>
    `;
}
