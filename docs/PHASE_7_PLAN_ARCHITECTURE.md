# Phase 7 — Planning Hub & Recurring Architecture

## 1. Domain Entities
The planning domain operates on top of the "Deterministic Financial State" established in Phase 5 and Phase 6.

1. **`recurring_series`**: Deterministically detected or user-created recurring patterns.
2. **`commitments`**: One-off financial obligations not captured by recurring series.
3. **`goals` & `goal_contributions`**: Financial targets and the ledger of funds applied toward them.
4. **`planning_snapshots` & `financial_health_snapshots`**: Point-in-time materializations for historical tracking and trend analysis.

## 2. Evidence-Based Confidence
Phase 7 explicitly prohibits "Fake Success" and arbitrary predictive algorithms. All future projections are deterministic aggregations of known facts.
- **Evidence States**: `USER_CONFIRMED` > `OBSERVED` > `INFERRED`.
- **Confidence Rating**: Deterministic recurring patterns carry a 0.0 to 1.0 confidence score based on the cadence variance and amount stability.

## 3. Financial Health Model
Rather than a single arbitrary score, Financial Health is modeled as 4 transparent components:
1. **Cash Buffer**: Usable Cash ÷ Average Monthly Essential Spending (Target > 3 months)
2. **Commitment Load**: Confirmed Monthly Commitments ÷ Confirmed Monthly Income (Target < 40%)
3. **Savings Pace**: Monthly Contributions ÷ Target Pace (Target > 90%)
4. **Spending Stability**: Coefficient of Variation of weekly spending (Target < 0.20)

## 4. UI Layer (Vanilla JS SPA)
- `plan.js`: The central hub.
- `recurring.js`: Pattern review and lifecycle management.
- `upcoming.js`: 7d/30d/90d horizon of EXPECTED, DUE, OVERDUE, and PAID items.
- `cashflow.js`: Known income minus known expenses.
- `goals.js` & `goal-detail.js`: CRUD, simulation, and progress tracking.
- `financial-health.js`: The 4 components and their drivers.
