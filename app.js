const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { tripSchema, commentSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Trip = require('./models/trip');
const Comment = require('./models/comment');

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

const validateTrip = (req, res, next) => {
    const { error } = tripSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const lastUpdate = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (date + ' ' + time);
}

app.get('/trips', catchAsync(async (req, res) => {
    const trips = await Trip.find({});
    res.render('trips/index', { trips });
}))

app.get('/trips/new', (req, res) => {
    res.render('trips/new');
})

app.get('/trips/:id', catchAsync(async (req, res) => {
    const trip = await Trip.findById(req.params.id).populate('comments');
    res.render('trips/show', { trip });
}))

app.post('/trips', validateTrip, catchAsync(async (req, res, next) => {
    const trip = new Trip(req.body.trip);
    trip.lastUpdate = lastUpdate();
    await trip.save();
    res.redirect('/trips');
}))

app.get('/trips/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    res.render('trips/edit', { trip });
}))

app.put('/trips/:id', validateTrip, catchAsync(async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findByIdAndUpdate(id, { ...req.body.trip });
    trip.lastUpdate = lastUpdate();
    await trip.save();
    res.redirect(`/trips/${trip._id}`);
}))

app.delete('/trips/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    res.redirect('/trips');
}))

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/trips/:id/comments', validateComment, catchAsync(async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    trip.comments.push(comment);
    await comment.save();
    await trip.save();
    res.redirect(`/trips/${trip._id}`);
}))

app.delete('/trips/:id/comments/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Trip.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/trips/${id}`);
}))

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

