const { body } = require('express-validator');
const ExpressError = require('../utils/ExpressError');

module.exports.registerSchema = [
    body('username').trim().not().isEmpty().withMessage('Username is required'),
    body('email').normalizeEmail().isEmail().withMessage('Please enter a valid email'),
    body('password').trim().not().isEmpty().isLength({ min: 8, max: 20 }).withMessage('Your password should have min and max length between 8-20'),
    body('confirmPassword').trim().not().isEmpty().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new ExpressError('Password confirmation does not match', 400);
        }
        return true;
    })
];
