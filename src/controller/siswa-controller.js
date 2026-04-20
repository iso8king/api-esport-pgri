import siswaService from "../service/siswa-service.js";

const createAbsensi = async(req,res,next)=>{
    try {
    const request = req.body;
    request.user_id = req.user.id;
    request.kegiatan_id = req.params.id_kegiatan;
    request.bukti = req.file.filename;
        
    const result = await siswaService.createAbsensi(request);
    res.status(200).json({
        data : result
    });

    } catch (e) {
        next(e);        
    }
}

export default{
    createAbsensi
}