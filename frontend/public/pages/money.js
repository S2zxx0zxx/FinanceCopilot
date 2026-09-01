import { ApiClient } from '../services/api.js';
import { Card, MetricCard, SectionHeader, Badge, ErrorState } from '../components/ui.js';

export async function MoneyPage() {
    try {
        const [moneyData, accountsData] = await Promise.all([
            ApiClient.get('/financial-state/money'),
            ApiClient.get('/accounts')
        ]);
        
        const formatCurrency = (paise) => (paise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
        
        const netPositionRupees = formatCurrency(moneyData.net_position.available_balance_paise);
        const postedRupees = formatCurrency(moneyData.net_position.posted_balance_paise);
        const pendingRupees = formatCurrency(moneyData.net_position.pending_balance_paise);

        const isFullySynced = moneyData.coverage.synced_accounts >= moneyData.coverage.total_accounts;

        const overviewSection = `
            <section class="mb-8 animate-fade-in">
                ${MetricCard({
                    title: 'Total Net Position',
                    amount: netPositionRupees,
                    badge: Badge({ label: `${moneyData.coverage.synced_accounts}/${moneyData.coverage.total_accounts} Synced`, variant: isFullySynced ? 'positive' : 'warning' }),
                    subtitle: `Posted: ${postedRupees} | Pending: ${pendingRupees}`
                })}
            </section>
        `;

        const accountsListSection = `
            <section class="mb-8 animate-slide-up" style="animation-delay:80ms">
                ${SectionHeader({ 
                    title: 'Connected Accounts', 
                    action: `<span class="text-caption">${accountsData.accounts.length} Total</span>` 
                })}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${accountsData.accounts.map(acc => {
                        const balance = formatCurrency(acc.balances.available_balance_paise);
                        return `
                            <a href="/accounts/${acc.account_id}" data-link class="card card-interactive block">
                                <div class="card-header">
                                    <div>
                                        <p class="card-title">${acc.institution_name}</p>
                                        <p class="card-subtitle capitalize">${acc.account_type.replace('_', ' ')} •••• ${acc.account_number_last4 || '****'}</p>
                                    </div>
                                </div>
                                <div class="flex justify-between items-end">
                                    <p class="text-h3 tabular-nums">${balance}</p>
                                    <p class="text-caption">Available</p>
                                </div>
                                <div class="card-footer">
                                    <span class="text-caption">Last synced: ${new Date(acc.last_synced_at).toLocaleDateString()}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </div>
                            </a>
                        `;
                    }).join('')}
                    ${accountsData.accounts.length === 0 ? `
                        <div class="col-span-full">
                            <div class="empty-state">
                                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                <h3 class="empty-state-title">No accounts yet</h3>
                                <p class="empty-state-description">Connect a bank account to get started.</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </section>
        `;

        const linksSection = `
            <section class="animate-slide-up" style="animation-delay:160ms">
                <a href="/transactions" data-link class="card card-interactive block">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="card-title">All Transactions</p>
                            <p class="card-subtitle">View and correct your transactions</p>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                </a>
            </section>
        `;

        return `
            <main class="page">
                <header class="mb-8 animate-fade-in">
                    <h1 class="text-h1">Money</h1>
                </header>
                ${overviewSection}
                ${accountsListSection}
                ${linksSection}
            </main>
        `;
    } catch (error) {
        return `
            <main class="page">
                <div class="flex items-center justify-center h-full min-h-screen">
                    ${ErrorState({ title: 'Failed to load Money view', description: error.message, onRetry: 'window.appInstance.route()' })}
                </div>
            </main>
        `;
    }
}
