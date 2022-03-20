const { tripSchema, commentSchema } = require('./schemas/schemas');
const ExpressError = require('./utils/ExpressError');
const Trip = require('./models/trip');
const Comment = require('./models/comment');

const { validationResult } = require('express-validator');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateTrip = (req, res, next) => {
    const { error } = tripSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if (!trip.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/trips/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/trips/${id}`);
    }
    next();
}

module.exports.validateRequestSchema = (req, res, next) => {
    const error = validationResult(req);
    if (error && error.errors.length != 0) {
        const msg = error.errors.map(el => el.msg).join(',');
        req.flash('error', msg);
        return res.redirect('/register');
    } else {
        next();
    }
}




