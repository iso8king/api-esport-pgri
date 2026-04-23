import Joi from "joi";

export const registerUserValidation = Joi.object({
    email : Joi.string().max(100).required().email(),
    username : Joi.string().max(100).required(),
    password : Joi.string().max(100).required(),
    nama : Joi.string().max(100).required(),
    role : Joi.string().valid("admin" , 'user'),
    game_id : Joi.string().required(),
    server_id : Joi.string().required().max(4)
})

export const loginValidation = Joi.object({
    username : Joi.string().max(100).required(),
    password : Joi.string().required()
});

export const updateUserValidation = Joi.object({
    username : Joi.string().max(100).optional(),
    nama : Joi.string().max(100).optional(),
    game_id : Joi.string().max(100).optional(),
    server_id : Joi.string().max(4).optional()
})

export const changePassword = Joi.object({
    password : Joi.string().max(100).required()
})

export const otpVerificationValidation = Joi.object({
    email : Joi.string().required().email(),
    otp : Joi.string().required()
});


