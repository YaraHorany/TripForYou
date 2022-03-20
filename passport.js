const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const User = require('./models/user');

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => {
            done(null, user);
        });
    });

    // ******************** Local Strategy ********************
    passport.use(new LocalStrategy(User.authenticate()));

    // ******************** Google Strategy ********************
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback",
        passReqToCallback: true
    },
        function (request, accessToken, refreshToken, profile, done) {
            User.findOrCreate({ googleId: profile.id, googleName: profile.displayName }, function (err, user) {
                return done(err, user);
            });
        }
    ));
};