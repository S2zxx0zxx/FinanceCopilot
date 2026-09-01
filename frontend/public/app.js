// ============================================================================
// FinCopilot — Application Entry Point
// Premium SPA Router with Black & White Design
// ============================================================================

// ---------------------------------------------------------------------------
// BASE PATH — auto-detect so the SPA works at root OR mounted under /app/*
// Detection order:
//   1. window.__FC_BASE_PATH__ (injected by backend or index.html)
//   2. <base href="/app/"> tag in document.head
//   3. Derive from the first <script> src that matches /app/app.js
//   4. Default: '' (root)
// ---------------------------------------------------------------------------
const BASE_PATH = (() => {
    if (typeof window !== 'undefined' && window.__FC_BASE_PATH__) {
        return window.__FC_BASE_PATH__.replace(/\/$/, '');
    }
    const baseTag = document.querySelector('base[href]');
    if (baseTag) {
        const href = baseTag.getAttribute('href');
        if (href && href.startsWith('/') && href !== '/' && !href.startsWith('//')) {
            return href.replace(/\/$/, '');
        }
    }
    const script = document.querySelector('script[src$="app.js"]');
    if (script) {
        const src = script.getAttribute('src');
        if (src && src.startsWith('/') && !src.startsWith('//')) {
            const parts = src.split('/').filter(Boolean);
            if (parts.length >= 2) return '/' + parts.slice(0, -1).join('/');
        }
    }
    return '';
})();

// Strip base path from a full URL path → returns clean route like '/money'
function stripBase(pathname) {
    if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
        const rest = pathname.slice(BASE_PATH.length);
        return rest === '' ? '/' : rest;
    }
    return pathname;
}

// Add base path to a clean route like '/money' → '/app/money'
function withBase(cleanPath) {
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    return BASE_PATH + cleanPath;
}

// Expose globally so page modules can build full URLs for full-page reloads
// and for any non-SPA navigation.
window.__FC_BASE_PATH__ = BASE_PATH;
window.fcUrl = function (cleanPath) {
    if (!cleanPath || !cleanPath.startsWith('/')) cleanPath = '/' + (cleanPath || '');
    return BASE_PATH + cleanPath;
};
window.fcNavigateTo = function (cleanPath) {
    // full-page reload to a base-prefixed path
    window.location.href = window.fcUrl(cleanPath);
};

// Page Imports
import { HomePage } from './pages/home.js';
import { MoneyPage } from './pages/money.js';
import { AccountsPage } from './pages/accounts.js';
import { AccountDetailPage } from './pages/account-detail.js';
import { TransactionsPage } from './pages/transactions.js';
import { TransactionDetailPage } from './pages/transaction-detail.js';
import { SpendingStoryPage } from './pages/spending-story.js';
import { IncomePage } from './pages/income.js';
import { CategoryDetailPage } from './pages/category-detail.js';
import { SearchPage } from './pages/search.js';
import { LoginPage, setupLoginListeners } from './pages/login.js';
import { AuthService } from './services/auth.js';

// Phase 7 — Planning
import { PlanPage } from './pages/plan.js';
import { RecurringPage, RecurringPageAfterRender } from './pages/recurring.js';
import { UpcomingPage, UpcomingPageAfterRender } from './pages/upcoming.js';
import { CashflowPage, CashflowPageAfterRender } from './pages/cashflow.js';
import { GoalsPage, GoalsPageAfterRender } from './pages/goals.js';
import { GoalDetailPage, GoalDetailPageAfterRender } from './pages/goal-detail.js';
import { FinancialHealthPage, FinancialHealthPageAfterRender } from './pages/financial-health.js';

// Phase 8 — Forecast
import { ForecastPage } from './pages/forecast.js';

// Phase 10 — AI
import { AIHomePage, AIHomePageAfterRender } from './pages/ai-home.js';
import { AIChatPage, AIChatPageAfterRender } from './pages/ai-chat.js';
import { AIInsightPage, AIInsightPageAfterRender } from './pages/ai-insight.js';
import {
    AIAffordPage, AIAffordPageAfterRender,
    AIMoneyLeaksPage, AIMoneyLeaksPageAfterRender,
    AIExplainMonthPage, AIExplainMonthPageAfterRender,
    AIGoalAcceleratorPage, AIGoalAcceleratorPageAfterRender,
    AIWhatIfPage, AIWhatIfPageAfterRender
} from './pages/ai-simulators.js';

