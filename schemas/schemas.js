const Joi = require('joi');

module.exports.tripSchema = Joi.object({
    trip: Joi.object({
        country: Joi.string().required(),
        // image: Joi.string().required(),
        numOfDays: Joi.number().required().min(1),
        startCity: Joi.string().required(),
        endCity: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
});

