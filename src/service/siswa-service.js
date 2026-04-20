
import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validate.js";
import { responseError } from "../error/response-error.js";
import { createAbsensiValidation } from "../validation/siswa-validation.js";
import { upload } from "../application/multer.js";

const createAbsensi = async(request)=>{
    request = validate(createAbsensiValidation, request);

    const kegiatan = await prismaClient.kegiatan.count({
        where :{
            id : request.kegiatan_id
        }
    })

    if(!kegiatan) throw new responseError(404, 'Kegiatan Not Found!');

    return prismaClient.absensi.create({
        data : request
    })
}

export default{
    createAbsensi
}