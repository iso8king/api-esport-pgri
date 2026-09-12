import Joi from "joi";

export const createThreadValidation = Joi.object({
    title : Joi.string().min(1).max(150).required(),
    content : Joi.string().min(1).required(),
    pinned : Joi.bool().optional(),
})

export const idThreadValidation = Joi.string().max(36);

export const createReplyValidation = Joi.object({
    threadId : Joi.string().max(36).min(1).required(),
    content : Joi.string().min(1).required()
});

export const threadIdValidation = Joi.string().max(36);

export const createTierlistValidation = Joi.object({
    content : Joi.string().min(1).required()
});

export const createCommentTierlistValidation = createTierlistValidation

export const voteTierlistValidation = Joi.object({
    value : Joi.number().required().valid(0, -1, 1),
    id_tierlist : Joi.number().min(1).required()
})