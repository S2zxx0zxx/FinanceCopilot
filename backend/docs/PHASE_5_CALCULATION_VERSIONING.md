# PHASE 5 CALCULATION VERSIONING

## Version Registry
- **Pending Policy**: `v1.0.0`
- **Calculation Type**: `safe_to_spend`
- **Calculation Version**: `v1.0.0`

## Replay Guarantee
Because `financial_snapshots` stores the `rulebook_version` (`v1.0.0`) alongside the exact JSON inputs used to derive the result, a future upgrade to `v2.0.0` (which may, for example, weigh pending credits at 50%) will not silently rewrite historical traces. The older traces will always correctly assert that they were calculated using `v1.0.0` rules.
