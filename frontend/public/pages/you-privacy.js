/**
 * Privacy Page (SCR-39) — Privacy center.
 * Shows data inventory, AI consent, consent history, and retention policy.
 */
import { ApiClient, safeFetch } from '../services/api.js';
import { ErrorState, Skeleton } from '../components/ui.js';

function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export async function YouPrivacyPage() {
    return `
    <main class="page" aria-label="Privacy Center">
        <header class="flex gap-4 items-center mb-6">
            <button class="btn btn-ghost btn-icon" data-route="you" aria-label="Back to You">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <h1 class="text-h1">Privacy</h1>
        </header>

        <!-- Overview Card -->
        <div class="card card-dark mb-8 animate-slide-up">
            <div class="flex items-start gap-4">
                <div class="shrink-0 mt-0.5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                    <h2 class="text-h3 text-inverse">Your data is encrypted end-to-end</h2>
                    <p class="text-body mt-2 text-gray-400">We never share your data without explicit consent. You control what is collected and can delete everything at any time.</p>
                </div>
            </div>
        </div>

        <div id="privacy-content">
            ${Skeleton({ type: 'card', className: 'mb-6 animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'mb-6 animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'mb-6 animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
        </div>
    </main>`;
}

export function YouPrivacyPageAfterRender() {
    const container = document.getElementById('privacy-content');
    if (!container) return;

    const loadPrivacy = async () => {
        try {
            const { data, error } = await safeFetch('/trust/privacy', { timeout: 8000 });
            if (error) {
                container.innerHTML = ErrorState({ title: 'Unable to load privacy settings', description: error, onRetry: 'YouPrivacyPageAfterRender()' });
                return;
            }
            const consents = data.consents || [];
            const aiConsent = data.ai_consent ?? false;
            const retentionDays = data.data_retention_days ?? 365;
            const dataTypes = data.data_types || [];

            container.innerHTML = `
                <!-- Data Inventory -->
                <section class="mb-8 animate-slide-up" aria-label="Data Inventory">
                    <div class="section-header">Data We Collect</div>
                    <div class="card card-flat p-0 overflow-hidden">
                        <ul>
                            ${dataTypes.map(dt => `
                                <li class="settings-item">
                                    <div class="settings-item-icon">
                                        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center ${dt.collected ? 'border-positive bg-positive-soft' : 'border-subtle bg-surface-subtle'}">
                                            ${dt.collected ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-positive"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                                        </div>
                                    </div>
                                    <div class="settings-item-content">
                                        <span class="settings-item-label">${dt.name}</span>
                                        <span class="settings-item-desc">${dt.description}</span>
                                    </div>
                                    <div class="settings-item-action">
                                        <span class="badge ${dt.collected ? 'badge-positive' : 'badge-dark'}">${dt.collected ? 'Collected' : 'Not collected'}</span>
                                    </div>
                                </li>
                                ${dt !== dataTypes[dataTypes.length - 1] ? '<div class="separator"></div>' : ''}
                            `).join('')}
                        </ul>
                    </div>
                </section>

                <!-- AI Data Sharing -->
                <section class="mb-8 animate-slide-up" aria-label="AI Data Sharing">
                    <div class="section-header">AI Processing</div>
                    <div class="card card-flat p-0 overflow-hidden">
                        <ul>
                            <li class="settings-item">
                                <div class="settings-item-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a6 6 0 0 0-6 6v1h20v-1a6 6 0 0 0-6-6z"/><path d="M12 18v4"/><path d="M8 22h8"/></svg>
                                </div>
                                <div class="settings-item-content">
                                    <span class="settings-item-label">Allow AI analysis</span>
                                    <span class="settings-item-desc">AI sees only aggregated patterns, never raw transactions or personal identifiers.</span>
                                </div>
                                <div class="settings-item-action">
                                    <label class="toggle">
                                        <input type="checkbox" class="toggle" id="privacy-ai-toggle" ${aiConsent ? 'checked' : ''} aria-label="Toggle AI data processing consent">
                                        <div class="toggle-track"></div>
                                    </label>
                                </div>
                            </li>
                        </ul>
                        <div id="ai-toggle-error" class="text-negative text-caption px-4 pb-4 hidden"></div>
                    </div>
                    <div class="card mt-4 p-4 flex items-start gap-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        <p class="text-caption text-secondary">AI is processed on secure servers with no human review. You can revoke consent at any time. <a href="/docs/ai-gateway" class="text-primary font-medium">Learn more about AI Gateway</a></p>
                    </div>
                </section>

                <!-- Consent History -->
                <section class="mb-8 animate-slide-up" aria-label="Consent History">
                    <div class="section-header">Consent History</div>
                    ${consents.length > 0 ? `
                        <div class="card card-flat p-0 overflow-hidden">
                            <ul>
                                ${consents.map(c => `
                                    <li class="settings-item">
                                        <div class="settings-item-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-tertiary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                        </div>
                                        <div class="settings-item-content">
                                            <span class="settings-item-label">Version ${c.version}</span>
                                            <span class="settings-item-desc">Granted ${formatDateTime(c.granted_at)}</span>
                                        </div>
                                        <div class="settings-item-action">
                                            <span class="badge ${c.status === 'active' ? 'badge-positive' : 'badge-dark'}">${c.status === 'active' ? 'Active' : c.status}</span>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : `
                        <div class="card">
                            <p class="text-body text-secondary text-center py-4">No consent records found.</p>
                        </div>
                    `}
                </section>

                <!-- Data Retention -->
                <section class="mb-8 animate-slide-up" aria-label="Data Retention">
                    <div class="section-header">Data Retention</div>
                    <div class="card">
                        <div class="flex items-start gap-4">
                            <div class="shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            </div>
                            <div>
                                <p class="text-body text-primary">Your data is retained for <strong>${retentionDays} days</strong> after your last activity.</p>
                                <p class="text-caption text-secondary mt-2">After this period, data is automatically and irreversibly deleted. You can request immediate deletion from the <a href="/you/delete" class="text-primary font-medium">Account page</a>.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Download Link -->
                <section class="animate-slide-up">
                    <a href="/you/export" class="card card-flat flex items-center justify-between p-4" role="link" aria-label="Download your data">
                        <div class="flex items-center gap-4">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            <span class="text-body text-primary font-medium">Download my data</span>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-tertiary"><polyline points="9 18 15 12 9 6"/></svg>
                    </a>
                </section>
            `;

            // AI consent toggle handler
            const aiToggle = document.getElementById('privacy-ai-toggle');
            const aiError = document.getElementById('ai-toggle-error');
            if (aiToggle) {
                aiToggle.addEventListener('change', async () => {
                    const granted = aiToggle.checked;
                    aiToggle.disabled = true;
                    if (aiError) aiError.classList.add('hidden');

                    try {
                        await ApiClient.put('/trust/privacy', { ai_consent: granted });
                        aiToggle.disabled = false;
                    } catch (err) {
                        console.error('Failed to update AI consent:', err);
                        if (aiError) {
                            aiError.textContent = 'Could not update consent: ' + (err.message || 'Unknown error');
                            aiError.classList.remove('hidden');
                        }
                        aiToggle.checked = !granted;
                        aiToggle.disabled = false;
                    }
                });
            }

        } catch (err) {
            console.error('Failed to load privacy data:', err);
            if (!navigator.onLine) {
                container.innerHTML = ErrorState({ title: 'Offline', description: 'Privacy data is unavailable while offline.' });
            } else {
                container.innerHTML = ErrorState({
                    title: 'Could not load privacy data',
                    description: err.message || 'An unexpected error occurred.',
                    onRetry: 'window.loadPrivacy?.()'
                });
                window.loadPrivacy = loadPrivacy;
            }
        }
    };

    loadPrivacy();
}
