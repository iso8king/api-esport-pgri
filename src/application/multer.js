import multer from "multer";
import fs from "fs"
import { responseError } from "../error/response-error.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../assets/upload');

function formatTanggal(date){
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth()).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${day}-${month}-${year}`
}

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive : true});  
}

// Config Storage
const storage = multer.diskStorage({
    destination : (req,file, cb)=>{
        cb(null, uploadDir);
    },
    filename : (req, file, cb)=>{
        const nama_pengirim = req.user.nama;
        const now = new Date();
        const date = formatTanggal(now)
        const extensi = path.extname(file.originalname);
        cb(null, nama_pengirim + '-' + date + extensi);
    }
}) 

// Filter extensi
const allowExt = (req,file,cb)=>{
    const allowMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    if(allowMimes.includes(file.mimetype)){
        cb(null, true);
    } else{
        cb(new responseError(400, "Salah Ekstensi File"));
    }
}

export const upload = multer({
    storage,
    limits : {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter : allowExt
})

