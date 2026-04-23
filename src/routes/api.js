import express from 'express'
import userController from '../controller/user-controller.js'
import { authMiddleware, roleMiddleware } from '../middleware/auth-middleware.js'
import adminController from '../controller/admin-controller.js';
import siswaController from '../controller/siswa-controller.js';
import { upload } from '../application/multer.js';

const userRouter = express.Router();
const adminRouter = express.Router();
const siswaRouter = express.Router();

userRouter.delete('/api/users/logout' , [authMiddleware] , userController.logout);
userRouter.get('/api/users/current' , [authMiddleware] , userController.getUser)
userRouter.patch('/api/users/updateprofile' , [authMiddleware] , userController.updateProfile);
userRouter.post('/api/users/verify', authMiddleware, userController.verifyOTP)

// Admin Router
adminRouter.post('/api/kegiatan/create', [authMiddleware, roleMiddleware(['admin'])], adminController.createKegiatan)
adminRouter.get('/api/kegiatan/:id_kegiatan' , [authMiddleware, roleMiddleware(['admin', 'user'])] , adminController.getKegiatan);
adminRouter.get('/api/kegiatan', [authMiddleware, roleMiddleware(['admin', 'user'])], adminController.getAllKegiatan);
adminRouter.patch('/api/kegiatan/:id_kegiatan/update', [authMiddleware, roleMiddleware(['admin'])], adminController.updateKegiatan);
adminRouter.delete('/api/kegiatan/:id_kegiatan/delete', [authMiddleware, roleMiddleware(['admin'])], adminController.delete_kegiatan);
adminRouter.get('/api/absen/:id_kegiatan/get' , [authMiddleware, roleMiddleware(['admin'])], adminController.get_absensi)

// Siswa Router
siswaRouter.post('/api/absen/:id_kegiatan/create', [authMiddleware, roleMiddleware(['user']), upload.single("bukti")], siswaController.createAbsensi);

export{
    userRouter,
    adminRouter,
    siswaRouter
}