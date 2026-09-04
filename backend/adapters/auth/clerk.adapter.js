import { AuthInterface } from './auth.interface.js';
import { createClerkClient } from '@clerk/backend';

/**
 * Clerk Authentication Adapter.
 * Replaces Firebase auth while implementing the same interface.
 */
export class ClerkAuthAdapter extends AuthInterface {
  constructor(env = process.env) {
    super();
    this.env = env;
    this.mode = env.AUTH_MODE ?? 'production';
    
    if (this.mode === 'mock' && env.NODE_ENV !== 'test') {
      const err = new Error('INV-SEC-001: AUTH_MODE=mock is strictly forbidden outside of NODE_ENV=test');
      err.code = 'MOCK_AUTH_FORBIDDEN';
      throw err;
    }

    if (this.mode !== 'mock') {
      if (!env.CLERK_SECRET_KEY) {
        console.warn('CLERK_SECRET_KEY is missing. Real auth will fail.');
      }
      this.clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
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

    try {
      // For Vite SPA, the token is passed as a Bearer token (JWT)
      const decodedToken = await this.clerkClient.verifyToken(token, {
        secretKey: this.env.CLERK_SECRET_KEY
      });
      
      const user = await this.clerkClient.users.getUser(decodedToken.sub);
      const email = user.emailAddresses[0]?.emailAddress;
      const emailVerified = user.emailAddresses[0]?.verification?.status === 'verified';
      
      return { 
        uid: decodedToken.sub, 
        email: email, 
        emailVerified: emailVerified,
        mock: false
      };
    } catch (error) {
      const err = new Error('UNAUTHORIZED: Invalid Clerk token');
      err.code = 'CLERK_AUTH_FAILED';
      err.originalError = error;
      throw err;
    }
  }

  async revokeSessions(uid) {
    try {
      if (this.mode === 'mock') return { status: 'MOCKED_SUCCESS' };
      // Clerk handles revoking differently, but we can ban/unban or revoke specific sessions
      // For now, we will fetch and revoke all active sessions for the user.
      const { data: sessions } = await this.clerkClient.sessions.getSessionList({ userId: uid });
      for (const session of sessions) {
        await this.clerkClient.sessions.revokeSession(session.id);
      }
      return { status: 'SUCCESS' };
    } catch (error) {
      console.error(`[Clerk Auth] Failed to revoke sessions for ${uid}:`, error);
      throw new Error(`Failed to revoke sessions: ${error.message}`);
    }
  }

  /**
   * FIX (audit P1 #32): listSessions — required by TrustController
   * getSecuritySessions. Returns the user's active Clerk sessions with the
   * fields the frontend security page renders (id, device, lastActive,
   * currentSessionId badge). Never throws — on any Clerk failure we return
   * an empty list so the security page still loads.
   */
  async listSessions(uid) {
    try {
      if (this.mode === 'mock') return [];
      const { data: sessions } = await this.clerkClient.sessions.getSessionList({
        userId: uid,
        limit: 50
      });
      return (sessions || []).map(s => ({
        id: s.id,
        status: s.status,
        device: s.lastActiveOrganization?.name
          || s.deviceType
          || (s.expireAt ? 'Web' : 'Unknown'),
        ipAddress: s.lastActiveToken?.ip_address || null,
        lastActive: s.lastActiveAt || s.updatedAt || s.createdAt,
        createdAt: s.createdAt
      }));
    } catch (error) {
      console.error(`[Clerk Auth] Failed to list sessions for ${uid}:`, error);
      return [];
    }
  }

  /**
   * FIX (audit P1 #32): revokeSession — revoke a SINGLE Clerk session by id
   * (used by the "Revoke" button on the security page when allOther=false).
   * Returns the revoked session or null on not-found / failure.
   */
  async revokeSession(sessionId) {
    try {
      if (this.mode === 'mock') return { id: sessionId, status: 'revoked' };
      const revoked = await this.clerkClient.sessions.revokeSession(sessionId);
      return revoked;
    } catch (error) {
      console.error(`[Clerk Auth] Failed to revoke session ${sessionId}:`, error);
      throw new Error(`Failed to revoke session: ${error.message}`);
    }
  }

  async deleteUser(uid) {
    try {
      if (this.mode === 'mock') return { status: 'MOCKED_SUCCESS' };
      await this.clerkClient.users.deleteUser(uid);
      return { status: 'SUCCESS' };
    } catch (error) {
      console.error(`[Clerk Auth] Failed to delete user ${uid}:`, error);
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
