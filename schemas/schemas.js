const Joi = require('joi');

module.exports.tripSchema = Joi.object({
    trip: Joi.object({
        country: Joi.string().required(),
        coverUrl: Joi.string().required(),
        numOfDays: Joi.number().required().min(1),
        startCity: Joi.string().required(),
        endCity: Joi.string().required()
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
});

