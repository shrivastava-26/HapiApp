// Ensures incoming data meets the expected format and structure.

const Joi = require('joi');

let userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(50).required(),
    phone: Joi.number().required(),
    age:Joi.number().required(),
    dept:Joi.string().min(3).required()
});

module.exports = userSchema