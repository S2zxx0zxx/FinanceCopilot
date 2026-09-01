/**
 * Goals Service — Phase 7 §21-27
 *
 * Manages financial goals: create, list, detail, update, archive,
 * contributions (idempotent), goal pace, completion estimate, acceleration simulation.
 *
 * Key invariants (§23-27):
 * - current_amount_paise = SUM(confirmed contributions) — NEVER manually incremented
 * - Simulation NEVER mutates the real goal
 * - Pace calculation handles: no history, zero days, already completed, stale input
 * - No NaN/Infinity/undefined in financial outputs
 * - All contributions are durable + idempotent via idempotency_key
 * - Ownership always resolved from authenticated server identity
 *
 * Version: goal_calculation_v1.0.0
 */
import { GoalRepo, GoalContributionRepo } from '../../../db/repositories/planning.repo.js';
import { AuditRepo } from '../../../db/repositories.js';
import { AppError } from '../../../utils/errors.js';

const GOAL_CALC_VERSION = 'v1.0.0';

// ── Validation helpers ──────────────────────────────────────────────────────

function validateGoalInput(data) {
    if (!data.name || data.name.trim().length === 0)
        throw new AppError('Goal name is required', 422, true, 'VALIDATION_ERROR');
    if (data.name.length > 120)
        throw new AppError('Goal name must be <= 120 characters', 422, true, 'VALIDATION_ERROR');
    if (!data.target_amount_paise || Number(data.target_amount_paise) <= 0)
        throw new AppError('target_amount_paise must be a positive integer (paise)', 422, true, 'VALIDATION_ERROR');
    if (!Number.isInteger(Number(data.target_amount_paise)))
        throw new AppError('target_amount_paise must be an integer (no decimals)', 422, true, 'VALIDATION_ERROR');
    if (data.currency && data.currency !== 'INR')
        throw new AppError('Only INR is supported in this version', 422, true, 'UNSUPPORTED_CURRENCY');
    if (data.target_date) {
        const td = new Date(data.target_date);
        if (Number.isNaN(td.getTime())) throw new AppError('Invalid target_date', 422, true, 'VALIDATION_ERROR');
    }
}

// ── Pace calculation (§25 — handles all edge cases) ────────────────────────

function calculatePace(goal, currentAmountPaise) {
    const targetPaise = Number(goal.target_amount_paise);
    const currentPaise = Number(currentAmountPaise || 0);
    const remainingPaise = Math.max(0, targetPaise - currentPaise);

    if (remainingPaise === 0) {
        return {
            status: 'completed',
            remaining_paise: 0,
            remaining_days: 0,
            required_monthly_paise: 0,
            current_monthly_paise: Number(goal.monthly_contribution_paise || 0),
            gap_paise: 0,
            calculation_version: GOAL_CALC_VERSION
        };
    }

    let remainingDays = null;
    if (goal.target_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(goal.target_date);
        remainingDays = Math.max(0, Math.floor((targetDate - today) / (1000 * 60 * 60 * 24)));
    }

    const currentMonthlyPaise = Number(goal.monthly_contribution_paise || 0);

    let requiredMonthlyPaise = null;
    let gapPaise = null;

    if (remainingDays !== null && remainingDays > 0) {
        // Required monthly = remaining / (remaining days / 30)
        requiredMonthlyPaise = Math.ceil(remainingPaise / (remainingDays / 30));
        gapPaise = requiredMonthlyPaise - currentMonthlyPaise;
    }

    const progressPct = targetPaise > 0
        ? Math.min(100, Math.round((currentPaise / targetPaise) * 10000) / 100)
        : 0;

    return {
        status:                   remainingDays === 0 ? 'deadline_passed' : 'in_progress',
        progress_pct:             progressPct,
        remaining_paise:          remainingPaise,
        remaining_days:           remainingDays,
        required_monthly_paise:   requiredMonthlyPaise,
        current_monthly_paise:    currentMonthlyPaise,
        gap_paise:                gapPaise,
        calculation_version:      GOAL_CALC_VERSION
    };
}

