const passport = require('passport');
const { User } = require('../models/user'); // Adjust path based on your project structure

// Import authentication strategies
require('./googleStrategy');
require('./facebookStrategy');
require('./localStrategy');

passport.serializeUser((user, done) => {
    console.log("SERIALIZING USER:", user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id); // Use `findByPk` for Sequelize
        console.log("DESERIALIZING USER:", user);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;