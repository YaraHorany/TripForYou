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

router.get('/logout', users.logout);

module.exports = router;

