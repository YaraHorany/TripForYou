const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Trip = require('../models/trip');
const { tripSchema } = require('../schemas.js');

const lastUpdate = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (date + ' ' + time);
}

const validateTrip = (req, res, next) => {
    const { error } = tripSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const trips = await Trip.find({});
    res.render('trips/index', { trips });
}));

router.get('/new', (req, res) => {
    res.render('trips/new');
});

router.get('/:id', catchAsync(async (req, res) => {
    const trip = await Trip.findById(req.params.id).populate('comments');
    if (!trip) {
        req.flash('error', 'Cannot find that trip!');
        return res.redirect('/trips')
    }
    res.render('trips/show', { trip });
}));

router.post('/', validateTrip, catchAsync(async (req, res, next) => {
    const trip = new Trip(req.body.trip);
    trip.lastUpdate = lastUpdate();
    await trip.save();
    req.flash('success', 'Successfully made a new trip!');
    res.redirect('/trips');
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if (!trip) {
        req.flash('error', 'Cannot find that trip!');
        return res.redirect('/trips')
    }
    res.render('trips/edit', { trip });
}));

router.put('/:id', validateTrip, catchAsync(async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findByIdAndUpdate(id, { ...req.body.trip });
    trip.lastUpdate = lastUpdate();
    await trip.save();
    req.flash('success', 'Successfully updated trip!');
    res.redirect(`/trips/${trip._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted trip!');
    res.redirect('/trips');
}));

module.exports = router;