import { ApiClient } from '../services/api.js';
import { Card, SectionHeader, ErrorState, EmptyState } from '../components/ui.js';

function formatCurrency(paise) {
    if (paise == null) return '\u2014';
    return (Number(paise) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

export async function CashflowPage() {
    return renderCashflowContent('30d');
}

async function renderCashflowContent(period = '30d') {
    let data;
    try {
        data = await ApiClient.get(`/financial/cashflow?period=${period}`);
    } catch (err) {
        return `
            <div class="page flex items-center justify-center">
                ${ErrorState({ title: 'Failed to load Cashflow Plan', description: err.message, onRetry: 'window.appInstance.route()' })}
            </div>
        `;
    }

    const netPaise = Number(data.projected_net_paise || 0);

    return `
        <div class="page animate-fade-in">
            <header class="flex gap-4 items-center mb-10">
                <button onclick="window.history.back();" class="btn btn-icon" aria-label="Back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                </button>
                <h1 class="text-h1">Cashflow Plan</h1>
            </header>

            <nav class="tabs mb-10" role="tablist">
                ${['7d','30d','90d'].map(p => `
                    <button class="tabs-item ${p === period ? 'tabs-item-active' : ''}"
                            role="tab"
                            aria-selected="${p === period}"
                            data-period="${p}"
                            aria-label="${p} plan">${p}</button>
                `).join('')}
            </nav>

            <div class="card card-hero p-8 text-center mb-10 animate-slide-up">
                <p class="text-label text-secondary mb-3">Projected Balance (in ${period})</p>
                <p class="text-display ${netPaise >= 0 ? 'text-positive' : 'text-negative'} mb-3">${formatCurrency(netPaise)}</p>
                <p class="text-caption text-secondary">${data.projection_label}</p>
            </div>

            <section class="mb-10 animate-slide-up">
                <div class="section-header">
                    <h2 class="section-header-title">Breakdown</h2>
                </div>
                <div class="card">
                    <div class="cashflow-table">
                        <div class="cashflow-table-header">
                            <span class="text-body">Current Usable Cash</span>
                            <span class="text-body font-medium">${formatCurrency(data.current_balance_paise)}</span>
                        </div>

                        <div class="cashflow-table-row">
                            <span class="text-body text-positive">+ Known Income</span>
                            <span class="text-body text-positive font-medium">${formatCurrency(data.confirmed_income_paise)}</span>
                        </div>
                        <div class="px-4 py-2">
                            <span class="text-caption text-tertiary">Confirmed recurring credits (${data.income_sources?.series_count || 0} sources)</span>
                        </div>

                        <div class="separator"></div>

                        <div class="cashflow-table-row">
                            <span class="text-body text-negative">- Known Expenses</span>
                            <span class="text-body text-negative font-medium">${formatCurrency(data.total_known_expense_paise)}</span>
                        </div>
                        <div class="flex flex-col gap-2 px-4 py-2">
                            <div class="flex justify-between items-center">
                                <span class="text-caption text-tertiary">Confirmed recurring series</span>
                                <span class="text-caption text-secondary">${formatCurrency(data.expense_breakdown?.confirmed_recurring_paise)}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-caption text-tertiary">Additional commitments</span>
                                <span class="text-caption text-secondary">${formatCurrency(data.expense_breakdown?.additional_commitments_paise)}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-caption text-tertiary">Planned goal contributions</span>
                                <span class="text-caption text-secondary">${formatCurrency(data.expense_breakdown?.goal_contributions_paise)}</span>
                            </div>
                        </div>

                        <div class="separator"></div>

                        <div class="cashflow-table-footer">
                            <span class="text-body font-medium">Projected Net</span>
                            <span class="text-metric ${netPaise >= 0 ? 'text-positive' : 'text-negative'}">${formatCurrency(netPaise)}</span>
                        </div>
                    </div>
                </div>
            </section>

            ${data.data_gaps?.length > 0 ? `
                <div class="card p-5 mb-6">
                    <div class="flex gap-3 items-start">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-warning flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <div>
                            <p class="text-body font-medium mb-1">Notice</p>
                            <p class="text-caption text-secondary">${data.data_gaps.join('; ')}</p>
                        </div>
                    </div>
                </div>
            ` : ''}

            <p class="text-caption text-tertiary text-center">${data.coverage_note}</p>
        </div>
    `;
}

export function CashflowPageAfterRender() {
    document.querySelectorAll('[data-period]').forEach(tab => {
        tab.addEventListener('click', async () => {
            const p = tab.dataset.period;
            const app = document.getElementById('app');
            if (app) {
                app.innerHTML = `
                    <div class="page flex justify-center items-center">
                        <span class="spinner" style="width: 2rem; height: 2rem; border-width: 3px;"></span>
                    </div>
                `;
                app.innerHTML = await renderCashflowContent(p);
                CashflowPageAfterRender();
            }
        });
    });
}
