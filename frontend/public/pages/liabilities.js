/**
 * Credit & Liabilities Page (SCR-34)
 * View credit card balances and known liabilities.
 */
import { ApiClient } from '../services/api.js';

function fmtP(p) {
    if (p == null) return '\u2014';
    return '\u20b9' + Math.abs(p / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function typeIcon(type) {
    const t = (type || '').toLowerCase();
    if (t.includes('credit')) return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>';
    if (t.includes('emi') || t.includes('loan')) return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
}

export async function LiabilitiesPage() {
    return `
    <div class="page animate-fade-in" aria-label="Credit & Liabilities">
      <header class="mb-8">
        <h1 class="text-h1">Liabilities</h1>
        <p class="text-body text-secondary mt-3">Track what you owe and upcoming payments</p>
      </header>
      <div id="liab-content">
        <div class="flex flex-col gap-4">
          <div class="card card-hero p-6"><div class="skeleton skeleton-text" style="width:50%"></div><div class="skeleton skeleton-text mt-4" style="width:70%"></div></div>
          <div class="card p-5"><div class="skeleton skeleton-text" style="width:60%"></div><div class="skeleton skeleton-text mt-3" style="width:80%"></div><div class="skeleton skeleton-text mt-3" style="width:40%"></div></div>
        </div>
      </div>
    </div>`;
}

export async function LiabilitiesPageAfterRender() {
    const el = document.getElementById('liab-content');
    if (!el) return;

    async function load() {
        try {
            const data = await ApiClient.get('/financial/liabilities');
            render(data);
        } catch (err) {
            el.innerHTML = `
                <div class="card p-8 text-center animate-fade-in">
                    <p class="text-body text-negative mb-2">Unable to load liabilities</p>
                    <p class="text-caption text-secondary mb-4">${err.message || 'Please try again'}</p>
                    <button class="btn btn-primary" id="liab-retry">Retry</button>
                </div>`;
            document.getElementById('liab-retry')?.addEventListener('click', load);
        }
    }

    function render(data) {
        const total = data.total_paise ?? 0;
        const change = data.change_paise;
        const accounts = data.accounts || [];
        const upcoming = data.upcoming || [];

        if (accounts.length === 0) {
            el.innerHTML = `
                <div class="card card-hero p-8 text-center animate-fade-in">
                    <div class="w-14 h-14 rounded-full bg-surface-subtle flex items-center justify-center mx-auto mb-6">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-positive"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <h2 class="text-h2 mb-3">No liabilities detected</h2>
                    <p class="text-body text-secondary max-w-sm mx-auto">Your connected accounts don't show any outstanding debts or EMIs right now.</p>
                </div>`;
            return;
        }

        const upcomingHtml = upcoming.length > 0
            ? '<section class="mb-8"><h2 class="text-label text-secondary uppercase mb-4">Upcoming Payments</h2><div class="flex flex-col gap-2">' +
              upcoming.map(u => {
                  const due = u.due_date ? new Date(u.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—';
                  const isOverdue = u.due_date && new Date(u.due_date) < new Date();
                  const cls = isOverdue ? 'text-negative' : 'text-primary';
                  const border = isOverdue ? 'border-l-2 border-l-negative' : '';
                  return '<div class="card card-flat p-4 flex items-center justify-between ' + border + '"><div><p class="text-body font-medium">' + (u.label || 'Payment') + '</p><p class="text-caption text-secondary mt-1">Due ' + due + '</p></div><span class="text-body font-semibold ' + cls + '">' + fmtP(u.amount_paise) + '</span></div>';
              }).join('') +
              '</div></section>'
            : '';

        const accountsHtml = accounts.map(a => {
            const statusBadge = a.status === 'ACTIVE' ? '<span class="badge badge-positive">Active</span>' : a.status === 'ERROR' ? '<span class="badge badge-negative">Error</span>' : '<span class="badge badge-outline">' + (a.status || 'Unknown') + '</span>';
            const minDueHtml = a.min_due_paise != null
                ? '<div class="text-right"><p class="text-caption text-secondary">Min Due</p><p class="text-body font-semibold">' + fmtP(a.min_due_paise) + '</p>' +
                  (a.due_date ? '<p class="text-micro text-secondary mt-1">Due ' + new Date(a.due_date).toLocaleDateString('en-IN', { day:'numeric', month:'short' }) + '</p>' : '') +
                  '</div>'
                : '';
            return '<div class="card p-5 cursor-pointer" onclick="window.appInstance.navigate(\'/accounts/' + a.id + '\')">' +
                '<div class="flex items-center justify-between mb-3"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center">' + typeIcon(a.type) + '</div><div><p class="text-body font-medium">' + (a.institution || 'Unknown') + '</p><p class="text-caption text-secondary">' + (a.type || 'Account') + ' · ' + (a.masked_number || '····') + '</p></div></div>' + statusBadge + '</div>' +
                '<div class="flex justify-between items-end pt-3 border-t"><div><p class="text-caption text-secondary">Outstanding</p><p class="text-amount-sm font-semibold">' + fmtP(a.outstanding_paise) + '</p></div>' + minDueHtml + '</div></div>';
        }).join('');

        const changeHtml = change != null
            ? '<span class="text-body ' + (change <= 0 ? 'text-positive' : 'text-negative') + ' mb-2">' + (change <= 0 ? '\u2193' : '\u2191') + ' ' + fmtP(Math.abs(change)) + ' this month</span>'
            : '';

        el.innerHTML = '<div class="animate-fade-in">' +
            '<div class="card card-hero p-6 mb-6"><p class="text-caption text-secondary uppercase mb-2">Total Outstanding</p><div class="flex items-end gap-3 mb-3"><span class="text-display">' + fmtP(total) + '</span>' + changeHtml + '</div><p class="text-caption text-secondary">' + accounts.length + ' liability account' + (accounts.length > 1 ? 's' : '') + '</p></div>' +
            upcomingHtml +
            '<section class="mb-8"><h2 class="text-label text-secondary uppercase mb-4">Accounts</h2><div class="flex flex-col gap-3">' + accountsHtml + '</div></section>' +
            '<button class="card card-interactive text-left p-5 w-full animate-slide-up" onclick="window.appInstance.navigate(\'/ai/chat?q=\' + encodeURIComponent(\'How can I pay off my debt faster?\'))"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-inverse"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path></svg></div><div><p class="text-body font-medium">Ask AI about debt payoff</p><p class="text-caption text-secondary">Get a personalized strategy</p></div></div></button>' +
            '</div>';
    }

    load();
}