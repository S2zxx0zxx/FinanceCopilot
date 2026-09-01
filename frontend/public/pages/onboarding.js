/**
 * Onboarding Flow (SCR-01/02/03/04) — Welcome, Trust, Goal, Data.
 * Multi-step onboarding with progressive disclosure.
 * Calm, premium, trust-building first impression.
 */
import { ApiClient } from '../services/api.js';
import { ErrorState } from '../components/ui.js';

const GOAL_TYPES = [
    { id: 'emergency_fund', label: 'Emergency Fund', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
    { id: 'vacation', label: 'Vacation', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
    { id: 'debt_payoff', label: 'Debt Payoff', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
    { id: 'save_home', label: 'Save for Home', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>' },
    { id: 'retirement', label: 'Retirement', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
    { id: 'custom', label: 'Custom', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' },
];

const TIMELINE_OPTIONS = [
    { value: 3, label: '3 months' },
    { value: 6, label: '6 months' },
    { value: 12, label: '12 months' },
    { value: 24, label: '24 months' },
];

const IMPORT_METHODS = [
    { id: 'csv', label: 'CSV File', desc: 'Upload a spreadsheet export from your bank', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
    { id: 'pdf', label: 'PDF Statement', desc: 'Import from PDF bank statements', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
    { id: 'excel', label: 'Excel File', desc: 'Upload .xlsx or .xls spreadsheets', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>' },
    { id: 'bank', label: 'Bank Connection', desc: 'Securely link your bank via read-only access', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' },
    { id: 'manual', label: 'Manual Entry', desc: 'Add transactions one by one', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' },
];

export async function OnboardingPage() {
    return `
    <div class="page onboarding-step" aria-label="Welcome to FinCopilot">
        <div id="ob-root" class="pt-8">
            <div class="flex justify-center py-16">
                <span class="spinner spinner-sm"></span>
            </div>
        </div>
    </div>`;
}

export function OnboardingPageAfterRender() {
    const root = document.getElementById('ob-root');
    if (!root) return;

    let currentStep = 1;
    let consentGiven = false;
    let selectedGoal = null;
    let targetAmount = '';
    let selectedTimeline = null;

    function stepDots(step) {
        return `
            <div class="flex items-center justify-center gap-3 mb-10" role="progressbar" aria-valuenow="${step}" aria-valuemin="1" aria-valuemax="4" aria-label="Step ${step} of 4">
                ${[1, 2, 3, 4].map(i => `
                    <div class="w-5 h-5 rounded-full ${i === step ? 'bg-primary' : i < step ? 'bg-gray-900' : 'bg-gray-200'}" ${i === step ? 'aria-current="step"' : ''}></div>
                    ${i < 4 ? '<div class="w-8 h-2 ' + (i < step ? 'bg-gray-900' : 'bg-gray-200') + '"></div>' : ''}
                `).join('')}
            </div>`;
    }

    function render() {
        if (currentStep === 1) renderStep1();
        else if (currentStep === 2) renderStep2();
        else if (currentStep === 3) renderStep3();
        else if (currentStep === 4) renderStep4();
    }

    function renderStep1() {
        root.innerHTML = `
            <div class="animate-fade-in">
                <div class="flex justify-center mb-12">
                    <div class="avatar avatar--dark avatar--lg">F</div>
                </div>

                <div class="text-center mb-10">
                    <h1 class="text-display mb-4">Welcome to FinCopilot</h1>
                    <p class="text-body text-secondary max-w-sm mx-auto">Your AI-powered financial copilot. Understand your money, plan for the future, and grow with confidence.</p>
                </div>

                <div class="flex flex-col gap-4 mb-10">
                    <div class="card flex items-start gap-4 animate-slide-up">
                        <div class="shrink-0 p-3 bg-surface-subtle rounded-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-secondary"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        </div>
                        <div>
                            <h3 class="text-body text-primary font-medium">Understand</h3>
                            <p class="text-caption text-secondary mt-1">See where your money goes with clear, honest analysis.</p>
                        </div>
                    </div>
                    <div class="card flex items-start gap-4 animate-slide-up">
                        <div class="shrink-0 p-3 bg-surface-subtle rounded-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-secondary"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div>
                            <h3 class="text-body text-primary font-medium">Plan</h3>
                            <p class="text-caption text-secondary mt-1">Set goals, track progress, and stay on course.</p>
                        </div>
                    </div>
                    <div class="card flex items-start gap-4 animate-slide-up">
                        <div class="shrink-0 p-3 bg-surface-subtle rounded-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-secondary"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        </div>
                        <div>
                            <h3 class="text-body text-primary font-medium">Grow</h3>
                            <p class="text-caption text-secondary mt-1">Build better habits with AI-powered insights.</p>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary btn-block btn-lg" id="ob-step1-next" aria-label="Get started with onboarding">Get Started</button>
            </div>
        `;

        document.getElementById('ob-step1-next').addEventListener('click', () => { currentStep = 2; render(); });
    }

    function renderStep2() {
        root.innerHTML = `
            <div class="animate-fade-in">
                ${stepDots(2)}

                <div class="card card-dark mb-6">
                    <div class="flex items-start gap-4">
                        <div class="shrink-0 mt-0.5">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </div>
                        <div>
                            <h2 class="text-h3 text-inverse">Your data is protected</h2>
                            <p class="text-body mt-2 text-gray-400">We use end-to-end encryption. Your financial data is never shared without your explicit consent. You can delete everything at any time.</p>
                        </div>
                    </div>
                </div>

                <div class="card mb-6">
                    <h3 class="text-h3 mb-4">How we use your data</h3>
                    <ul class="flex flex-col gap-4">
                        <li class="flex items-start gap-3">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-positive shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span class="text-body text-secondary">Transaction analysis to find patterns and insights</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-positive shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span class="text-body text-secondary">Goal tracking to measure your progress</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-positive shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span class="text-body text-secondary">AI insights to help you make better decisions</span>
                        </li>
                    </ul>
                </div>

                <div class="card flex items-center justify-between mb-6">
                    <div class="flex-1">
                        <p class="text-body text-primary font-medium">I consent to data processing</p>
                        <p class="text-caption text-secondary mt-1">Required to use FinCopilot. You can revoke at any time.</p>
                    </div>
                    <label class="toggle">
                        <input type="checkbox" class="toggle" id="ob-consent-toggle" aria-label="Consent to data processing">
                        <div class="toggle-track"></div>
                    </label>
                </div>

                <div id="ob-step2-error" class="text-negative text-caption mb-4 text-center hidden"></div>

                <div class="flex justify-between items-center">
                    <button class="btn btn-ghost" id="ob-step2-back" aria-label="Go back to welcome">Back</button>
                    <button class="btn btn-primary" id="ob-step2-next" disabled aria-label="Continue to goal setup">Continue</button>
                </div>
            </div>
        `;

        const consentToggle = document.getElementById('ob-consent-toggle');
        const continueBtn = document.getElementById('ob-step2-next');
        const errorDiv = document.getElementById('ob-step2-error');

        consentToggle.addEventListener('change', () => {
            consentGiven = consentToggle.checked;
            continueBtn.disabled = !consentGiven;
        });

        document.getElementById('ob-step2-back').addEventListener('click', () => { currentStep = 1; render(); });

        continueBtn.addEventListener('click', async () => {
            if (!consentGiven) return;
            continueBtn.disabled = true;
            continueBtn.textContent = 'Saving…';
            if (errorDiv) errorDiv.classList.add('hidden');

            try {
                await ApiClient.post('/trust/consent', { granted: true });
                currentStep = 3;
                render();
            } catch (err) {
                console.error('Consent failed:', err);
                if (errorDiv) { errorDiv.textContent = err.message || 'Failed to save consent'; errorDiv.classList.remove('hidden'); }
                continueBtn.disabled = false;
                continueBtn.textContent = 'Continue';
            }
        });
    }

    function renderStep3() {
        root.innerHTML = `
            <div class="animate-fade-in">
                ${stepDots(3)}

                <div class="mb-6">
                    <h2 class="text-h2 mb-2">Set a financial goal</h2>
                    <p class="text-body text-secondary">Optional — you can always add goals later.</p>
                </div>

                <div class="section-header">What are you saving for?</div>
                <div class="grid grid-cols-2 gap-3 mb-6" role="radiogroup" aria-label="Goal type">
                    ${GOAL_TYPES.map(g => `
                        <button class="card card-flat p-4 text-center goal-type-btn active-scale-sm ${selectedGoal === g.id ? 'is-selected ring-1-primary' : ''}" data-goal-id="${g.id}" role="radio" aria-checked="${selectedGoal === g.id}" aria-label="${g.label}">
                            <div class="flex justify-center mb-3 text-secondary">${g.icon}</div>
                            <span class="text-caption font-medium">${g.label}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="mb-6">
                    <div class="input-wrapper">
                        <label class="input-label" for="ob-target-amount">Target amount (optional)</label>
                        <input type="text" id="ob-target-amount" class="input" placeholder="e.g. 5,00,000" inputmode="numeric" autocomplete="off" value="${targetAmount}" aria-label="Target amount in rupees">
                    </div>
                </div>

                <div class="section-header">Timeline</div>
                <div class="flex gap-3 mb-8" role="radiogroup" aria-label="Goal timeline">
                    ${TIMELINE_OPTIONS.map(t => `
                        <button class="card card-flat p-3 flex-1 text-center timeline-btn active-scale-sm ${selectedTimeline === t.value ? 'is-selected ring-1-primary' : ''}" data-timeline="${t.value}" role="radio" aria-checked="${selectedTimeline === t.value}">
                            <span class="text-caption font-medium">${t.label}</span>
                        </button>
                    `).join('')}
                </div>

                <div id="ob-step3-error" class="text-negative text-caption mb-4 text-center hidden"></div>

                <div class="flex justify-between items-center">
                    <button class="btn btn-ghost" id="ob-step3-skip" aria-label="Skip goal setup">Skip for now</button>
                    <button class="btn btn-primary" id="ob-step3-next" aria-label="Continue to data connection">Continue</button>
                </div>
            </div>
        `;

        root.querySelectorAll('.goal-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedGoal = btn.dataset.goalId;
                root.querySelectorAll('.goal-type-btn').forEach(b => { b.classList.remove('is-selected', 'ring-1-primary'); b.setAttribute('aria-checked', 'false'); });
                btn.classList.add('is-selected', 'ring-1-primary');
                btn.setAttribute('aria-checked', 'true');
            });
        });

        root.querySelectorAll('.timeline-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedTimeline = Number(btn.dataset.timeline);
                root.querySelectorAll('.timeline-btn').forEach(b => { b.classList.remove('is-selected', 'ring-1-primary'); b.setAttribute('aria-checked', 'false'); });
                btn.classList.add('is-selected', 'ring-1-primary');
                btn.setAttribute('aria-checked', 'true');
            });
        });

        const amountInput = document.getElementById('ob-target-amount');
        if (amountInput) {
            amountInput.addEventListener('input', () => { targetAmount = amountInput.value; });
        }

        document.getElementById('ob-step3-skip').addEventListener('click', () => { currentStep = 4; render(); });

        document.getElementById('ob-step3-next').addEventListener('click', async () => {
            const nextBtn = document.getElementById('ob-step3-next');
            const errorDiv = document.getElementById('ob-step3-error');

            if (selectedGoal) {
                nextBtn.disabled = true;
                nextBtn.textContent = 'Saving…';
                if (errorDiv) errorDiv.classList.add('hidden');

                const amountPaise = targetAmount ? Math.round(parseFloat(targetAmount.replace(/,/g, '')) * 100) : null;

                try {
                    await ApiClient.post('/goals', {
                        type: selectedGoal,
                        target_paise: amountPaise,
                        timeline_months: selectedTimeline,
                    });
                    currentStep = 4;
                    render();
                } catch (err) {
                    console.error('Goal save failed:', err);
                    if (errorDiv) { errorDiv.textContent = err.message || 'Failed to save goal'; errorDiv.classList.remove('hidden'); }
                    nextBtn.disabled = false;
                    nextBtn.textContent = 'Continue';
                }
            } else {
                currentStep = 4;
                render();
            }
        });
    }

    function renderStep4() {
        root.innerHTML = `
            <div class="animate-fade-in">
                ${stepDots(4)}

                <div class="mb-6">
                    <h2 class="text-h2 mb-2">Connect your data</h2>
                    <p class="text-body text-secondary">Import your financial data to get the full FinCopilot experience.</p>
                </div>

                <div class="grid grid-cols-2 gap-3 mb-8">
                    ${IMPORT_METHODS.map(m => `
                        <button class="card card-flat p-5 text-center import-method-btn active-scale-sm" data-method="${m.id}" aria-label="Import via ${m.label}">
                            <div class="flex justify-center mb-3 text-secondary">${m.icon}</div>
                            <span class="text-caption font-medium">${m.label}</span>
                            <p class="text-2xs text-tertiary mt-2">${m.desc}</p>
                        </button>
                    `).join('')}
                </div>

                <div id="ob-step4-error" class="text-negative text-caption mb-4 text-center hidden"></div>

                <div class="flex flex-col gap-3">
                    <button class="btn btn-primary btn-block btn-lg" id="ob-step4-finish" aria-label="Finish setup">Finish Setup</button>
                    <button class="btn btn-ghost btn-block" id="ob-step4-later" aria-label="Connect data later">Connect Later</button>
                </div>
            </div>
        `;

        let selectedMethod = null;
        root.querySelectorAll('.import-method-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                selectedMethod = btn.dataset.method;
                btn.classList.add('is-selected', 'ring-1-primary');
            });
        });

        document.getElementById('ob-step4-later').addEventListener('click', finishOnboarding);
        document.getElementById('ob-step4-finish').addEventListener('click', finishOnboarding);

        async function finishOnboarding() {
            const finishBtn = document.getElementById('ob-step4-finish');
            const laterBtn = document.getElementById('ob-step4-later');
            const errorDiv = document.getElementById('ob-step4-error');
            if (finishBtn) finishBtn.disabled = true;
            if (laterBtn) laterBtn.disabled = true;
            if (finishBtn) finishBtn.textContent = 'Finishing…';
            if (errorDiv) errorDiv.classList.add('hidden');

            try {
                await ApiClient.post('/auth/onboarding-complete', {
                    import_method: selectedMethod,
                });
                if (window.appInstance) window.appInstance.navigate('/');
            } catch (err) {
                console.error('Onboarding complete failed:', err);
                if (errorDiv) { errorDiv.textContent = err.message || 'Failed to complete setup'; errorDiv.classList.remove('hidden'); }
                if (finishBtn) { finishBtn.disabled = false; finishBtn.textContent = 'Finish Setup'; }
                if (laterBtn) laterBtn.disabled = false;
            }
        }
    }

    render();
}
