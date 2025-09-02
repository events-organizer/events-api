const {OAuth2Client} = require('google-auth-library');
const User = require('../models/User');
const {signAccessToken, generateRefreshToken, hashToken, refreshExpiryDate} = require('../utils/token');
const googleClient = new OAuth2Client();

/**
 * Register a new user
 */
const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            username,
            email,
            phone,
            password,
            deviceInfo,
        } = req.body;

        // Check for existing user
        const existingUser = await User.findOne({
            $or: [
                {email: email.toLowerCase()},
                {username: username.toLowerCase()},
                ...(phone ? [{phone}] : [])
            ]
        });

        if (existingUser) {
            let field = 'Email';
            if (existingUser.username === username.toLowerCase()) field = 'Username';
            else if (existingUser.phone === phone) field = 'Phone number';

            return res.status(409).json({
                success: false,
                error: `${field} already exists`
            });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            phone,
            roles: ['attendee'],
            provider: 'local'
        });

        await user.setPassword(password);

        // Generate tokens
        const refreshToken = generateRefreshToken();
        const hashedToken = hashToken(refreshToken);

        user.refreshTokens.push({
            token: hashedToken,
            deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : 'Unknown device',
            expiresAt: refreshExpiryDate()
        });

        await user.save();

        const accessToken = signAccessToken({
            sub: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            profilePicture: user.profilePicture || user.avatar,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                accessToken,
                refreshToken,
                user: user.toSafeJSON()
            }
        });

    } catch (error) {
        console.error('Registration error:', error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                success: false,
                error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
            });
        }

        res.status(500).json({
            success: false,
            error: 'Registration failed'
        });
    }
};

/**
 * Login user
 */
const login = async (req, res) => {
    try {
        const {emailOrPhone, password, deviceInfo} = req.body;

        // Find user by email, username, or phone
        const user = await User.findOne({
            $or: [
                {email: emailOrPhone.toLowerCase()},
                {username: emailOrPhone.toLowerCase()},
                {phone: emailOrPhone}
            ]
        }).select('+passwordHash');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if account is locked
        if (user.accountLocked && user.lockUntil && user.lockUntil > new Date()) {
            return res.status(423).json({
                success: false,
                error: 'Account is temporarily locked due to too many failed attempts'
            });
        }

        // Validate password
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Update last login and clear any account lock
        user.lastLoginAt = new Date();
        user.accountLocked = false;
        user.lockUntil = undefined;

        // Clean expired refresh tokens and generate new one
        const refreshToken = generateRefreshToken();
        const tokenHash = hashToken(refreshToken);

        user.refreshTokens = user.refreshTokens.filter(
            rt => rt.expiresAt > new Date()
        );

        user.refreshTokens.push({
            token: tokenHash,
            deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : 'Unknown device',
            expiresAt: refreshExpiryDate()
        });

        await user.save();

        const accessToken = signAccessToken({
            sub: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            profilePicture: user.profilePicture || user.avatar,
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                accessToken,
                refreshToken,
                user: user.toSafeJSON()
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
};

/**
 * Refresh access token
 */
const refresh = async (req, res) => {
    try {
        const {refreshToken, deviceInfo} = req.body;

        const tokenHash = hashToken(refreshToken);

        const user = await User.findOne({
            'refreshTokens.token': tokenHash,
            'refreshTokens.expiresAt': {$gt: new Date()}
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired refresh token'
            });
        }

        // Remove old token and add new one
        user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== tokenHash);

        const newRefreshToken = generateRefreshToken();
        user.refreshTokens.push({
            token: hashToken(newRefreshToken),
            deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : 'Unknown device',
            expiresAt: refreshExpiryDate()
        });

        await user.save();

        const accessToken = signAccessToken({
            sub: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture || user.avatar,
            roles: user.roles
        });

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken,
                refreshToken: newRefreshToken,
                user: user.toSafeJSON()
            }
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            success: false,
            error: 'Token refresh failed'
        });
    }
};

/**
 * Logout user
 */
const logout = async (req, res) => {
    try {
        const {refreshToken} = req.body;
        const tokenHash = hashToken(refreshToken);

        const user = await User.findOne({
            'refreshTokens.token': tokenHash
        });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'User already logged out'
            });
        }

        // Remove the refresh token
        user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== tokenHash);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            error: 'Logout failed'
        });
    }
};

/**
 * Google OAuth login
 */
const googleLogin = async (req, res) => {
    try {
        const {idToken, deviceInfo} = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: [
                process.env.GOOGLE_WEB_CLIENT_ID,
                process.env.GOOGLE_ANDROID_CLIENT_ID,
            ],
        });

        const payload = ticket.getPayload();

        if (!payload.email || !payload.email_verified) {
            return res.status(400).json({
                success: false,
                error: 'Email is required and must be verified by Google'
            });
        }

        const {sub: googleId, email, name, given_name, family_name, picture} = payload;

        // Find or create user
        let user = await User.findOne({
            $or: [
                {email: email.toLowerCase()},
                {providerId: googleId, provider: 'google'}
            ]
        });

        let isNewUser = false;

        if (!user) {
            // Generate unique username from email
            let username = email.split('@')[0].toLowerCase();
            const existingUsername = await User.findOne({username});
            if (existingUsername) {
                username = `${username}_${Math.random().toString(36).substr(2, 6)}`;
            }

            user = new User({
                firstName: given_name || name?.split(' ')[0] || 'User',
                lastName: family_name || name?.split(' ').slice(1).join(' ') || '',
                username,
                email: email.toLowerCase(),
                provider: 'google',
                providerId: googleId,
                profilePicture: picture,
                isEmailVerified: true,
                emailVerified: true,
                roles: ['attendee']
            });
            isNewUser = true;
        } else if (user.provider === 'local' && !user.providerId) {
            // Link Google account to existing local account
            user.provider = 'google';
            user.providerId = googleId;
            user.isEmailVerified = true;
            user.emailVerified = true;
            if (picture && !user.profilePicture) {
                user.profilePicture = picture;
            }
        }

        // Update last login
        user.lastLoginAt = new Date();

        // Clean expired tokens and generate new ones
        user.refreshTokens = user.refreshTokens.filter(
            rt => rt.expiresAt > new Date()
        );

        const refreshToken = generateRefreshToken();
        const tokenHash = hashToken(refreshToken);

        user.refreshTokens.push({
            token: tokenHash,
            deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : 'Google Sign-In',
            expiresAt: refreshExpiryDate()
        });

        await user.save();

        const accessToken = signAccessToken({
            sub: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            profilePicture: user.profilePicture,
        });

        res.status(200).json({
            success: true,
            message: isNewUser ? 'Account created successfully with Google' : 'Google sign-in successful',
            data: {
                accessToken,
                refreshToken,
                user: user.toSafeJSON()
            }
        });

    } catch (error) {
        console.error('Google login error:', error);

        if (error.message.includes('Wrong number of segments')) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Google ID token'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Google login failed'
        });
    }
};

/**
 * Get current user profile
 */
const me = async (req, res) => {
    try {
        // Get fresh user data from database
        const user = await User.findById(req.user.sub);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile data fetched successfully',
            data: {
                user: user.toSafeJSON()
            }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user data'
        });
    }
};

module.exports = {
    register,
    login,
    googleLogin,
    refresh,
    logout,
    me
};
