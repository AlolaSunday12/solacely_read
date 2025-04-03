const express = require('express');
const router = express.Router();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models/user'); // Import the User model

require('dotenv').config();

passport.use(new FacebookStrategy({
    callbackURL: 'http://localhost:5000/auth/facebook/redirect',
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    profileFields: ['id', 'displayName', 'photos', 'email'] // Request email from Facebook
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const currentUser = await User.findOne({ where: { facebookId: profile.id } });

        if (currentUser) {
            console.log('User found:', currentUser);

            // Update the user's email if it's not already set
            if (!currentUser.email) {
                currentUser.update({ email: profile.emails[0].value }).then(updatedUser => {
                    console.log('User email updated:', updatedUser);
                    done(null, updatedUser);
                }).catch((err) => {
                    console.error('Error updating email:', err);
                    done(err);
                });
            } else {
                done(null, currentUser); // No update needed, email already exists
            }
        } else {
            // Create a new user and include the email
            const newUser = await new User({
                username: profile.displayName,
                facebookId: profile.id,
                email: profile.emails[0].value, // Save the email from Facebook
                thumbnail: profile.photos[0].value // Save the profile picture
            }).save();

            console.log('New user created:', newUser);
            done(null, newUser);
        }
    } catch (err) {
        console.error('Error during Facebook authentication:', err);
        done(err, null);
    }
}));
