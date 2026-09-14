import Joi from "joi";

export const createThreadValidation = Joi.object({
    title : Joi.string().min(1).max(150).required(),
    content : Joi.string().min(1).required(),
    pinned : Joi.bool().optional(),
})

export const updateThreadValidation = Joi.object({
    title : Joi.string().min(1).max(150).optional(),
    content : Joi.string().min(1).optional(),
    pinned : Joi.bool().optional(),
    id : Joi.string().max(36).required(),
    authorId : Joi.string().required()
})

export const idThreadValidation = Joi.string().max(36);

export const createReplyValidation = Joi.object({
    threadId : Joi.string().max(36).min(1).required(),
    content : Joi.string().min(1).required()
});

export const updateReplyThreadValidation = Joi.object({
    threadId : Joi.string().max(36).min(1).required(),
    content : Joi.string().min(1).required(),
    authorId : Joi.string().max(36).required(),
    id : Joi.number().min(1).required()
})

export const threadIdValidation = Joi.string().max(36);

export const createTierlistValidation = Joi.object({
    content : Joi.string().min(1).required()
});

export const updateTierlistValidation = Joi.object({
     content : Joi.string().min(1).required(),
     authorId : Joi.string().max(36).required(),
     id : Joi.number().min(1).required()
});

export const createCommentTierlistValidation = createTierlistValidation;
export const updateCommentTierlistValidation = Joi.object({
     content : Joi.string().min(1).required(),
     authorId : Joi.string().max(36).required(),
     id : Joi.number().min(1).required(),
     tierlistId : Joi.number().min(1).required()
});

export const voteTierlistValidation = Joi.object({
    value : Joi.number().required().valid(0, -1, 1),
    id_tierlist : Joi.number().min(1).required()
})

export const deleteThreadValidation = Joi.object({
    id: Joi.string().max(36).required(),
    authorId: Joi.string().max(36).required()
});

export const deleteReplyThreadValidation = Joi.object({
    id: Joi.number().min(1).required(),
    threadId: Joi.string().max(36).min(1).required(),
    authorId: Joi.string().max(36).required()
});

export const deleteTierlistValidation = Joi.object({
    id: Joi.number().min(1).required(),
    authorId: Joi.string().max(36).required()
});

export const deleteReplyTierlistValidation = Joi.object({
    id: Joi.number().min(1).required(),
    tierlistId: Joi.number().min(1).required(),
    authorId: Joi.string().max(36).required()
});