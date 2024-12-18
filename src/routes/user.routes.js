import { Router } from 'express'
import UserController from '../controllers/user.controller.js'
import { jwtAuth } from '../auth/jwt.auth.js'
import setLastVisit from '../middlewares/lastVisit.middleware.js'

const userRouter = Router()
const userController = new UserController()

// Route to post the registration data
userRouter.post('/register', 
    (req, res, next) => {
        userController.postRegister(req, res, next) 
    }
)

// Route to delete a user and handle jobs and applicants
userRouter.get('/deleteUser', jwtAuth,
    (req, res, next) => {
        userController.getDeleteUser(req, res, next)
    }
)

// Route to post the login data
userRouter.post('/login', setLastVisit,
    (req, res, next) => {
        userController.postLogin(req, res, next)
    }
)

// Route to get logout
userRouter.get('/logout', jwtAuth,
    (req, res, next) => {
        userController.getLogout(req, res, next)
    }
)

// Route to post the change password data
userRouter.post('/change-password', jwtAuth,
    (req, res, next) => {
        userController.postChangePassword(req, res, next)
    }
)

export default userRouter
