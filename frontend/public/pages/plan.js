import { ApiClient } from '../services/api.js';
import { Card, SectionHeader, Badge, ErrorState, Button } from '../components/ui.js';

function formatCurrency(paise) {
    if (paise == null || Number.isNaN(Number(paise))) return '\u2014';
    return (Number(paise) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

function pct(val) {
    if (val == null) return '\u2014';
    return `${Math.round(Number(val) * 100)}%`;
}

function healthBadge(status) {
    const map = {
        healthy: { cls: 'positive', label: 'Healthy' },
        on_track: { cls: 'positive', label: 'On Track' },
        low: { cls: 'warning', label: 'Low' },
        moderate: { cls: 'warning', label: 'Moderate' },
        below: { cls: 'warning', label: 'Below Target' },
        high: { cls: 'negative', label: 'High' },
        critical: { cls: 'negative', label: 'Critical' },
        volatile: { cls: 'negative', label: 'Volatile' },
        variable: { cls: 'warning', label: 'Variable' },
        stable: { cls: 'positive', label: 'Stable' },
        no_goal: { cls: 'neutral', label: 'No Goals Set' },
        unknown: { cls: 'neutral', label: 'Unknown' },
    };
    const b = map[status] || map.unknown;
    return Badge({ label: b.label, variant: b.cls });
}

function renderHealthPanel(health) {
    if (health?.error) return `<p class="text-caption text-secondary">Financial health data unavailable.</p>`;

    return `
        <div class="grid grid-cols-2 gap-4 animate-fade-in">
            <div class="card p-5">
                <p class="text-label text-secondary mb-2">Cash Buffer</p>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-h2">${health.cash_buffer_months != null ? `${Number(health.cash_buffer_months).toFixed(1)} mo` : '\u2014'}</span>
                    ${healthBadge(health.cash_buffer_status)}
                </div>
                <p class="text-caption text-tertiary">${health.drivers?.cash_buffer?.reason || ''}</p>
            </div>

            <div class="card p-5">
                <p class="text-label text-secondary mb-2">Commitment Load</p>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-h2">${pct(health.commitment_load_ratio)}</span>
                    ${healthBadge(health.commitment_load_status)}
                </div>
                <p class="text-caption text-tertiary">${health.drivers?.commitment_load?.reason || ''}</p>
            </div>

            <div class="card p-5">
                <p class="text-label text-secondary mb-2">Savings Pace</p>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-h2">${pct(health.savings_pace_ratio)}</span>
                    ${healthBadge(health.savings_pace_status)}
                </div>
                <p class="text-caption text-tertiary">${health.drivers?.savings_pace?.reason || ''}</p>
            </div>

            <div class="card p-5">
                <p class="text-label text-secondary mb-2">Spending Stability</p>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-h2">${health.spending_stability_cv != null ? `CV ${Number(health.spending_stability_cv).toFixed(2)}` : '\u2014'}</span>
                    ${healthBadge(health.spending_stability_status)}
                </div>
                <p class="text-caption text-tertiary">${health.drivers?.spending_stability?.reason || ''}</p>
            </div>
        </div>
        ${health.data_gaps?.length ? `<p class="text-caption text-warning mt-4">Data gaps: ${health.data_gaps.join('; ')}</p>` : ''}
    `;
}

function renderGoalsSummary(goalsData) {
    if (goalsData?.error) return `<p class="text-caption text-secondary">Goals unavailable.</p>`;

    const goals = goalsData?.goals || [];
    if (goals.length === 0) {
        return `
            <div class="card card-flat p-6 flex flex-col items-center text-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-tertiary mb-4"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                <p class="text-body text-secondary mb-4">No goals set yet.</p>
                ${Button({ label: 'Set a Goal', variant: 'secondary', onClick: "window.fcNavigateTo('/goals')" })}
            </div>
        `;
    }

    return `
        <div class="flex flex-col gap-3 animate-fade-in">
            ${goals.slice(0, 3).map(g => {
                const prog = g.pace?.progress_pct ?? 0;
                return `
                    <a href="/goal-detail/${g.goal_id}" data-link class="goal-card card card-interactive animate-slide-up">
                        <div class="goal-card-header">
                            <span class="goal-card-name">${g.name}</span>
                            <span class="text-metric ${prog >= 100 ? 'text-positive' : 'text-primary'}">${prog}%</span>
                        </div>
                        <div class="goal-card-progress">
                            <div class="progress-bar">
                                <div class="progress-bar-fill ${prog >= 100 ? 'progress-bar-positive' : ''}" style="width:${Math.min(100, prog)}%"></div>
                            </div>
                        </div>
                        <div class="goal-card-amounts">
                            <span class="text-body">${formatCurrency(g.current_amount_paise)}</span>
                            <span class="text-caption text-secondary">of ${formatCurrency(g.target_amount_paise)}</span>
                        </div>
                    </a>
                `;
            }).join('')}
        </div>
    `;
}

function renderUpcomingSummary(upcoming) {
    if (upcoming?.error) return `<p class="text-caption text-secondary">Upcoming data unavailable.</p>`;
    const items = (upcoming?.items || []).filter(i => ['EXPECTED','DUE','OVERDUE'].includes(i.status)).slice(0, 4);

    if (items.length === 0) {
        return `<p class="text-caption text-secondary">No upcoming commitments in the next 30 days.</p>`;
    }

    return `
        <div class="card animate-fade-in">
            <div class="flex flex-col">
                ${items.map((i, idx) => {
                    let badgeVar = 'neutral';
                    if (i.status === 'OVERDUE') badgeVar = 'negative';
                    else if (i.status === 'DUE') badgeVar = 'warning';

                    return `
                        <a href="/upcoming" data-link class="upcoming-item ${idx !== items.length - 1 ? '' : ''}">
                            <div class="upcoming-item-content">
                                <div class="upcoming-item-name">${i.name}</div>
                                <div class="upcoming-item-date">${i.expected_date || '\u2014'}</div>
                            </div>
                            <div class="upcoming-item-amount">
                                <span class="text-body">${i.amount_paise != null ? formatCurrency(i.amount_paise) : '\u2014'}</span>
                                ${Badge({ label: i.status, variant: badgeVar })}
                            </div>
                        </a>
                        ${idx !== items.length - 1 ? '<div class="separator"></div>' : ''}
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderCashflowSummary(cashflow) {
    if (cashflow?.error) return `<p class="text-caption text-secondary">Cashflow data unavailable.</p>`;
    const net = Number(cashflow.projected_net_paise || 0);
    return `
        <div class="card p-5 animate-fade-in">
            <div class="cashflow-table">
                <div class="cashflow-table-header">
                    <span class="text-caption text-secondary">Confirmed Income</span>
                    <span class="text-body text-positive">${formatCurrency(cashflow.confirmed_income_paise)}</span>
                </div>
                <div class="cashflow-table-row">
                    <span class="text-caption text-secondary">Known Expenses</span>
                    <span class="text-body text-negative">${formatCurrency(cashflow.total_known_expense_paise)}</span>
                </div>
                <div class="separator"></div>
                <div class="cashflow-table-footer">
                    <span class="text-body">Projected Net</span>
                    <span class="text-metric ${net >= 0 ? 'text-positive' : 'text-negative'}">${formatCurrency(cashflow.projected_net_paise)}</span>
                </div>
            </div>
            <p class="text-caption text-tertiary mt-4">${cashflow.projection_label || ''}</p>
        </div>
    `;
}

export async function PlanPage() {
    try {
        const planData = await ApiClient.get('/plan');

        return `
            <div class="page animate-fade-in">
                <header class="flex justify-between items-end mb-10">
                    <h1 class="text-h1">Plan</h1>
                    <span class="text-caption text-secondary">Updated ${new Date(planData.as_of).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </header>

                <section class="mb-10 animate-slide-up">
                    <div class="section-header">
                        <h2 class="section-header-title">Financial Health</h2>
                        <a href="/financial-health" data-link class="section-header-action text-primary">See Details
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-block ml-1"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </a>
                    </div>
                    ${renderHealthPanel(planData.health)}
                </section>

                <section class="mb-10 animate-slide-up">
                    <div class="section-header">
                        <h2 class="section-header-title">Goals</h2>
                        <a href="/goals" data-link class="section-header-action text-primary">Manage
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-block ml-1"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </a>
                    </div>
                    ${renderGoalsSummary(planData.goals)}
                </section>

                <section class="mb-10 animate-slide-up">
                    <div class="section-header">
                        <h2 class="section-header-title">Upcoming (30 days)</h2>
                        <a href="/upcoming" data-link class="section-header-action text-primary">See All
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-block ml-1"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </a>
                    </div>
                    ${renderUpcomingSummary(planData.upcoming)}
                </section>

                <section class="mb-10 animate-slide-up">
                    <div class="section-header">
                        <h2 class="section-header-title">Cashflow (30 days)</h2>
                        <a href="/cashflow" data-link class="section-header-action text-primary">Details
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-block ml-1"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </a>
                    </div>
                    ${renderCashflowSummary(planData.cashflow)}
                </section>
            </div>
        `;
    } catch (error) {
        return `
            <div class="page flex items-center justify-center">
                ${ErrorState({ title: 'Failed to load Plan', description: error.message, onRetry: 'window.appInstance.route()' })}
            </div>
        `;
    }
}
