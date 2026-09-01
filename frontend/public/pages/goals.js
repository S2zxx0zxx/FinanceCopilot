import { ApiClient } from '../services/api.js';
import { Button, SectionHeader, EmptyState, Badge, ErrorState } from '../components/ui.js';

function formatCurrency(paise) {
    if (paise == null) return '\u2014';
    return (Number(paise) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

function paceStatus(pace) {
    if (!pace) return '';
    const map = { completed: 'Completed', on_track: 'On track', in_progress: 'In progress', below: 'Behind target', deadline_passed: 'Deadline passed' };
    return map[pace.status] || pace.status;
}

function renderGoalCard(goal) {
    const prog = goal.pace?.progress_pct ?? 0;
    const isDone = goal.status === 'completed';

    return `
        <a href="/goal-detail/${goal.goal_id}" data-link class="goal-card card card-interactive animate-slide-up ${isDone ? 'opacity-60' : ''}">
            <div class="goal-card-header">
                <div>
                    <h3 class="text-h3 mb-2">${goal.name}</h3>
                    ${Badge({ label: goal.goal_type.replaceAll('_', ' '), variant: 'neutral' })}
                </div>
                <span class="text-metric ${prog >= 100 ? 'text-positive' : 'text-primary'}">${prog}%</span>
            </div>
            
            <div class="goal-card-progress">
                <div class="progress-bar">
                    <div class="progress-bar-fill ${isDone ? 'progress-bar-positive' : ''}" style="width:${Math.min(100, prog)}%"></div>
                </div>
            </div>
            
            <div class="goal-card-amounts">
                <span class="text-body font-medium">${formatCurrency(goal.current_amount_paise)}</span>
                <span class="text-caption text-secondary">of ${formatCurrency(goal.target_amount_paise)}</span>
            </div>
            
            <div class="separator mt-4"></div>
            
            <div class="flex justify-between items-center mt-4">
                <span class="text-caption text-secondary">${goal.target_date ? `Target: ${new Date(goal.target_date).toLocaleDateString()}` : 'No target date'}</span>
                <span class="badge ${isDone ? 'badge-positive' : 'badge-outline'}">${paceStatus(goal.pace)}</span>
            </div>
        </a>
    `;
}

function createGoalForm() {
    return `
        <div class="card bg-surface-elevated p-6 mb-8 animate-slide-up">
            <h2 class="text-h3 mb-6">New Goal</h2>
            <form id="create-goal-form" class="flex flex-col gap-5" novalidate>
                <div class="input-wrapper">
                    <label for="goal-name" class="input-label">Goal name *</label>
                    <input type="text" id="goal-name" name="name" class="input" required placeholder="e.g., Emergency Fund, Goa Trip" />
                </div>
                
                <div class="input-wrapper">
                    <label for="goal-type" class="input-label">Goal type *</label>
                    <select id="goal-type" name="goal_type" class="select" required>
                        <option value="">Select type...</option>
                        <option value="emergency_fund">Emergency Fund</option>
                        <option value="vacation">Vacation</option>
                        <option value="purchase">Purchase</option>
                        <option value="debt_payoff">Debt Payoff</option>
                        <option value="education">Education</option>
                        <option value="home">Home</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="input-wrapper">
                    <label for="goal-target" class="input-label">Target amount (*) *</label>
                    <input type="number" id="goal-target" name="target_amount_rupees" class="input" min="1" step="1" required placeholder="50000" />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-wrapper">
                        <label for="goal-date" class="input-label">Target date</label>
                        <input type="date" id="goal-date" name="target_date" class="input" />
                    </div>
                    <div class="input-wrapper">
                        <label for="goal-monthly" class="input-label">Monthly (*)</label>
                        <input type="number" id="goal-monthly" name="monthly_contribution_rupees" class="input" min="0" step="1" placeholder="5000" />
                    </div>
                </div>
                
                <div id="goal-form-error" class="text-caption text-negative hidden"></div>
                
                <div class="flex gap-3 mt-2">
                    <button type="submit" id="create-goal-btn" class="btn btn-primary flex-1">Create Goal</button>
                    <button type="button" id="cancel-goal-btn" class="btn btn-ghost">Cancel</button>
                </div>
            </form>
        </div>
    `;
}

export async function GoalsPage() {
    let goalsData;
    try {
        goalsData = await ApiClient.get('/goals');
    } catch (err) {
        return `
            <div class="page flex items-center justify-center">
                ${ErrorState({ title: 'Failed to load Goals', description: err.message, onRetry: 'window.appInstance.route()' })}
            </div>
        `;
    }

    const goals = goalsData?.goals || [];
    const active = goals.filter(g => ['active', 'draft'].includes(g.status));
    const completed = goals.filter(g => g.status === 'completed');

    return `
        <div class="page animate-fade-in">
            <header class="flex gap-4 items-center justify-between mb-10">
                <div class="flex gap-4 items-center">
                    <button onclick="window.history.back();" class="btn btn-icon" aria-label="Back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    </button>
                    <h1 class="text-h1">Goals</h1>
                </div>
                ${Button({ label: 'New Goal', variant: 'primary', id: 'show-create-goal' })}
            </header>

            <div id="create-goal-section" class="hidden">
                ${createGoalForm()}
            </div>

            ${active.length > 0 ? `
                <section class="mb-10 animate-slide-up">
                    <div class="section-header">
                        <h2 class="section-header-title">Active Goals (${active.length})</h2>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        ${active.map(renderGoalCard).join('')}
                    </div>
                </section>
            ` : ''}

            ${completed.length > 0 ? `
                <section class="mb-10 animate-slide-up">
                    <div class="section-header">
                        <h2 class="section-header-title">Completed (${completed.length})</h2>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        ${completed.map(renderGoalCard).join('')}
                    </div>
                </section>
            ` : ''}

            ${goals.length === 0 ? `
                <div class="empty-state">
                    <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="1.5"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    </svg>
                    <h3 class="empty-state-title">No goals yet</h3>
                    <p class="empty-state-description">Create your first financial goal to start tracking progress.</p>
                </div>
            ` : ''}
        </div>
    `;
}

export function GoalsPageAfterRender() {
    const showBtn = document.getElementById('show-create-goal');
    const createSection = document.getElementById('create-goal-section');
    const cancelBtn = document.getElementById('cancel-goal-btn');

    if (showBtn && createSection) {
        showBtn.addEventListener('click', () => {
            const isHidden = createSection.classList.contains('hidden');
            if (isHidden) {
                createSection.classList.remove('hidden');
            } else {
                createSection.classList.add('hidden');
            }
        });
    }

    if (cancelBtn && createSection) {
        cancelBtn.addEventListener('click', () => {
            createSection.classList.add('hidden');
        });
    }

    const form = document.getElementById('create-goal-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errDiv = document.getElementById('goal-form-error');
            const submitBtn = document.getElementById('create-goal-btn');
            errDiv.classList.add('hidden');

            const name = form.elements['name'].value.trim();
            const goalType = form.elements['goal_type'].value;
            const targetRupees = Number(form.elements['target_amount_rupees'].value);
            const targetDate = form.elements['target_date'].value || null;
            const monthlyRupees = Number(form.elements['monthly_contribution_rupees'].value || 0);

            if (!name) { errDiv.textContent = 'Goal name is required.'; errDiv.classList.remove('hidden'); return; }
            if (!goalType) { errDiv.textContent = 'Please select a goal type.'; errDiv.classList.remove('hidden'); return; }
            if (!targetRupees || targetRupees <= 0) { errDiv.textContent = 'Enter a valid target amount.'; errDiv.classList.remove('hidden'); return; }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Creating\u2026';

            try {
                await ApiClient.post('/goals', {
                    name,
                    goal_type: goalType,
                    target_amount_paise: Math.round(targetRupees * 100),
                    target_date: targetDate,
                    monthly_contribution_paise: monthlyRupees > 0 ? Math.round(monthlyRupees * 100) : null,
                    currency: 'INR'
                });

                window.appInstance.route();
            } catch (err) {
                errDiv.textContent = err.message || 'Failed to create goal. Please try again.';
                errDiv.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Goal';
            }
        });
    }
}
