/**
 * Settings Pages (SCR-37) — App preferences and notification settings.
 * Comprehensive settings with General, Notifications, Display, and AI sections.
 */
import { ApiClient, safeFetch } from '../services/api.js';
import { ErrorState, Skeleton } from '../components/ui.js';

const BACK_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';

function settingsRow(icon, label, desc, content, id) {
    return `
        <li class="settings-item" ${id ? `data-pref-key="${id}"` : ''}>
            <div class="settings-item-icon">${icon}</div>
            <div class="settings-item-content">
                <span class="settings-item-label">${label}</span>
                <span class="settings-item-desc">${desc}</span>
            </div>
            <div class="settings-item-action">${content}</div>
        </li>`;
}

function toggleHTML(name, key, checked, disabled) {
    return `
        <label class="toggle ${disabled ? 'opacity-50 cursor-not-allowed' : ''}">
            <input type="checkbox" class="toggle pref-toggle" data-key="${key}" name="${name}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} aria-label="${name}">
            <div class="toggle-track"></div>
        </label>`;
}

function selectHTML(key, options, current) {
    return `<select class="select pref-select" data-key="${key}" aria-label="${key}">
        ${options.map(o => `<option value="${o.value}" ${o.value === current ? 'selected' : ''}>${o.label}</option>`).join('')}
    </select>`;
}

// --- SETTINGS PAGE ---

export async function YouPreferencesPage() {
    return `
    <main class="page" aria-label="Settings">
        <header class="flex gap-4 items-center mb-6">
            <button class="btn btn-ghost btn-icon" data-route="you" aria-label="Back to You">${BACK_SVG}</button>
            <h1 class="text-h1">Settings</h1>
        </header>

        <div id="pref-error" class="mb-4 hidden"></div>

        <div id="pref-root" class="flex flex-col gap-8 pb-20">
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
        </div>

        <div id="pref-save-bar" class="fixed bottom-0 left-0 right-0 z-sticky p-4 pb-8 bg-surface border-t border-subtle hidden">
            <div class="max-w-xs mx-auto">
                <button class="btn btn-primary btn-block btn-lg" id="pref-save-btn" disabled>Save Changes</button>
            </div>
        </div>

        <div id="pref-toast" class="fixed top-0 left-0 right-0 z-toast p-4 hidden">
            <div class="card border border-positive p-4 flex items-center gap-3 max-w-sm mx-auto">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-positive shrink-0"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span class="text-body text-primary font-medium">Settings saved</span>
            </div>
        </div>
    </main>`;
}

