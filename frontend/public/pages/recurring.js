import { ApiClient } from '../services/api.js';
import { Card, MetricCard, SectionHeader, Badge, Button, ErrorState, EmptyState } from '../components/ui.js';

function formatCurrency(paise) {
    if (paise == null) return '\u2014';
    return (Number(paise) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

function confidenceBar(confidence) {
    const pct = Math.round((confidence || 0) * 100);
    let fillCls = 'text-warning';
    if (pct >= 80) fillCls = 'text-positive';
    else if (pct >= 50) fillCls = 'text-primary';
    return `
        <div class="mt-4">
            <div class="flex justify-between items-center mb-2">
                <span class="text-label text-secondary">Confidence</span>
                <span class="text-caption font-medium">${pct}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-bar-fill ${pct >= 80 ? 'progress-bar-positive' : ''}" style="width:${pct}%"></div>
            </div>
        </div>
    `;
}

function evidenceBadge(evidenceState) {
    const map = {
        USER_CONFIRMED: { variant: 'positive', label: 'You Confirmed' },
        OBSERVED:       { variant: 'neutral',  label: 'Detected' },
        INFERRED:       { variant: 'warning',  label: 'Candidate' },
    };
    const b = map[evidenceState] || { variant: 'neutral', label: evidenceState };
    return Badge({ label: b.label, variant: b.variant });
}

function statusBadge(status) {
    const map = {
        detected:   { variant: 'warning', label: 'Candidate' },
        reviewable: { variant: 'warning', label: 'Needs Review' },
        confirmed:  { variant: 'positive', label: 'Confirmed' },
        active:     { variant: 'positive', label: 'Active' },
        paused:     { variant: 'neutral', label: 'Paused' },
        ended:      { variant: 'neutral', label: 'Ended' },
        dismissed:  { variant: 'negative', label: 'Dismissed' },
    };
    const b = map[status] || { variant: 'neutral', label: status };
    return Badge({ label: b.label, variant: b.variant });
}

function renderControls(series) {
    const canConfirm  = ['detected','reviewable'].includes(series.status);
    const canDismiss  = ['detected','reviewable','confirmed','active'].includes(series.status);
    const canPause    = series.status === 'active';
    const canResume   = series.status === 'paused';
    const canEnd      = ['confirmed','active','paused'].includes(series.status);

    const buttons = [];
    if (canConfirm) buttons.push(`<button class="btn btn-primary btn-sm flex-1" data-action="confirm" data-id="${series.series_id}">Confirm</button>`);
    if (canPause)   buttons.push(`<button class="btn btn-secondary btn-sm flex-1" data-action="pause" data-id="${series.series_id}">Pause</button>`);
    if (canResume)  buttons.push(`<button class="btn btn-secondary btn-sm flex-1" data-action="resume" data-id="${series.series_id}">Resume</button>`);
    if (canEnd)     buttons.push(`<button class="btn btn-ghost btn-sm flex-1" data-action="end" data-id="${series.series_id}">End</button>`);
    if (canDismiss) buttons.push(`<button class="btn btn-ghost btn-sm flex-1 text-negative" data-action="dismiss" data-id="${series.series_id}">Dismiss</button>`);

    return buttons.length ? `<div class="flex gap-2 mt-6 pt-6 separator-t">${buttons.join('')}</div>` : '';
}

function renderSeriesCard(series) {
    return `
        <div class="recurring-card card animate-slide-up ${series.status === 'dismissed' ? 'opacity-50' : ''}" data-series-id="${series.series_id}">
            <div class="recurring-card-header">
                <div>
                    <h3 class="text-h3 mb-1">${series.series_name}</h3>
                    <p class="text-caption text-secondary capitalize">${series.frequency}</p>
                </div>
                <div class="flex flex-col gap-2 items-end">
                    ${evidenceBadge(series.evidence_state)}
                    ${statusBadge(series.status)}
                </div>
            </div>

            <div class="recurring-card-body">
                <div class="bg-surface-elevated p-4 flex gap-6">
                    <div class="flex-1">
                        <span class="text-label text-secondary block mb-1">Typical</span>
                        <span class="text-body font-medium">${formatCurrency(series.typical_amount_paise)}</span>
                        ${series.amount_type !== 'fixed' ? `<span class="text-caption text-secondary ml-1">(${series.amount_type})</span>` : ''}
                    </div>
                    <div class="flex-1">
                        <span class="text-label text-secondary block mb-1">Monthly Eq.</span>
                        <span class="text-body font-medium">${formatCurrency(series.monthly_equivalent_paise)}</span>
                    </div>
                </div>
            </div>

            <div class="recurring-card-amounts">
                <span class="text-caption text-secondary">Annual: ${formatCurrency(series.annualized_equivalent_paise)}</span>
                ${series.next_expected_at ? `<span class="text-caption text-primary font-medium">Next: ${new Date(series.next_expected_at).toLocaleDateString()}</span>` : ''}
            </div>

            ${series.confidence != null ? confidenceBar(series.confidence) : ''}

            ${renderControls(series)}
        </div>
    `;
}

async function handleRecurringAction(seriesId, action) {
    try {
        await ApiClient.patch(`/recurring/${seriesId}`, { action });
        window.appInstance.route();
    } catch (err) {
        const { Toast } = await import('./error-states.js'); Toast({ message: 'Action failed: ' + (err.message || 'Unknown error'), type: 'error' });
    }
}

function attachRecurringListeners() {
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            const id = btn.dataset.id;

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span>';

            await handleRecurringAction(id, action);
        });
    });
}

