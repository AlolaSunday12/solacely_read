const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { User } = require('../models/user');

// Passport LocalStrategy for authentication
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // If no user is found, return false with an appropriate message
    if (!user) {
      return done(null, false, { message: 'Invalid credentials.' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // If the password doesn't match, return false with an appropriate message
    if (!isMatch) {
      return done(null, false, { message: 'Invalid credentials.' });
    }
    console.log("USER AUTHENTICATED:", user);

    // If everything is fine, return the user
    return done(null, user);

  } catch (err) {
    // Handle any other errors
    return done(err);
  }
}));

module.exports = router;