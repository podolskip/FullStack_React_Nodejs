const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const otps = {};
otps.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
otps.secretOrKey = keys.secretOrKey;

const passportCallback = (jwt_payload, done) => {
    User.findById(jwt_payload.id)
        .then((user) => {
            if (user) {
                return done(null, user);
            }

            return donw(null, false);
        })
        .catch(err => console.log(err));
}

module.exports = passport => {
    passport.use(
        new jwtStrategy(otps, passportCallback)
    );
}; // this is still an arrow function