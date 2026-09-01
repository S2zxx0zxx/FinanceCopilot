import { AuthInterface } from './auth.interface.js';
import admin from 'firebase-admin';

/**
 * Firebase Authentication Adapter (F-B2 remediated).
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

    // Initialize Firebase Admin if in production mode
    if (this.mode !== 'mock' && !admin.apps?.length) {
      try {
        admin.initializeApp();
      } catch {
        console.warn('Failed to initialize firebase-admin natively. Ensure GOOGLE_APPLICATION_CREDENTIALS is set.');
      }
    }
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

    // Real Firebase Verification
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
    try {
      if (this.mode === 'mock') return { status: 'MOCKED_SUCCESS' };
      await admin.auth().revokeRefreshTokens(uid);
      return { status: 'SUCCESS' };
    } catch (error) {
      console.error(`[Firebase Auth] Failed to revoke sessions for ${uid}:`, error);
      throw new Error(`Failed to revoke sessions: ${error.message}`);
    }
  }

  async deleteUser(uid) {
    try {
      if (this.mode === 'mock') return { status: 'MOCKED_SUCCESS' };
      await admin.auth().deleteUser(uid);
      return { status: 'SUCCESS' };
    } catch (error) {
      console.error(`[Firebase Auth] Failed to delete user ${uid}:`, error);
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
