/**
 * Data Coverage & Trust Center (SCR-09)
 * Shows user what data exists, why, what's connected, coverage.
 */
import { ApiClient } from '../services/api.js';

function svgRing(pct, size = 120, stroke = 8) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(pct, 1) * c);
  const color = pct >= 0.85 ? 'var(--color-positive)' : pct >= 0.7 ? 'var(--color-warning)' : 'var(--color-negative)';
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="mx-auto" aria-hidden="true">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--color-surface-subtle)" stroke-width="${stroke}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${offset}" transform="rotate(-90 ${size/2} ${size/2})"/>
    <text x="${size/2}" y="${size/2 - 8}" text-anchor="middle" dominant-baseline="middle" fill="var(--color-text-primary)" font-size="28" font-weight="700" font-family="Inter, sans-serif">${Math.round(pct * 100)}%</text>
    <text x="${size/2}" y="${size/2 + 16}" text-anchor="middle" fill="var(--color-text-secondary)" font-size="11" font-family="Inter, sans-serif">coverage</text>
  </svg>`;
}

function syncBadge(status) {
  const map = {
    LIVE: 'badge-positive', RECENT: 'badge-positive',
    STALE: 'badge-warning', OLD: 'badge-negative',
    SYNCING: 'badge-dark', ERROR: 'badge-negative', ACTIVE: 'badge-positive',
  };
  return `<span class="badge ${map[status] || 'badge-outline'}">${status}</span>`;
}

export async function DataCoveragePage() {
  return `
    <div class="page animate-fade-in" aria-label="Data Coverage">
      <header class="mb-8">
        <h1 class="text-h1">Data Coverage</h1>
        <p class="text-body text-secondary mt-3">Understand what powers your financial picture</p>
      </header>
      <div id="dc-content">
        <div class="flex flex-col gap-4">
          <div class="card p-8 text-center"><div class="skeleton skeleton-circle mx-auto mb-4" style="width:120px;height:120px"></div><div class="skeleton skeleton-text mx-auto" style="width:60%"></div></div>
          <div class="card p-6"><div class="skeleton skeleton-text" style="width:80%"></div><div class="skeleton skeleton-text mt-4" style="width:60%"></div></div>
        </div>
      </div>
    </div>`;
}

export async function DataCoveragePageAfterRender() {
  const content = document.getElementById('dc-content');
  if (!content) return;

  async function load() {
    try {
      const data = await ApiClient.get('/data-quality');
      render(data);
    } catch (err) {
      content.innerHTML = `
        <div class="card p-8 text-center animate-fade-in">
          <p class="text-body text-negative mb-2">Unable to load coverage data</p>
          <p class="text-caption text-secondary mb-4">${err.message || 'Unknown error'}</p>
          <button class="btn btn-primary" id="dc-retry">Retry</button>
        </div>`;
      document.getElementById('dc-retry')?.addEventListener('click', load);
    }
  }

  function render(data) {
    const score = data.coverage_score ?? 0;
    const statusLabel = data.status || 'Unknown';
    const m = data.metrics || {};

    content.innerHTML = `
      <div class="animate-fade-in">
        <!-- Coverage Score -->
        <div class="card card-hero p-8 mb-6 text-center">
          ${svgRing(score)}
          <p class="text-caption text-secondary mt-4 uppercase">Overall Coverage — ${statusLabel}</p>
        </div>

        <!-- Quality Metrics Grid -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="card card-flat p-5 text-center">
            <p class="text-display">${(m.total_transactions ?? 0).toLocaleString('en-IN')}</p>
            <p class="text-caption text-secondary mt-2">Total Transactions</p>
          </div>
          <div class="card card-flat p-5 text-center">
            <p class="text-display">${m.categories_detected ?? 0}</p>
            <p class="text-caption text-secondary mt-2">Categories Detected</p>
          </div>
          <div class="card card-flat p-5 text-center">
            <p class="text-display">${m.recurring_found ?? 0}</p>
            <p class="text-caption text-secondary mt-2">Recurring Patterns</p>
          </div>
          <div class="card card-flat p-5 text-center">
            <p class="text-display">${m.freshness_status || '—'}</p>
            <p class="text-caption text-secondary mt-2">Data Freshness</p>
          </div>
        </div>

        <!-- Connected Sources -->
        ${data.sources && data.sources.length > 0 ? `
          <section class="mb-8">
            <h2 class="text-label text-secondary uppercase mb-4">Connected Sources</h2>
            <div class="flex flex-col gap-2">
              ${data.sources.map(s => `
                <div class="card card-flat p-4 flex items-center justify-between">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center shrink-0">
                      <span class="text-body font-semibold text-secondary">${(s.institution || 'B').charAt(0).toUpperCase()}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-body font-medium truncate">${s.institution || 'Unknown'}</p>
                      <p class="text-caption text-secondary">${s.type || 'Account'} · ${(s.transaction_count ?? 0).toLocaleString('en-IN')} txns</p>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-1 shrink-0 ml-3">
                    ${syncBadge(s.status)}
                    <span class="text-micro text-tertiary">${s.last_sync ? new Date(s.last_sync).toLocaleDateString('en-IN', { day:'numeric', month:'short' }) : 'Never'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : `
          <div class="card p-8 text-center mb-8 animate-slide-up">
            <div class="w-14 h-14 rounded-full bg-surface-subtle flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"></path></svg>
            </div>
            <h2 class="text-h3 mb-2">No connections yet</h2>
            <p class="text-body text-secondary mb-6 max-w-sm mx-auto">Connect a bank account or import data to see your coverage score improve.</p>
            <button class="btn btn-primary" onclick="window.appInstance.navigate('/you/connections')">Connect Accounts</button>
          </div>
        `}

        <!-- Data Gaps -->
        ${data.gaps && data.gaps.length > 0 ? `
          <section class="mb-8">
            <h2 class="text-label text-secondary uppercase mb-4">Gaps Detected</h2>
            <div class="flex flex-col gap-2">
              ${data.gaps.map(g => `
                <div class="card card-flat p-4 flex items-center justify-between border-l-2 border-l-warning">
                  <div class="min-w-0 mr-3">
                    <p class="text-body font-medium">${g.description || g.type}</p>
                  </div>
                  <button class="btn btn-ghost btn-sm shrink-0" onclick="window.appInstance.navigate('${g.action_route || '/you/connections'}')">${g.action || 'Connect'}</button>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Trust Note -->
        <div class="card card-flat p-5 animate-slide-up">
          <div class="flex gap-3 items-start">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary flex-shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <p class="text-body text-secondary leading-relaxed">Your data is encrypted end-to-end and processed in isolated environments. FinCopilot never shares your data with third parties without explicit consent. <a href="/you/privacy" class="text-primary font-medium" onclick="event.preventDefault();window.appInstance.navigate('/you/privacy')">Learn more</a></p>
          </div>
        </div>
      </div>`;
  }

  load();
}