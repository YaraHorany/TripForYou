const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

const { registerSchema } = require('../schemas/registerSchema');
const { validateRequestSchema } = require('../middleware');

router.get('/register', users.renderRegister);

router.post(
    '/register',
    registerSchema,
    validateRequestSchema,
    catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

// Auth Google Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: "select_account" }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/register' }), users.login);

// Auth Facebook Routes
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/register' }), users.login);

router.get('/logout', users.logout);

module.exports = router;

