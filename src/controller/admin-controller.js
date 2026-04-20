import adminService from "../service/admin-service.js";

const createKegiatan = async(req,res,next)=>{
    try {
        const result = await adminService.createKegiatan(req.body);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }
}

const getKegiatan = async(req,res,next)=>{
    try {
        const result = await adminService.getKegiatan(req.params.id_kegiatan);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }
}

const getAllKegiatan = async(req,res,next)=>{
    try {
        const page = req.query.page;
        const size = req.query.size;
        const request = {
            page,
            size
        }
        const result = await adminService.getAllKegiatan(request);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }
}

const updateKegiatan = async(req,res,next)=>{
    try {
        const id_kegiatan = req.params.id_kegiatan;
        const result = await adminService.updateKegiatan(id_kegiatan,req.body);
        res.status(200).json({
            data : result
        });
    } catch (e) {
        next(e);        
    }
}

const delete_kegiatan = async(req,res,next)=>{
    try {
        const id_kegiatan = req.params.id_kegiatan;
        await adminService.deleteKegiatan(id_kegiatan);
        res.status(200).json({
            data : 'OK'
        })
    } catch (e) {
        next(e)        
    }
};

const get_absensi = async(req,res,next)=>{
    try {
        const id_kegiatan = req.params.id_kegiatan;
        const result = await adminService.getAbsensi(id_kegiatan);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }
}

export default{
    createKegiatan,
    getKegiatan,
    getAllKegiatan,
    updateKegiatan,
    delete_kegiatan,
    get_absensi
}