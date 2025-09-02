const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        }),
    deviceInfo: Joi.object({
        deviceId: Joi.string().optional(),
        deviceType: Joi.string().valid('mobile', 'desktop', 'tablet').optional(),
        ipAddress: Joi.string().ip().optional(),
        deviceLocation: Joi.string().optional(),
        osVersion: Joi.string().optional(),
        appVersion: Joi.string().optional()
    }).optional()
});

const loginSchema = Joi.object({
    emailOrPhone: Joi.string().required(),
    password: Joi.string().required(),
    deviceInfo: Joi.object({
        deviceId: Joi.string().optional(),
        deviceType: Joi.string().valid('mobile', 'desktop', 'tablet').optional(),
        ipAddress: Joi.string().ip().optional(),
        deviceLocation: Joi.string().optional(),
        osVersion: Joi.string().optional(),
        appVersion: Joi.string().optional()
    }).optional()
});

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
    deviceInfo: Joi.object({
        deviceId: Joi.string().optional(),
        deviceType: Joi.string().valid('mobile', 'desktop', 'tablet').optional(),
        ipAddress: Joi.string().ip().optional(),
        deviceLocation: Joi.string().optional(),
        osVersion: Joi.string().optional(),
        appVersion: Joi.string().optional()
    }).optional()
});

const logoutSchema = Joi.object({
    refreshToken: Joi.string().required()
});

const googleLoginSchema = Joi.object({
    idToken: Joi.string().required(),
    deviceInfo: Joi.object({
        deviceId: Joi.string().optional(),
        deviceType: Joi.string().valid('mobile', 'desktop', 'tablet').optional(),
        ipAddress: Joi.string().ip().optional(),
        deviceLocation: Joi.string().optional(),
        osVersion: Joi.string().optional(),
        appVersion: Joi.string().optional()
    }).optional()
});

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

module.exports = {
    validateRegister: validateRequest(registerSchema),
    validateLogin: validateRequest(loginSchema),
    validateRefreshToken: validateRequest(refreshTokenSchema),
    validateLogout: validateRequest(logoutSchema),
    validateGoogleLogin: validateRequest(googleLoginSchema)
};

