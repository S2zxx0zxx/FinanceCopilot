// Shared UI Component System
// Ultra-Premium Black & White Design System

export function Button({ label, variant = 'primary', icon = '', onClick = '', disabled = false, loading = false }) {
    const classMap = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
        outline: 'btn-outline'
    };

    return `
        <button class="btn ${classMap[variant] || 'btn-primary'} ${loading ? 'btn-loading' : ''}" ${disabled || loading ? 'disabled' : ''} ${onClick ? `onclick="${onClick}"` : ''}>
            ${icon ? `<span class="mr-1 whitespace-nowrap">${icon}</span>` : ''}
            <span>${label}</span>
        </button>
    `;
}

export function IconButton({ icon, variant = 'ghost', onClick = '', ariaLabel = '' }) {
    return `
        <button class="btn btn-icon ${variant === 'ghost' ? 'btn-ghost' : ''}" aria-label="${ariaLabel}" ${onClick ? `onclick="${onClick}"` : ''}>
            ${icon}
        </button>
    `;
}

export function Card({ children, className = '' }) {
    return `<div class="card ${className}">${children}</div>`;
}

export function MetricCard({ title, amount, subtitle = '', badge = '', icon = '' }) {
    return `
        <div class="card metric-card">
            <div class="flex justify-between items-start mb-2">
                <div class="text-label flex items-center gap-2">
                    ${icon ? `<span class="text-tertiary">${icon}</span>` : ''}
                    ${title}
                </div>
                ${badge}
            </div>
            <div class="metric-value">${amount}</div>
            ${subtitle ? `<div class="metric-label mt-2">${subtitle}</div>` : ''}
        </div>
    `;
}

export function Badge({ label, variant = 'neutral', icon = '' }) {
    const classMap = {
        positive: 'badge-positive',
        warning: 'badge-warning',
        negative: 'badge-negative',
        neutral: 'badge-dark',
        ai: 'badge-dark'
    };
    return `
        <span class="badge ${classMap[variant] || 'badge-dark'}">
            ${icon ? `<span class="mr-1">${icon}</span>` : ''}
            ${label}
        </span>
    `;
}

export function FreshnessBadge({ status, timeAgo }) {
    let variant = 'neutral';
    let label = 'Live';
    let icon = '<span class="animate-pulse" style="width:6px;height:6px;border-radius:50%;background:currentColor;display:inline-block;"></span>';

    if (status === 'stale') {
        variant = 'warning';
        label = `Updated ${timeAgo}`;
        icon = '';
    } else if (status === 'partial') {
        variant = 'neutral';
        label = 'Partial coverage';
        icon = '';
    } else if (status === 'estimated') {
        variant = 'neutral';
        label = 'Estimated';
        icon = '';
    }

    return Badge({ label, variant, icon });
}

export function EmptyState({ title, description, action = '', icon = '' }) {
    return `
        <div class="empty-state">
            ${icon ? `<div class="empty-state-icon">${icon}</div>` : ''}
            <h3 class="empty-state-title">${title}</h3>
            <p class="empty-state-description">${description}</p>
            ${action ? `<div class="mt-4">${action}</div>` : ''}
        </div>
    `;
}

export function ErrorState({ title = "Couldn't load", description, onRetry = '' }) {
    return `
        <div class="error-state">
            <svg class="error-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 class="error-state-title">${title}</h3>
            <p class="error-state-description">${description}</p>
            ${onRetry ? `<div class="mt-2">${Button({ label: 'Retry', variant: 'secondary', onClick: onRetry })}</div>` : ''}
        </div>
    `;
}

export function Skeleton({ type = 'text', lines = 1, className = '' }) {
    if (type === 'card') {
        return `<div class="skeleton skeleton-card ${className}"></div>`;
    }
    if (type === 'row') {
        return `
            <div class="flex justify-between items-center p-4 ${className}">
                <div class="flex items-center gap-3 flex-1">
                    <div class="skeleton skeleton-avatar"></div>
                    <div class="flex-1">
                        <div class="skeleton skeleton-text" style="width:60%"></div>
                        <div class="skeleton skeleton-text" style="width:40%"></div>
                    </div>
                </div>
                <div class="skeleton skeleton-text" style="width:20%"></div>
            </div>
        `;
    }
    if (type === 'metric') {
        return `
            <div class="card ${className}">
                <div class="skeleton skeleton-text" style="width:40%;height:12px"></div>
                <div class="skeleton skeleton-metric mt-3"></div>
                <div class="skeleton skeleton-text mt-3" style="width:60%"></div>
            </div>
        `;
    }
    if (type === 'avatar') {
        return `<div class="skeleton skeleton-avatar ${className}"></div>`;
    }

    let html = '';
    for (let i = 0; i < lines; i++) {
        const width = i === lines - 1 ? '60%' : '100%';
        html += `<div class="skeleton skeleton-text ${className}" style="width:${width}"></div>`;
    }
    return html;
}

export function SectionHeader({ title, action = '', description = '' }) {
    return `
        <div class="flex justify-between items-end mb-6">
            <div>
                <h2 class="text-h3">${title}</h2>
                ${description ? `<p class="text-caption mt-1">${description}</p>` : ''}
            </div>
            ${action}
        </div>
    `;
}
