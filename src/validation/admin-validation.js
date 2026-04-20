import Joi from 'joi'

export const createKegiatanValidation = Joi.object({
    nama_kegiatan : Joi.string().max(100).required(),
    tanggal_kegiatan : Joi.date().required(),
    jam : Joi.string().required()
});

export const updateKegiatanValidation = Joi.object({
    id : Joi.string().max(36).required(),
    nama_kegiatan : Joi.string().max(100).optional(),
    tanggal_kegiatan : Joi.date().optional(),
    jam : Joi.string().optional()
})

export const idKegiatanValidation = Joi.string().max(36).required();

export const getAllValidation = Joi.object({
    page : Joi.number().min(1).positive().default(1),
    size : Joi.number().min(1).max(100).default(10)
})
