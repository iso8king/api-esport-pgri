import Joi from 'joi'

export const createKegiatanValidation = Joi.object({
    nama_kegiatan : Joi.string().max(100).required(),
    tanggal_kegiatan : Joi.date().required(),
    jam_mulai : Joi.string().required(),
    onlyTeam : Joi.boolean().required().default(false),
    attachment : Joi.string().max(100).optional(),
    jam_selesai : Joi.string().required(),
    lokasi : Joi.string().required().min(1),
    deskripsi : Joi.string().required().min(1)
});

export const updateKegiatanValidation = Joi.object({
    id : Joi.string().max(36).required(),
    nama_kegiatan : Joi.string().max(100).optional(),
    tanggal_kegiatan : Joi.date().optional(),
    jam_mulai : Joi.string().optional(),
    onlyTeam : Joi.bool().optional(),
    attachment : Joi.string().max(100).optional(),
    jam_selesai : Joi.string().optional(),
    lokasi : Joi.string().optional().min(1),
    deskripsi : Joi.string().optional().min(1)
})

export const idKegiatanValidation = Joi.string().max(36).required();

export const idTeamValidation = Joi.number().required().min(1);

export const getAllValidation = Joi.object({
    page : Joi.number().min(1).positive().default(1),
    size : Joi.number().min(1).max(100).default(10)
})

export const addMemberValidation = Joi.object({
    teamId : Joi.number().min(1).required(),
    userId : Joi.string().max(36).required(),
    role : Joi.string().valid("gold","exp","mid","jungle","roam").required()
})

export const updateTeamNameValidation = Joi.object({
    nama_tim : Joi.string().max(100).required()
})

export const addBeritaValidation = Joi.object({
    link : Joi.string().min(1).required().uri()
})

export const idBeritaValidation = Joi.string().max(36).min(1).required()
