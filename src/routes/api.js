import express from 'express'
import userController from '../controller/user-controller.js'
import { authMiddleware } from '../middleware/auth-middleware.js'

const userRouter = express.Router()

userRouter.delete('/api/users/logout' , [authMiddleware] , userController.logout);
userRouter.get('/api/users/current' , [authMiddleware] , userController.getUser)
userRouter.patch('/api/users/updateprofile' , [authMiddleware] , userController.updateProfile);

export{
    userRouter
}