/**
 * Error, Empty, Loading State Components
 * Reusable across the app. Each function returns an HTML string.
 */
export function LoadingState(options = {}) {
    const { message = 'Loading...', size = 'md' } = options;
    const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
    const spinner = `<span class="spinner ${sizeMap[size] || sizeMap.md}" aria-hidden="true"></span>`;
    if (!message) return `<div class="flex justify-center items-center py-10" role="status">${spinner}</div>`;
    return `<div class="flex flex-col items-center justify-center py-10 gap-3" role="status">
        ${spinner}
        <p class="text-caption text-secondary">${message}</p>
    </div>`;
}

export function EmptyState(options = {}) {
    const { title = 'Nothing here', description = '', action = null, illustration = 'no-data' } = options;
    const illustrations = {
        'no-data': `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-tertiary mx-auto mb-4"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
        'no-connection': `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-tertiary mx-auto mb-4"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"></path></svg>`,
        'no-results': `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-tertiary mx-auto mb-4"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
        'search': `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-tertiary mx-auto mb-4"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    };
    return `<div class="card p-8 text-center animate-fade-in" role="status">
        ${illustrations[illustration] || illustrations['no-data']}
        <h3 class="text-h3 mb-2">${title}</h3>
        ${description ? `<p class="text-body text-secondary max-w-sm mx-auto mb-6">${description}</p>` : '<div class="mb-6"></div>'}
        ${action ? `<button class="btn btn-primary" onclick="window.appInstance.navigate('${action.route}')">${action.label}</button>` : ''}
    </div>`;
}

export function ErrorState(options = {}) {
    const { title = 'Something went wrong', description = '', retry = false, code = '' } = options;
    return `<div class="card p-8 text-center animate-fade-in" role="alert">
        <div class="w-14 h-14 rounded-full bg-surface-subtle flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-negative"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        </div>
        <h3 class="text-h3 mb-2">${title}</h3>
        ${description ? `<p class="text-body text-secondary max-w-sm mx-auto mb-2">${description}</p>` : ''}
        ${code ? `<p class="text-micro text-tertiary mb-4">Error: ${code}</p>` : (description ? '<div class="mb-4"></div>' : '<div class="mb-4"></div>')}
        ${retry ? `<button class="btn btn-primary" onclick="window.__retryLastRequest && window.__retryLastRequest()">Try Again</button>` : ''}
    </div>`;
}

export function OfflineState() {
    return `<div class="card p-8 text-center animate-fade-in" role="alert">
        <div class="w-14 h-14 rounded-full bg-surface-subtle flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><path d="M1 1l22 22"></path><path d="M16.72 11.06A10.94 10.94 0 0119 12.55"></path><path d="M5 12.55a10.94 10.94 0 015.17-2.39"></path><path d="M10.71 5.05A16 16 0 0122.56 9"></path><path d="M1.42 9a15.91 15.91 0 014.7-2.88"></path><path d="M8.53 16.11a6 6 0 016.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
        </div>
        <h3 class="text-h3 mb-2">You're offline</h3>
        <p class="text-body text-secondary mb-4">Check your internet connection and try again.</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
    </div>`;
}

export function SkeletonCard(options = {}) {
    const { lines = 3, hasAvatar = false, hasAmount = false } = options;
    return `<div class="card p-5 animate-pulse">
        <div class="flex items-start gap-3">
            ${hasAvatar ? '<div class="skeleton skeleton-circle shrink-0" style="width:40px;height:40px"></div>' : ''}
            <div class="flex-1">
                <div class="skeleton skeleton-text" style="width:${60 + Math.random() * 30}%"></div>
                <div class="skeleton skeleton-text mt-3" style="width:${40 + Math.random() * 40}%"></div>
                ${hasAmount ? '<div class="skeleton skeleton-text mt-3" style="width:35%"></div>' : ''}
                ${lines > 2 ? '<div class="skeleton skeleton-text mt-3" style="width:' + (50 + Math.random() * 30) + '%"></div>' : ''}
            </div>
        </div>
    </div>`;
}

export function SkeletonList(options = {}) {
    const { count = 3, hasAvatar = false } = options;
    return Array.from({ length: count }, () => SkeletonCard({ lines: 2, hasAvatar })).join('');
}

export function DataFreshnessBadge(options = {}) {
    const { status = 'LIVE', lastUpdated } = options;
    const map = {
        LIVE: { cls: 'badge-positive', label: 'LIVE' },
        RECENT: { cls: 'badge-positive', label: 'RECENT' },
        STALE: { cls: 'badge-warning', label: 'STALE' },
        OLD: { cls: 'badge-negative', label: 'OLD' },
        PARTIAL: { cls: 'badge-outline', label: 'PARTIAL' },
    };
    const b = map[status] || map.LIVE;
    const time = lastUpdated ? ` · ${new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : '';
    return `<span class="badge ${b.cls}">${b.label}${time}</span>`;
}

export function DataStateBadge(options = {}) {
    const { state = 'VERIFIED' } = options;
    const map = {
        VERIFIED: { cls: 'badge-positive', label: 'VERIFIED' },
        PENDING: { cls: 'badge-warning', label: 'PENDING' },
        ESTIMATED: { cls: 'badge-dark', label: 'ESTIMATED' },
        IMPORTED: { cls: 'badge-outline', label: 'IMPORTED' },
        MANUAL: { cls: 'badge-outline', label: 'MANUAL' },
        STALE: { cls: 'badge-negative', label: 'STALE' },
        PARTIAL: { cls: 'badge-outline', label: 'PARTIAL' },
        UNAVAILABLE: { cls: 'badge-outline', label: 'UNAVAILABLE' },
    };
    const b = map[state] || map.VERIFIED;
    return `<span class="badge ${b.cls}">${b.label}</span>`;
}

export function ConfidenceBar(options = {}) {
    const { value = 0, size = 'md' } = options;
    const pct = Math.round(Math.min(value, 1) * 100);
    const h = size === 'sm' ? 'h-1' : 'h-2';
    const color = value >= 0.8 ? 'bg-positive' : value >= 0.6 ? 'bg-warning' : 'bg-negative';
    return `<div class="flex items-center gap-2">
        <div class="flex-1 bg-surface-subtle rounded-full ${h}">
            <div class="${color} ${h} rounded-full transition-all" style="width:${pct}%"></div>
        </div>
        <span class="text-micro text-secondary font-medium" style="min-width:32px;text-align:right">${pct}%</span>
    </div>`;
}

export function Toast(options = {}) {
    const { message = '', type = 'info', duration = 4000 } = options;
    const id = 'toast-' + Date.now();
    const icons = {
        success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
        warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
        error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    };
    const typeClasses = { success: 'bg-positive-light text-positive', info: 'bg-surface-elevated text-primary', warning: 'bg-warning-light text-warning', error: 'bg-negative-light text-negative' };
    const el = document.createElement('div');
    el.id = id;
    el.className = `toast ${typeClasses[type] || typeClasses.info}`;
    el.setAttribute('role', 'alert');
    el.innerHTML = `<div class="flex items-center gap-3"><span class="shrink-0">${icons[type] || icons.info}</span><span class="text-body font-medium">${message}</span></div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('toast-visible'));
    if (duration > 0) {
        setTimeout(() => { el.classList.remove('toast-visible'); setTimeout(() => el.remove(), 350); }, duration);
    }
    return id;
}

// ------------------------------------------------------------------
// Full Error Pages (referenced by app.js router)
// ------------------------------------------------------------------

export function ConnectionErrorPage() {
    return `<div class="page-container">
        <div class="page-header mb-6">
            <a href="/" class="btn btn-ghost" aria-label="Go back">&larr; Back</a>
        </div>
        <div class="card p-8 text-center animate-fade-in max-w-md mx-auto">
            <div class="w-16 h-16 rounded-full bg-surface-subtle flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-negative">
                    <path d="M1 1l22 22"></path>
                    <path d="M16.72 11.06A10.94 10.94 0 0119 12.55"></path>
                    <path d="M5 12.55a10.94 10.94 0 015.17-2.39"></path>
                    <path d="M8.53 16.11a6 6 0 016.95 0"></path>
                    <circle cx="12" cy="20" r="1" fill="currentColor"></circle>
                </svg>
            </div>
            <h2 class="text-h2 mb-3">Connection Lost</h2>
            <p class="text-body text-secondary mb-2">We couldn't reach the server. This could be a network issue or a temporary outage.</p>
            <p class="text-caption text-tertiary mb-6">Please check your connection and try again. If the problem persists, your data is safe and will sync once connectivity is restored.</p>
            <button class="btn btn-primary" onclick="window.location.reload()">Retry Connection</button>
            <a href="/" class="btn btn-ghost mt-3 d-block">Go to Home</a>
        </div>
    </div>`;
}

export function IncompleteDataPage() {
    return `<div class="page-container">
        <div class="page-header mb-6">
            <a href="/" class="btn btn-ghost" aria-label="Go back">&larr; Back</a>
        </div>
        <div class="card p-8 text-center animate-fade-in max-w-md mx-auto">
            <div class="w-16 h-16 rounded-full bg-surface-subtle flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-warning">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
            </div>
            <h2 class="text-h2 mb-3">Data Not Ready</h2>
            <p class="text-body text-secondary mb-2">Your financial data is still being processed. Some features require a complete dataset to work accurately.</p>
            <p class="text-caption text-tertiary mb-6">This usually takes a few minutes after connecting an account. You can check your data coverage status for details.</p>
            <a href="/data-coverage" class="btn btn-primary">Check Data Coverage</a>
            <a href="/" class="btn btn-ghost mt-3 d-block">Go to Home</a>
        </div>
    </div>`;
}

export function ErrorStatesAfterRender() {
    // Shared after-render hook for error state pages.
    // Currently no interactive bindings needed — buttons use inline handlers.
}