/**
 * Authentication Adapter Interface
 * 
 * Defines the contract that any authentication provider (e.g., Firebase, Auth0) 
 * must implement to be used in the AI Financial Life Manager.
 */

export class AuthInterface {
    /**
     * Verifies an incoming client token and returns the normalized user identity.
     * @param {string} token - The raw auth token from the client request
     * @returns {Promise<{uid: string, email: string, emailVerified: boolean}>}
     * @throws {Error} If token is invalid or expired
     */
    async verifyToken(token) {
        throw new Error('Method not implemented.');
    }

    /**
     * Revokes all active sessions/refresh tokens for a user.
     * @param {string} uid - The provider-specific user ID
     * @returns {Promise<void>}
     */
    async revokeSessions(uid) {
        throw new Error('Method not implemented.');
    }
    
    /**
     * Deletes a user account from the authentication provider.
     * Note: Does not delete application database records.
     * @param {string} uid - The provider-specific user ID
     * @returns {Promise<void>}
     */
    async deleteUser(uid) {
        throw new Error('Method not implemented.');
    }
}
