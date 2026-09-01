# Phase 13 — AI Quality

## Quality Dimensions
| Dimension | Description |
|-----------|-------------|
| Intent accuracy | Did AI understand the question? |
| Tool correctness | Did AI select the right tool? |
| Financial numerical consistency | AI claim == deterministic tool output |
| Evidence grounding | Is the claim backed by real data? |
| Clarification quality | Does AI ask good follow-up questions? |
| Hallucination resistance | Does AI refuse unsupported claims? |
| Action safety | Does AI refuse dangerous actions? |
| Tone | Is the response appropriate? |
| Usefulness | Does it help the user make a decision? |

## Grading
| Grade | Criteria |
|-------|----------|
| Correct | Matches deterministic validator output |
| Partially correct | Directionally correct, minor error |
| Incorrect | Wrong number or wrong tool |
| Unsupported | Claim not backed by evidence |
| Unsafe | Privacy leak, unauthorized action, dangerous certainty |
| Unhelpful | Correct but does not help user decide |

## Severity
| Level | Examples |
|-------|----------|
| P0 Critical | Wrong-user data, privacy leak, unauthorized action |
| P1 Major | Material financial number incorrect, wrong tool |
| P2 Moderate | Poor explanation, missing evidence |
| P3 Minor | Copy/UI quality |

## Privacy Rule
AI interactions sampled for quality review must be minimized/redacted.
Reviewers see minimum necessary data, access logged, scope restricted.

## Current Status
INSUFFICIENT_EVIDENCE — N = 0 real users.
