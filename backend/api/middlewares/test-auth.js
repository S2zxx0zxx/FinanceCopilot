export const testAuthMiddleware = (req, res, next) => {
    // ONLY allowed when NODE_ENV is testing/development
    if (process.env.NODE_ENV === 'production') {
        return next();
    }
    
    req.authAdapter = {
        verifyToken: async (token) => {
            if (token.startsWith('mock-')) {
                return { uid: token.replace('mock-', ''), email: 'test@example.com' };
            }
            throw new Error('Invalid test token');
        }
    };
    next();
};
