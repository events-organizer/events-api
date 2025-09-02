const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function signAccessToken(payload) {
    return jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
    );
}

function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

// Opaque refresh token (random string). We only store a SHA-256 hash in DB.
function generateRefreshToken() {
    return crypto.randomBytes(48).toString('base64url');
}

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function refreshExpiryDate() {
    const days = parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '30', 10);
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000); // always adds ms in UTC
}

module.exports = {
    signAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    hashToken,
    refreshExpiryDate,
};