// Phase 11 — You / Profile
import { YouPage, YouPageAfterRender } from './pages/you.js';
import { YouConnectionsPage, YouConnectionsPageAfterRender } from './pages/you-connections.js';
import { YouPrivacyPage, YouPrivacyPageAfterRender } from './pages/you-privacy.js';
import { YouSecurityPage, YouSecurityPageAfterRender } from './pages/you-security.js';
import { YouExportPage, YouExportPageAfterRender, YouDeletePage, YouDeletePageAfterRender } from './pages/you-export-delete.js';
import { YouPreferencesPage, YouPreferencesPageAfterRender, YouNotificationsPage, YouNotificationsPageAfterRender } from './pages/you-settings.js';

// Phase 12 — Onboarding
import { OnboardingPage, OnboardingPageAfterRender } from './pages/onboarding.js';

// Final Screens
import { DataCoveragePage, DataCoveragePageAfterRender } from './pages/data-coverage.js';
import { LiabilitiesPage, LiabilitiesPageAfterRender } from './pages/liabilities.js';
import { ConnectionErrorPage, IncompleteDataPage, ErrorStatesAfterRender } from './pages/error-states.js';

// ============================================================================
// Icon System — Premium SVG Icons
// ============================================================================
const Icons = {
    home: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>',
    wallet: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20"/><circle cx="17" cy="14.5" r="1.5"/></svg>',
    layers: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    sparkles: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M18 14l.75 2.25L21 17l-2.25.75L18 20l-.75-2.25L15 17l2.25-.75L18 14z"/></svg>',
    user: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>',
    chevronLeft: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    plus: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    wifiOff: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0119 12.55"/><path d="M5 12.55a10.94 10.94 0 015.17-2.39"/><path d="M10.71 5.05A16 16 0 0122.58 9"/><path d="M1.42 9a15.91 15.91 0 014.7-2.88"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>',
    arrowRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    chatBubble: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
    target: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
};

// ============================================================================
// Navigation Configuration
// ============================================================================
const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: Icons.home, exactMatch: true },
    { path: '/money', label: 'Money', icon: Icons.wallet },
    { path: '/plan', label: 'Plan', icon: Icons.layers },
    { path: '/ai', label: 'AI', icon: Icons.sparkles },
    { path: '/you', label: 'You', icon: Icons.user },
];

// ============================================================================
// Route Definitions
// ============================================================================
const routes = {
    '/': HomePage,
    '/money': MoneyPage,
    '/accounts': AccountsPage,
    '/transactions': TransactionsPage,
    '/spending-story': SpendingStoryPage,
    '/income': IncomePage,
    '/search': SearchPage,
    '/login': LoginPage,
    '/plan': PlanPage,
    '/recurring': RecurringPage,
    '/upcoming': UpcomingPage,
    '/cashflow': CashflowPage,
    '/goals': GoalsPage,
    '/financial-health': FinancialHealthPage,
    '/forecast': ForecastPage,
    '/ai': AIHomePage,
    '/ai/chat': AIChatPage,
    '/ai/afford': AIAffordPage,
    '/ai/leaks': AIMoneyLeaksPage,
    '/ai/explain-month': AIExplainMonthPage,
    '/ai/goal-accelerator': AIGoalAcceleratorPage,
    '/ai/what-if': AIWhatIfPage,
    '/you': YouPage,
    '/you/connections': YouConnectionsPage,
    '/you/privacy': YouPrivacyPage,
    '/you/security': YouSecurityPage,
    '/you/export': YouExportPage,
    '/you/delete': YouDeletePage,
    '/you/preferences': YouPreferencesPage,
    '/you/notifications': YouNotificationsPage,
    '/onboarding': OnboardingPage,
    '/data-coverage': DataCoveragePage,
    '/liabilities': LiabilitiesPage,
    '/error/connection': ConnectionErrorPage,
    '/error/incomplete': IncompleteDataPage,
};

