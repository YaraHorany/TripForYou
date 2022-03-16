const { body } = require('express-validator');
const ExpressError = require('../utils/ExpressError');


module.exports.registerSchema = [
    body('username').trim().not().isEmpty().withMessage('Username is required!'),
    body('email').normalizeEmail().isEmail().withMessage('Invalid email'),
    body('password').trim().not().isEmpty().isLength({ min: 5, max: 20 }).withMessage('Password must be 5 to 20 characters long!'),
    body('confirmPassword').trim().not().isEmpty().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new ExpressError('Both password must be the same!', 400);
        }
        return true;
    })
];