// ── Main Service ─────────────────────────────────────────────────────────────

export class GoalsService {

    static async createGoal(userId, data) {
        validateGoalInput(data);
        const goal = await GoalRepo.createGoal(userId, data);
        await AuditRepo.logEvent('GOAL_CREATED', 'goals', goal.goal_id, userId, { goal_type: goal.goal_type });
        return GoalsService._buildViewModel(goal, 0);
    }

    static async listGoals(userId) {
        const goals = await GoalRepo.listGoals(userId);
        return goals.map(g => GoalsService._buildViewModel(g, Number(g.current_amount_paise || 0)));
    }

    static async getGoalDetail(userId, goalId) {
        const goal = await GoalRepo.getGoalById(userId, goalId);
        if (!goal) throw new AppError('Goal not found', 404, true, 'NOT_FOUND');

        const contributions = await GoalContributionRepo.listContributions(userId, goalId);
        const currentAmountPaise = Number(goal.current_amount_paise || 0);

        return {
            ...GoalsService._buildViewModel(goal, currentAmountPaise),
            contributions: contributions.map(c => ({
                contribution_id:  c.contribution_id,
                amount_paise:     Number(c.amount_paise),
                currency:         c.currency,
                contribution_date: c.contribution_date,
                source_type:      c.source_type,
                status:           c.status,
                notes:            c.notes,
                created_at:       c.created_at
            }))
        };
    }

    static async updateGoal(userId, goalId, patch) {
        const existing = await GoalRepo.getGoalById(userId, goalId);
        if (!existing) throw new AppError('Goal not found', 404, true, 'NOT_FOUND');
        if (existing.status === 'abandoned')
            throw new AppError('Cannot update an abandoned goal', 422, true, 'INVALID_STATE');

        // Validate patch fields
        if (patch.target_amount_paise !== undefined) {
            if (Number(patch.target_amount_paise) <= 0)
                throw new AppError('target_amount_paise must be positive', 422, true, 'VALIDATION_ERROR');
        }
        if (patch.target_date !== undefined && patch.target_date) {
            const td = new Date(patch.target_date);
            if (Number.isNaN(td.getTime())) throw new AppError('Invalid target_date', 422, true, 'VALIDATION_ERROR');
        }

        const updated = await GoalRepo.updateGoal(userId, goalId, patch);
        await AuditRepo.logEvent('GOAL_UPDATED', 'goals', goalId, userId, { patch_keys: Object.keys(patch) });
        const currentPaise = Number(updated.current_amount_paise || 0);
        return GoalsService._buildViewModel(updated, currentPaise);
    }

    static async archiveGoal(userId, goalId) {
        const goal = await GoalRepo.getGoalById(userId, goalId);
        if (!goal) throw new AppError('Goal not found', 404, true, 'NOT_FOUND');

        const deleted = await GoalRepo.softDeleteGoal(userId, goalId);
        await AuditRepo.logEvent('GOAL_ARCHIVED', 'goals', goalId, userId, {});
        return { goal_id: goalId, status: deleted?.status || 'abandoned' };
    }

    /**
     * Add a contribution — idempotent via idempotency_key (§24).
     */
    static async addContribution(userId, goalId, data) {
        const goal = await GoalRepo.getGoalById(userId, goalId);
        if (!goal) throw new AppError('Goal not found', 404, true, 'NOT_FOUND');
        if (['abandoned', 'completed'].includes(goal.status))
            throw new AppError('Cannot add contribution to a completed or abandoned goal', 422, true, 'INVALID_STATE');

        if (!data.amount_paise || Number(data.amount_paise) <= 0)
            throw new AppError('amount_paise must be a positive integer', 422, true, 'VALIDATION_ERROR');
        if (!data.idempotency_key)
            throw new AppError('idempotency_key is required', 422, true, 'VALIDATION_ERROR');

        const contribution = await GoalContributionRepo.addContribution(userId, goalId, data);

        if (contribution) {
            await AuditRepo.logEvent('GOAL_CONTRIBUTION_ADDED', 'goal_contributions', contribution.contribution_id, userId, {
                goal_id: goalId,
                amount_paise: data.amount_paise
            });
        }
        // null = idempotent duplicate — return success without error (§24)
        return contribution || { idempotent: true, message: 'Contribution already recorded' };
    }

