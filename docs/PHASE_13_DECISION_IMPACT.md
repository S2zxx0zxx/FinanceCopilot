# Phase 13 — Decision Impact

## Honest Stance
FinCopilot must NOT claim "FinCopilot saved users ₹X" without causal evidence.

## Observable Proxies (OBSERVATIONAL — not causal)
| Proxy Event | Description |
|-------------|-------------|
| reviewed_upcoming_obligation | User viewed commitment detail |
| corrected_financial_classification | User corrected a category/merchant |
| changed_goal_contribution | User updated goal amount |
| ran_affordability_simulation | User ran what-if scenario |
| reviewed_spending_driver | User investigated a spending category |
| followed_plan | User created + executed a planning action |
| avoided_purchase_after_affordability | User ran simulation then did NOT transact |

## Labeling Rule
All proxies must be labeled: OBSERVATIONAL
Claims of causal impact require proper experimental design (controlled A/B with appropriate statistical power).

## Statistical Requirements (§36, §37, §77)
Before any causal claim, must define and validate:
- N eligible
- Baseline rate
- Variance
- Effect size
- Confidence interval / uncertainty

If unavailable: report as OBSERVATIONAL or INSUFFICIENT_EVIDENCE.

## Current Status
INSUFFICIENT_EVIDENCE — N = 0 real users.
