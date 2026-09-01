/**
 * Upcoming Page (SCR-20) — Phase 7
 * 7/30/90-day timeline of upcoming committed payments.
 * Every event shows: What, When, How much, Why, Certainty (§39).
 * States: EXPECTED, DUE, OVERDUE, PAID, CANCELLED, UNKNOWN (§17).
 */
import { ApiClient } from '../services/api.js';

function formatCurrency(paise) {
    if (paise == null) return '—';
    return (Number(paise) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

const STATUS_CONFIG = {
    OVERDUE:   { badgeCls: 'badge-negative',  label: 'Overdue' },
    DUE:       { badgeCls: 'badge-warning',  label: 'Due Today' },
    EXPECTED:  { badgeCls: 'badge-outline',  label: 'Expected' },
    PAID:      { badgeCls: 'badge-positive', label: 'Paid' },
    CANCELLED: { badgeCls: 'badge-dark',     label: 'Cancelled' },
    UNKNOWN:   { badgeCls: 'badge-dark',     label: 'Unknown' },
};

const EVIDENCE_LABEL = {
    user_confirmed:    'You set this',
    confirmed_recurring: 'From confirmed recurring',
    inferred_candidate: 'Inferred — not yet confirmed',
    system:            'System generated',
};

function statusIcon(status) {
    if (status === 'OVERDUE') return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    if (status === 'DUE') return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    if (status === 'PAID') return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    if (status === 'EXPECTED') return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';
}

function renderItem(item) {
    const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG.UNKNOWN;
    const evidenceLabel = EVIDENCE_LABEL[item.source_type] || item.source_type || 'Unknown source';
    const confidencePct = Math.round((item.confidence || 1) * 100);

    return `
    <li class="upcoming-item animate-slide-up" data-item-id="${item.item_id}"
        aria-label="${item.name}: ${item.amount_paise != null ? formatCurrency(item.amount_paise) : '—'} ${item.status} on ${item.expected_date || 'unknown date'}">
        <div class="upcoming-item-date">
            ${statusIcon(item.status)}
        </div>
        <div class="upcoming-item-content">
            <div class="flex justify-between items-center">
                <span class="upcoming-item-name">${item.name}</span>
                <span class="upcoming-item-amount">${item.amount_paise != null ? formatCurrency(item.amount_paise) : 'Amount unknown'}</span>
            </div>
            <div class="flex justify-between items-center mt-2">
                <span class="text-caption text-secondary">${item.expected_date || '—'}</span>
                <span class="badge ${sc.badgeCls}">${sc.label}</span>
            </div>
            <div class="mt-2">
                <span class="text-caption text-tertiary">Why is this here?</span>
                <span class="text-caption text-secondary ml-2">${evidenceLabel}</span>
                ${item.source_type === 'inferred_candidate'
                    ? `<p class="text-caption text-warning mt-1">Candidate — confirm recurring pattern to solidify</p>`
                    : ''}
                ${confidencePct < 100
                    ? `<span class="text-caption text-tertiary ml-2">${confidencePct}% certain</span>`
                    : ''}
            </div>
        </div>
    </li>`;
}

export async function UpcomingPage() {
    return renderUpcomingContent('30d');
}

async function renderUpcomingContent(horizon = '30d') {
    let data;
    try {
        data = await ApiClient.get(`/upcoming?horizon=${horizon}`);
    } catch (err) {
        if (err?.status === 401) return `<div class="page" role="alert"><p class="text-body text-secondary">Please sign in to view upcoming payments.</p></div>`;
        if (!navigator.onLine) return `<div class="page" role="alert"><p class="text-body text-secondary">Offline — upcoming data unavailable.</p></div>`;
        return `<div class="page" role="alert"><p class="text-body text-secondary">Unable to load upcoming payments. Please try again.</p></div>`;
    }

    const items = data?.items || [];
    const overdue  = items.filter(i => i.status === 'OVERDUE');
    const due      = items.filter(i => i.status === 'DUE');
    const expected = items.filter(i => i.status === 'EXPECTED');
    const paid     = items.filter(i => i.status === 'PAID');

    return `
    <div class="page animate-fade-in" aria-label="Upcoming payments">
        <header class="mb-10">
            <h1 class="text-h1">Upcoming</h1>
        </header>

        <nav class="tabs mb-8" role="tablist" aria-label="Time horizon">
            ${['7d','30d','90d'].map(h => `
            <button class="tabs-item ${h === horizon ? 'tabs-item-active' : ''}"
                    role="tab"
                    aria-selected="${h === horizon}"
                    data-horizon="${h}"
                    aria-label="Show ${h} view">${h}</button>`).join('')}
        </nav>

        <div class="grid grid-cols-3 gap-4 mb-8 animate-slide-up">
            <div class="card p-4 text-center">
                <p class="text-label text-secondary mb-1">Total Expected</p>
                <p class="text-metric">${formatCurrency(data.total_expected_paise)}</p>
            </div>
            <div class="card p-4 text-center">
                <p class="text-label text-secondary mb-1">Items</p>
                <p class="text-metric">${data.total_count}</p>
            </div>
            <div class="card p-4 text-center">
                <p class="text-label text-secondary mb-1">Period</p>
                <p class="text-body">${data.period_start} → ${data.period_end}</p>
            </div>
        </div>

        ${overdue.length > 0 ? `
        <section class="mb-8" aria-labelledby="overdue-heading">
            <h2 class="section-header-title text-negative mb-4" id="overdue-heading">Overdue (${overdue.length})</h2>
            <div class="card">${overdue.map(renderItem).join('<div class="separator"></div>')}</div>
        </section>` : ''}

        ${due.length > 0 ? `
        <section class="mb-8" aria-labelledby="due-heading">
            <h2 class="section-header-title mb-4" id="due-heading">Due Today (${due.length})</h2>
            <div class="card">${due.map(renderItem).join('<div class="separator"></div>')}</div>
        </section>` : ''}

        ${expected.length > 0 ? `
        <section class="mb-8" aria-labelledby="expected-heading">
            <h2 class="section-header-title mb-4" id="expected-heading">Expected (${expected.length})</h2>
            <div class="card">${expected.map(renderItem).join('<div class="separator"></div>')}</div>
        </section>` : ''}

        ${paid.length > 0 ? `
        <section class="mb-8" aria-labelledby="paid-heading">
            <h2 class="section-header-title mb-4" id="paid-heading">Paid (${paid.length})</h2>
            <div class="card">${paid.map(renderItem).join('<div class="separator"></div>')}</div>
        </section>` : ''}

        ${items.length === 0 ? `
        <div class="empty-state">
            <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h3 class="empty-state-title">No upcoming payments in this period.</h3>
            <p class="empty-state-description">Confirm recurring patterns to see upcoming payments here.</p>
            <div class="mt-6"><a href="/recurring" data-link class="btn btn-secondary">Review Recurring
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-block ml-1"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a></div>
        </div>` : ''}

        <p class="text-caption text-tertiary mt-8" role="note">
            Only confirmed and user-verified commitments are shown. Unconfirmed candidates are marked.
        </p>
    </div>`;
}

export function UpcomingPageAfterRender() {
    document.querySelectorAll('[data-horizon]').forEach(tab => {
        tab.addEventListener('click', async () => {
            const horizon = tab.dataset.horizon;
            const app = document.getElementById('app');
            if (app) {
                app.innerHTML = `<div class="page" aria-busy="true"><div class="flex justify-center items-center p-10"><span class="spinner" style="width:2rem;height:2rem;border-width:3px;"></span></div></div>`;
                app.innerHTML = await renderUpcomingContent(horizon);
                UpcomingPageAfterRender();
            }
        });
    });
}
