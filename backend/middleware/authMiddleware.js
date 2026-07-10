const jwt = require('jsonwebtoken');

// Middelware to protect private routes
const protect = (req, res, next) => {
    let token;

    // Check if the token exists in the HTTP Authorization header (format: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extract the token part

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the decoded user data (userId, username) to the request object for use in subsequent middleware or route handlers
            req.user = decoded;

            // Everything is good, proceed to the controller logic
            return next();
        }
        catch (err) {
            console.error('Token verification failed:', err.message);
            return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };