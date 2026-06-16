import Joi from "joi";

export const registerUserValidation = Joi.object({
    email : Joi.string().max(100).required().email(),
    username : Joi.string().max(100).required(),
    password : Joi.string().max(100).required(),
    nama : Joi.string().max(100).required(),
    role : Joi.string().valid("admin" , 'user'),
    game_id : Joi.string().required(),
    server_id : Joi.string().required().max(5)
})

export const loginValidation = Joi.object({
    username : Joi.string().max(100).required(),
    password : Joi.string().required()
});

export const updateUserValidation = Joi.object({
    email : Joi.string().max(100).optional().email(),
    nama : Joi.string().max(100).optional(),
    game_id : Joi.string().max(100).optional(),
    server_id : Joi.string().max(5).optional(),
    username : Joi.string().max(100).optional()
})

export const changePassword = Joi.object({
    password : Joi.string().max(100).required(),
    password_new : Joi.string().max(100).required()
})

export const otpVerificationValidation = Joi.object({
    email : Joi.string().required().email(),
    otp : Joi.string().required()
});


