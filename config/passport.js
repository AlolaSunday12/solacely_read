const passport = require('passport');
const User = require('../models/user'); // Adjust path based on your project structure

// Import authentication strategies
require('./googleStrategy');
require('./facebookStrategy');
require('./localStrategy');


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

module.exports = passport;