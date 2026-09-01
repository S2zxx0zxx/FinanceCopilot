/**
 * Forecast Page (SCR-22) — Phase 8
 * Shows financial forecast (7/30/90 day) with confidence bands, drivers, assumptions.
 * NEVER shows false precision. Always shows confidence + coverage.
 */
import { ApiClient } from '../services/api.js';

const HORIZONS = [
  { days: 7, label: '7 Days' },
  { days: 30, label: '30 Days' },
  { days: 90, label: '90 Days' },
];

function formatPaise(p) {
  if (p == null) return '\u2014';
  return '\u20b9' + Math.abs(p / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function confidenceLabel(c) {
  if (c >= 0.8) return { cls: 'badge-positive', text: 'High Confidence' };
  if (c >= 0.6) return { cls: 'badge-warning', text: 'Moderate Confidence' };
  return { cls: 'badge-negative', text: 'Low Confidence' };
}

function coverageLabel(c) {
  if (c >= 0.85) return { cls: 'badge-positive', text: 'Strong Coverage' };
  if (c >= 0.7) return { cls: 'badge-warning', text: 'Fair Coverage' };
  return { cls: 'badge-negative', text: 'Weak Coverage' };
}

function buildChartSVG(dataPoints, width = 340, height = 180) {
  if (!dataPoints || dataPoints.length < 2) {
    return `<div class="flex items-center justify-center h-45 text-caption text-secondary">Insufficient data points for chart</div>`;
  }
  const pad = { t: 20, r: 10, b: 30, l: 50 };
  const cw = width - pad.l - pad.r;
  const ch = height - pad.t - pad.b;
  const vals = dataPoints.flatMap(d => [d.balance_paise, d.upper_paise, d.lower_paise]).filter(v => v != null);
  if (vals.length === 0) {
    return `<div class="flex items-center justify-center h-45 text-caption text-secondary">No balance data available</div>`;
  }
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const range = maxV - minV || 1;
  const xScale = (i) => pad.l + (i / (dataPoints.length - 1)) * cw;
  const yScale = (v) => pad.t + ch - ((v - minV) / range) * ch;

  const mainLine = dataPoints.map((d, i) => `${xScale(i)},${yScale(d.balance_paise)}`).join(' ');
  const upperLine = dataPoints.map((d, i) => `${xScale(i)},${yScale(d.upper_paise)}`).join(' ');
  const lowerLine = dataPoints.map((d, i) => `${xScale(i)},${yScale(d.lower_paise)}`).join(' ');
  const bandPath = upperLine + ' ' + lowerLine.split(' ').reverse().join(' ');
  const labels = dataPoints.filter((_, i) => i % Math.ceil(dataPoints.length / 4) === 0 || i === dataPoints.length - 1);

  return `
    <svg viewBox="0 0 ${width} ${height}" class="w-full" aria-label="Forecast trend chart" role="img">
      <defs>
        <linearGradient id="fc-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      <!-- Confidence band -->
      <polygon points="${bandPath}" fill="url(#fc-band)" />
      <!-- Upper bound -->
      <polyline points="${upperLine}" fill="none" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="4 4" />
      <!-- Lower bound -->
      <polyline points="${lowerLine}" fill="none" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="4 4" />
      <!-- Main line -->
      <polyline points="${mainLine}" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Data points on main line -->
      ${dataPoints.map((d, i) => `<circle cx="${xScale(i)}" cy="${yScale(d.balance_paise)}" r="3" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="2"/>`).join('')}
      <!-- X axis labels -->
      ${labels.map((d, i) => {
        const idx = dataPoints.indexOf(d);
        const x = xScale(idx);
        const dateStr = d.date ? new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';
        return `<text x="${x}" y="${height - 5}" text-anchor="middle" fill="var(--color-text-tertiary)" font-size="10" font-family="Inter, sans-serif">${dateStr}</text>`;
      }).join('')}
      <!-- Y axis labels -->
      <text x="${pad.l - 5}" y="${yScale(maxV) + 4}" text-anchor="end" fill="var(--color-text-tertiary)" font-size="10" font-family="Inter, sans-serif">${formatPaise(maxV)}</text>
      <text x="${pad.l - 5}" y="${yScale(minV) + 4}" text-anchor="end" fill="var(--color-text-tertiary)" font-size="10" font-family="Inter, sans-serif">${formatPaise(minV)}</text>
    </svg>`;
}

export async function ForecastPage() {
  return `
    <div class="page animate-fade-in" aria-label="Financial Forecast">
      <header class="mb-8">
        <div class="flex items-center justify-between mb-3">
          <h1 class="text-h1">Forecast</h1>
          <button class="btn btn-ghost btn-icon" aria-label="Forecast info" id="forecast-info-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </button>
        </div>
        <p class="text-body text-secondary">Projected outlook based on your patterns</p>
      </header>

      <div id="forecast-info-panel" class="card card-flat p-5 mb-8 hidden animate-slide-down">
        <p class="text-body text-secondary leading-relaxed">Forecasts use your confirmed recurring patterns, income history, and spending trends. They are <strong>not predictions</strong> — they show what happens if current patterns continue. Always check confidence and coverage levels.</p>
      </div>

      <!-- Horizon Selector -->
      <div class="flex gap-2 mb-8" role="tablist" aria-label="Forecast horizon">
        ${HORIZONS.map((h, i) => `
          <button class="btn ${i === 1 ? 'btn-primary' : 'btn-ghost'} flex-1" role="tab" aria-selected="${i === 1}" data-horizon="${h.days}">
            ${h.label}
          </button>
        `).join('')}
      </div>

      <div id="forecast-content">
        <div class="flex flex-col gap-4">
          <div class="card p-6"><div class="skeleton skeleton-text" style="width:60%"></div><div class="skeleton skeleton-text mt-4" style="width:80%"></div><div class="skeleton skeleton-text mt-4" style="width:40%"></div></div>
          <div class="card p-6" style="height:200px"><div class="skeleton skeleton-text" style="width:100%;height:100%"></div></div>
          <div class="card p-6"><div class="skeleton skeleton-text" style="width:50%"></div><div class="skeleton skeleton-text mt-4" style="width:70%"></div></div>
        </div>
      </div>
    </div>`;
}

export async function ForecastPageAfterRender() {
  const content = document.getElementById('forecast-content');
  const infoBtn = document.getElementById('forecast-info-btn');
  const infoPanel = document.getElementById('forecast-info-panel');
  let currentHorizon = 30;

  if (infoBtn && infoPanel) {
    infoBtn.addEventListener('click', () => {
      infoPanel.classList.toggle('hidden');
    });
  }

  const horizonBtns = document.querySelectorAll('[data-horizon]');
  horizonBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      horizonBtns.forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-ghost'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.remove('btn-ghost'); btn.classList.add('btn-primary'); btn.setAttribute('aria-selected', 'true');
      currentHorizon = parseInt(btn.dataset.horizon);
      loadForecast(currentHorizon);
    });
  });

  async function loadForecast(days) {
    if (!content) return;
    content.innerHTML = `
      <div class="flex flex-col gap-4">
        <div class="card p-6"><div class="skeleton skeleton-text" style="width:60%"></div><div class="skeleton skeleton-text mt-4" style="width:80%"></div><div class="skeleton skeleton-text mt-4" style="width:40%"></div></div>
        <div class="card p-6" style="height:200px"><div class="skeleton skeleton-text" style="width:100%;height:100%"></div></div>
        <div class="card p-6"><div class="skeleton skeleton-text" style="width:50%"></div><div class="skeleton skeleton-text mt-4" style="width:70%"></div></div>
      </div>`;

    try {
      const data = await ApiClient.get(`/forecast?horizon_days=${days}`);
      renderForecast(data, days);
    } catch (err) {
      if (err?.status === 422 || err?.code === 'INSUFFICIENT_DATA') {
        renderInsufficientData();
      } else if (!navigator.onLine) {
        content.innerHTML = `<div class="card p-8 text-center"><p class="text-body text-secondary mb-4">You're offline</p><button class="btn btn-primary" id="forecast-retry">Retry</button></div>`;
        document.getElementById('forecast-retry')?.addEventListener('click', () => loadForecast(days));
      } else {
        content.innerHTML = `<div class="card p-8 text-center"><p class="text-body text-negative mb-2">Unable to load forecast</p><p class="text-caption text-secondary mb-4">${err.message || 'Please try again'}</p><button class="btn btn-primary" id="forecast-retry">Retry</button></div>`;
        document.getElementById('forecast-retry')?.addEventListener('click', () => loadForecast(days));
      }
    }
  }

  function renderInsufficientData() {
    content.innerHTML = `
      <div class="card card-hero p-8 text-center animate-fade-in">
        <div class="w-14 h-14 rounded-full bg-surface-subtle flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </div>
        <h2 class="text-h2 mb-3">Not enough data yet</h2>
        <p class="text-body text-secondary mb-8 max-w-sm mx-auto">Forecasts need at least 30 days of transaction history. Connect more accounts or import data to get started.</p>
        <button class="btn btn-primary" onclick="window.appInstance.navigate('/you/connections')">Connect Accounts</button>
      </div>`;
  }

  function renderForecast(data, days) {
    const conf = confidenceLabel(data.confidence);
    const cov = coverageLabel(data.coverage);
    const netChange = data.projected_net_change_paise;
    const isPositive = netChange >= 0;
    const changeIcon = isPositive
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    const changeColor = isPositive ? 'text-positive' : 'text-negative';
    const freshnessBadge = data.is_stale
      ? '<span class="badge badge-warning">STALE</span>'
      : '<span class="badge badge-positive">LIVE</span>';

    content.innerHTML = `
      <div class="animate-fade-in">
        <!-- Data Quality Banner -->
        <div class="flex gap-2 mb-6 flex-wrap">
          <span class="badge ${cov.cls}">${cov.text} ${Math.round(data.coverage * 100)}%</span>
          <span class="badge ${conf.cls}">${conf.text} ${Math.round(data.confidence * 100)}%</span>
          ${freshnessBadge}
        </div>

        ${data.data_gaps && data.data_gaps.length > 0 ? `
          <div class="card p-5 mb-6 animate-slide-up">
            <div class="flex gap-3 items-start">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-warning flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div>
                <p class="text-body font-medium mb-2">Data gaps may affect accuracy:</p>
                <ul class="text-caption text-secondary flex flex-col gap-1">${data.data_gaps.map(g => `<li>\u2022 ${g}</li>`).join('')}</ul>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Forecast Summary Card -->
        <div class="card card-hero p-6 mb-6 animate-slide-up">
          <p class="text-caption text-secondary uppercase mb-2">Projected balance in ${days} days</p>
          <div class="flex items-end gap-3 mb-4">
            <span class="text-display">${formatPaise(data.projected_end_balance_paise)}</span>
            ${freshnessBadge}
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-caption text-secondary mb-1">Net change</p>
              <div class="flex items-center gap-2 ${changeColor}">
                ${changeIcon}
                <span class="text-body font-semibold">${isPositive ? '+' : '-'}${formatPaise(netChange)}</span>
              </div>
            </div>
            <div>
              <p class="text-caption text-secondary mb-1">Daily avg spending</p>
              <span class="text-body font-semibold">${formatPaise(data.projected_daily_avg_paise)}</span>
            </div>
          </div>
        </div>

        <!-- Forecast Chart -->
        <div class="card p-5 mb-6 animate-slide-up">
          <p class="text-caption text-secondary uppercase mb-4">Trend (dashed = confidence band)</p>
          ${buildChartSVG(data.data_points)}
        </div>

        <!-- Drivers -->
        ${data.drivers && data.drivers.length > 0 ? `
          <section class="mb-6 animate-slide-up">
            <h2 class="text-label text-secondary uppercase mb-4">Key Drivers</h2>
            <div class="flex flex-col gap-2">
              ${data.drivers.map(d => {
                const isSpend = d.impact_paise < 0;
                return `
                  <div class="card card-flat p-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center">
                        ${isSpend
                          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-negative"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>'
                          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-positive"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>'
                        }
                      </div>
                      <span class="text-body">${d.label}</span>
                    </div>
                    <span class="text-body font-semibold ${isSpend ? 'text-negative' : 'text-positive'}">${isSpend ? '-' : '+'}${formatPaise(d.impact_paise)}</span>
                  </div>`;
              }).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Assumptions -->
        ${data.assumptions && data.assumptions.length > 0 ? `
          <details class="mb-6 animate-slide-up">
            <summary class="card card-interactive p-4 cursor-pointer text-body font-medium">Assumptions</summary>
            <div class="card card-flat border-t-0 rounded-t-none p-5">
              <ul class="flex flex-col gap-2 text-body text-secondary">
                ${data.assumptions.map(a => `<li class="flex items-start gap-2"><span class="text-tertiary mt-1">\u2022</span><span>${a}</span></li>`).join('')}
              </ul>
            </div>
          </details>
        ` : ''}

        <!-- Actions -->
        <section class="animate-slide-up">
          <h2 class="text-label text-secondary uppercase mb-4">What can I do?</h2>
          <div class="flex flex-col gap-3">
            <button class="card card-interactive text-left p-5" onclick="window.appInstance.navigate('/recurring')">
              <div class="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"></path></svg>
                <span class="text-body font-medium">Adjust recurring payments</span>
              </div>
            </button>
            <button class="card card-interactive text-left p-5" onclick="window.appInstance.navigate('/ai/simulators')">
              <div class="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path></svg>
                <span class="text-body font-medium">Run a what-if simulation</span>
              </div>
            </button>
            <button class="card card-interactive text-left p-5" onclick="window.appInstance.navigate('/transactions')">
              <div class="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                <span class="text-body font-medium">Review recent spending</span>
              </div>
            </button>
          </div>
        </section>
      </div>`;
  }

  loadForecast(currentHorizon);
}
