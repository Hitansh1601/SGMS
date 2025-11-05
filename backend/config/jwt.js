// ============================================================
// JWT Configuration
// JSON Web Token settings and helper functions
// ============================================================

const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT Configuration
const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'sgms_secret_key_2024_change_in_production',
    expiresIn: '7d', // Token expires in 7 days
    issuer: 'SGMS',
    audience: 'sgms-users',
};

/**
 * Generate JWT token for a user
 * @param {Object} payload - User data to encode in token
 * @param {number} payload.id - User ID
 * @param {string} payload.email - User email
 * @param {string} payload.role - User role (student/faculty/admin)
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
    try {
        const token = jwt.sign(
            {
                id: payload.id,
                email: payload.email,
                role: payload.role,
                name: payload.name,
            },
            JWT_CONFIG.secret,
            {
                expiresIn: JWT_CONFIG.expiresIn,
                issuer: JWT_CONFIG.issuer,
                audience: JWT_CONFIG.audience,
            }
        );
        return token;
    } catch (error) {
        console.error('Error generating JWT token:', error);
        throw new Error('Token generation failed');
    }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_CONFIG.secret, {
            issuer: JWT_CONFIG.issuer,
            audience: JWT_CONFIG.audience,
        });
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else {
            throw new Error('Token verification failed');
        }
    }
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

module.exports = {
    JWT_CONFIG,
    generateToken,
    verifyToken,
    decodeToken,
};