    /**
     * Acceleration simulation (§27) — pure calculation, NEVER mutates real goal.
     */
    static async simulateAcceleration(userId, goalId, higherMonthlyPaise) {
        const goal = await GoalRepo.getGoalById(userId, goalId);
        if (!goal) throw new AppError('Goal not found', 404, true, 'NOT_FOUND');

        if (!higherMonthlyPaise || Number(higherMonthlyPaise) <= 0)
            throw new AppError('higher_monthly_paise must be a positive integer', 422, true, 'VALIDATION_ERROR');

        const currentAmountPaise = Number(goal.current_amount_paise || 0);
        const targetPaise = Number(goal.target_amount_paise);
        const remainingPaise = Math.max(0, targetPaise - currentAmountPaise);

        const currentPace = calculatePace(goal, currentAmountPaise);

        // Simulate with higher contribution (create temporary goal object — NOT persisted)
        const simulatedGoal = { ...goal, monthly_contribution_paise: higherMonthlyPaise };
        const simulatedPace = calculatePace(simulatedGoal, currentAmountPaise);

        // Estimate completion dates
        const estimateMonthsAt = (monthlyPaise) => {
            if (!monthlyPaise || monthlyPaise <= 0 || remainingPaise === 0) return 0;
            return Math.ceil(remainingPaise / monthlyPaise);
        };

        const currentMonths = estimateMonthsAt(Number(goal.monthly_contribution_paise || 0));
        const simulatedMonths = estimateMonthsAt(Number(higherMonthlyPaise));

        return {
            goal_id:                goalId,
            simulation_type:        'acceleration',

            // BEFORE (current plan)
            current_plan: {
                monthly_paise:      Number(goal.monthly_contribution_paise || 0),
                estimated_months:   currentMonths || null,
                pace:               currentPace
            },

            // AFTER (simulated plan)
            simulated_plan: {
                monthly_paise:      Number(higherMonthlyPaise),
                estimated_months:   simulatedMonths || null,
                pace:               simulatedPace
            },

            // Delta
            months_saved:           currentMonths && simulatedMonths ? Math.max(0, currentMonths - simulatedMonths) : null,
            additional_monthly_paise: Number(higherMonthlyPaise) - Number(goal.monthly_contribution_paise || 0),
            currency:               'INR',

            // Transparency (§26)
            assumptions: [
                'Simulation assumes constant monthly contribution',
                'Simulation does not account for variable income or unexpected expenses',
                'This is a planning estimate, not a predictive forecast (Phase 8)'
            ],
            calculation_version:    GOAL_CALC_VERSION,
            // CRITICAL: simulation never mutates real goal
            mutated_real_goal:      false
        };
    }

    // ── Private ───────────────────────────────────────────────────────────────

    static _buildViewModel(goal, currentAmountPaise) {
        const pace = calculatePace(goal, currentAmountPaise);
        return {
            goal_id:               goal.goal_id,
            goal_type:             goal.goal_type,
            name:                  goal.name,
            description:           goal.description,
            target_amount_paise:   Number(goal.target_amount_paise),
            current_amount_paise:  currentAmountPaise,  // DERIVED — not from column
            currency:              goal.currency,
            target_date:           goal.target_date,
            status:                goal.status,
            priority:              goal.priority,
            account_id:            goal.account_id,
            monthly_contribution_paise: goal.monthly_contribution_paise ? Number(goal.monthly_contribution_paise) : null,
            pace,
            created_at:            goal.created_at,
            updated_at:            goal.updated_at,
            calculation_version:   GOAL_CALC_VERSION
        };
    }
}