const afterRenderHooks = {
    '/recurring': RecurringPageAfterRender,
    '/upcoming': UpcomingPageAfterRender,
    '/cashflow': CashflowPageAfterRender,
    '/goals': GoalsPageAfterRender,
    '/financial-health': FinancialHealthPageAfterRender,
    '/ai': AIHomePageAfterRender,
    '/ai/chat': AIChatPageAfterRender,
    '/ai/afford': AIAffordPageAfterRender,
    '/ai/leaks': AIMoneyLeaksPageAfterRender,
    '/ai/explain-month': AIExplainMonthPageAfterRender,
    '/ai/goal-accelerator': AIGoalAcceleratorPageAfterRender,
    '/ai/what-if': AIWhatIfPageAfterRender,
    '/you': YouPageAfterRender,
    '/you/connections': YouConnectionsPageAfterRender,
    '/you/privacy': YouPrivacyPageAfterRender,
    '/you/security': YouSecurityPageAfterRender,
    '/you/export': YouExportPageAfterRender,
    '/you/delete': YouDeletePageAfterRender,
    '/you/preferences': YouPreferencesPageAfterRender,
    '/you/notifications': YouNotificationsPageAfterRender,
    '/onboarding': OnboardingPageAfterRender,
    '/data-coverage': DataCoveragePageAfterRender,
    '/liabilities': LiabilitiesPageAfterRender,
    '/error/connection': ErrorStatesAfterRender,
    '/error/incomplete': ErrorStatesAfterRender,
};

