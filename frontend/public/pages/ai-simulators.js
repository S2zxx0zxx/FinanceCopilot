// ═══════════════════════════════════════════════════════════════════════
// FinCopilot — What-If Simulator (SCR-26)
// Simulate financial scenarios before making decisions
// ═══════════════════════════════════════════════════════════════════════

import { ApiClient } from '../services/api.js';
import { Badge, ErrorState, Skeleton, SectionHeader } from '../components/ui.js';

const SCENARIO_TYPES = [
    { value: 'purchase', label: 'Purchase', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>' },
    { value: 'savings', label: 'Savings', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-0.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2"></path><path d="M2 9v1c0 1.1.9 2 2 2h1"></path></svg>' },
    { value: 'income_change', label: 'Income Change', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>' },
    { value: 'expense_cut', label: 'Expense Cut', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>' },
    { value: 'custom', label: 'Custom', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>' }
];

const LABELS = {
    purchase: { title: 'What would I buy?', placeholder: 'e.g. New laptop, Vacation, Emergency repair' },
    savings: { title: 'What would I save?', placeholder: 'e.g. Monthly SIP increase, Emergency fund top-up' },
    income_change: { title: 'What income change?', placeholder: 'e.g. New job, Freelance project, Raise' },
    expense_cut: { title: 'What would I cut?', placeholder: 'e.g. OTT subscriptions, Dining out' },
    custom: { title: 'Describe the scenario', placeholder: 'e.g. Rent increases by 10% next month' }
};

const formatCurrency = (paise) => {
    if (paise == null) return '—';
    return (Number(paise) / 100).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });
};

const formatCompactCurrency = (paise) => {
    if (paise == null) return '0';
    const rupees = paise / 100;
    if (Math.abs(rupees) >= 10000000) return (rupees / 10000000).toFixed(2) + ' Cr';
    if (Math.abs(rupees) >= 100000) return (rupees / 100000).toFixed(2) + ' L';
    return rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

export async function AIWhatIfSimulatorPage() {
    return `
    <div class="page" aria-label="What-If Simulator">
        <!-- Header -->
        <header class="flex items-center gap-3 mb-6 animate-fade-in">
            <button class="btn btn-ghost btn-icon" aria-label="Go back" id="sim-back">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div class="flex-1">
                <h1 class="text-h1">What-If Simulator</h1>
            </div>
            <button class="btn btn-ghost btn-icon" aria-label="More info" id="sim-info-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </button>
        </header>

        <!-- Info Tooltip (hidden by default) -->
        <div class="card card-flat bg-surface-subtle mb-6 hidden animate-fade-in" id="sim-info-panel">
            <p class="text-body text-secondary leading-relaxed">
                Simulate how a financial change would affect your <strong>Safe-to-Spend</strong>.
                AI proposes scenarios based on your actual data, and a deterministic engine
                calculates the precise impact. No data is modified.
            </p>
        </div>

        <!-- Scenario Type Tabs -->
        <section class="mb-6 animate-slide-up" aria-label="Scenario type">
            <div class="flex gap-2 overflow-x-auto scrollbar-none pb-1" id="sim-type-tabs" role="tablist">
                ${SCENARIO_TYPES.map((type, i) => `
                    <button
                        class="tabs-item shrink-0 ${i === 0 ? 'active' : ''}"
                        role="tab"
                        aria-selected="${i === 0}"
                        data-type="${type.value}"
                        id="sim-tab-${type.value}"
                        aria-controls="sim-type-panel"
                    >
                        ${type.icon}
                        <span class="ml-1.5">${type.label}</span>
                    </button>
                `).join('')}
            </div>
        </section>

        <!-- Input Section -->
        <section class="card mb-6 animate-slide-up" id="sim-input-section" role="tabpanel" aria-labelledby="sim-tab-purchase">
            <div class="ai-simulator-input-group">
                <div class="input-wrapper">
                    <label class="input-label" for="sim-label" id="sim-label-text">What would I buy?</label>
                    <input type="text" id="sim-label" class="input" placeholder="e.g. New laptop, Vacation, Emergency repair" autocomplete="off">
                </div>
                <div class="input-wrapper">
                    <label class="input-label" for="sim-amount">Amount</label>
                    <div class="flex items-center">
                        <span class="text-body text-tertiary font-medium tabular-nums shrink-0 mr-1">₹</span>
                        <input
                            type="number"
                            id="sim-amount"
                            class="input text-metric tabular-nums flex-1"
                            placeholder="50,000"
                            inputmode="numeric"
                            min="0"
                            step="100"
                            aria-describedby="sim-amount-hint"
                        >
                    </div>
                    <p class="input-hint" id="sim-amount-hint">Enter amount in rupees</p>
                </div>
                <div class="input-wrapper">
                    <label class="input-label" for="sim-timeline">Timeline <span class="text-tertiary font-normal normal-case tracking-normal">(optional)</span></label>
                    <div class="flex items-center gap-4">
                        <input
                            type="range"
                            id="sim-timeline"
                            min="1"
                            max="12"
                            value="1"
                            class="flex-1"
                            aria-valuemin="1"
                            aria-valuemax="12"
                            aria-valuenow="1"
                            aria-label="Timeline in months"
                        >
                        <span class="text-body font-medium tabular-nums w-12 text-center shrink-0" id="sim-timeline-value">1 mo</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-block btn-lg" id="sim-run-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    Run Simulation
                </button>
            </div>
        </section>

        <!-- Results Section (hidden until simulation run) -->
        <section class="hidden" id="sim-results" aria-live="polite" aria-label="Simulation results">
        </section>
    </div>`;
}

export function AIWhatIfSimulatorPageAfterRender() {
    const backBtn = document.getElementById('sim-back');
    const infoBtn = document.getElementById('sim-info-btn');
    const infoPanel = document.getElementById('sim-info-panel');
    const tabsContainer = document.getElementById('sim-type-tabs');
    const labelText = document.getElementById('sim-label-text');
    const labelInput = document.getElementById('sim-label');
    const amountInput = document.getElementById('sim-amount');
    const timelineInput = document.getElementById('sim-timeline');
    const timelineValue = document.getElementById('sim-timeline-value');
    const runBtn = document.getElementById('sim-run-btn');
    const resultsContainer = document.getElementById('sim-results');

    let currentType = 'purchase';

    // Back navigation
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
            } else if (window.appInstance) {
                window.appInstance.navigate('/ai');
            }
        });
    }

    // Info toggle
    if (infoBtn && infoPanel) {
        infoBtn.addEventListener('click', () => {
            infoPanel.classList.toggle('hidden');
            const isHidden = infoPanel.classList.contains('hidden');
            infoBtn.setAttribute('aria-expanded', String(!isHidden));
        });
    }

    // Tab switching
    if (tabsContainer) {
        tabsContainer.querySelectorAll('.tabs-item').forEach(tab => {
            tab.addEventListener('click', () => {
                tabsContainer.querySelectorAll('.tabs-item').forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');

                currentType = tab.dataset.type;
                const config = LABELS[currentType] || LABELS.custom;
                if (labelText) labelText.textContent = config.title;
                if (labelInput) labelInput.placeholder = config.placeholder;

                // Hide results when switching type
                if (resultsContainer) resultsContainer.classList.add('hidden');
            });
        });
    }

    // Timeline slider
    if (timelineInput && timelineValue) {
        timelineInput.addEventListener('input', () => {
            const val = parseInt(timelineInput.value, 10);
            timelineValue.textContent = val === 1 ? '1 mo' : `${val} mos`;
            timelineInput.setAttribute('aria-valuenow', String(val));
        });
    }

    // Form validation
    const validateForm = () => {
        const amount = parseFloat(amountInput?.value);
        if (!amount || amount <= 0) return { valid: false, error: 'Please enter a valid amount.' };
        if (amount > 100000000) return { valid: false, error: 'Amount seems too high. Please check.' };
        return { valid: true, amountRupees: amount };
    };

    // Show validation error
    const showValidationError = (msg) => {
        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = `
            <div class="alert alert-danger animate-fade-in">
                <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <div class="alert-content">
                    <p class="alert-message">${msg}</p>
                </div>
            </div>
        `;
    };

    // Render results
    const renderResults = (data, label) => {
        if (!data) return;

        const impact = data.impact ?? 0;
        const newSts = data.new_sts ?? 0;
        const confidence = data.confidence ?? 0;
        const coverage = data.coverage ?? 0;
        const tradeOffs = data.trade_offs || [];
        const assumptions = data.assumptions || [];
        const isPositive = impact >= 0;

        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = `
            <!-- Impact Summary Card -->
            <div class="card animate-scale-in mb-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-xl ${isPositive ? 'bg-positive-soft' : 'bg-negative-soft'} flex items-center justify-center shrink-0">
                        ${isPositive
                            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-positive"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>'
                            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-negative"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>'
                        }
                    </div>
                    <div class="flex-1">
                        <p class="text-caption text-tertiary">Safe-to-Spend Impact</p>
                        <p class="text-h2 ${isPositive ? 'text-positive' : 'text-negative'} tabular-nums">
                            ${isPositive ? '+' : ''}${formatCurrency(impact)}
                        </p>
                    </div>
                </div>

                <div class="ai-simulator-result-comparison">
                    <div class="ai-simulator-comparison-item">
                        <span class="ai-simulator-comparison-label">New STS</span>
                        <span class="ai-simulator-comparison-value text-primary tabular-nums">${formatCompactCurrency(newSts)}</span>
                    </div>
                    <div class="w-px h-8 bg-border-subtle"></div>
                    <div class="ai-simulator-comparison-item">
                        <span class="ai-simulator-comparison-label">Direction</span>
                        <span class="ai-simulator-comparison-delta ${isPositive ? 'positive' : 'negative'}">
                            ${isPositive
                                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg> Increase'
                                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg> Decrease'
                            }
                        </span>
                    </div>
                </div>
            </div>

            <!-- Trade-offs -->
            ${tradeOffs.length > 0 ? `
            <section class="mb-6 animate-slide-up">
                <h3 class="text-label text-secondary uppercase mb-4">Trade-offs</h3>
                <div class="card">
                    <ul class="flex flex-col gap-0">
                        ${tradeOffs.map((t, i) => `
                            <li class="flex items-start gap-3 p-4 ${i < tradeOffs.length - 1 ? 'border-b border-b-subtle' : ''}">
                                <div class="w-6 h-6 rounded-full ${t.type === 'gain' ? 'bg-positive-soft' : 'bg-negative-soft'} flex items-center justify-center shrink-0 mt-0.5">
                                    ${t.type === 'gain'
                                        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-positive"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                                        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-negative"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                                    }
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-body font-medium text-primary">${t.label || t.description}</p>
                                    ${t.amount != null ? `<p class="text-caption text-secondary mt-1 tabular-nums">${formatCurrency(t.amount)}</p>` : ''}
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </section>` : ''}

            <!-- Confidence & Coverage -->
            <section class="mb-6 animate-slide-up">
                <div class="card card-flat p-5">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-body font-medium text-primary">Simulation Confidence</span>
                        ${Badge({ label: confidence >= 80 ? 'High' : confidence >= 50 ? 'Medium' : 'Low', variant: confidence >= 80 ? 'neutral' : confidence >= 50 ? 'warning' : 'negative' })}
                    </div>
                    <div class="confidence-bar">
                        <div class="confidence-bar-track">
                            <div class="confidence-bar-fill ${confidence >= 80 ? 'high' : confidence >= 50 ? 'medium' : 'low'}" style="width:${confidence}%"></div>
                        </div>
                        <span class="confidence-bar-value">${confidence}%</span>
                    </div>
                    ${coverage > 0 ? `
                    <p class="text-caption text-tertiary mt-3">Based on <strong class="text-secondary">${coverage}%</strong> of your connected data</p>
                    ` : ''}
                </div>
            </section>

            <!-- Assumptions (collapsible) -->
            ${assumptions.length > 0 ? `
            <section class="mb-6 animate-slide-up">
                <details class="card card-flat bg-surface-subtle group">
                    <summary class="p-5 cursor-pointer text-body font-medium text-secondary select-none flex items-center justify-between gap-3">
                        <span>Assumptions</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary shrink-0 transition-transform-slow group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </summary>
                    <ul class="px-5 pb-5 border-t border-t-subtle pt-4 flex flex-col gap-2">
                        ${assumptions.map(a => `
                            <li class="flex items-start gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-tertiary shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                <span class="text-caption text-secondary leading-relaxed">${typeof a === 'string' ? a : a.text || a.description || ''}</span>
                            </li>
                        `).join('')}
                    </ul>
                </details>
            </section>` : ''}

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3 mb-8 animate-slide-up">
                <button class="btn btn-primary btn-block" id="sim-ask-ai-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    Ask AI about this
                </button>
                <div class="grid grid-cols-2 gap-3">
                    <button class="btn btn-secondary" id="sim-save-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        Save Scenario
                    </button>
                    <button class="btn btn-ghost" id="sim-reset-btn">Reset</button>
                </div>
            </div>
        `;

        // Attach action button handlers
        const askAiBtn = document.getElementById('sim-ask-ai-btn');
        if (askAiBtn) {
            const scenarioText = `What if I ${currentType.replace('_', ' ')} of ${label || formatCurrency(amountInput.value * 100)}?`;
            askAiBtn.addEventListener('click', () => {
                if (window.appInstance) {
                    window.appInstance.navigate('/ai/chat?q=' + encodeURIComponent(scenarioText));
                }
            });
        }

        const saveBtn = document.getElementById('sim-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                saveBtn.disabled = true;
                try {
                    await ApiClient.post('/ai/simulate/save', {
                        type: currentType,
                        label: labelInput?.value || '',
                        amount_paise: Math.round(parseFloat(amountInput.value) * 100),
                        timeline_days: parseInt(timelineInput?.value, 10) * 30
                    });
                    saveBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-positive"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Saved';
                } catch (err) {
                    saveBtn.disabled = false;
                    console.error('Save scenario error:', err);
                }
            });
        }

        const resetBtn = document.getElementById('sim-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (labelInput) labelInput.value = '';
                if (amountInput) amountInput.value = '';
                if (timelineInput) {
                    timelineInput.value = 1;
                    timelineValue.textContent = '1 mo';
                }
                resultsContainer.classList.add('hidden');
                resultsContainer.innerHTML = '';
            });
        }
    };

    // Run simulation
    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            const validation = validateForm();
            if (!validation.valid) {
                showValidationError(validation.error);
                return;
            }

            // Show loading skeletons
            resultsContainer.classList.remove('hidden');
            resultsContainer.innerHTML = `
                <div class="animate-fade-in">
                    <div class="card mb-6 p-6">${Skeleton({ type: 'metric' })}</div>
                    <div class="card mb-6 p-5">${Skeleton({ type: 'text', lines: 3 })}</div>
                </div>
            `;

            runBtn.disabled = true;
            const originalBtnText = runBtn.innerHTML;
            runBtn.innerHTML = '<span class="spinner spinner-sm spinner-white"></span> Simulating...';

            try {
                const data = await ApiClient.post('/ai/simulate', {
                    type: currentType,
                    amount_paise: Math.round(validation.amountRupees * 100),
                    label: labelInput?.value || '',
                    timeline_days: parseInt(timelineInput?.value, 10) * 30
                });

                renderResults(data, labelInput?.value);
            } catch (err) {
                console.error('Simulation error:', err);
                resultsContainer.innerHTML = ErrorState({
                    title: 'Simulation failed',
                    description: err.message || 'Could not run the simulation. Please try again.',
                    onRetry: 'simRetry()'
                });

                window.simRetry = () => {
                    runBtn.click();
                };
            } finally {
                runBtn.disabled = false;
                runBtn.innerHTML = originalBtnText;
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════
// LEGACY SIMULATOR ROUTES (kept for backward compatibility)
// These are redirected to the unified What-If Simulator above
// ═══════════════════════════════════════════════════════════════════════

export async function AIAffordPage() {
    return AIWhatIfSimulatorPage();
}
export function AIAffordPageAfterRender() {
    AIWhatIfSimulatorPageAfterRender();
}

export async function AIGoalAcceleratorPage() {
    return AIWhatIfSimulatorPage();
}
export function AIGoalAcceleratorPageAfterRender() {
    AIWhatIfSimulatorPageAfterRender();
}

export async function AIExplainMonthPage() {
    return AIWhatIfSimulatorPage();
}
export async function AIExplainMonthPageAfterRender() {
    AIWhatIfSimulatorPageAfterRender();
}

export async function AIMoneyLeaksPage() {
    return AIWhatIfSimulatorPage();
}
export async function AIMoneyLeaksPageAfterRender() {
    AIWhatIfSimulatorPageAfterRender();
}

export async function AIWhatIfPage() {
    return AIWhatIfSimulatorPage();
}
export function AIWhatIfPageAfterRender() {
    AIWhatIfSimulatorPageAfterRender();
}
