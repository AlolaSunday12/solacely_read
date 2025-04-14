const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const authCheck = require('../middleware/authMiddleware')
const router = express.Router();
const sendOTPEmail = require('../utils/sendEmail')
//require('../config/localStrategy');

// Local authentication
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authCheck, authController.logout);

// OTP and Password Reset Routes
router.post('/send-otp', authController.sendOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);
/*
// Local login
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
  });
*/
// Google authentication route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google redirect route after successful login
router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login'
}), authCheck, (req, res) => {
    // On successful authentication, redirect the user to the profile page
    res.redirect('http://localhost:5173/');
});

router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
}));

router.get('/facebook/redirect', passport.authenticate('facebook', {
    failureRedirect: 'http://localhost:5173/login'
}), authCheck, (req, res) => {
    try {
        res.redirect('http://localhost:5173/');
    } catch (err) {
        console.error('Error during redirect:', err);
        res.status(500).send('An error occurred');
    }
});

router.get('/user', (req, res) => {
    console.log("GET /auth/user - REQ.USER:", req.user);
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    res.status(401).json({ message: 'Unauthorized' });
  });
  

// Protect the home route by ensuring the user is authenticated
router.get('/session', authCheck, (req, res) => {
    console.log('User in session:', req.user);
    res.status(200).send({ user: req.user });
});

module.exports = router;