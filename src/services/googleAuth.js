const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {signAccessToken, generateRefreshToken, hashToken, refreshExpiryDate} = require('../utils/token');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleSignInHandler = async (req, res) => {
    try {
        const {idToken, deviceInfo} = req.body;

        if (!idToken) {
            return res.status(400).json({
                success: false,
                error: 'ID Token is required'
            });
        }

        // Verify the ID token
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: [
                process.env.GOOGLE_WEB_CLIENT_ID,
                process.env.GOOGLE_ANDROID_CLIENT_ID,
            ],
        });
        const payload = ticket.getPayload();

        const { sub: googleId, email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required from Google'
            });
        }

        // Check if user already exists by email or providerId
        let user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { providerId: googleId, provider: 'google' }
            ]
        });

        let isNewUser = false;

        if (!user) {
            // Create a new user if not found
            user = new User({
                name,
                email: email.toLowerCase(),
                provider: 'google',
                providerId: googleId,
                profilePicture: picture,
                roles: ['patient']
            });
            await user.save();
            isNewUser = true;
        } else if (user.provider === 'local' && !user.providerId) {
            // Link Google account to existing local account
            user.provider = 'google';
            user.providerId = googleId;
            if (picture && !user.profilePicture) {
                user.profilePicture = picture;
            }
            await user.save();
        }

        // Clean expired refresh tokens
        user.refreshTokens = user.refreshTokens.filter(
            rt => rt.expiresAt > new Date()
        );

        // Generate new refresh token
        const refreshToken = generateRefreshToken();
        const tokenHash = hashToken(refreshToken);

        user.refreshTokens.push({
            token: tokenHash,
            deviceInfo: deviceInfo || 'Google Sign-In',
            expiresAt: refreshExpiryDate()
        });

        await user.save();

        // Generate JWT access token
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
        console.error('Google Sign-In Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};

module.exports = { googleSignInHandler };

