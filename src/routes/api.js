import express from 'express'
import userController from '../controller/user-controller.js'
import { authMiddleware, roleMiddleware } from '../middleware/auth-middleware.js'
import adminController from '../controller/admin-controller.js';
import siswaController from '../controller/siswa-controller.js';
import { upload, upload_attachment, upload_face, upload_pfp, uploadSetting } from '../application/multer.js';
import settingController from '../controller/setting-controller.js';
import hubController from '../controller/hub-controller.js';

const userRouter = express.Router();
const adminRouter = express.Router();
const siswaRouter = express.Router();
const hubRouter = express.Router()

userRouter.delete('/api/users/logout' , [authMiddleware] , userController.logout);
userRouter.get('/api/users/current' , [authMiddleware] , userController.getUser)
userRouter.patch('/api/users/updateprofile' , [authMiddleware] , userController.updateProfile);
userRouter.post('/api/users/verify', authMiddleware, userController.verifyOTP)
userRouter.post('/api/users/request/otp', authMiddleware , userController.requestotp)
userRouter.patch('/api/users/update/password' , authMiddleware , userController.changePassword)
userRouter.post('/api/users/check-password' , authMiddleware , userController.checkPassword)
userRouter.patch('/api/users/upload/pfp', [authMiddleware, upload_pfp.single('avatar')], userController.uploadPfp);
userRouter.post('/api/users/upload/face', [authMiddleware, upload_face.single('face')], userController.uploadFaceC);


// Admin Router
adminRouter.post('/api/kegiatan/create', [authMiddleware, roleMiddleware(['admin']), upload_attachment.single("attachment")], adminController.createKegiatan)
adminRouter.get('/api/kegiatan/:id_kegiatan' , [authMiddleware, roleMiddleware(['admin', 'user'])] , adminController.getKegiatan);
adminRouter.get('/api/kegiatan', [authMiddleware, roleMiddleware(['admin', 'user'])], adminController.getAllKegiatan);
adminRouter.patch('/api/kegiatan/:id_kegiatan/update', [authMiddleware, roleMiddleware(['admin']), upload_attachment.single("attachment")], adminController.updateKegiatan);
adminRouter.delete('/api/kegiatan/:id_kegiatan/delete', [authMiddleware, roleMiddleware(['admin'])], adminController.delete_kegiatan);
adminRouter.get('/api/absen/export', [authMiddleware, roleMiddleware(['admin'])], adminController.exportExcel);
adminRouter.get('/api/absen/:id_kegiatan/get' , [authMiddleware, roleMiddleware(['admin'])], adminController.get_absensi)
adminRouter.get('/api/users/all' , [authMiddleware , roleMiddleware(['admin'])] , adminController.getUser)
adminRouter.post('/api/teams/create' , [authMiddleware , roleMiddleware(['admin'])] , adminController.createTeam)
adminRouter.get('/api/teams/all' , [authMiddleware , roleMiddleware(['admin'])] , adminController.getTeam)
adminRouter.post('/api/teams/:team_id/add' , [authMiddleware , roleMiddleware(['admin'])] , adminController.addingMember)
adminRouter.delete('/api/teams/:team_id/remove' , [authMiddleware , roleMiddleware(['admin'])] , adminController.removeMember)
adminRouter.get('/api/statistik' , [authMiddleware, roleMiddleware(['admin'])] , adminController.statistic)
adminRouter.delete('/api/teams/:id_team', [authMiddleware, roleMiddleware(['admin'])], adminController.deleteTeam)
adminRouter.patch('/api/teams/:id_team', [authMiddleware, roleMiddleware(['admin'])], adminController.updateNameTeam)
adminRouter.post('/api/berita/create', [authMiddleware, roleMiddleware(['admin'])], adminController.addBeritaFromBroguC)
adminRouter.patch('/api/berita/:id_berita/update' , [authMiddleware, roleMiddleware(['admin'])], adminController.updateBeritaC)
adminRouter.delete('/api/berita/:id_berita/delete' , [authMiddleware, roleMiddleware(['admin'])], adminController.deleteBeritaC)

// Admin Settings Router
adminRouter.post('/api/settings/hero', [authMiddleware, roleMiddleware(['admin']), uploadSetting.single("hero")], settingController.uploadHero);
adminRouter.post('/api/settings/about-image', [authMiddleware, roleMiddleware(['admin']), uploadSetting.single("about")], settingController.uploadAboutImage);
adminRouter.patch('/api/settings/about-text', [authMiddleware, roleMiddleware(['admin'])], settingController.updateAboutText);
adminRouter.post('/api/settings/gallery', [authMiddleware, roleMiddleware(['admin']), uploadSetting.single("galleryItem")], settingController.uploadGallery);
adminRouter.delete('/api/settings/gallery/:id', [authMiddleware, roleMiddleware(['admin'])], settingController.deleteGallery);

// Siswa Router
siswaRouter.post('/api/absen/:id_kegiatan/create', [authMiddleware, roleMiddleware(['user']), upload.single("bukti")], siswaController.createAbsensi);
siswaRouter.get('/api/absen/get/complete', [authMiddleware, roleMiddleware(['user'])] ,siswaController.getUserAbsen)


// Hub Router
hubRouter.post('/api/hub/threads/create', [authMiddleware], hubController.createThreadC);
hubRouter.get('/api/hub/threads', [authMiddleware],hubController.getThreadListC)
hubRouter.get('/api/hub/threads/:id_thread',[authMiddleware], hubController.getThreadC)
hubRouter.post('/api/hub/threads/:id_thread/reply', [authMiddleware], hubController.createReplyThreadC)
hubRouter.post('/api/hub/threads/:id_thread/like', [ authMiddleware ], hubController.createThreadLikeC);
hubRouter.post('/api/hub/threads/:id_thread/reply/:id_reply/like', authMiddleware, hubController.createThreadReplyLikeC)

export{
    userRouter,
    adminRouter,
    siswaRouter,
    hubRouter
}
