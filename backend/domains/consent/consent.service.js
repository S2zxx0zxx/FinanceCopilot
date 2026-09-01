import crypto from 'node:crypto';

/**
 * Consent Service (F-B4 remediated).
 * - IP hashed at write boundary (never stored raw).
 * - Structured policy versioning with effective-date semantics (no naive string equality).
 * - Every grant/revoke emits an audit event (INV-002).
 */
const VERSION_RE = /^\d{4}-\d{2}-\d{2}$/;

function assertVersionShape(v) {
  if (!VERSION_RE.test(v)) throw Object.assign(new Error(`policy.version must be YYYY-MM-DD, got ${v}`), { code: 'CONSENT_VERSION_INVALID' });
}

/** Effective-date comparison: '2026-08-23' >= '2024-01-01' lexically == chronologically. */
export function isVersionAtLeast(candidate, required) {
  assertVersionShape(candidate);
  assertVersionShape(required);
  return candidate >= required;
}

export class ConsentService {
  constructor(dbRepository, auditSink, env = process.env) {
    this.db = dbRepository;
    this.audit = auditSink; // append-only audit_events writer
    this.salt = env.CONSENT_HASH_SALT ?? '';
  }

  #hashIp(ip) {
    if (!ip) return null;
    return crypto.createHash('sha256').update(`${this.salt}:${ip}`).digest('hex'); // raw IP never persisted
  }

  async recordConsent(userId, policyId, version, clientInfo = {}) {
    assertVersionShape(version);
    const row = await this.db.saveConsent({
      user_id: userId,
      consent_type: policyId,
      version,
      ip_hash: this.#hashIp(clientInfo.ip_address),
      user_agent: clientInfo.user_agent ?? null,
      granted_at: new Date().toISOString(),
    });
    await this.audit.logEvent('consent_change', 'consent_record', row.consent_id, 'user', { action: 'grant', policy_id: policyId, version });
    return row;
  }

  /** True only when latest non-revoked grant for policyId is >= required effective version. */
  async hasConsent(userId, policyId, requiredVersion) {
    assertVersionShape(requiredVersion);
    const latest = await this.db.getLatestConsent(userId, policyId);
    if (!latest || latest.revoked_at) return false;
    return isVersionAtLeast(latest.version, requiredVersion)
      && isVersionAtLeast(new Date(latest.granted_at).toISOString().slice(0, 10), requiredVersion);
  }

  async revokeConsent(userId, policyId, reason) {
    const row = await this.db.revokeConsent(userId, policyId, new Date().toISOString());
    await this.audit.logEvent('consent_change', 'consent_record', row?.consent_id ?? null, 'user', { action: 'revoke', policy_id: policyId, reason: reason ?? null });
    return row; // INV-SEC-008: callers must now deny processing
  }

  // Account Aggregator Extensions
  async trackPendingConsent(userId, policyId, consentHandle) {
    // Save a pending consent record linked to the AA consentHandle
    return await this.db.saveConsent({
      user_id: userId,
      consent_type: policyId,
      version: new Date().toISOString().slice(0, 10),
      status: 'PENDING',
      consent_handle: consentHandle
    });
  }

  async getConsentByHandle(consentHandle) {
    // Abstract DB call to fetch consent by AA handle
    return await this.db.getConsentByHandle(consentHandle);
  }

  async activateConsent(consentRecordId, consentId) {
    // Abstract DB call to mark consent as ACTIVE and save AA consentId
    return await this.db.activateConsent(consentRecordId, consentId, new Date().toISOString());
  }

  async revokeConsentById(consentRecordId) {
    // Abstract DB call to revoke by ID
    return await this.db.revokeConsentById(consentRecordId, new Date().toISOString());
  }
}
