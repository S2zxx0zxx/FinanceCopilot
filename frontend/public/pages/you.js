/**
 * You Page (SCR-36/37/38/39/40/41) — Profile Hub
 * User profile center with grouped navigation to all You sub-pages.
 * Calm, premium, progressive disclosure.
 */
import { ApiClient, safeFetch } from '../services/api.js';
import { AuthService } from '../services/auth.js';
import { Skeleton, ErrorState } from '../components/ui.js';

const CHEVRON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function settingsItem(icon, label, desc, route) {
    return `
        <li class="settings-item settings-item--interactive" data-route="${route}" role="link" tabindex="0" aria-label="${label}">
            <div class="settings-item-icon">${icon}</div>
            <div class="settings-item-content">
                <span class="settings-item-label">${label}</span>
                <span class="settings-item-desc">${desc}</span>
            </div>
            <div class="settings-item-action text-tertiary">${CHEVRON_SVG}</div>
        </li>`;
}

export async function YouPage() {
    return `
    <main class="page" aria-label="Your Profile">
        <header class="mb-8">
            <h1 class="text-h1">You</h1>
        </header>

        <div id="you-profile-root" class="flex flex-col gap-8">
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
            <div class="flex gap-4">
                ${Skeleton({ type: 'card', className: 'flex-1' })}
                ${Skeleton({ type: 'card', className: 'flex-1' })}
                ${Skeleton({ type: 'card', className: 'flex-1' })}
            </div>
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
        </div>
    </main>`;
}

