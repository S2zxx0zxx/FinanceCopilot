import { ApiClient } from '../services/api.js';
import { ErrorState } from '../components/ui.js';

const formatCurrency = (paise) =>
  `₹${(paise / 100).toLocaleString('en-IN')}`;

export async function IncomePage() {
  try {
    const data = await ApiClient.get('/financial-state/income');
    const income = data.income ?? data;
    const totalPaise = income.effective_income_paise ?? income.total_paise ?? 0;
    const period = data.period ?? 'This month';
    const change = income.month_over_month_change;
    const sources = income.sources ?? income.categories ?? [];
    const sourceCount = sources.length;

    const hasData = totalPaise > 0 || sourceCount > 0;

    if (!hasData) {
      return `
        <main class="page">
          <header class="mb-8 animate-slide-up">
            <div class="flex items-center gap-3">
              <a href="/money" data-link class="btn btn-icon btn-ghost" aria-label="Back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </a>
              <h1 class="text-h1">Income</h1>
            </div>
          </header>
          <section class="animate-slide-up">
            <div class="card">
              <div class="empty-state" style="padding:var(--space-8) var(--space-6)">
                <svg class="empty-state-icon" style="width:48px;height:48px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v10l4-4"></path><path d="M12 12l-4-4"></path><path d="M4 17h16"></path><path d="M6 21h12"></path></svg>
                <h3 class="text-h3">No income data yet</h3>
                <p class="text-caption text-secondary" style="max-width:none">Your income details will appear here once transactions are recorded.</p>
              </div>
            </div>
          </section>
        </main>`;
    }

    const changeHtml = change != null
      ? `<p class="text-caption mt-3 ${change >= 0 ? 'text-positive' : 'text-secondary'}">
           <span class="badge ${change >= 0 ? 'badge-positive' : ''}">${change >= 0 ? '↑' : '↓'} ${Math.abs(change).toFixed(1)}%</span>
           <span class="text-tertiary"> vs last month</span>
         </p>`
      : `<p class="text-caption text-tertiary mt-3">Total monthly income for ${period}.</p>`;

    const sourcesHtml = sourceCount > 0
      ? `
        <section class="mb-6 animate-slide-up stagger-children">
          <div class="section-header mb-4">
            <h2 class="section-header-title">Income Sources</h2>
            <span class="text-caption text-tertiary">${sourceCount} ${sourceCount === 1 ? 'source' : 'sources'}</span>
          </div>
          <div class="flex flex-col gap-3">
            ${sources.map((s) => {
              const amount = s.amount_paise ?? s.amount ?? 0;
              const pct = totalPaise > 0 ? Math.round((amount / totalPaise) * 100) : 0;
              return `
                <div class="card card-flat p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-body font-medium truncate">${s.name ?? s.category ?? 'Other'}</span>
                    <span class="text-body font-semibold tabular-nums ml-3">${formatCurrency(amount)}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex-1 h-2 rounded-full bg-border-subtle">
                      <div class="h-full rounded-full bg-positive" style="width:${pct}%"></div>
                    </div>
                    <span class="text-caption text-tertiary tabular-nums w-9 text-right">${pct}%</span>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </section>`
      : '';

    const topSource = sources.length > 0
      ? sources.reduce((a, b) => (a.amount_paise ?? a.amount ?? 0) > (b.amount_paise ?? b.amount ?? 0) ? a : b)
      : null;

    return `
      <main class="page">
        <header class="mb-8 animate-slide-up">
          <div class="flex items-center gap-3">
            <a href="/money" data-link class="btn btn-icon btn-ghost" aria-label="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </a>
            <h1 class="text-h1">Income</h1>
          </div>
        </header>

        <div class="card card-hero mb-6 animate-slide-up" style="animation-delay:60ms">
          <p class="text-caption text-secondary mb-3">${period}</p>
          <h2 class="text-h2 text-positive tabular-nums">${formatCurrency(totalPaise)}</h2>
          ${changeHtml}
        </div>

        <div class="grid grid-cols-2 gap-3 mb-6 animate-slide-up" style="animation-delay:120ms">
          <div class="card card-flat py-4 px-4">
            <p class="text-caption text-tertiary mb-1">Sources</p>
            <p class="text-h3 font-semibold tabular-nums">${sourceCount}</p>
          </div>
          <div class="card card-flat py-4 px-4">
            <p class="text-caption text-tertiary mb-1">Top Source</p>
            <p class="text-body font-medium truncate">${topSource ? (topSource.name ?? topSource.category ?? 'Other') : '—'}</p>
          </div>
        </div>

        ${sourcesHtml}

        <footer class="border-b border-border-subtle pb-6 mb-4">
          <p class="text-caption text-tertiary px-1">Last updated ${period}</p>
        </footer>
      </main>`;
  } catch (error) {
    return `
      <main class="page">
        <header class="mb-8">
          <div class="flex items-center gap-3">
            <a href="/money" data-link class="btn btn-icon btn-ghost" aria-label="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </a>
            <h1 class="text-h1">Income</h1>
          </div>
        </header>
        ${ErrorState({ title: 'Failed to load income', description: error.message, onRetry: 'window.appInstance.route()' })}
      </main>`;
  }
}