export function YouPreferencesPageAfterRender() {
    const root = document.getElementById('pref-root');
    const saveBar = document.getElementById('pref-save-bar');
    const saveBtn = document.getElementById('pref-save-btn');
    const errorDiv = document.getElementById('pref-error');
    const toast = document.getElementById('pref-toast');
    if (!root || !saveBtn) return;

    let originalPrefs = null;
    let isDirty = false;

    const checkDirty = () => {
        if (!originalPrefs) return;
        const selects = root.querySelectorAll('.pref-select');
        const toggles = root.querySelectorAll('.pref-toggle');
        let dirty = false;
        selects.forEach(s => { if (s.value !== String(originalPrefs[s.dataset.key] ?? '')) dirty = true; });
        toggles.forEach(t => { if (t.checked !== Boolean(originalPrefs[t.dataset.key])) dirty = true; });
        if (dirty !== isDirty) {
            isDirty = dirty;
            saveBtn.disabled = !dirty;
            if (saveBar) saveBar.classList.toggle('hidden', !dirty);
        }
    };

    const loadPrefs = async () => {
        try {
            const { data, error } = await safeFetch('/trust/preferences', { timeout: 8000 });
            if (error) {
                root.innerHTML = ErrorState({ title: 'Unable to load preferences', description: error, onRetry: 'YouSettingsPageAfterRender()' });
                return;
            }
            originalPrefs = { ...data };

            root.innerHTML = `
                <!-- General -->
                <section class="animate-slide-up" aria-label="General">
                    <div class="section-header">General</div>
                    <div class="card card-flat p-0 overflow-hidden">
                        <ul>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
                                'Currency', 'Primary display currency',
                                selectHTML('currency', [
                                    { value: 'INR', label: '₹ INR (Indian Rupee)' },
                                    { value: 'USD', label: '$ USD (US Dollar)' }
                                ], data.currency || 'INR')
                            )}
                            <div class="separator"></div>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
                                'Month Start', 'When does your financial month begin?',
                                selectHTML('month_start', Array.from({ length: 28 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}` })), String(data.month_start || 1))
                            )}
                            <div class="separator"></div>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>',
                                'Number Format', 'How amounts are displayed',
                                selectHTML('number_format', [
                                    { value: 'indian', label: 'Indian (1,00,000)' },
                                    { value: 'international', label: 'International (100,000)' }
                                ], data.number_format || 'indian')
                            )}
                        </ul>
                    </div>
                </section>

                <!-- Notifications -->
                <section class="animate-slide-up" aria-label="Notifications">
                    <div class="section-header">Notifications</div>
                    <div class="card card-flat p-0 overflow-hidden">
                        <ul>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
                                'Spending Alerts', 'Get notified when spending exceeds your typical range',
                                toggleHTML('Spending Alerts', 'notif_spending', data.notif_spending ?? true)
                            )}
                            <div class="separator"></div>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
                                'Bill Reminders', 'Reminders before upcoming bills and commitments',
                                toggleHTML('Bill Reminders', 'notif_bills', data.notif_bills ?? true)
                            )}
                            <div class="separator"></div>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a6 6 0 0 0-6 6v1h20v-1a6 6 0 0 0-6-6z"/></svg>',
                                'AI Insights', 'Personalized financial insights from AI',
                                toggleHTML('AI Insights', 'notif_ai', data.notif_ai ?? true)
                            )}
                            <div class="separator"></div>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
                                'Weekly Summary', 'A weekly digest of your financial week',
                                toggleHTML('Weekly Summary', 'notif_weekly', data.notif_weekly ?? false)
                            )}
                            <div class="separator"></div>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 0 0-2 2v6"/></svg>',
                                'Marketing', 'Product updates and promotional content',
                                toggleHTML('Marketing', 'notif_marketing', data.notif_marketing ?? false)
                            )}
                        </ul>
                    </div>
                </section>

                <!-- Display -->
                <section class="animate-slide-up" aria-label="Display">
                    <div class="section-header">Display</div>
                    <div class="card card-flat p-0 overflow-hidden">
                        <ul>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
                                'Theme', 'App appearance mode',
                                `<div class="flex items-center gap-2">${selectHTML('theme', [
                                    { value: 'light', label: 'Light' },
                                    { value: 'dark', label: 'Dark' },
                                    { value: 'system', label: 'System' }
                                ], data.theme || 'light')}<span class="badge badge-dark">Coming soon</span></div>`
                            )}
                            <div class="separator"></div>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>',
                                'Compact Mode', 'Reduce spacing for more information density',
                                toggleHTML('Compact Mode', 'compact_mode', data.compact_mode ?? false)
                            )}
                        </ul>
                    </div>
                </section>

                <!-- AI Preferences -->
                <section class="animate-slide-up" aria-label="AI Preferences">
                    <div class="section-header">AI Preferences</div>
                    <div class="card card-flat p-0 overflow-hidden">
                        <ul>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
                                'Response Tone', 'How the AI communicates with you',
                                selectHTML('ai_tone', [
                                    { value: 'concise', label: 'Concise' },
                                    { value: 'detailed', label: 'Detailed' },
                                    { value: 'friendly', label: 'Friendly' }
                                ], data.ai_tone || 'concise')
                            )}
                            <div class="separator"></div>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
                                'Confidence Badges', 'Show confidence levels on AI predictions',
                                toggleHTML('Confidence Badges', 'ai_confidence_badges', data.ai_confidence_badges ?? true)
                            )}
                            <div class="separator"></div>
                            ${settingsRow(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
                                'Auto-Suggest Insights', 'Proactively surface insights on the dashboard',
                                toggleHTML('Auto-Suggest Insights', 'ai_auto_suggest', data.ai_auto_suggest ?? true)
                            )}
                        </ul>
                    </div>
                </section>
            `;

            // Attach listeners
            root.querySelectorAll('.pref-select').forEach(s => s.addEventListener('change', checkDirty));
            root.querySelectorAll('.pref-toggle').forEach(t => t.addEventListener('change', checkDirty));

        } catch (err) {
            console.error('Failed to load preferences:', err);
            if (!navigator.onLine) {
                root.innerHTML = ErrorState({ title: 'Offline', description: 'Settings unavailable while offline.' });
            } else {
                root.innerHTML = ErrorState({ title: 'Could not load settings', description: err.message || 'An unexpected error occurred.', onRetry: 'window.loadPrefs?.()' });
                window.loadPrefs = loadPrefs;
            }
        }
    };

    // Save handler
    saveBtn.addEventListener('click', async () => {
        if (errorDiv) errorDiv.classList.add('hidden');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving…';

        const payload = {};
        root.querySelectorAll('.pref-select').forEach(s => { payload[s.dataset.key] = s.value; });
        root.querySelectorAll('.pref-toggle').forEach(t => { payload[t.dataset.key] = t.checked; });

        try {
            await ApiClient.put('/trust/preferences/update', payload);
            originalPrefs = { ...originalPrefs, ...payload };
            isDirty = false;
            if (saveBar) saveBar.classList.add('hidden');
            saveBtn.textContent = 'Save Changes';
            // Show toast
            if (toast) {
                toast.classList.remove('hidden');
                setTimeout(() => { toast.classList.add('hidden'); }, 2500);
            }
        } catch (err) {
            console.error('Save failed:', err);
            if (errorDiv) { errorDiv.textContent = err.message || 'Failed to save settings'; errorDiv.classList.remove('hidden'); }
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Changes';
        }
    });

    loadPrefs();
}

// --- NOTIFICATIONS PAGE ---

export async function YouNotificationsPage() {
    return `
    <main class="page" aria-label="Notifications">
        <header class="flex gap-4 items-center mb-6">
            <button class="btn btn-ghost btn-icon" data-route="you" aria-label="Back to You">${BACK_SVG}</button>
            <h1 class="text-h1">Notifications</h1>
        </header>

        <div class="card p-4 flex gap-3 items-start border border-warning mb-6 animate-slide-up">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-warning shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <p class="text-body text-primary"><strong>Important:</strong> Critical security and account alerts cannot be disabled.</p>
        </div>

        <div id="notif-root" class="flex flex-col gap-4">
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
        </div>
    </main>`;
}

export function YouNotificationsPageAfterRender() {
    const container = document.getElementById('notif-root');
    if (!container) return;

    const loadNotifications = async () => {
        try {
            const { data, error } = await safeFetch('/trust/notifications/preferences', { timeout: 8000 });
            if (error) {
                container.innerHTML = ErrorState({ title: 'Unable to load notifications', description: error, onRetry: 'YouNotificationsPageAfterRender()' });
                return;
            }

            if (data?.preferences?.length) {
                container.innerHTML = `
                    <div class="card card-flat p-0 overflow-hidden animate-slide-up">
                        <ul>
                            ${data.preferences.map(pref => `
                                <li class="settings-item ${pref.mandatory ? 'opacity-50' : ''}">
                                    <div class="settings-item-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                                    </div>
                                    <div class="settings-item-content">
                                        <span class="settings-item-label">${pref.title}</span>
                                        <span class="settings-item-desc">${pref.description}</span>
                                    </div>
                                    <div class="settings-item-action">
                                        <label class="toggle ${pref.mandatory ? 'opacity-50 cursor-not-allowed' : ''}">
                                            <input type="checkbox" class="toggle notif-toggle" data-id="${pref.id}" ${pref.enabled || pref.mandatory ? 'checked' : ''} ${pref.mandatory ? 'disabled' : ''} aria-label="${pref.title}">
                                            <div class="toggle-track"></div>
                                        </label>
                                    </div>
                                </li>
                                <div id="notif-error-${pref.id}" class="text-negative text-caption px-4 pb-3 hidden"></div>
                            `).join('')}
                        </ul>
                    </div>`;

                container.querySelectorAll('.notif-toggle:not(:disabled)').forEach(toggle => {
                    toggle.addEventListener('change', async (e) => {
                        const id = e.target.dataset.id;
                        const enabled = e.target.checked;
                        toggle.disabled = true;
                        const errDiv = document.getElementById(`notif-error-${id}`);
                        if (errDiv) errDiv.classList.add('hidden');

                        try {
                            await ApiClient.post('/trust/notifications/update', { id, enabled });
                            toggle.disabled = false;
                        } catch (err) {
                            console.error('Failed to update notification:', err);
                            if (errDiv) { errDiv.textContent = err.message || 'Failed to save'; errDiv.classList.remove('hidden'); }
                            e.target.checked = !enabled;
                            toggle.disabled = false;
                        }
                    });
                });
            } else {
                container.innerHTML = `
                    <div class="card animate-slide-up">
                        <p class="text-body text-secondary text-center py-8">No notification preferences available.</p>
                    </div>`;
            }
        } catch (err) {
            console.error('Failed to load notifications:', err);
            if (!navigator.onLine) {
                container.innerHTML = ErrorState({ title: 'Offline', description: 'Notification settings unavailable while offline.' });
            } else {
                container.innerHTML = ErrorState({ title: 'Could not load notifications', description: err.message || 'An unexpected error occurred.', onRetry: 'window.loadNotifs?.()' });
                window.loadNotifs = loadNotifications;
            }
        }
    };

    loadNotifications();
}