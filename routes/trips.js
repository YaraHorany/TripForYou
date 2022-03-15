const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const Trip = require('../models/trip');
const { isLoggedIn, validateTrip, isAuthor } = require('../middleware');

const lastUpdate = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (date + ' ' + time);
}

router.get('/', catchAsync(async (req, res) => {
    const trips = await Trip.find({});
    res.render('trips/index', { trips });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('trips/new');
});

router.get('/:id', catchAsync(async (req, res) => {
    const trip = await Trip.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!trip) {
        req.flash('error', 'Cannot find that trip!');
        return res.redirect('/trips')
    }
    res.render('trips/show', { trip });
}));

router.post('/', isLoggedIn, validateTrip, catchAsync(async (req, res, next) => {
    const trip = new Trip(req.body.trip);
    trip.lastUpdate = lastUpdate();
    trip.author = req.user._id;
    await trip.save();
    req.flash('success', 'Successfully made a new trip!');
    res.redirect('/trips');
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if (!trip) {
        req.flash('error', 'Cannot find that trip!');
        return res.redirect('/trips')
    }
    res.render('trips/edit', { trip });
}));

router.put('/:id', isLoggedIn, isAuthor, validateTrip, catchAsync(async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findByIdAndUpdate(id, { ...req.body.trip });
    trip.lastUpdate = lastUpdate();
    await trip.save();
    req.flash('success', 'Successfully updated trip!');
    res.redirect(`/trips/${trip._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted trip!');
    res.redirect('/trips');
}));

module.exports = router;