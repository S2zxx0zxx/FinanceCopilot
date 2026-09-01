/**
 * Security Page (SCR-40) — Security settings, sessions, activity.
 * Shows security score, 2FA, active sessions, and activity timeline.
 */
import { ApiClient, safeFetch } from '../services/api.js';
import { ErrorState, Skeleton } from '../components/ui.js';

function timeAgo(iso) {
    if (!iso) return 'Unknown';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

function formatDateTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function scoreColor(score) {
    if (score >= 80) return 'text-positive';
    if (score >= 50) return 'text-warning';
    return 'text-negative';
}

function scoreLabel(score) {
    if (score >= 80) return 'Strong';
    if (score >= 50) return 'Fair';
    return 'Needs attention';
}

function activityIcon(type) {
    const icons = {
        login: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-positive"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>',
        logout: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-tertiary"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
        session_revoked: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-warning"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        password_change: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        two_factor_enabled: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-positive"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    };
    return icons[type] || icons.login;
}

function deviceIcon(device) {
    const d = (device || '').toLowerCase();
    if (d.includes('iphone') || d.includes('android') || d.includes('mobile')) {
        return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-tertiary"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';
    }
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-tertiary"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
}

function maskIP(ip) {
    if (!ip) return '';
    const parts = ip.split('.');
    if (parts.length !== 4) return ip;
    return parts[0] + '.' + parts[1] + '.xx.xx';
}

export async function YouSecurityPage() {
    return `
    <main class="page" aria-label="Security">
        <header class="flex gap-4 items-center mb-6">
            <button class="btn btn-ghost btn-icon" data-route="you" aria-label="Back to You">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <h1 class="text-h1">Security</h1>
        </header>

        <div id="security-content">
            ${Skeleton({ type: 'card', className: 'mb-6 animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'mb-6 animate-slide-up' })}
            ${Skeleton({ type: 'card', className: 'animate-slide-up' })}
        </div>
    </main>`;
}

export function YouSecurityPageAfterRender() {
    const container = document.getElementById('security-content');
    if (!container) return;

    const loadSecurity = async () => {
        try {
            const { data, error } = await safeFetch('/auth/security', { timeout: 8000 });
            if (error) {
                container.innerHTML = ErrorState({ title: 'Unable to load security settings', description: error, onRetry: 'YouSecurityPageAfterRender()' });
                return;
            }
            const score = data.security_score ?? 0;
            const twoFactorEnabled = data.two_factor_enabled ?? false;
            const sessions = data.sessions || [];
            const activity = data.recent_activity || [];

            const circumference = 2 * Math.PI * 54;
            const offset = circumference - (score / 100) * circumference;

            container.innerHTML = `
                <!-- Security Score -->
                <section class="mb-8 animate-slide-up" aria-label="Security Score">
                    <div class="section-header">Security Score</div>
                    <div class="card flex flex-col items-center py-8">
                        <div class="relative mb-6">
                            <svg width="120" height="120" viewBox="0 0 120 120" transform="rotate(-90 60 60)">
                                <circle cx="60" cy="60" r="54" fill="none" stroke-width="6" class="text-gray-200" stroke="currentColor" opacity="0.3"/>
                                <circle cx="60" cy="60" r="54" fill="none" stroke-width="6" stroke-linecap="round" class="${scoreColor(score)} transition-all duration-700" stroke="currentColor"
                                    stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <span class="text-metric ${scoreColor(score)}">${score}</span>
                                <span class="text-caption text-secondary mt-1">${scoreLabel(score)}</span>
                            </div>
                        </div>
                        <ul class="flex flex-col gap-3 w-full max-w-xs">
                            <li class="flex items-center gap-3 text-body">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="${twoFactorEnabled ? 'text-positive' : 'text-warning'}"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span class="flex-1">Two-factor authentication</span>
                                <span class="badge ${twoFactorEnabled ? 'badge-positive' : 'badge-warning'}">${twoFactorEnabled ? 'On' : 'Off'}</span>
                            </li>
                            <li class="flex items-center gap-3 text-body">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="${sessions.length <= 2 ? 'text-positive' : 'text-warning'}"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span class="flex-1">Session management</span>
                                <span class="badge ${sessions.length <= 2 ? 'badge-positive' : 'badge-warning'}">${sessions.length} active</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <!-- Two-Factor Auth -->
                <section class="mb-8 animate-slide-up" aria-label="Two-Factor Authentication">
                    <div class="section-header">Two-Factor Authentication</div>
                    <div class="card flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="shrink-0 p-3 bg-surface-subtle rounded-lg">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <div>
                                <p class="text-body text-primary font-medium">${twoFactorEnabled ? 'Two-factor is enabled' : 'Protect your account with 2FA'}</p>
                                <p class="text-caption text-secondary mt-1">${twoFactorEnabled ? 'Your account has an extra layer of protection.' : 'Adds a verification step when signing in.'}</p>
                            </div>
                        </div>
                        <button class="btn ${twoFactorEnabled ? 'btn-secondary' : 'btn-primary'} btn-sm shrink-0" id="toggle-2fa-btn" aria-label="${twoFactorEnabled ? 'Disable two-factor authentication' : 'Enable two-factor authentication'}">${twoFactorEnabled ? 'Disable' : 'Enable'}</button>
                    </div>
                </section>

                <!-- Active Sessions -->
                <section class="mb-8 animate-slide-up" aria-label="Active Sessions">
                    <div class="flex justify-between items-end mb-6">
                        <div>
                            <h2 class="text-h3">Active Sessions</h2>
                            <p class="text-caption text-secondary mt-1">Devices currently signed in to your account</p>
                        </div>
                        <button class="btn btn-outline btn-sm text-negative shrink-0" id="revoke-all-btn">Sign Out Others</button>
                    </div>
                    <div id="revoke-all-confirm" class="hidden mb-4">
                        <div class="card border border-negative p-4 flex flex-col gap-3">
                            <p class="text-body text-negative font-medium">Sign out of all other devices?</p>
                            <div class="flex gap-3">
                                <button class="btn btn-danger flex-1" id="confirm-revoke-all">Confirm</button>
                                <button class="btn btn-secondary flex-1" id="cancel-revoke-all">Cancel</button>
                            </div>
                            <div id="revoke-all-error" class="text-negative text-caption hidden"></div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-3">
                        ${sessions.length > 0 ? sessions.map(s => `
                            <article class="card p-4 flex items-center gap-4 ${s.is_current ? 'border-positive' : ''}">
                                <div class="shrink-0 p-3 bg-surface-subtle rounded-lg">
                                    ${deviceIcon(s.device)}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2">
                                        <h3 class="text-body text-primary font-medium truncate">${s.device || 'Unknown Device'}</h3>
                                        ${s.is_current ? '<span class="badge badge-positive">Current</span>' : ''}
                                    </div>
                                    <p class="text-caption text-secondary mt-1 truncate">${s.location || 'Unknown'} ${s.ip ? '\u00b7 ' + maskIP(s.ip) : ''}</p>
                                    <p class="text-caption text-tertiary mt-1">Active ${timeAgo(s.last_active)}</p>
                                </div>
                                ${!s.is_current ? `
                                    <button class="btn btn-outline btn-sm text-negative shrink-0 session-revoke-btn" data-session-id="${s.id}">Revoke</button>
                                ` : ''}
                                <div id="revoke-error-${s.id}" class="text-negative text-caption hidden basis-full"></div>
                            </article>
                        `).join('') : `<div class="card"><p class="text-body text-secondary text-center py-4">No active sessions found.</p></div>`}
                    </div>
                </section>

                <!-- Recent Activity -->
                <section class="mb-8 animate-slide-up" aria-label="Recent Security Activity">
                    <div class="section-header">Recent Activity</div>
                    ${activity.length > 0 ? `
                        <div class="card card-flat p-0 overflow-hidden">
                            <ul>
                                ${activity.map((a, i) => `
                                    <li class="settings-item">
                                        <div class="settings-item-icon">
                                            ${activityIcon(a.type)}
                                        </div>
                                        <div class="settings-item-content">
                                            <span class="settings-item-label">${a.description || a.type}</span>
                                            <span class="settings-item-desc">${formatDateTime(a.timestamp)}</span>
                                        </div>
                                    </li>
                                    ${i < activity.length - 1 ? '<div class="separator"></div>' : ''}
                                `).join('')}
                            </ul>
                        </div>
                    ` : `<div class="card"><p class="text-body text-secondary text-center py-4">No recent activity.</p></div>`}
                </section>

                <!-- Change Password -->
                <section class="animate-slide-up">
                    <button class="btn btn-secondary btn-block btn-lg" id="change-password-btn" aria-label="Change your password">Change Password</button>
                </section>
            `;

            // 2FA toggle
            const toggle2faBtn = document.getElementById('toggle-2fa-btn');
            if (toggle2faBtn) {
                toggle2faBtn.addEventListener('click', async () => {
                    toggle2faBtn.disabled = true;
                    toggle2faBtn.textContent = twoFactorEnabled ? 'Disabling…' : 'Enabling…';
                    try {
                        await ApiClient.put('/auth/security', { two_factor_enabled: !twoFactorEnabled });
                        loadSecurity();
                    } catch (err) {
                        console.error('Failed to toggle 2FA:', err);
                        toggle2faBtn.disabled = false;
                        toggle2faBtn.textContent = twoFactorEnabled ? 'Disable' : 'Enable';
                    }
                });
            }

            // Revoke all
            const revokeAllBtn = document.getElementById('revoke-all-btn');
            const revokeAllConfirm = document.getElementById('revoke-all-confirm');
            const confirmRevokeAll = document.getElementById('confirm-revoke-all');
            const cancelRevokeAll = document.getElementById('cancel-revoke-all');

            if (revokeAllBtn && revokeAllConfirm) {
                revokeAllBtn.addEventListener('click', () => {
                    revokeAllBtn.classList.add('hidden');
                    revokeAllConfirm.classList.remove('hidden');
                });
            }
            if (cancelRevokeAll && revokeAllConfirm && revokeAllBtn) {
                cancelRevokeAll.addEventListener('click', () => {
                    revokeAllConfirm.classList.add('hidden');
                    revokeAllBtn.classList.remove('hidden');
                });
            }
            if (confirmRevokeAll) {
                confirmRevokeAll.addEventListener('click', async () => {
                    const errDiv = document.getElementById('revoke-all-error');
                    if (errDiv) errDiv.classList.add('hidden');
                    confirmRevokeAll.disabled = true;
                    confirmRevokeAll.textContent = 'Processing…';
                    try {
                        await ApiClient.post('/auth/security/sessions/revoke', { allOther: true });
                        loadSecurity();
                    } catch (err) {
                        console.error('Failed to revoke all sessions:', err);
                        if (errDiv) { errDiv.textContent = err.message || 'Failed to revoke sessions'; errDiv.classList.remove('hidden'); }
                        confirmRevokeAll.disabled = false;
                        confirmRevokeAll.textContent = 'Confirm';
                    }
                });
            }

            // Individual session revoke
            container.querySelectorAll('.session-revoke-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.sessionId;
                    const errDiv = document.getElementById(`revoke-error-${id}`);
                    if (btn.textContent === 'Revoke') {
                        btn.textContent = 'Confirm?';
                        btn.classList.add('bg-primary', 'text-inverse');
                        const timeout = setTimeout(() => {
                            if (btn && btn.textContent === 'Confirm?') {
                                btn.textContent = 'Revoke';
                                btn.classList.remove('bg-primary', 'text-inverse');
                            }
                        }, 3000);
                        btn._resetTimeout = timeout;
                        return;
                    }
                    if (btn._resetTimeout) clearTimeout(btn._resetTimeout);
                    if (errDiv) errDiv.classList.add('hidden');
                    btn.disabled = true;
                    btn.textContent = 'Revoking…';
                    try {
                        await ApiClient.post('/auth/security/sessions/revoke', { id });
                        loadSecurity();
                    } catch (err) {
                        console.error('Failed to revoke session:', err);
                        if (errDiv) { errDiv.textContent = err.message || 'Failed to revoke'; errDiv.classList.remove('hidden'); }
                        btn.disabled = false;
                        btn.textContent = 'Revoke';
                        btn.classList.remove('bg-primary', 'text-inverse');
                    }
                });
            });

            // Change password
            const changePwBtn = document.getElementById('change-password-btn');
            if (changePwBtn) {
                changePwBtn.addEventListener('click', () => {
                    if (window.appInstance) window.appInstance.navigate('/you/security/change-password');
                });
            }

        } catch (err) {
            console.error('Failed to load security data:', err);
            if (!navigator.onLine) {
                container.innerHTML = ErrorState({ title: 'Offline', description: 'Security data is unavailable while offline.' });
            } else {
                container.innerHTML = ErrorState({
                    title: 'Could not load security data',
                    description: err.message || 'An unexpected error occurred.',
                    onRetry: 'window.loadSecurityData?.()'
                });
                window.loadSecurityData = loadSecurity;
            }
        }
    };

    loadSecurity();
}
