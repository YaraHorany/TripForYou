if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');

const userRoutes = require('./routes/users');
const tripRoutes = require('./routes/trips');
const commentRoutes = require('./routes/comments');

const Trip = require('./models/trip');

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

require('./passport')(passport); // pass passport for configuration

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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/trips', tripRoutes);
app.use('/trips/:id/comments', commentRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

// app.post('/trips/getCountries', async (req, res) => {
//     let payload = req.body.payload.trim(); // removing spaces from both sides of the string
//     let search = await Trip.find({ country: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec(); // it has to start with payload 
//     // limit search results to 10
//     search = search.slice(0, 10);
//     res.send({ payload: search });
// })

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

