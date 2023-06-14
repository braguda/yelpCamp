const Joi = require("joi");


module.exports.campgroundJoiSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewsJoiSchema = Joi.object({
    reviews: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});

module.exports.userJoiSchema = Joi.object({
    user: Joi.object({
        
    })
})