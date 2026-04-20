import Joi from "joi";  

export const createAbsensiValidation = Joi.object({
    user_id : Joi.string().max(36).required(),
    kegiatan_id : Joi.string().max(36).required(),
    deskripsi : Joi.string().max(1000).required(),
    mood : Joi.string().allow("baik", 'buruk', 'biasa').required(),
    bukti : Joi.string().max(100).required()
})


