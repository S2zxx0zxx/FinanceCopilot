/**
 * Export & Delete Page (SCR-41) — Data export and account deletion.
 * Export data in various formats, delete data, or delete account entirely.
 */
import { ApiClient, safeFetch } from '../services/api.js';
import { AuthService } from '../services/auth.js';
import { ErrorState, Skeleton } from '../components/ui.js';

const BACK_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';

function formatPaise(paise) {
    if (paise == null || isNaN(paise)) return '\u2014';
    const rupees = Number(paise) / 100;
    return '\u20b9' + Math.abs(rupees).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function formatDateTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function humanFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 KB';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

export async function YouExportPage() {
    return `
    <main class="page" aria-label="Data & Account">
        <header class="flex gap-4 items-center mb-6">
            <button class="btn btn-ghost btn-icon" data-route="you" aria-label="Back to You">${BACK_SVG}</button>
            <h1 class="text-h1">Data & Account</h1>
        </header>

        <div id="export-root">
            ${Skeleton({ type: 'card', className: 'mb-6 animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'mb-6 animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
        </div>
    </main>`;
}

export function YouExportPageAfterRender() {
    const root = document.getElementById('export-root');
    if (!root) return;

    let pollingInterval = null;

    const loadExportPage = async () => {
        try {
            const { data, error } = await safeFetch('/trust/export/status', { timeout: 8000 });
            if (error) {
                root.innerHTML = ErrorState({ title: 'Unable to load export settings', description: error, onRetry: 'YouExportPageAfterRender()' });
                return;
            }
            const hasActiveExport = data?.status === 'PROCESSING';
            const hasReadyExport = data?.status === 'READY';
            const lastExport = data?.generatedAt;
            const summary = data?.summary || {};

            root.innerHTML = `
                <!-- Export Section -->
                <section class="mb-8 animate-slide-up" aria-label="Export Data">
                    <div class="section-header">Export Your Data</div>
                    <div class="card">
                        <p class="text-body text-secondary mb-6">Download a complete copy of your financial data. Credentials and internal identifiers are excluded.</p>

                        <div id="export-status-area" class="mb-6">
                            ${hasActiveExport ? `
                                <div class="card border border-warning p-4 flex items-center gap-4">
                                    <span class="spinner spinner-sm shrink-0"></span>
                                    <div>
                                        <p class="text-body text-primary font-medium">Processing export…</p>
                                        <p class="text-caption text-secondary mt-1">This may take a few minutes. You can leave this page.</p>
                                    </div>
                                </div>
                            ` : hasReadyExport ? `
                                <div class="card border border-positive p-4 flex items-center justify-between gap-4">
                                    <div>
                                        <p class="text-body text-positive font-medium">Export ready</p>
                                        <p class="text-caption text-secondary mt-1">Generated ${formatDateTime(lastExport)}</p>
                                    </div>
                                    <a href="${data.downloadUrl}" target="_blank" class="btn btn-primary btn-sm shrink-0">Download</a>
                                </div>
                            ` : lastExport ? `
                                <div class="flex items-center gap-2 p-3 bg-surface-subtle rounded">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <span class="text-caption text-secondary">Last export: ${formatDateTime(lastExport)}</span>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Format Selection -->
                        <div class="mb-6">
                            <label class="text-label mb-3 block">Format</label>
                            <div class="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Export format">
                                <button class="card card-flat p-4 text-center export-format-btn active-scale-sm ${!hasActiveExport ? 'is-selected ring-1-primary' : 'is-disabled'}" data-format="json" role="radio" aria-checked="${!hasActiveExport ? 'true' : 'false'}" ${hasActiveExport ? 'disabled' : ''}>
                                    <span class="text-h3 font-bold">JSON</span>
                                    <p class="text-caption text-secondary mt-1">Full data</p>
                                </button>
                                <button class="card card-flat p-4 text-center export-format-btn active-scale-sm ${!hasActiveExport ? '' : 'is-disabled'}" data-format="csv" role="radio" aria-checked="false" ${hasActiveExport ? 'disabled' : ''}>
                                    <span class="text-h3 font-bold">CSV</span>
                                    <p class="text-caption text-secondary mt-1">Spreadsheets</p>
                                </button>
                                <button class="card card-flat p-4 text-center export-format-btn active-scale-sm ${!hasActiveExport ? '' : 'is-disabled'}" data-format="pdf" role="radio" aria-checked="false" ${hasActiveExport ? 'disabled' : ''}>
                                    <span class="text-h3 font-bold">PDF</span>
                                    <p class="text-caption text-secondary mt-1">Printable</p>
                                </button>
                            </div>
                        </div>

                        <div id="export-error" class="text-negative text-caption mb-4 hidden"></div>

                        <button class="btn btn-primary btn-block btn-lg" id="request-export-btn" ${hasActiveExport ? 'disabled' : ''} aria-label="Request data export">
                            ${hasActiveExport ? 'Export in progress…' : 'Request Export'}
                        </button>
                    </div>
                </section>

                <!-- Data Summary -->
                <section class="mb-8 animate-slide-up" aria-label="Data Summary">
                    <div class="section-header">Your Data at a Glance</div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="card text-center py-5">
                            <div class="text-metric text-primary">${summary.total_transactions ?? 0}</div>
                            <div class="text-caption mt-2">Transactions</div>
                        </div>
                        <div class="card text-center py-5">
                            <div class="text-metric text-primary">${summary.total_accounts ?? 0}</div>
                            <div class="text-caption mt-2">Accounts</div>
                        </div>
                        <div class="card text-center py-5">
                            <div class="text-body font-medium text-primary">${summary.date_range || '\u2014'}</div>
                            <div class="text-caption mt-2">Date Range</div>
                        </div>
                        <div class="card text-center py-5">
                            <div class="text-body font-medium text-primary">${humanFileSize(summary.estimated_size_bytes)}</div>
                            <div class="text-caption mt-2">Est. Size</div>
                        </div>
                    </div>
                </section>

                <!-- Danger Zone -->
                <section class="animate-slide-up" aria-label="Danger Zone">
                    <div class="section-header text-negative">Danger Zone</div>
                    <div class="card border border-negative overflow-hidden">
                        <!-- Delete All Data -->
                        <div class="p-5 border-b border-negative">
                            <h3 class="text-h3 text-negative">Delete All My Data</h3>
                            <p class="text-body text-secondary mt-2">Remove all your financial data while keeping your account active. You have a 30-day grace period to recover.</p>
                            <div id="delete-data-confirm-area" class="hidden mt-4">
                                <div class="p-4 bg-negative-soft rounded flex flex-col gap-3">
                                    <p class="text-caption text-negative">Type <strong>DELETE</strong> to confirm:</p>
                                    <div class="input-wrapper">
                                        <input type="text" id="delete-data-input" class="input" placeholder="DELETE" autocomplete="off" aria-label="Type DELETE to confirm data deletion">
                                    </div>
                                    <div class="flex gap-3">
                                        <button class="btn btn-danger flex-1" id="confirm-delete-data-btn" disabled>Delete All Data</button>
                                        <button class="btn btn-secondary flex-1" id="cancel-delete-data-btn">Cancel</button>
                                    </div>
                                    <div id="delete-data-error" class="text-negative text-caption hidden"></div>
                                </div>
                            </div>
                            <button class="btn btn-outline btn-sm text-negative mt-4" id="delete-data-btn">Delete All Data</button>
                        </div>

                        <!-- Delete Account -->
                        <div class="p-5">
                            <h3 class="text-h3 text-negative">Delete Account</h3>
                            <p class="text-body text-secondary mt-2">Permanently delete your account and all associated data. This cannot be undone.</p>
                            <button class="btn btn-danger btn-sm mt-4" id="goto-delete-account" aria-label="Go to account deletion page">Delete Account</button>
                        </div>
                    </div>
                </section>
            `;

            // Format selection
            let selectedFormat = 'json';
            root.querySelectorAll('.export-format-btn:not(.is-disabled)').forEach(btn => {
                btn.addEventListener('click', () => {
                    root.querySelectorAll('.export-format-btn').forEach(b => {
                        b.classList.remove('is-selected', 'ring-1-primary');
                        b.setAttribute('aria-checked', 'false');
                    });
                    btn.classList.add('is-selected', 'ring-1-primary');
                    btn.setAttribute('aria-checked', 'true');
                    selectedFormat = btn.dataset.format;
                });
            });

            // Request export
            const requestBtn = document.getElementById('request-export-btn');
            const exportError = document.getElementById('export-error');
            if (requestBtn) {
                requestBtn.addEventListener('click', async () => {
                    requestBtn.disabled = true;
                    requestBtn.textContent = 'Requesting…';
                    if (exportError) exportError.classList.add('hidden');

                    try {
                        const result = await ApiClient.post('/trust/export', { format: selectedFormat });
                        // Start polling for status
                        requestBtn.textContent = 'Export in progress\u2026';
                        if (pollingInterval) clearInterval(pollingInterval);
                        pollingInterval = setInterval(checkExportStatus, 3000);
                    } catch (err) {
                        console.error('Export request failed:', err);
                        if (exportError) { exportError.textContent = err.message || 'Failed to request export'; exportError.classList.remove('hidden'); }
                        requestBtn.disabled = false;
                        requestBtn.textContent = 'Request Export';
                    }
                });
            }

            // Delete data flow
            const deleteDataBtn = document.getElementById('delete-data-btn');
            const deleteDataConfirm = document.getElementById('delete-data-confirm-area');
            const deleteDataInput = document.getElementById('delete-data-input');
            const confirmDeleteData = document.getElementById('confirm-delete-data-btn');
            const cancelDeleteData = document.getElementById('cancel-delete-data-btn');
            const deleteDataError = document.getElementById('delete-data-error');

            if (deleteDataBtn && deleteDataConfirm) {
                deleteDataBtn.addEventListener('click', () => {
                    deleteDataBtn.classList.add('hidden');
                    deleteDataConfirm.classList.remove('hidden');
                    if (deleteDataInput) deleteDataInput.focus();
                });
            }
            if (cancelDeleteData && deleteDataConfirm && deleteDataBtn) {
                cancelDeleteData.addEventListener('click', () => {
                    deleteDataConfirm.classList.add('hidden');
                    deleteDataBtn.classList.remove('hidden');
                    if (deleteDataInput) deleteDataInput.value = '';
                    if (confirmDeleteData) confirmDeleteData.disabled = true;
                });
            }
            const validateDeleteData = () => {
                if (confirmDeleteData && deleteDataInput) {
                    confirmDeleteData.disabled = deleteDataInput.value !== 'DELETE';
                }
            };
            if (deleteDataInput) deleteDataInput.addEventListener('input', validateDeleteData);
            if (confirmDeleteData) {
                confirmDeleteData.addEventListener('click', async () => {
                    if (deleteDataInput?.value !== 'DELETE') return;
                    if (deleteDataError) deleteDataError.classList.add('hidden');
                    confirmDeleteData.disabled = true;
                    confirmDeleteData.textContent = 'Deleting\u2026';
                    try {
                        await ApiClient.post('/trust/delete-data', {});
                        loadExportPage();
                    } catch (err) {
                        console.error('Delete data failed:', err);
                        if (deleteDataError) { deleteDataError.textContent = err.message || 'Failed to delete data'; deleteDataError.classList.remove('hidden'); }
                        confirmDeleteData.disabled = false;
                        confirmDeleteData.textContent = 'Delete All Data';
                    }
                });
            }

            // Go to delete account
            const gotoDelete = document.getElementById('goto-delete-account');
            if (gotoDelete) {
                gotoDelete.addEventListener('click', () => {
                    if (window.appInstance) window.appInstance.navigate('/you/delete');
                });
            }

            function checkExportStatus() {
                safeFetch('/trust/export/status').then(({ data: d }) => {
                    if (d?.status === 'READY') {
                        if (pollingInterval) clearInterval(pollingInterval);
                        loadExportPage();
                    } else if (d?.status === 'FAILED') {
                        if (pollingInterval) clearInterval(pollingInterval);
                        loadExportPage();
                    }
                }).catch(() => {});
            }

        } catch (err) {
            console.error('Failed to load export page:', err);
            if (!navigator.onLine) {
                root.innerHTML = ErrorState({ title: 'Offline', description: 'Export data unavailable while offline.' });
            } else {
                root.innerHTML = ErrorState({ title: 'Could not load data', description: err.message || 'An unexpected error occurred.', onRetry: 'window.loadExportPage?.()' });
                window.loadExportPage = loadExportPage;
            }
        }
    };

    loadExportPage();
}

// --- DELETION PAGE ---

export async function YouDeletePage() {
    return `
    <main class="page" aria-label="Delete Account">
        <header class="flex gap-4 items-center mb-6">
            <button class="btn btn-ghost btn-icon" data-route="you" aria-label="Back to You">${BACK_SVG}</button>
            <h1 class="text-h1 text-negative">Delete Account</h1>
        </header>

        <div id="delete-root">
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
        </div>
    </main>`;
}

export function YouDeletePageAfterRender() {
    const root = document.getElementById('delete-root');
    if (!root) return;

    let pollingInterval = null;
    const firebaseUser = AuthService.getCurrentUser();
    const userEmail = firebaseUser?.email || '';

    const checkStatus = async () => {
        try {
            const { data, error } = await safeFetch('/trust/deletion/status', { timeout: 8000 });
            if (error) {
                root.innerHTML = ErrorState({ title: 'Unable to load status', description: error, onRetry: 'YouDeletePageAfterRender()' });
                return;
            }
            if (data?.status === 'PROCESSING') {
                root.innerHTML = `
                    <div class="card flex flex-col items-center py-12 gap-6 animate-scale-in">
                        <span class="spinner"></span>
                        <h2 class="text-h2">Deletion in progress</h2>
                        <p class="text-body text-secondary">Securely removing your data…</p>
                    </div>`;
            } else if (data?.status === 'COMPLETED') {
                if (pollingInterval) clearInterval(pollingInterval);
                root.innerHTML = `
                    <div class="card flex flex-col items-center py-12 gap-6 animate-scale-in">
                        <div class="p-4 bg-surface-subtle rounded-full">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-negative"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
                        </div>
                        <h2 class="text-h2">Account Deleted</h2>
                        <p class="text-body text-secondary">Your data has been permanently removed.</p>
                        <button class="btn btn-primary btn-lg" id="delete-return-login">Return to Login</button>
                    </div>`;
                const returnBtn = document.getElementById('delete-return-login');
                if (returnBtn) returnBtn.addEventListener('click', () => { window.fcNavigateTo('/login'); });
            } else if (data?.status === 'FAILED') {
                if (pollingInterval) clearInterval(pollingInterval);
                root.innerHTML = ErrorState({ title: 'Deletion Incomplete', description: 'We encountered an issue. Please try again or contact support.' });
                renderDeleteForm();
            } else {
                renderDeleteForm();
            }
        } catch (err) {
            renderDeleteForm();
        }
    };

    function renderDeleteForm() {
        root.innerHTML = `
            <article class="card border border-negative animate-slide-up">
                <h2 class="text-h2 mb-3 text-negative">Are you sure?</h2>
                <p class="text-body text-secondary mb-6">Deleting your account is permanent and cannot be undone.</p>

                <div class="p-4 bg-surface-subtle rounded mb-6">
                    <p class="text-body text-negative font-medium mb-3">This will immediately:</p>
                    <ul class="list-disc ml-5 flex flex-col gap-2 text-body text-secondary">
                        <li>Revoke all active sessions</li>
                        <li>Disconnect all data sources</li>
                        <li>Delete your financial history and goals</li>
                        <li>Permanently erase your identity from FinCopilot</li>
                    </ul>
                </div>

                <div class="flex items-start gap-3 mb-6 p-4 bg-surface-subtle rounded">
                    <input type="checkbox" id="delete-account-cb" class="mt-1" aria-label="Confirm account deletion">
                    <label for="delete-account-cb" class="text-body font-medium text-primary">I understand that my data will be permanently deleted and cannot be recovered.</label>
                </div>

                <div id="delete-input-wrap" class="hidden mb-6">
                    <div class="input-wrapper">
                        <label class="input-label text-negative" for="delete-account-email-input">Type your email to confirm</label>
                        <input type="email" id="delete-account-email-input" class="input" placeholder="${userEmail}" autocomplete="off" aria-label="Type your email to confirm deletion">
                    </div>
                </div>

                <div id="delete-account-error" class="text-negative text-caption mb-4 text-center hidden"></div>

                <button class="btn btn-danger btn-block btn-lg" id="execute-delete-btn" disabled>Permanently Delete Account</button>
            </article>
        `;

        const cb = document.getElementById('delete-account-cb');
        const inputWrap = document.getElementById('delete-input-wrap');
        const emailInput = document.getElementById('delete-account-email-input');
        const executeBtn = document.getElementById('execute-delete-btn');
        const errorDiv = document.getElementById('delete-account-error');

        if (!cb || !executeBtn || !emailInput) return;

        const validate = () => {
            const isValid = cb.checked && emailInput.value.toLowerCase().trim() === userEmail.toLowerCase();
            executeBtn.disabled = !isValid;
        };

        cb.addEventListener('change', () => {
            if (cb.checked) {
                inputWrap.classList.remove('hidden');
                emailInput.focus();
            } else {
                inputWrap.classList.add('hidden');
                emailInput.value = '';
            }
            validate();
        });

        emailInput.addEventListener('input', validate);

        executeBtn.addEventListener('click', async () => {
            if (emailInput.value.toLowerCase().trim() !== userEmail.toLowerCase()) return;
            if (errorDiv) errorDiv.classList.add('hidden');
            executeBtn.disabled = true;
            executeBtn.textContent = 'Deleting\u2026';
            cb.disabled = true;
            emailInput.disabled = true;

            try {
                await ApiClient.delete('/auth/account');
                if (pollingInterval) clearInterval(pollingInterval);
                pollingInterval = setInterval(checkStatus, 3000);
                checkStatus();
            } catch (err) {
                console.error('Account deletion failed:', err);
                if (errorDiv) { errorDiv.textContent = err.message || 'Failed to delete account'; errorDiv.classList.remove('hidden'); }
                executeBtn.disabled = false;
                executeBtn.textContent = 'Permanently Delete Account';
                cb.disabled = false;
                emailInput.disabled = false;
            }
        });
    }

    checkStatus();
}
