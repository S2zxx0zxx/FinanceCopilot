# PHASE 5 SAFE TO SPEND CONTRACT

## Formula
`Available Cash + Expected Income - Upcoming Commitments - Expected Essential Spending - Minimum Safety Buffer = Safe-to-Spend`

## Invariants
1. **Never Negative**: If the formula evaluates to `< 0`, the STS engine floors the result to `0`.
2. **Deterministic Horizons**: Upcoming commitments are bounded by the exact `horizon_days` configured for the user.
3. **No AI Mutation**: The LLM is never allowed to guess, infer, or override this mathematical result.
4. **Explainable Trace**: Every STS result has a 1-to-1 map to a `financial_snapshot` containing the payload array of exact variables that went into it.
