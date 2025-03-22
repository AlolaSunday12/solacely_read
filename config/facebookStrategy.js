const express = require('express');
const router = express.Router();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const keys = require('./keys');

passport.serializeUser((user, done) => {
    done (null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findByPk(id)
    .then((user) => {
        done(null, user)
    }).catch((err) => {
        console.error('Error occurred while deserializing:', err)
        done(err, null);
     })
});

passport.use(new FacebookStrategy({
    callbackURL: 'http://localhost:5000/auth/facebook/redirect',
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
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

module.exports = router;