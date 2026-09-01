import { ApiClient } from '../services/api.js';
import { ErrorState, EmptyState } from '../components/ui.js';

export async function AccountsPage() {
    try {
        const data = await ApiClient.get('/accounts');
        
        const formatCurrency = (paise) => (paise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
        
        if (data.accounts.length === 0) {
            return `
                <main class="page">
                    <header class="mb-8 animate-fade-in">
                        <h1 class="text-h1">Accounts</h1>
                    </header>
                    ${EmptyState({ 
                        title: 'No accounts connected', 
                        description: 'Link your first bank account to begin tracking your finances.',
                        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>'
                    })}
                </main>
            `;
        }

        return `
            <main class="page">
                <header class="mb-8 animate-fade-in">
                    <h1 class="text-h1">Accounts</h1>
                    <p class="text-caption mt-1">${data.accounts.length} account${data.accounts.length !== 1 ? 's' : ''} connected</p>
                </header>

                <div class="flex flex-col gap-3 stagger-children">
                    ${data.accounts.map(acc => `
                        <a href="/accounts/${acc.account_id}" data-link class="card card-interactive block animate-slide-up">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-4 min-w-0 flex-1">
                                    <div class="transaction-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="transaction-merchant">${acc.institution_name}</p>
                                        <p class="transaction-category capitalize">${acc.account_type.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <div class="text-right flex-shrink-0 ml-4">
                                    <p class="transaction-amount tabular-nums">${formatCurrency(acc.balances.available_balance_paise)}</p>
                                </div>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </main>
        `;
    } catch (error) {
        return `
            <main class="page">
                <div class="flex items-center justify-center h-full min-h-screen">
                    ${ErrorState({ title: 'Failed to load Accounts', description: error.message, onRetry: 'window.appInstance.route()' })}
                </div>
            </main>
        `;
    }
}
