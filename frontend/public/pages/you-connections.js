/**
 * Connections Page (SCR-35) — Manage data connections and imports.
 * Shows connected accounts with sync status, freshness, and data quality.
 */
import { ApiClient, safeFetch } from '../services/api.js';
import { EmptyState, ErrorState, Skeleton } from '../components/ui.js';

const CHEVRON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
const CHEVRON_DOWN_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

function formatPaise(paise) {
    if (paise == null || isNaN(paise)) return '\u2014';
    const rupees = Number(paise) / 100;
    return '\u20b9' + Math.abs(rupees).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function timeAgo(iso) {
    if (!iso) return 'Never';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

function syncFreshness(lastSync) {
    if (!lastSync) return { label: 'OLD', cls: 'badge-dark' };
    const diff = Date.now() - new Date(lastSync).getTime();
    if (diff < 3600000) return { label: 'LIVE', cls: 'badge-positive' };
    if (diff < 86400000) return { label: 'RECENT', cls: 'badge-outline' };
    if (diff < 604800000) return { label: 'STALE', cls: 'badge-warning' };
    return { label: 'OLD', cls: 'badge-dark' };
}

function statusBadge(status) {
    const map = {
        ACTIVE: { label: 'Active', cls: 'badge-positive' },
        ERROR: { label: 'Error', cls: 'badge-negative' },
        SYNCING: { label: 'Syncing', cls: 'badge-outline' },
    };
    const b = map[status?.toUpperCase()] || { label: status || 'Unknown', cls: 'badge-dark' };
    return `<span class="badge ${b.cls}">${b.label}</span>`;
}

export async function YouConnectionsPage() {
    return `
    <main class="page" aria-label="Connections">
        <header class="flex gap-4 items-center mb-6">
            <button class="btn btn-ghost btn-icon" data-route="you" aria-label="Back to You">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <h1 class="text-h1">Connections</h1>
        </header>

        <div id="conn-summary" class="mb-6">${Skeleton({ type: 'card', className: 'animate-slide-up' })}</div>

        <div id="conn-list" class="flex flex-col gap-4">
            ${Skeleton({ type: 'row', className: 'animate-slide-up' })}
            ${Skeleton({ type: 'row', className: 'animate-slide-up' })}
            ${Skeleton({ type: 'row', className: 'animate-slide-up' })}
        </div>

        <div class="mt-6" id="conn-add-wrap">
            <button class="btn btn-primary btn-block btn-lg" id="conn-add-btn" aria-label="Add a new connection">Add Connection</button>
        </div>
    </main>`;
}

export function YouConnectionsPageAfterRender() {
    const summaryEl = document.getElementById('conn-summary');
    const listEl = document.getElementById('conn-list');
    if (!summaryEl || !listEl) return;

    const loadConnections = async () => {
        try {
            const { data, error } = await safeFetch('/accounts', { timeout: 8000 });
            if (error) {
                listEl.innerHTML = ErrorState({ title: 'Unable to load connections', description: error, onRetry: 'YouConnectionsPageAfterRender()' });
                summaryEl.innerHTML = '';
                return;
            }
            const accounts = data.accounts || [];

            // Summary card
            const connectedCount = accounts.filter(a => a.status === 'ACTIVE').length;
            const totalCount = accounts.length;
            const lastSyncAll = accounts.reduce((latest, a) => {
                if (!a.last_sync) return latest;
                return !latest || new Date(a.last_sync) > new Date(latest) ? a.last_sync : latest;
            }, null);
            const avgCoverage = totalCount > 0
                ? Math.round(accounts.reduce((sum, a) => sum + (a.data_quality || 0), 0) / totalCount)
                : 0;

            if (totalCount === 0) {
                summaryEl.innerHTML = '';
                listEl.innerHTML = `
                    <div class="card animate-slide-up">
                        ${EmptyState({
                            title: 'No connections yet',
                            description: 'Link your bank accounts or import data to get started with FinCopilot.',
                            icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-tertiary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
                            action: '<button class="btn btn-primary btn-lg" id="conn-add-empty-btn">Add Your First Connection</button>'
                        })}
                    </div>`;
                const emptyAddBtn = document.getElementById('conn-add-empty-btn');
                if (emptyAddBtn) emptyAddBtn.addEventListener('click', handleAddConnection);
                return;
            }

            summaryEl.innerHTML = `
                <div class="card animate-slide-up flex items-center gap-5">
                    <div class="avatar avatar--dark shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-h3">${connectedCount} of ${totalCount} connected</h2>
                        <p class="text-caption text-secondary mt-1">
                            ${lastSyncAll ? `Last sync ${timeAgo(lastSyncAll)}` : 'Not yet synced'}
                            ${avgCoverage > 0 ? ` \u00b7 ${avgCoverage}% avg data quality` : ''}
                        </p>
                    </div>
                </div>`;

            // Connection list
            listEl.innerHTML = accounts.map((acc, idx) => {
                const fresh = syncFreshness(acc.last_sync);
                const isErr = acc.status?.toUpperCase() === 'ERROR';
                const initial = (acc.institution_name || 'U').charAt(0).toUpperCase();

                return `
                <article class="card ${isErr ? 'border-negative' : ''} p-0 overflow-hidden animate-slide-up" 
                    aria-label="${acc.institution_name || 'Account'}" data-conn-id="${acc.id}">
                    <button class="conn-toggle flex items-center gap-4 p-4 w-full text-left" data-conn-id="${acc.id}" aria-expanded="false" aria-controls="conn-detail-${acc.id}">
                        <div class="avatar avatar--sm avatar--dark shrink-0">${initial}</div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <h3 class="text-h3 text-primary truncate">${acc.institution_name || 'Unknown'}</h3>
                            </div>
                            <p class="text-caption text-secondary mt-1 truncate">
                                ${acc.account_type || 'Account'} ${acc.masked_number ? '\u00b7 ' + acc.masked_number : ''}
                            </p>
                        </div>
                        <div class="flex flex-col items-end gap-2 shrink-0">
                            ${acc.balance_paise != null ? `<span class="text-body text-primary font-medium">${formatPaise(acc.balance_paise)}</span>` : ''}
                            <div class="flex gap-2">
                                <span class="badge ${fresh.cls}">${fresh.label}</span>
                                ${statusBadge(acc.status)}
                            </div>
                        </div>
                        <span class="shrink-0 text-tertiary ml-1 conn-chevron" data-conn-id="${acc.id}">${CHEVRON_DOWN_SVG}</span>
                    </button>

                    ${isErr && acc.error ? `
                        <div class="px-4 pb-4">
                            <div class="flex items-start gap-3 p-3 border border-negative rounded">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-negative shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                <div class="flex-1">
                                    <p class="text-caption text-negative">${acc.error}</p>
                                    <button class="btn btn-outline btn-sm mt-2 conn-retry-btn" data-conn-id="${acc.id}">Retry Sync</button>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <div id="conn-detail-${acc.id}" class="hidden">
                        <div class="separator"></div>
                        <div class="p-4 flex flex-col gap-3">
                            <div class="flex justify-between items-center">
                                <span class="text-label">Last Sync</span>
                                <span class="text-body text-secondary">${acc.last_sync ? timeAgo(acc.last_sync) : 'Never'}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-label">Transactions</span>
                                <span class="text-body text-secondary">${acc.transaction_count ?? 0}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-label">Data Quality</span>
                                <span class="text-body text-secondary">${acc.data_quality != null ? acc.data_quality + '%' : '\u2014'}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-label">Sync Status</span>
                                ${statusBadge(acc.sync_status || acc.status)}
                            </div>
                        </div>
                    </div>
                </article>`;
            }).join('');

            // Toggle expand/collapse
            listEl.querySelectorAll('.conn-toggle').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.connId;
                    const detail = document.getElementById(`conn-detail-${id}`);
                    const chevron = listEl.querySelector(`.conn-chevron[data-conn-id="${id}"]`);
                    if (!detail) return;
                    const isHidden = detail.classList.contains('hidden');
                    detail.classList.toggle('hidden');
                    btn.setAttribute('aria-expanded', String(isHidden));
                    if (chevron) {
                        chevron.innerHTML = isHidden ? CHEVRON_SVG : CHEVRON_DOWN_SVG;
                    }
                });
            });

            // Retry buttons
            listEl.querySelectorAll('.conn-retry-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.connId;
                    btn.disabled = true;
                    btn.textContent = 'Retrying\u2026';
                    try {
                        await ApiClient.post(`/accounts/${id}/sync`, {});
                        loadConnections();
                    } catch (err) {
                        console.error('Retry sync failed:', err);
                        btn.disabled = false;
                        btn.textContent = 'Retry Failed';
                        setTimeout(() => { btn.textContent = 'Retry Sync'; }, 2000);
                    }
                });
            });

        } catch (err) {
            console.error('Failed to load connections:', err);
            if (!navigator.onLine) {
                listEl.innerHTML = ErrorState({ title: 'Offline', description: 'Connections unavailable while offline.' });
            } else {
                listEl.innerHTML = ErrorState({
                    title: 'Could not load connections',
                    description: err.message || 'An unexpected error occurred.',
                    onRetry: 'window.loadConnections?.()'
                });
                window.loadConnections = loadConnections;
            }
        }
    };

    function handleAddConnection() {
        if (window.appInstance) window.appInstance.navigate('/you/connections/add');
    }

    const addBtn = document.getElementById('conn-add-btn');
    if (addBtn) addBtn.addEventListener('click', handleAddConnection);

    loadConnections();
}
