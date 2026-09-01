/**
 * Financial Health Page (SCR-27) — Phase 7
 * Displays 4 canonical health components with evidence-backed drivers.
 * Uses non-judgmental language. No single mysterious score.
 */
import { ApiClient } from '../services/api.js';

function pct(val) {
    if (val == null) return '\u2014';
    return `${Math.round(Number(val) * 100)}%`;
}

function healthStatusBadge(status) {
    const map = {
        healthy: { cardCls: 'health-card-good',    badgeCls: 'badge-positive', label: 'Healthy' },
        on_track: { cardCls: 'health-card-good',   badgeCls: 'badge-positive', label: 'On Track' },
        stable: { cardCls: 'health-card-good',      badgeCls: 'badge-positive', label: 'Stable' },
        
        low: { cardCls: 'health-card-fair',         badgeCls: 'badge-warning',  label: 'Low' },
        moderate: { cardCls: 'health-card-fair',    badgeCls: 'badge-warning',  label: 'Moderate' },
        below: { cardCls: 'health-card-fair',       badgeCls: 'badge-warning',  label: 'Below Target' },
        variable: { cardCls: 'health-card-fair',    badgeCls: 'badge-warning',  label: 'Variable' },
        
        high: { cardCls: 'health-card-poor',        badgeCls: 'badge-negative', label: 'High' },
        critical: { cardCls: 'health-card-poor',    badgeCls: 'badge-negative', label: 'Critical' },
        volatile: { cardCls: 'health-card-poor',    badgeCls: 'badge-negative', label: 'Volatile' },
        
        no_goal: { cardCls: '',                      badgeCls: 'badge-dark',     label: 'No Goals Set' },
        unknown: { cardCls: '',                      badgeCls: 'badge-outline',  label: 'Unknown' },
    };
    const b = map[status] || map.unknown;
    return `<span class="badge ${b.badgeCls}">${b.label}</span>`;
}

