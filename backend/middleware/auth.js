// ============================================================
// Authentication Middleware
// JWT token verification and role-based access control
// ============================================================

const { verifyToken } = require('../config/jwt');

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header and verifies it
 * Attaches user data to req.user if valid
 */
const authenticateToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }

        // Verify token
        const decoded = verifyToken(token);
        
        // Attach user data to request object
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: error.message || 'Invalid or expired token',
        });
    }
};

/**
 * Middleware to check if user has required role
 * @param {...string} roles - Allowed roles (e.g., 'student', 'faculty', 'admin')
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}`,
            });
        }

        next();
    };
};

/**
 * Middleware to check if user is a student
 */
const isStudent = (req, res, next) => {
    return authorizeRoles('student')(req, res, next);
};

/**
 * Middleware to check if user is faculty
 */
const isFaculty = (req, res, next) => {
    return authorizeRoles('faculty')(req, res, next);
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
    return authorizeRoles('admin')(req, res, next);
};

/**
 * Middleware to check if user is faculty or admin
 */
const isFacultyOrAdmin = (req, res, next) => {
    return authorizeRoles('faculty', 'admin')(req, res, next);
};

/**
 * Optional authentication - attaches user if token is valid, but doesn't fail if no token
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = verifyToken(token);
            req.user = decoded;
        }
        
        next();
    } catch (error) {
        // Don't fail - just continue without user data
        next();
    }
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    isStudent,
    isFaculty,
    isAdmin,
    isFacultyOrAdmin,
    optionalAuth,
};
