import { AuthInterface } from './auth.interface.js';

/**
 * Firebase Authentication Adapter (F-B2 remediated).
 *
 * NOTE: This adapter is retained for legacy compatibility only. The ACTIVE auth
 * provider is Clerk (see `./clerk.adapter.js`). Firebase support is unmaintained.
 *
 * `firebase-admin` is loaded LAZILY so it is no longer a hard runtime dependency
 * — production deployments that use Clerk do not need it installed. If a non-mock
 * call is attempted without the package present, it throws an explicit error
 * rather than crashing at import time.
 *
 * INV-SEC-001: production NEVER uses mock auth — construction throws.
 * Fail-closed: verifyToken denies unless explicitly in dev-mock mode.
 */
export class FirebaseAuthAdapter extends AuthInterface {
  constructor(env = process.env) {
    super();
    this.env = env;
    this.mode = env.AUTH_MODE ?? 'production';
    if (this.mode === 'mock' && env.NODE_ENV !== 'test') {
      const err = new Error('INV-SEC-001: AUTH_MODE=mock is strictly forbidden outside of NODE_ENV=test');
      err.code = 'MOCK_AUTH_FORBIDDEN';
      throw err;
    }
    this._admin = null;
    this._adminLoadAttempted = false;
  }

  async _getAdmin() {
    if (this._adminLoadAttempted) return this._admin;
    this._adminLoadAttempted = true;
    try {
      // Lazy import so `firebase-admin` is NOT a hard dependency. Production
      // deployments using Clerk never load it.
      const mod = await import('firebase-admin');
      this._admin = mod.default || mod;
      if (this.mode !== 'mock' && this._admin && !this._admin.apps?.length) {
        this._admin.initializeApp();
      }
    } catch (err) {
      console.warn(
        '[FirebaseAuthAdapter] firebase-admin is not installed or failed to initialize. ' +
        'Clerk is the active auth provider — this adapter is legacy. Error:',
        err.message
      );
      this._admin = null;
    }
    return this._admin;
  }

  async verifyToken(token) {
    if (typeof token !== 'string' || token.length < 8) {
      const err = new Error('TOKEN_INVALID: token missing or too short');
      err.code = 'TOKEN_INVALID';
      throw err;
    }

    if (this.mode === 'mock') {
      const { createHash } = await import('node:crypto');
      const uid = `mock_${createHash('sha256').update(token).digest('hex').slice(0, 16)}`;
      return { uid, email: `${uid}@mock.invalid`, emailVerified: true, mock: true };
    }

    const admin = await this._getAdmin();
    if (!admin) {
      const err = new Error('UNAUTHORIZED: Invalid Firebase token');
      err.code = 'FIREBASE_UNAVAILABLE';
      throw err;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        mock: false
      };
    } catch (error) {
      const err = new Error('UNAUTHORIZED: Invalid Firebase token');
      err.code = 'FIREBASE_AUTH_FAILED';
      err.originalError = error;
      throw err;
    }
  }

  async revokeSessions(uid) {
    if (this.mode === 'mock') return { status: 'MOCKED_SUCCESS' };
    const admin = await this._getAdmin();
    if (!admin) throw new Error('Failed to revoke sessions: firebase-admin unavailable');
    try {
      await admin.auth().revokeRefreshTokens(uid);
      return { status: 'SUCCESS' };
    } catch (error) {
      console.error(`[Firebase Auth] Failed to revoke sessions for ${uid}:`, error);
      throw new Error(`Failed to revoke sessions: ${error.message}`);
    }
  }

  async deleteUser(uid) {
    if (this.mode === 'mock') return { status: 'MOCKED_SUCCESS' };
    const admin = await this._getAdmin();
    if (!admin) throw new Error('Failed to delete user: firebase-admin unavailable');
    try {
      await admin.auth().deleteUser(uid);
      return { status: 'SUCCESS' };
    } catch (error) {
      console.error(`[Firebase Auth] Failed to delete user ${uid}:`, error);
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