function healthIcon(status) {
    if (['healthy','on_track','stable'].includes(status)) {
        return '<svg class="health-card-icon text-positive" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    }
    if (['low','moderate','below','variable'].includes(status)) {
        return '<svg class="health-card-icon text-warning" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    }
    if (['high','critical','volatile'].includes(status)) {
        return '<svg class="health-card-icon text-negative" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    }
    return '<svg class="health-card-icon text-tertiary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';
}

export async function FinancialHealthPage() {
    let health;
    try {
        health = await ApiClient.get('/financial-health');
    } catch (err) {
        if (err?.status === 401) return `<div class="page" role="alert"><p class="text-body text-secondary">Please sign in to view financial health.</p></div>`;
        if (!navigator.onLine) return `<div class="page" role="alert"><p class="text-body text-secondary">Offline — financial health data unavailable.</p></div>`;
        return `<div class="page" role="alert"><p class="text-body text-secondary">Unable to load financial health. Please try again.</p></div>`;
    }

    return `
    <div class="page animate-fade-in" aria-label="Financial Health Report">
        <header class="mb-10">
            <h1 class="text-h1">Financial Health</h1>
            <p class="text-body text-secondary mt-3">Insights based on your confirmed transaction history and plans.</p>
        </header>

        ${health.data_gaps?.length > 0 ? `
            <div class="card p-5 mb-8 animate-slide-up">
                <div class="flex gap-3 items-start">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-warning flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    <div>
                        <p class="text-body font-medium mb-2">More data needed for full insights:</p>
                        <ul class="text-caption text-secondary flex flex-col gap-1">
                            ${health.data_gaps.map(g => `<li>• ${g}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        ` : ''}

        <div class="grid grid-cols-2 gap-6">
            
            <!-- Cash Buffer -->
            <section class="health-card ${['healthy','on_track','stable'].includes(health.cash_buffer_status) ? 'health-card-good' : ['low','moderate','below','variable'].includes(health.cash_buffer_status) ? 'health-card-fair' : ['high','critical','volatile'].includes(health.cash_buffer_status) ? 'health-card-poor' : ''} animate-slide-up" aria-labelledby="hc-cash-buffer">
                <div class="health-card-header">
                    <div class="flex items-center gap-3">
                        ${healthIcon(health.cash_buffer_status)}
                        <h2 id="hc-cash-buffer" class="health-card-title">Cash Buffer</h2>
                    </div>
                    ${healthStatusBadge(health.cash_buffer_status)}
                </div>
                <div class="health-card-body">
                    <div class="health-card-score">
                        ${health.cash_buffer_months != null ? `${Number(health.cash_buffer_months).toFixed(1)} <span class="text-label text-secondary">months</span>` : '\u2014'}
                    </div>
                    <p class="text-caption text-secondary mt-3">${health.drivers?.cash_buffer?.reason || ''}</p>
                    <p class="text-caption text-tertiary mt-2">Usable cash divided by average monthly essential spending.</p>
                </div>
            </section>

            <!-- Commitment Load -->
            <section class="health-card ${['healthy','on_track','stable'].includes(health.commitment_load_status) ? 'health-card-good' : ['low','moderate','below','variable'].includes(health.commitment_load_status) ? 'health-card-fair' : ['high','critical','volatile'].includes(health.commitment_load_status) ? 'health-card-poor' : ''} animate-slide-up" aria-labelledby="hc-commit-load">
                <div class="health-card-header">
                    <div class="flex items-center gap-3">
                        ${healthIcon(health.commitment_load_status)}
                        <h2 id="hc-commit-load" class="health-card-title">Commitment Load</h2>
                    </div>
                    ${healthStatusBadge(health.commitment_load_status)}
                </div>
                <div class="health-card-body">
                    <div class="health-card-score">
                        ${pct(health.commitment_load_ratio)}
                    </div>
                    <p class="text-caption text-secondary mt-3">${health.drivers?.commitment_load?.reason || ''}</p>
                    <p class="text-caption text-tertiary mt-2">Confirmed monthly recurring expenses divided by confirmed monthly income.</p>
                </div>
            </section>

            <!-- Savings Pace -->
            <section class="health-card ${['healthy','on_track','stable'].includes(health.savings_pace_status) ? 'health-card-good' : ['low','moderate','below','variable'].includes(health.savings_pace_status) ? 'health-card-fair' : ['high','critical','volatile'].includes(health.savings_pace_status) ? 'health-card-poor' : ''} animate-slide-up" aria-labelledby="hc-savings-pace">
                <div class="health-card-header">
                    <div class="flex items-center gap-3">
                        ${healthIcon(health.savings_pace_status)}
                        <h2 id="hc-savings-pace" class="health-card-title">Savings Pace</h2>
                    </div>
                    ${healthStatusBadge(health.savings_pace_status)}
                </div>
                <div class="health-card-body">
                    <div class="health-card-score">
                        ${pct(health.savings_pace_ratio)}
                    </div>
                    <p class="text-caption text-secondary mt-3">${health.drivers?.savings_pace?.reason || ''}</p>
                    <p class="text-caption text-tertiary mt-2">Recent goal contributions compared to your target monthly pace.</p>
                </div>
            </section>

            <!-- Spending Stability -->
            <section class="health-card ${['healthy','on_track','stable'].includes(health.spending_stability_status) ? 'health-card-good' : ['low','moderate','below','variable'].includes(health.spending_stability_status) ? 'health-card-fair' : ['high','critical','volatile'].includes(health.spending_stability_status) ? 'health-card-poor' : ''} animate-slide-up" aria-labelledby="hc-spend-stab">
                <div class="health-card-header">
                    <div class="flex items-center gap-3">
                        ${healthIcon(health.spending_stability_status)}
                        <h2 id="hc-spend-stab" class="health-card-title">Spending Stability</h2>
                    </div>
                    ${healthStatusBadge(health.spending_stability_status)}
                </div>
                <div class="health-card-body">
                    <div class="health-card-score">
                        ${health.spending_stability_cv != null ? `CV ${Number(health.spending_stability_cv).toFixed(2)}` : '\u2014'}
                    </div>
                    <p class="text-caption text-secondary mt-3">${health.drivers?.spending_stability?.reason || ''}</p>
                    <p class="text-caption text-tertiary mt-2">Measures how much your weekly spending varies (Coefficient of Variation).</p>
                </div>
            </section>

        </div>
    </div>`;
}

export function FinancialHealthPageAfterRender() {
    // No interactive elements on this page yet
}
