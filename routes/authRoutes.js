const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const authCheck = require('../middleware/authMiddleware')
const router = express.Router();

// Local authentication
router.post('/signup', authController.signup);
router.post('/login', authCheck, authController.login);
router.post('/logout', authController.logout);

// OTP and Password Reset Routes
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);

// Google authentication route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google redirect route after successful login
router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: '/auth/login'
}), (req, res) => {
    // On successful authentication, redirect the user to the profile page
    res.redirect('/profile/');
});

router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
}));

router.get('/facebook/redirect', passport.authenticate('facebook', {
    failureRedirect: '/auth/login'
}), (req, res) => {
    try {
        res.redirect('/profile');
    } catch (err) {
        console.error('Error during redirect:', err);
        res.status(500).send('An error occurred');
    }
});

// Protect the home route by ensuring the user is authenticated
router.get('/', authCheck, (req, res) => {
    console.log('User in session:', req.user);
    res.status(200).send({ user: req.user });
});

module.exports = router;