// ============================================================================
// App Class
// ============================================================================
class App {
    constructor() {
        this.root = document.getElementById('app-root');
        this.currentUser = null;
        this.isAuthInitialized = false;
        this.isShellReady = false;
        this.pageTransitionTimeout = null;
        this.retryCount = 0;
        this.maxRetries = 3;

        // Global click delegation for SPA routing
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link) {
                const href = link.getAttribute('href');
                // Intercept only same-origin path links (not external, not protocol-relative)
                if (href && href.startsWith('/') && !href.startsWith('//')) {
                    // Allow modifier-key clicks to open in new tab (native browser behavior)
                    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
                    e.preventDefault();
                    // Strip BASE_PATH if present, navigate handles re-prefixing
                    this.navigate(stripBase(href));
                    return;
                }
            }
            if (e.target.closest('[data-route]')) {
                if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
                e.preventDefault();
                this.navigate('/' + e.target.closest('[data-route]').dataset.route);
            }
        });

        // Browser back/forward
        window.addEventListener('popstate', () => this.route());

        // Network state
        window.addEventListener('offline', () => this.updateNetworkState());
        window.addEventListener('online', () => this.updateNetworkState());

        // Financial state changes (from corrections, etc.)
        window.addEventListener('FINANCIAL_STATE_CHANGED', () => this.route());

        // Init auth
        AuthService.onAuthStateChanged((user) => {
            this.currentUser = user;
            this.isAuthInitialized = true;
            this.route();
        });
    }

    // ------------------------------------------------------------------
    // Navigation
    // ------------------------------------------------------------------
    navigate(url) {
        // url is a clean route like '/money'. Push the base-prefixed URL.
        const fullUrl = withBase(url);
        window.history.pushState(null, null, fullUrl);
        this.route();
    }

    // ------------------------------------------------------------------
    // Anchor Prefixer — rewrites all in-page <a href="/..."> to include BASE_PATH
    // so hover status, right-click "open in new tab", and middle-click all work.
    // Called after every page render. Skips external, protocol-relative, and
    // already-prefixed links. Pure DOM, no re-render.
    // ------------------------------------------------------------------
    prefixAnchors(rootEl) {
        if (!BASE_PATH) return; // nothing to do at root mount
        const scope = rootEl || document;
        const anchors = scope.querySelectorAll('a[href^="/"]');
        anchors.forEach(a => {
            const href = a.getAttribute('href');
            if (!href || href.startsWith('//')) return; // external / protocol-relative
            if (href.startsWith(BASE_PATH + '/')) return; // already prefixed
            if (href === BASE_PATH) return; // already root-of-app
            // Prefix the clean href with BASE_PATH
            a.setAttribute('href', BASE_PATH + href);
        });
    }

    // ------------------------------------------------------------------
    // Network State
    // ------------------------------------------------------------------
    updateNetworkState() {
        const existing = document.getElementById('offline-banner');
        if (!navigator.onLine) {
            if (!existing) {
                const banner = document.createElement('div');
                banner.id = 'offline-banner';
                banner.className = 'offline-banner';
                banner.innerHTML = `
                    <div class="offline-banner-content">
                        ${Icons.wifiOff}
                        <span>You're offline. Showing last available data.</span>
                    </div>
                    <button class="offline-banner-close" aria-label="Dismiss">${Icons.x}</button>
                `;
                banner.querySelector('.offline-banner-close').addEventListener('click', () => banner.remove());
                const shell = document.getElementById('app-shell');
                if (shell) shell.prepend(banner);
                else document.body.prepend(banner);
            }
        } else if (existing) {
            existing.remove();
        }
    }

    // ------------------------------------------------------------------
    // Shell Rendering
    // ------------------------------------------------------------------
    ensureShell() {
        if (document.getElementById('app-shell')) return;

        this.root.innerHTML = `
            <div id="app-shell" class="app-shell">
                <aside id="sidebar" class="sidebar">
                    <div class="sidebar-header">
                        <div class="sidebar-logo">F</div>
                        <span class="sidebar-brand">FinCopilot</span>
                    </div>
                    <nav class="sidebar-nav" id="sidebar-nav"></nav>
                    <div class="sidebar-footer">
                        <div class="sidebar-user" id="sidebar-user">
                            <div class="avatar avatar--sm avatar--dark">?</div>
                            <span class="sidebar-user-name">Loading...</span>
                        </div>
                    </div>
                </aside>

                <main id="page-content" class="page-content"></main>

                <nav id="bottom-nav" class="bottom-nav"></nav>

                <!-- FAB -->
                <div id="fab" class="fab">
                    <button class="fab-trigger" id="fab-trigger" aria-label="Quick Actions">
                        ${Icons.plus}
                    </button>
                    <div class="fab-menu" id="fab-menu">
                        <button class="fab-item" data-fab-action="ai-chat">
                            <span class="fab-item-icon">${Icons.chatBubble}</span>
                            <span class="fab-item-label">Ask AI</span>
                        </button>
                        <button class="fab-item" data-fab-action="transactions">
                            <span class="fab-item-icon">${Icons.search}</span>
                            <span class="fab-item-label">Transactions</span>
                        </button>
                        <button class="fab-item" data-fab-action="goals">
                            <span class="fab-item-icon">${Icons.target}</span>
                            <span class="fab-item-label">Goals</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // FAB toggle
        const fabTrigger = document.getElementById('fab-trigger');
        const fabMenu = document.getElementById('fab-menu');
        if (fabTrigger && fabMenu) {
            fabTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = fabMenu.classList.contains('fab-menu-open');
                fabMenu.classList.toggle('fab-menu-open', !isOpen);
                fabTrigger.classList.toggle('fab-trigger-active', !isOpen);
            });
            document.addEventListener('click', (e) => {
                if (!fabMenu.contains(e.target) && !fabTrigger.contains(e.target)) {
                    fabMenu.classList.remove('fab-menu-open');
                    fabTrigger.classList.remove('fab-trigger-active');
                }
            });
            fabMenu.querySelectorAll('[data-fab-action]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.fabAction;
                    const routeMap = { 'ai-chat': '/ai/chat', 'transactions': '/transactions', 'goals': '/goals' };
                    if (routeMap[action]) this.navigate(routeMap[action]);
                    fabMenu.classList.remove('fab-menu-open');
                    fabTrigger.classList.remove('fab-trigger-active');
                });
            });
        }

        // Update sidebar user info
        if (this.currentUser) {
            const userEl = document.getElementById('sidebar-user');
            if (userEl) {
                const initial = (this.currentUser.displayName || this.currentUser.email || '?')[0].toUpperCase();
                userEl.innerHTML = `
                    <div class="avatar avatar--sm avatar--dark">${initial}</div>
                    <span class="sidebar-user-name">${this.currentUser.displayName || this.currentUser.email || 'User'}</span>
                `;
            }
        }

        this.isShellReady = true;
    }

    // ------------------------------------------------------------------
    // Navigation Rendering
    // ------------------------------------------------------------------
    renderNav(currentPath) {
        return NAV_ITEMS.map(item => {
            const isActive = item.exactMatch
                ? currentPath === item.path
                : currentPath.startsWith(item.path);
            return `
                <a href="${withBase(item.path)}" class="nav-item ${isActive ? 'nav-item--active' : ''}" aria-label="${item.label}" aria-current="${isActive ? 'page' : 'false'}">
                    <span class="nav-item-icon">${item.icon}</span>
                    <span class="nav-item-label">${item.label}</span>
                </a>
            `;
        }).join('');
    }

    updateNav(currentPath) {
        const bottomNav = document.getElementById('bottom-nav');
        const sidebarNav = document.getElementById('sidebar-nav');
        const navHtml = this.renderNav(currentPath);

        if (bottomNav) bottomNav.innerHTML = navHtml;
        if (sidebarNav) sidebarNav.innerHTML = navHtml;
    }

    // ------------------------------------------------------------------
    // Routing
    // ------------------------------------------------------------------
    async route() {
        if (!this.isAuthInitialized) {
            this.root.innerHTML = '<div class="boot-screen"><div class="boot-screen-logo">F</div><div class="boot-screen-bar"></div></div>';
            return;
        }

        // Strip BASE_PATH so route matching uses clean paths like '/money'
        let path = stripBase(window.location.pathname);
        if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);

        // Auth guard
        if (!this.currentUser && path !== '/login') return this.navigate('/login');
        if (this.currentUser && path === '/login') return this.navigate('/');

        // Ensure shell for non-login pages
        if (path !== '/login') this.ensureShell();

        // Resolve page component
        let pageContent = routes[path];
        let arg = null;

        if (!pageContent) {
            if (path.startsWith('/accounts/')) { pageContent = AccountDetailPage; arg = path.split('/')[2]; }
            else if (path.startsWith('/transactions/')) { pageContent = TransactionDetailPage; arg = path.split('/')[2]; }
            else if (path.startsWith('/categories/')) { pageContent = CategoryDetailPage; arg = path.split('/')[2]; }
            else if (path.startsWith('/goal-detail/')) { pageContent = GoalDetailPage; arg = path.split('/')[2]; }
            else if (path.startsWith('/ai/insight/')) { pageContent = AIInsightPage; arg = path.split('/')[3]; }
            else { pageContent = this.notFoundPage(); }
        }

        this.updateNetworkState();

        try {
            if (path === '/login') {
                // Login page — no shell
                const html = await pageContent(arg);
                this.root.innerHTML = html;
                this.prefixAnchors(this.root);
                setupLoginListeners();
            } else {
                // Update navigation
                this.updateNav(path);

                // Hide FAB on onboarding and full-screen pages
                const fabHidePages = ['/onboarding', '/ai/chat', '/ai/afford', '/ai/leaks', '/ai/what-if', '/ai/explain-month', '/ai/goal-accelerator', '/login'];
                const shell = document.getElementById('app-shell');
                if (shell) {
                    if (fabHidePages.some(p => path.startsWith(p))) {
                        shell.classList.add('app-shell--hide-fab');
                    } else {
                        shell.classList.remove('app-shell--hide-fab');
                    }
                }

                // Show loading skeleton
                const mainContent = document.getElementById('page-content');
                mainContent.innerHTML = '<div class="page-content-skeleton"><div class="skeleton skeleton--card mb-4" style="height:120px"></div><div class="skeleton skeleton--card mb-4" style="height:80px"></div><div class="skeleton skeleton--card" style="height:200px"></div></div>';

                // Render page with animation
                const html = await pageContent(arg);
                
                // Apply page transition
                if (this.pageTransitionTimeout) clearTimeout(this.pageTransitionTimeout);
                mainContent.style.opacity = '0';
                mainContent.style.transform = 'translateY(8px)';
                
                requestAnimationFrame(() => {
                    this.retryCount = 0; // Reset on successful render
                    mainContent.innerHTML = html;
                    // Prefix all in-page anchors with BASE_PATH (after content is in DOM)
                    this.prefixAnchors(mainContent);
                    // Full-height page class management
                    const fullHeightPages = ['/ai/chat', '/ai/afford', '/ai/leaks', '/ai/what-if', '/ai/explain-month', '/ai/goal-accelerator'];
                    if (fullHeightPages.some(p => path.startsWith(p))) {
                        mainContent.classList.add('page-content--fullheight');
                    } else {
                        mainContent.classList.remove('page-content--fullheight');
                    }
                    // Trigger AfterRender hooks (with error boundary)
                    const triggerAfterRender = async () => {
                        try {
                            if (afterRenderHooks[path]) {
                                afterRenderHooks[path]();
                            } else if (path.startsWith('/goal-detail/')) {
                                GoalDetailPageAfterRender(arg);
                            } else if (path.startsWith('/ai/insight/')) {
                                AIInsightPageAfterRender(arg);
                            }
                        } catch (hookError) {
                            console.error('[AfterRender Error]', path, hookError);
                            // Don't crash the app — show error inline
                            const mainContent = document.getElementById('page-content');
                            if (mainContent && !mainContent.querySelector('.error-state')) {
                                const errDiv = document.createElement('div');
                                errDiv.className = 'page-container';
                                errDiv.style.padding = 'var(--space-8)';
                                errDiv.innerHTML = `
                                    <div class="error-state">
                                        <h3 class="error-state-title">Something went wrong</h3>
                                        <p class="error-state-description">${hookError.message}</p>
                                        <button class="btn btn-secondary mt-4" onclick="window.appInstance.route()">Retry</button>
                                    </div>
                                `;
                                mainContent.appendChild(errDiv);
                            }
                        }
                    };
                    
                    requestAnimationFrame(() => {
                        mainContent.style.transition = 'opacity 300ms ease, transform 300ms cubic-bezier(0.16, 1, 0.3, 1)';
                        mainContent.style.opacity = '1';
                        mainContent.style.transform = 'translateY(0)';
                        
                        // Fire hooks after DOM is fully painted
                        triggerAfterRender();
                    });
                });
            }
        } catch (error) {
            console.error('Routing error:', error);
            if (path === '/login') {
                this.root.innerHTML = `<div class="page-container"><div class="error-state"><h3 class="error-state-title">Error</h3><p class="error-state-description">${error.message}</p></div></div>`;
            } else {
                const mainContent = document.getElementById('page-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="page-container">
                            <div class="error-state">
                                <div class="error-state-icon">${Icons.x}</div>
                                <h3 class="error-state-title">Couldn't load this view</h3>
                                <p class="error-state-description">${error.message}</p>
                                <button class="btn btn-secondary" onclick="window.appInstance.retryRoute()">Retry</button>
                            </div>
                        </div>
                    `;
                }
            }
        }
    }

    // ------------------------------------------------------------------
    // Retry with Backoff
    // ------------------------------------------------------------------
    retryRoute() {
        if (this.retryCount >= this.maxRetries) {
            const mainContent = document.getElementById('page-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="page-container flex flex-col-center" style="min-height:80vh">
                        <h3 class="text-h3 mb-2">Unable to load</h3>
                        <p class="text-body text-secondary mb-6">Multiple retry attempts failed. Please check your connection and try refreshing the page.</p>
                        <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
                    </div>
                `;
            }
            return;
        }
        this.retryCount++;
        setTimeout(() => this.route(), 1000 * this.retryCount); // Linear backoff: 1s, 2s, 3s
    }

    // ------------------------------------------------------------------
    // 404 Page
    // ------------------------------------------------------------------
    notFoundPage() {
        return () => `
            <div class="page-container flex flex-col-center" style="min-height:80vh">
                <h1 class="text-hero" style="opacity:0.15">404</h1>
                <p class="text-body" style="color:var(--color-text-secondary)">Page not found</p>
                <a href="/" class="btn btn-secondary mt-6">Go Home</a>
            </div>
        `;
    }
}

// ============================================================================
// Bootstrap
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    window.appInstance = app;
    app.route();
});