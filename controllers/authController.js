const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../models/user');
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const authCheck = require('../middleware/authMiddleware')
const {sendOTPEmail} = require('../utils/sendEmail')

// Signup route
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ errors: ["All fields are required."] });
    }
  
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ errors: ["Email already in use."] });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user instance
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });
   // Save the user to the database
   await newUser.save();
   res.status(201).send("User registered successfully!");
 } catch (error) {
   // If the error is a Sequelize validation error, send the validation messages
   if (error.name === 'SequelizeValidationError') {
     const errorMessages = error.errors.map(err => err.message);
     return res.status(400).json({ errors: errorMessages });
   }
   // For other types of errors, return a generic message
   console.error(error);
   res.status(500).send("Error registering user.");
 }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });

        if (!user) return res.status(401).json({ error: info.message });

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ error: 'Login failed' });

            req.session.user = {
                id: user.id,
                isAdmin: user.isAdmin
            };

            return res.json({
                message: 'Login successful',
                user: req.session.user
            });
        });
    })(req, res, next);
};

// Logout route to destroy the session and clear the cookie
exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }

            // Clear the session cookie
            res.clearCookie('connect.sid'); // Adjust this if you're using a custom session cookie name
            res.redirect('/'); // Redirect to the homepage after logout
        });
    });
};

// Generate OTP
const generateOTP = () => {
    return (Math.floor(100000 + Math.random() * 900000)).toString();
};

// sent OTP  for password reset
exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP and expiry time (10 minutes)
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to user record
    await user.update({ otp, otpExpires });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent to your email for password reset' });
};

exports.resendOTP = async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new OTP and expiry time (10 minutes)
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Save new OTP to user record
    await user.update({ otp, otpExpires });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.json({ message: 'New OTP sent to your email' });
};

// verify OTP for password reset
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp || user.otpExpires < new Date()) {
        return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (user.otp !== otp) {
        return res.status(400).json({ message: 'Incorrect OTP' });
    }

    // Clear OTP after successful verification
    await user.update({ otp: null, otpExpires: null });

    res.json({ message: 'OTP verified. You can now reset your password' });
};

// Reset password API
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password reset successful' });
};

//module.exports = router;