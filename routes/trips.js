const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateTrip, isAuthor } = require('../middleware');
const trips = require('../controllers/trips');

router.route('/')
    .get(catchAsync(trips.index))
    .post(isLoggedIn, validateTrip, catchAsync(trips.createTrip));

router.get('/new', isLoggedIn, trips.renderNewForm);

router.route('/:id')
    .get(catchAsync(trips.showTrip))
    .put(isLoggedIn, isAuthor, validateTrip, catchAsync(trips.updateTrip))
    .delete(isLoggedIn, isAuthor, catchAsync(trips.deleteTrip));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(trips.renderEditForm));

module.exports = router;