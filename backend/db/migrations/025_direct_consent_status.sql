-- Direct policy grants are not pending Account Aggregator authorizations.
UPDATE consent_records SET status='active'
WHERE status='pending' AND consented=true AND revoked_at IS NULL
AND consent_handle IS NULL AND consent_type IN ('privacy_policy','terms','ai_processing');
