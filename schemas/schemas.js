const Joi = require('joi');

module.exports.tripSchema = Joi.object({
    trip: Joi.object({
        country: Joi.string().required().trim(),
        numOfDays: Joi.number().required().integer().min(1),
        startCity: Joi.string().required().trim(),
        endCity: Joi.string().required().trim(),
        daysProgram: Joi.array().items(Joi.string().allow("").trim()).min(1)
    }).required(),
    deleteImages: Joi.array()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
});

