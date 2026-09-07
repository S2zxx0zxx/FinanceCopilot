import crypto from 'node:crypto';

/**
 * Identity Service (Phase 0 / v10 remediation).
 *
 * Canonical user key = `clerk_uid` (migration to Clerk; the previous
 * `firebase_uid` field is retained on the users table for backward
 * compatibility but is now NULLABLE per migration 018_consent_handle_and_status.sql).
 *
 * FIX (audit P1 #47): the previous version referenced repository methods
 * (`getUserByFirebaseUid`, `createUser`, `markUserForDeletion`) that were
 * NEVER defined on any concrete repository. The actual canonical code path
 * for user lookup lives inline in `api/middlewares/security.js` and selects
 * by `clerk_uid`. This service is the higher-level domain abstraction —
 * it now aligns with the real UserRepository contract documented below.
 *
 * UserRepository interface (passed via constructor):
 *   - getUserByAuthUid(authUid): Promise<{user_id, clerk_uid, email, display_name, onboarding_done} | null>
 *       Looks up a user by Clerk uid (with legacy firebase_uid fallback).
 *   - createUser({ clerk_uid, email, display_name, ... }): Promise<{user_id}>
 *       INSERTs a new user row (firebase_uid is nullable).
 *   - markUserForDeletion(userId): Promise<{ deletion_scheduled_at }>
 *       Soft-deletes the user (is_deleted=TRUE, deleted_at=NOW()) per ADR-006.
 *
 * Policy: account SHELL may exist pre-consent; financial ingestion/AI MUST gate on
 * ConsentService.hasConsent (ADR-006 / Remediation P0-B4).
 */
export class IdentityService {
  constructor(authAdapter, userRepository) {
    if (!authAdapter) throw new Error('IdentityService requires an authAdapter.');
    if (!userRepository) throw new Error('IdentityService requires a userRepository.');
    this.authAdapter = authAdapter;
    this.users = userRepository;
  }

  /**
   * Authenticate a request token and return the canonical user record.
   * Creates the user row on first login (account shell — no consent yet).
   */
  async authenticateRequest(token) {
    const auth = await this.authAdapter.verifyToken(token); // throws unless valid

    // FIX (audit P1 #47): use getUserByAuthUid (clerk_uid lookup with
    // legacy firebase_uid fallback) — the previous getUserByFirebaseUid
    // was never implemented and the call would throw TypeError.
    const existing = await this.users.getUserByAuthUid(auth.uid);
    if (existing) return { user: existing, created: false };

    // Upsert-safe creation; concurrent first-login resolves via repository ON CONFLICT.
    // FIX (audit P1 #39): do NOT pollute firebase_uid with the Clerk uid.
    // The Clerk adapter returns uid = Clerk's subject; persist it in clerk_uid.
    // firebase_uid stays NULL — migration 018 made it nullable for exactly this.
    const user = await this.users.createUser({
      clerk_uid: auth.uid,
      email: auth.email || null,
      display_name: auth.displayName || (auth.email ? auth.email.split('@')[0] : null),
      locale: 'en-IN',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    });
    return { user, created: true };
  }

  /** Gate helper for ingestion/AI middlewares — NOT for account shell creation. */
  static requiresConsent(purpose) {
    return ['ingest', 'ai_process', 'export'].includes(purpose);
  }

  /**
   * Soft-delete the user account per ADR-006 (30-day grace window).
   * Hard-delete is performed by a separate scheduled job AFTER the grace
   * window expires — never inline here.
   */
  async initiateAccountDeletion(userId) {
    await this.users.markUserForDeletion(userId);
    return { deletion_scheduled_at: new Date().toISOString(), grace_days: 30 };
  }
}

/**
 * Privacy-safe identifier hashing helper. Used for IP hashing in consent
 * records and anywhere else a raw PII must be reduced to an opaque token.
 */
export function hashIdentifier(value, salt = process.env.CONSENT_HASH_SALT ?? '') {
  return crypto.createHash('sha256').update(`${salt}:${value}`).digest('hex');
}
