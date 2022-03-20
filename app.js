if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// ******************** GOOGLE ********************
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const findOrCreate = require("mongoose-findorcreate");
// ******************** GOOGLE ********************


// ******************** FACEBOOK ********************
// const FacebookStrategy = require('passport-facebook').Strategy;
// const findOrCreate = require("mongoose-findorcreate");
// ******************** FACEBOOK ********************

// const { facebook } = require('./config');

const User = require('./models/user');

const userRoutes = require('./routes/users');
const tripRoutes = require('./routes/trips');
const commentRoutes = require('./routes/comments');

const app = express();

mongoose.connect('mongodb://localhost:27017/trips', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(express.json());
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
})

// passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// ******************** GOOGLE ********************
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

// Auth Routes
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: "select_account"
}));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/register' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/trips');
    }
);
// ******************** GOOGLE ********************


// ******************** FACEBOOK ********************
// passport.use(new FacebookStrategy({
//     clientID: process.env.CLIENT_ID_FB,
//     clientSecret: process.env.CLIENT_SECRET_FB,
//     callbackURL: "http://localhost:8080/auth/facebook/trips"
// },
//     function (accessToken, refreshToken, profile, cb) {
//         User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//             return cb(err, user);
//         });
//     }
// ));

// app.get('/auth/facebook',
//     passport.authenticate('facebook'));

// app.get('/auth/facebook/trips',
//     passport.authenticate('facebook', { failureRedirect: '/login' }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/trips');
//     });
// ******************** FACEBOOK ********************

app.use('/', userRoutes);
app.use('/trips', tripRoutes);
app.use('/trips/:id/comments', commentRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(8080, () => {
    console.log("Listening on port 8080");
})

