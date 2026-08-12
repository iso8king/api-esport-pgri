import adminService from "../service/admin-service.js";
import { hapusSheet } from "../application/excel.js";

const createKegiatan = async(req,res,next)=>{
    try {
        const request = req.body;
        if(req.file) request.attachment = req.file.filename;
        const result = await adminService.createKegiatan(request);
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
        const request = req.body;
        if(req.file) request.attachment = req.file.filename;
        const result = await adminService.updateKegiatan(id_kegiatan,request);
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

const getUser = async(req,res,next)=>{
    try {
         const result = await adminService.getAllUser();
         res.status(200).json({
            data : result
         })
    } catch (e) {
        next(e)        
    }
}

const createTeam = async(req,res,next)=>{
    try {
        const result = await adminService.createTeam(req.query.nama_tim);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e)        
    }
}

const getTeam = async(req,res,next)=>{
    try {
        const result = await adminService.getAllTeam();
        res.status(200).json({
            data : result    
        })
    } catch (e) {
        next(e)        
    }
}

const addingMember = async(req,res,next)=>{
    try {
        const request = req.body;
        request.teamId = req.params.team_id;  

        const result = await adminService.addingMember(request)
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e)        
    }
}

const removeMember = async(req,res,next)=>{
    try {
        const userId = req.query.userId;
        const result = await adminService.removeMember(userId)

        res.status(200).json({
            data : "OK"
        })
    } catch (e) {
        next(e)        
    }
}

const statistic = async(req,res,next)=>{
    try {
        const result = await adminService.statistik();
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e)        
    }
}

const exportExcel = async(req,res,next)=>{
    try {
        const id_kegiatan = req.query.id_kegiatan;
        const result = await adminService.exportExcel(id_kegiatan);
        res.download(result, (err) => {
            if (err) {
                console.error('Error saat download:', err);
            } else {
                hapusSheet(result);
            }
        })
        
    } catch (e) {
        next(e);        
    }
}

const deleteTeam = async(req,res,next)=>{
    try {
        const id_team = req.params.id_team;
        const result = await adminService.deleteTeam(id_team);
        res.status(200).json({
            data : 'OK'
        })
    } catch (e) {
        next(e);        
    }
}

const updateNameTeam = async(req,res,next)=>{
    try {
        const id_team = req.params.id_team;
        const request = req.body;
        const result = await adminService.updateTeamName(id_team, request);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }
}

const addBeritaFromBroguC = async(req,res,next) => {
    try {
        const request = req.body;
        const result = await adminService.addBeritaFromBrogu(request);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }
}

const getBerita = async(req,res,next) => {
    try {
        const result = await adminService.getBerita();
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);
    }
}

const updateBeritaC = async(req,res,next)=>{
    try {
        const request = req.body;
        const id_berita = req.params.id_berita;

        const result = await adminService.updateBerita(id_berita, request);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }
}

const deleteBeritaC = async(req,res,next) => {
    try {
        const id_berita = req.params.id_berita;

        const result = await adminService.deleteBerita(id_berita);
        res.status(200).json({
            data : 'OK'
        })
    } catch (e) {
        next(e);        
    }
}


export default{
    getBerita,
    exportExcel,
    createKegiatan,
    getKegiatan,
    getAllKegiatan,
    updateKegiatan,
    delete_kegiatan,
    get_absensi,
    getUser,
    createTeam,
    getTeam,
    addingMember,
    removeMember,
    statistic,
    deleteTeam,
    updateNameTeam,
    addBeritaFromBroguC,
    updateBeritaC,
    deleteBeritaC
}