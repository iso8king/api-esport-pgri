import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validate.js";
import { responseError } from "../error/response-error.js";
import {createKegiatanValidation, getAllValidation, idKegiatanValidation, updateKegiatanValidation} from "../validation/admin-validation.js"

const createKegiatan = async(request)=>{
    request = validate(createKegiatanValidation, request);

    return prismaClient.kegiatan.create({
        data : request
    })
}

const getKegiatan = async(id_kegiatan)=>{
    id_kegiatan = validate(idKegiatanValidation, id_kegiatan);
    const kegiatan = await prismaClient.kegiatan.findUnique({
        where : {
            id : id_kegiatan
        }
    });

    if(!kegiatan) throw new responseError(404, "Kegiatan Not Found!");

    return kegiatan;
}

const getAllKegiatan= async(request)=>{
    request = validate(getAllValidation, request);

    const skip = (request.page - 1) * request.size;
    const kegiatan = await prismaClient.kegiatan.findMany({
        skip,
        take : request.size,
        orderBy :{
            id : 'desc'
        }
    });

    const totalItems = await prismaClient.kegiatan.count();

    return{
        paging : {
            page : request.page,
            totalItems : totalItems,
            totalPage :  Math.ceil(totalItems/ request.size)
        },
        data : kegiatan
    }
}

const updateKegiatan = async(id_kegiatan,request)=>{
    request.id = id_kegiatan
    request = validate(updateKegiatanValidation, request);
    const data = {}

    const field = ['nama_kegiatan' , "tanggal" , "jam"];

    for (const f of field) {
        if(request[f] !== "undefined"){
            data[f] = request[f]
        }      
    }

    return prismaClient.kegiatan.update({
        where : {
            id : request.id,
        },
        data
    })
}

const deleteKegiatan = async(id_kegiatan)=>{
    id_kegiatan = validate(idKegiatanValidation, id_kegiatan);

    const delKegiatan = await prismaClient.kegiatan.delete({
        where : {
            id : id_kegiatan
        }
    })

    if(!delKegiatan) throw new responseError(404, "Not Found!");
}

const getAbsensi = async(id_kegiatan)=>{
    id_kegiatan = validate(idKegiatanValidation, id_kegiatan);

    const absen = await prismaClient.absensi.findFirst({
        where :{
            kegiatan_id : id_kegiatan
        },
        select : {
            user : {
                select : {
                    nama : true
                }
            },
            kegiatan : {
                select :{
                    nama_kegiatan : true
                }
            },
            deskripsi : true,
            mood : true,
            bukti : true
        }
    });

    return absen;
}

export default{
    createKegiatan,
    getKegiatan,
    getAllKegiatan,
    updateKegiatan,
    deleteKegiatan,
    getAbsensi
}