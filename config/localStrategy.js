const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Serialize the user into the session (store the user ID in the session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize the user from the session (retrieve user by ID)
passport.deserializeUser((id, done) => {
    User.findByPk(id).then((user) => {
        done(null, user);
    }).catch((err) => console.error('Error deserializing user:', err));
});

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

    // If everything is fine, return the user
    return done(null, user);

  } catch (err) {
    // Handle any other errors
    return done(err);
  }
}));

module.exports = router;