import express from 'express'
import userController from '../controller/user-controller.js'
import settingController from '../controller/setting-controller.js';
import adminController from '../controller/admin-controller.js';
import { upload_face } from '../application/multer.js';

const publicRouter = express.Router();

// publicRouter.post('/api/users/register' , userController.register);

publicRouter.post('/api/users/register' , userController.register);
publicRouter.post('/api/users/login', userController.login);
publicRouter.get('/api/settings', settingController.getSettings);
publicRouter.post('/api/otp/forget' , userController.sendOTPForgetPassword)
publicRouter.post('/api/otp/forget/verify',  userController.verifyOTPForgetPassword)
publicRouter.post('/api/forget/change' , userController.changePasswordFromForgetPassword)
publicRouter.get('/api/berita/get', adminController.getBerita)
publicRouter.post('/api/users/login/face', upload_face.single("file"),userController.loginFaceC)

export{
    publicRouter
}
