# PHASE 5 FINANCE REGRESSION

## Integration Regression Suite
- Suite Location: `tests/phase5.qa.integration.test.js`
- Test Scope: Financial State Math, SQL Aggregate Precedence, Deduplication safety.

## Regressions Prevented
1. **Double Counting Defect**: Verified that the repository engine layer successfully drops `duplicate_status = 'duplicate'` rows BEFORE they enter the math logic.
2. **Refund Inflation Defect**: Verified that a `refund` record subtracts from total spending, rather than incorrectly inflating the user's apparent income.
3. **Pending Cash Illusion**: Verified that the balance engine subtracts pending debits immediately, preventing users from seeing non-existent safe-to-spend cash.
