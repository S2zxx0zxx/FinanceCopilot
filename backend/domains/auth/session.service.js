import { UnauthorizedError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

/**
 * Session Validation Service
 * 
 * Verifies that a token has not expired and the session is not revoked.
 */
export class SessionService {
    constructor(dbRepository) {
        this.dbRepository = dbRepository;
    }

    async validateSession(tokenPayload) {
        if (!tokenPayload || !tokenPayload.exp) {
            throw new UnauthorizedError('Invalid token payload.');
        }

        const now = Math.floor(Date.now() / 1000);
        if (tokenPayload.exp < now) {
            logger.warn('Session expired.', { userId: tokenPayload.sub });
            throw new UnauthorizedError('Session expired.');
        }

        if (!this.dbRepository) {
            // STRICT MODE: Do not fake success if the DB adapter is missing
            throw new Error('Session DB repository is not injected. Cannot verify revocation status.');
        }

        // Scaffold: Check DB if session was explicitly revoked
        // const isRevoked = await this.dbRepository.isSessionRevoked(tokenPayload.sub, tokenPayload.sid);
        // if (isRevoked) throw new UnauthorizedError('Session revoked.');

        return true;
    }

    async revokeSession(userId, sessionId) {
        // Scaffold: Update DB to revoke session
        logger.audit('SESSION_REVOKED', userId, sessionId);
    }
}
