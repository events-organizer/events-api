const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const {requireAuth} = require('../middlewares/auth.middleware');
const {
    validateLogin,
    validateRegister,
    validateRefreshToken,
    validateLogout,
    validateGoogleLogin
} = require('../validations/auth.validation');


// POST /auth/register
router.post('/register', validateRegister, authController.register);

// POST /auth/login
router.post('/login', validateLogin, authController.login);

// POST /auth/refresh
router.post('/refresh', validateRefreshToken, authController.refresh);

// DELETE /auth/logout
router.delete('/logout', validateLogout, authController.logout);

// GET /auth/me
router.get('/me', requireAuth, authController.me);

// POST /auth/google-login
router.post('/google-login', validateGoogleLogin, authController.googleLogin);

module.exports = router;