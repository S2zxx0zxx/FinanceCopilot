import crypto from 'node:crypto';

/**
 * Identity Service (F-B1/F-B4 remediated).
 * Canonical user key = firebase_uid (06_DOMAIN_MODEL.md §2.1).
 * Policy: account SHELL may exist pre-consent; financial ingestion/AI MUST gate on
 * ConsentService.hasConsent (ADR-006 / Remediation P0-B4).
 */
export class IdentityService {
  constructor(authAdapter, userRepository) {
    this.authAdapter = authAdapter;
    this.users = userRepository; // interface documented in control/schema-contract.yaml
  }

  async authenticateRequest(token) {
    const auth = await this.authAdapter.verifyToken(token); // throws unless valid
    const existing = await this.users.getUserByFirebaseUid(auth.uid);
    if (existing) return { user: existing, created: false };

    // Upsert-safe creation; concurrent first-login resolves via repository ON CONFLICT.
    const user = await this.users.createUser({
      firebase_uid: auth.uid,
      email: auth.email,
      locale: 'en-IN',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    });
    return { user, created: true };
  }

  /** Gate helper for ingestion/AI middlewares — NOT for account shell creation. */
  static requiresConsent(purpose) {
    return ['ingest', 'ai_process', 'export'].includes(purpose); // retention-policy exempt purposes excluded
  }

  async initiateAccountDeletion(userId) {
    await this.users.markUserForDeletion(userId); // soft delete per ADR-006, 30-day grace
    return { deletion_scheduled_at: new Date().toISOString(), grace_days: 30 };
  }
}

export function hashIdentifier(value, salt = process.env.CONSENT_HASH_SALT ?? '') {
  return crypto.createHash('sha256').update(`${salt}:${value}`).digest('hex');
}
