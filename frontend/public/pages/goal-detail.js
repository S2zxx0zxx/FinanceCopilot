import { ApiClient } from '../services/api.js';
import { Card, SectionHeader, Badge, Button, ErrorState, EmptyState } from '../components/ui.js';

function formatCurrency(paise) {
    if (paise == null) return '\u2014';
    return (Number(paise) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

function paceStatus(pace) {
    if (!pace) return '';
    const map = { completed: 'Completed', on_track: 'On track', in_progress: 'In progress', below: 'Behind target', deadline_passed: 'Deadline passed' };
    return map[pace.status] || pace.status;
}

export async function GoalDetailPage(goalId) {
    if (!goalId) {
        return `
            <div class="page flex items-center justify-center">
                ${ErrorState({ title: 'Goal ID is required', description: 'Cannot load goal details without an ID.' })}
            </div>
        `;
    }

    let goal;
    try {
        goal = await ApiClient.get(`/goals/${goalId}`);
    } catch (err) {
        return `
            <div class="page flex items-center justify-center">
                ${ErrorState({ title: err?.status === 404 ? 'Goal not found' : 'Failed to load goal', description: 'Unable to load goal details.', onRetry: 'window.appInstance.route()' })}
            </div>
        `;
    }

    const prog = goal.pace?.progress_pct ?? 0;
    const isDone = goal.status === 'completed';

    return `
        <div class="page animate-fade-in">
            <header class="flex gap-4 items-center mb-10">
                <button onclick="window.history.back();" class="btn btn-icon" aria-label="Back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                </button>
                <h1 class="text-h1">${goal.name}</h1>
            </header>

            <div class="card p-6 mb-10 animate-slide-up">
                <div class="flex justify-between items-start mb-8">
                    ${Badge({ label: goal.goal_type.replace(/_/g, ' '), variant: 'neutral' })}
                    ${Badge({ label: goal.status, variant: isDone ? 'positive' : 'warning' })}
                </div>
                
                <div class="flex flex-col md:flex-row justify-between mb-8 gap-6">
                    <div>
                        <p class="text-label text-secondary mb-2">Current Balance</p>
                        <p class="text-display text-primary">${formatCurrency(goal.current_amount_paise)}</p>
                    </div>
                    <div class="md:text-right">
                        <p class="text-label text-secondary mb-2">Target</p>
                        <p class="text-h2 text-tertiary">${formatCurrency(goal.target_amount_paise)}</p>
                    </div>
                </div>

                <div class="progress-bar mb-4">
                    <div class="progress-bar-fill ${isDone ? 'progress-bar-positive' : ''}" style="width:${Math.min(100, prog)}%"></div>
                </div>
                
                <div class="flex justify-between items-center mb-8">
                    <span class="text-body font-medium ${prog >= 100 ? 'text-positive' : 'text-primary'}">${prog}% complete</span>
                    <span class="badge ${isDone ? 'badge-positive' : 'badge-outline'}">${paceStatus(goal.pace)}</span>
                </div>
                
                <div class="separator"></div>
                
                <div class="grid grid-cols-3 gap-6 mt-6">
                    ${goal.target_date ? `
                        <div>
                            <p class="text-label text-secondary mb-1">Target Date</p>
                            <p class="text-body font-medium">${new Date(goal.target_date).toLocaleDateString()}</p>
                        </div>
                    ` : ''}
                    ${goal.monthly_contribution_paise ? `
                        <div>
                            <p class="text-label text-secondary mb-1">Monthly Plan</p>
                            <p class="text-body font-medium">${formatCurrency(goal.monthly_contribution_paise)}/mo</p>
                        </div>
                    ` : ''}
                    ${goal.pace?.remaining_days != null ? `
                        <div>
                            <p class="text-label text-secondary mb-1">Time Left</p>
                            <p class="text-body font-medium">${goal.pace.remaining_days} days</p>
                        </div>
                    ` : ''}
                </div>
            </div>

            ${!isDone ? `
                <div class="grid grid-cols-2 gap-6 mb-10 animate-slide-up">
                    <div class="card bg-surface-elevated p-6">
                        <h2 class="text-h3 mb-6">Add Contribution</h2>
                        <form id="add-contribution-form" class="flex flex-col gap-4">
                            <input type="hidden" id="contrib-goal-id" value="${goal.goal_id}">
                            <div class="input-wrapper">
                                <label class="input-label" for="contrib-amount">Amount (*)</label>
                                <input type="number" id="contrib-amount" class="input" min="1" step="1" required placeholder="e.g. 5000">
                            </div>
                            <div id="contrib-error" class="text-caption text-negative hidden mt-1"></div>
                            <button type="submit" class="btn btn-primary btn-block mt-2" id="btn-add-contrib">Add Funds</button>
                        </form>
                    </div>
                    
                    <div class="card p-6">
                        <h2 class="text-h3 mb-2">Speed Up</h2>
                        <p class="text-caption text-secondary mb-6">See how increasing your monthly contribution affects your goal timeline.</p>
                        <div class="flex gap-3">
                            <input type="number" id="sim-amount" class="input flex-1" min="1" step="1" placeholder="New monthly amount (*)" value="${(goal.monthly_contribution_paise || 0) / 100 + 1000}">
                            <button type="button" class="btn btn-secondary" id="btn-simulate">Simulate</button>
                        </div>
                        <div id="sim-result" class="mt-4 p-4 bg-surface-elevated hidden card"></div>
                    </div>
                </div>
            ` : ''}

            <section class="mb-10 animate-slide-up">
                <div class="section-header">
                    <h2 class="section-header-title">Contribution History</h2>
                </div>
                <div class="card">
                    ${(!goal.contributions || goal.contributions.length === 0) ? `
                        <div class="p-8">
                            <div class="empty-state">
                                <svg class="empty-state-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                                </svg>
                                <h3 class="empty-state-title">No contributions yet</h3>
                                <p class="empty-state-description">Start contributing to reach your goal faster.</p>
                            </div>
                        </div>
                    ` : `
                        <div class="cashflow-table">
                            ${goal.contributions.map((c, idx) => `
                                <div class="cashflow-table-row">
                                    <div>
                                        <p class="text-body font-medium">${new Date(c.contribution_date).toLocaleDateString()}</p>
                                        <p class="text-caption text-secondary capitalize">${c.source_type}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-body text-positive font-medium">+${formatCurrency(c.amount_paise)}</p>
                                        ${c.status !== 'confirmed' ? Badge({ label: c.status, variant: 'neutral' }) : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </section>
        </div>
    `;
}

export function GoalDetailPageAfterRender(goalId) {
    const contribForm = document.getElementById('add-contribution-form');
    if (contribForm) {
        contribForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-add-contrib');
            const errDiv = document.getElementById('contrib-error');
            const amtInput = document.getElementById('contrib-amount');
            
            errDiv.classList.add('hidden');
            const rupees = Number(amtInput.value);
            if (!rupees || rupees <= 0) {
                errDiv.textContent = 'Please enter a valid amount.';
                errDiv.classList.remove('hidden');
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span> Adding...';

            try {
                const idempotencyKey = `contrib-${goalId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                
                await ApiClient.post(`/goals/${goalId}/contributions`, {
                    amount_paise: Math.round(rupees * 100),
                    currency: 'INR',
                    source_type: 'manual'
                }, { 'Idempotency-Key': idempotencyKey });

                window.appInstance.route();
            } catch (err) {
                errDiv.textContent = err.message || 'Failed to add contribution.';
                errDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Add Funds';
            }
        });
    }

    const btnSimulate = document.getElementById('btn-simulate');
    if (btnSimulate) {
        btnSimulate.addEventListener('click', async () => {
            const simAmtInput = document.getElementById('sim-amount');
            const resBox = document.getElementById('sim-result');
            const rupees = Number(simAmtInput.value);
            
            if (!rupees || rupees <= 0) {
                resBox.innerHTML = '<p class="text-caption text-negative">Please enter a valid monthly amount.</p>';
                resBox.classList.remove('hidden');
                return;
            }

            btnSimulate.disabled = true;
            btnSimulate.textContent = '...';
            try {
                const sim = await ApiClient.post(`/goals/${goalId}/simulate`, {
                    higher_monthly_paise: Math.round(rupees * 100)
                });
                
                let html = `
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <p class="text-label text-secondary mb-1">Current Plan</p>
                            <p class="text-body font-medium">${formatCurrency(sim.current_plan.monthly_paise)}/mo</p>
                            <p class="text-caption text-tertiary">${sim.current_plan.estimated_months ? `Completes in ${sim.current_plan.estimated_months} mo` : '\u2014'}</p>
                        </div>
                        <div class="bg-primary-ultralight p-4">
                            <p class="text-label text-primary mb-1 font-medium">New Plan</p>
                            <p class="text-body text-primary font-medium">${formatCurrency(sim.simulated_plan.monthly_paise)}/mo</p>
                            <p class="text-caption text-primary">${sim.simulated_plan.estimated_months ? `Completes in ${sim.simulated_plan.estimated_months} mo` : '\u2014'}</p>
                        </div>
                    </div>
                `;
                
                if (sim.months_saved > 0) {
                    html += `<div class="separator mt-4 mb-4"></div><p class="text-caption text-positive font-medium">You would reach your goal <strong>${sim.months_saved} months earlier!</strong></p>`;
                }
                
                resBox.innerHTML = html;
                resBox.classList.remove('hidden');
            } catch (err) {
                resBox.innerHTML = `<p class="text-caption text-negative">Simulation failed: ${err.message}</p>`;
                resBox.classList.remove('hidden');
            } finally {
                btnSimulate.disabled = false;
                btnSimulate.textContent = 'Simulate';
            }
        });
    }
}