export function YouPageAfterRender() {
    const root = document.getElementById('you-profile-root');
    if (!root) return;

    const loadProfile = async () => {
        try {
            const { data: me, error } = await safeFetch('/auth/me', { timeout: 8000 });
            if (error) {
                root.innerHTML = ErrorState({ title: 'Unable to load profile', description: error, onRetry: 'YouPageAfterRender()' });
                return;
            }
            const firebaseUser = AuthService.getCurrentUser();
            const name = me.name || firebaseUser?.displayName || 'User';
            const email = me.email || firebaseUser?.email || '';
            const initial = name ? name.charAt(0).toUpperCase() : 'U';
            const memberSince = me.created_at ? formatDate(me.created_at) : '';
            const accountsConnected = me.accounts_connected ?? 0;
            const dataCoverage = me.data_coverage ?? 0;
            const daysActive = me.days_active ?? 0;
            const appVersion = me.app_version || '1.0.0';

            root.innerHTML = `
                <!-- Profile Card -->
                <article class="card card-hero flex items-center gap-5 animate-slide-up" aria-label="Profile card">
                    <div class="shrink-0">
                        <div class="avatar avatar--lg avatar--dark">${initial}</div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h2 class="text-h2 text-primary truncate">${name}</h2>
                        <p class="text-body text-secondary mt-1 truncate">${email}</p>
                        ${memberSince ? `<p class="text-caption text-tertiary mt-2">Member since ${memberSince}</p>` : ''}
                    </div>
                    <button class="btn btn-ghost btn-icon shrink-0" data-route="you/preferences" aria-label="Edit profile">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                </article>

                <!-- Financial Snapshot Mini -->
                <div class="grid grid-cols-3 gap-3 animate-slide-up">
                    <div class="card text-center py-4 px-3">
                        <div class="text-metric text-primary">${accountsConnected}</div>
                        <div class="text-caption mt-2">Accounts</div>
                    </div>
                    <div class="card text-center py-4 px-3">
                        <div class="text-metric text-primary">${dataCoverage}<span class="text-label">%</span></div>
                        <div class="text-caption mt-2">Coverage</div>
                    </div>
                    <div class="card text-center py-4 px-3">
                        <div class="text-metric text-primary">${daysActive}</div>
                        <div class="text-caption mt-2">Days Active</div>
                    </div>
                </div>

                <!-- Money & Data -->
                <section class="animate-slide-up" aria-label="Money and Data settings">
                    <div class="section-header">Money & Data</div>
                    <nav class="card card-flat p-0 overflow-hidden" aria-label="Money and Data">
                        <ul>
                            ${settingsItem(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
                                'Connections', 'Manage linked accounts and data sources', 'you/connections'
                            )}
                            <div class="separator"></div>
                            ${settingsItem(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>',
                                'Data Coverage', 'See how complete your financial picture is', 'data-coverage'
                            )}
                            <div class="separator"></div>
                            ${settingsItem(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
                                'Export Data', 'Download a copy of your financial data', 'you/export'
                            )}
                        </ul>
                    </nav>
                </section>

                <!-- Preferences -->
                <section class="animate-slide-up" aria-label="Preferences">
                    <div class="section-header">Preferences</div>
                    <nav class="card card-flat p-0 overflow-hidden" aria-label="Preferences">
                        <ul>
                            ${settingsItem(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
                                'Settings', 'Currency, month start, display, AI tone', 'you/preferences'
                            )}
                            <div class="separator"></div>
                            ${settingsItem(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
                                'Notifications', 'Alerts, reminders, and digest preferences', 'you/notifications'
                            )}
                        </ul>
                    </nav>
                </section>

                <!-- Privacy & Security -->
                <section class="animate-slide-up" aria-label="Privacy and Security">
                    <div class="section-header">Privacy & Security</div>
                    <nav class="card card-flat p-0 overflow-hidden" aria-label="Privacy and Security">
                        <ul>
                            ${settingsItem(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
                                'Privacy', 'Data inventory, consent, and retention policies', 'you/privacy'
                            )}
                            <div class="separator"></div>
                            ${settingsItem(
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
                                'Security', 'Sessions, two-factor auth, and activity log', 'you/security'
                            )}
                        </ul>
                    </nav>
                </section>

                <!-- Account (Destructive) -->
                <section class="animate-slide-up" aria-label="Account actions">
                    <div class="section-header">Account</div>
                    <nav class="card card-flat p-0 overflow-hidden" aria-label="Account">
                        <ul>
                            <li class="settings-item settings-item--interactive" data-route="you/delete" role="link" tabindex="0" aria-label="Delete account">
                                <div class="settings-item-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-negative"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </div>
                                <div class="settings-item-content">
                                    <span class="settings-item-label text-negative">Delete Account</span>
                                    <span class="settings-item-desc">Permanently remove your data and account</span>
                                </div>
                                <div class="settings-item-action text-tertiary">${CHEVRON_SVG}</div>
                            </li>
                        </ul>
                    </nav>
                </section>

                <!-- Footer -->
                <footer class="flex flex-col gap-4 pt-4 pb-8 animate-slide-up">
                    <p class="text-caption text-tertiary text-center">FinCopilot v${appVersion}</p>
                    <button class="btn btn-secondary btn-block btn-lg" id="you-signout-btn" aria-label="Sign out of your account">Sign Out</button>
                </footer>
            `;

            const signoutBtn = document.getElementById('you-signout-btn');
            if (signoutBtn) {
                signoutBtn.addEventListener('click', async () => {
                    signoutBtn.disabled = true;
                    signoutBtn.textContent = 'Signing out…';
                    try {
                        await AuthService.logout();
                        window.fcNavigateTo('/login');
                    } catch (err) {
                        console.error('Sign out failed:', err);
                        signoutBtn.disabled = false;
                        signoutBtn.textContent = 'Sign Out';
                    }
                });
            }

        } catch (err) {
            console.error('Failed to load profile:', err);
            if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
                root.innerHTML = `<p class="text-body text-secondary">Please sign in to view your profile.</p>`;
            } else if (!navigator.onLine) {
                root.innerHTML = ErrorState({ title: 'Offline', description: 'Profile data is unavailable while offline.' });
            } else {
                root.innerHTML = ErrorState({
                    title: 'Could not load profile',
                    description: err.message || 'An unexpected error occurred.',
                    onRetry: 'loadYouProfile()'
                });
                window.loadYouProfile = loadProfile;
            }
        }
    };

    loadProfile();
}