export async function RecurringPage() {
    let seriesData, summaryData;

    try {
        [seriesData, summaryData] = await Promise.all([
            ApiClient.get('/recurring'),
            ApiClient.get('/recurring/summary')
        ]);
    } catch (err) {
        return `
            <div class="page flex items-center justify-center">
                ${ErrorState({ title: 'Failed to load Recurring', description: err.message, onRetry: 'window.appInstance.route()' })}
            </div>
        `;
    }

    const series = seriesData?.recurring || [];
    const candidates = series.filter(s => s.status === 'detected');
    const confirmed  = series.filter(s => ['confirmed','active'].includes(s.status));
    const others     = series.filter(s => !['detected','confirmed','active'].includes(s.status));

    return `
        <div class="page animate-fade-in">
            <header class="flex gap-4 items-center justify-between mb-10">
                <div class="flex gap-4 items-center">
                    <button onclick="window.history.back();" class="btn btn-icon" aria-label="Back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    </button>
                    <h1 class="text-h1">Recurring</h1>
                </div>
                ${Button({ label: 'Detect Patterns', variant: 'secondary', id: 'detect-btn' })}
            </header>

            <section class="mb-10 animate-slide-up">
                <div class="section-header">
                    <h2 class="section-header-title">Burden Summary</h2>
                </div>
                <div class="grid grid-cols-3 gap-4">
                    ${MetricCard({ title: 'Monthly Burden', amount: formatCurrency(summaryData?.monthly_total_paise) })}
                    ${MetricCard({ title: 'Annual Equivalent', amount: formatCurrency(summaryData?.annualized_total_paise) })}
                    <div class="card metric-card">
                        <div class="metric-label">Confirmed Series</div>
                        <div class="metric-value">${summaryData?.series_count ?? '\u2014'}</div>
                    </div>
                </div>
            </section>

            ${candidates.length > 0 ? `
                <section class="mb-10 animate-slide-up">
                    <div class="section-header">
                        <h2 class="section-header-title">Needs Review (${candidates.length})</h2>
                    </div>
                    <p class="text-caption text-secondary mb-6">These patterns were detected from your transactions. Confirm to include in your plan.</p>
                    <div class="grid grid-cols-2 gap-4">
                        ${candidates.map(renderSeriesCard).join('')}
                    </div>
                </section>
            ` : ''}

            ${confirmed.length > 0 ? `
                <section class="mb-10 animate-slide-up">
                    <div class="section-header">
                        <h2 class="section-header-title">Active & Confirmed (${confirmed.length})</h2>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        ${confirmed.map(renderSeriesCard).join('')}
                    </div>
                </section>
            ` : ''}

            ${others.length > 0 ? `
                <section class="mb-10 animate-slide-up">
                    <div class="section-header">
                        <h2 class="section-header-title">Past / Inactive (${others.length})</h2>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        ${others.map(renderSeriesCard).join('')}
                    </div>
                </section>
            ` : ''}

            ${series.length === 0 ? `
                <div class="empty-state">
                    <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <h3 class="empty-state-title">No recurring patterns</h3>
                    <p class="empty-state-description">Import more transaction history and run detection.</p>
                </div>
            ` : ''}
        </div>
    `;
}

export function RecurringPageAfterRender() {
    const detectBtn = document.getElementById('detect-btn');
    if (detectBtn) {
        detectBtn.addEventListener('click', async () => {
            detectBtn.disabled = true;
            detectBtn.innerHTML = '<span class="spinner"></span> Detecting\u2026';
            try {
                await ApiClient.post('/recurring/detect', {});
                window.appInstance.route();
            } catch (err) {
                const { Toast } = await import('./error-states.js'); Toast({ message: 'Detection failed: ' + (err.message || 'Unknown error'), type: 'error' });
                detectBtn.disabled = false;
                detectBtn.textContent = 'Detect Patterns';
            }
        });
    }
    attachRecurringListeners();
}
