const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const keys = require('./keys');
const User = require('../models/user'); // Import the User model

require('dotenv').config();

// Google OAuth Strategy for Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/redirect',
    scope: ['profile', 'email']
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ where: { googleId: profile.id } }).then((currentUser) => {
        if (currentUser) {
            // User exists, return the user
            console.log('User found:', currentUser);
            done(null, currentUser);
        } else {
            // Create a new user
            new User({
                username: profile.displayName,
                googleId: profile.id,
                thumbnail: profile._json.picture,
            }).save().then((newUser) => {
                console.log('New user created:', newUser);
                done(null, newUser);
            }).catch((err) => {
                console.error('Error saving new user:', err);
                done(err);
            });
        }
    }).catch((err) => {
        console.error('Error finding user:', err);
        done(err);
    });
}));