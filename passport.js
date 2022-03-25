const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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
            User.findOrCreate({ googleId: profile.id, googleName: profile.displayName, googleEmail: profile.emails[0].value }, function (err, user) {
                return done(err, user);
            });
        }
    ));

    // ******************** Facebook Strategy ********************
    passport.use(new FacebookStrategy({
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName']
    },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            User.findOrCreate({ facebookId: profile.id, facebookName: profile.displayName }, function (err, user) {
                console.log(profile.id);
                console.log(profile.displayName);
                return done(err, user);
            });
        }
    ));
};