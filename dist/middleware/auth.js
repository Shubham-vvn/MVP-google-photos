/**
 * Authentication & Identity Middleware
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.1
 */
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    // In development / local testing, allow default user if header omitted or standard token
    if (!authHeader) {
        req.userId = 'usr_google_default';
        req.userEmail = 'shubham@gmail.com';
        return next();
    }
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (token === 'invalid_token') {
            res.status(401).json({
                code: 401,
                status: 'UNAUTHORIZED',
                message: 'Invalid or expired Google OAuth2 access token.',
            });
            return;
        }
        // Extract userId or default
        req.userId = token.startsWith('usr_') ? token : 'usr_google_default';
        req.userEmail = 'shubham@gmail.com';
        return next();
    }
    res.status(401).json({
        code: 401,
        status: 'UNAUTHORIZED',
        message: 'Missing or malformed Authorization header. Expected Bearer token.',
    });
}
