const { auth } = require('../config/firebase');

/**
 * Middleware to verify Firebase ID token sent from the client.
 * If the token is valid, it attaches the decoded user info to the request object.
 */
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided or token is not Bearer type.' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken; // Attach user data (uid, email, role, etc.) to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
    }
};

module.exports = verifyToken;