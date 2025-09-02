const {verifyAccessToken} = require("../utils/token");
const User = require("../models/User");


const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Authorization token missing"
            });
        }

        const decoded = verifyAccessToken(token);

        // Optional: Check if user still exists and is active
        const user = await User.findById(decoded.sub);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User not found"
            });
        }

        if (user.accountLocked && user.lockUntil && user.lockUntil > new Date()) {
            return res.status(423).json({
                success: false,
                error: "Account is locked"
            });
        }

        req.user = decoded;
        req.userDoc = user; // Full user document if needed
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: "Invalid token"
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: "Token expired"
            });
        }

        return res.status(401).json({
            success: false,
            error: "Authentication failed"
        });
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "Authentication required"
            });
        }

        const userRoles = req.user.roles || [];
        const hasRole = roles.some(role => userRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({
                success: false,
                error: "Insufficient permissions"
            });
        }

        next();
    };
};

module.exports = {
    requireAuth,
    requireRole
};
