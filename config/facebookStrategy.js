const express = require('express');
const router = express.Router();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
//const keys = require('./keys');

require('dotenv').config();

passport.use(new FacebookStrategy({
    callbackURL: 'http://localhost:5000/auth/facebook/redirect',
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const currentUser = await User.findOne({where: {facebookId: profile.id} })

        if (currentUser) {
            console.log('user is:', currentUser);
            done(null, currentUser)
        } else {
            const newUser = await new User({
                username: profile.displayName,
                facebookId: profile.id,
                thumbnail: profile.photos[0].value 
            }).save();
            console.log('new user created:', newUser);
            done(null, newUser)
        }
    } catch (err) {
        console.error('Error during Facebook authentication:', err);
        done(err, null)
    }
}));