import { ApiClient } from '../services/api.js';
import { Card, SectionHeader, Button, ErrorState } from '../components/ui.js';

export async function TransactionDetailPage(txId) {
    // Make global for inline event handlers since we don't use a framework
    window.toggleCorrectionForm = (event) => {
        event.preventDefault();
        const form = document.getElementById('correction-form');
        const btn = document.getElementById('correct-btn');
        if (form.classList.contains('d-none')) {
            form.classList.remove('d-none');
            btn.classList.add('d-none');
        }
    };

    window.updateTransaction = async (event, id) => {
        event.preventDefault();
        const form = event.target;
        const newCategory = form.querySelector('[name="category"]').value;
        const newMerchant = form.querySelector('[name="merchant_name"]').value;
        const isSubscription = form.querySelector('[name="is_subscription"]').checked;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        try {
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
            
            await ApiClient.put(`/transactions/${id}`, { 
                category: newCategory,
                merchant_name: newMerchant,
                is_subscription: isSubscription
            });
            
            window.appInstance.route();
        } catch(error) {
            const { Toast } = await import('./error-states.js'); Toast({ message: 'Failed to update: ' + error.message, type: 'error' });
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.textContent = 'Save Correction';
        }
    };

    try {
        const tx = await ApiClient.get(`/transactions/${txId}`);
        const formatCurrency = (paise) => (paise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
        
        const isCredit = tx.direction === 'credit';
        
        return `
            <main class="page page-narrow">
                <header class="mb-8 animate-fade-in">
                    <div class="flex items-center gap-3">
                        <button onclick="window.history.back();" class="btn btn-icon btn-ghost" aria-label="Back">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <h1 class="text-h1">Transaction Detail</h1>
                    </div>
                </header>

                <article class="card card-hero mb-6 animate-slide-up">
                    <p class="text-caption mb-3">${new Date(tx.observed_at).toLocaleString()}</p>
                    <h2 class="text-metric ${isCredit ? 'text-positive' : ''}">
                        ${isCredit ? '+' : '-'}${formatCurrency(tx.amount_paise)}
                    </h2>
                    
                    <div class="grid grid-cols-2 gap-6 mt-8 pt-6" style="border-top:1px solid var(--color-border-subtle)">
                        <div>
                            <p class="text-label mb-2">Merchant</p>
                            <p class="text-body text-primary font-medium">${tx.merchant_normalized || tx.description || 'Unknown'}</p>
                        </div>
                        <div>
                            <p class="text-label mb-2">Category</p>
                            <p class="text-body text-primary font-medium capitalize">${(tx.transaction_type || 'Uncategorized').replace('_', ' ')}</p>
                        </div>
                        <div>
                            <p class="text-label mb-2">Status</p>
                            <p class="text-body text-primary font-medium capitalize">${tx.posting_status}</p>
                        </div>
                        <div>
                            <p class="text-label mb-2">Subscription</p>
                            <p class="text-body text-primary font-medium">${tx.is_subscription ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </article>

                <section class="mb-6 animate-slide-up" style="animation-delay:80ms" id="correction-section">
                    <div id="correct-btn">
                        ${Button({ label: 'Correct this transaction', variant: 'secondary', onClick: 'window.toggleCorrectionForm(event)' })}
                    </div>
                    
                    <div id="correction-form" class="card mt-4 d-none" style="border-color:var(--color-border-strong);background:var(--color-surface-elevated)">
                        <h3 class="text-h3 mb-6">Correction Form</h3>
                        <form onsubmit="window.updateTransaction(event, '${tx.transaction_id}')" class="flex flex-col gap-5">
                            <div class="input-wrapper">
                                <label class="input-label">Merchant Name</label>
                                <input type="text" name="merchant_name" value="${tx.merchant_normalized || ''}" class="input">
                            </div>
                            
                            <div class="input-wrapper">
                                <label class="input-label">Category</label>
                                <select name="category" class="select">
                                    <option value="expense" ${tx.transaction_type === 'expense' ? 'selected' : ''}>Expense</option>
                                    <option value="income" ${tx.transaction_type === 'income' ? 'selected' : ''}>Income</option>
                                    <option value="transfer_in" ${tx.transaction_type === 'transfer_in' ? 'selected' : ''}>Transfer In</option>
                                    <option value="transfer_out" ${tx.transaction_type === 'transfer_out' ? 'selected' : ''}>Transfer Out</option>
                                </select>
                            </div>
                            
                            <label class="toggle">
                                <input type="checkbox" name="is_subscription" ${tx.is_subscription ? 'checked' : ''}>
                                <div class="toggle-track"><div class="toggle-thumb"></div></div>
                                <span class="toggle-label">Mark as Subscription</span>
                            </label>
                            
                            <div class="flex gap-3 mt-2">
                                <button type="submit" class="btn btn-primary flex-1">Save Correction</button>
                                <button type="button" class="btn btn-ghost" onclick="document.getElementById('correction-form').classList.add('d-none'); document.getElementById('correct-btn').classList.remove('d-none');">Cancel</button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        `;
    } catch (error) {
        return `
            <main class="page">
                <div class="flex items-center justify-center h-full min-h-screen">
                    ${ErrorState({ title: 'Failed to load Transaction', description: error.message, onRetry: 'window.appInstance.route()' })}
                </div>
            </main>
        `;
    }
}
