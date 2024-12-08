import { Router } from 'express'
import UserController from '../controllers/user.controller.js'
import validateRegistration from '../middlewares/registration.middleware.js'
import { jwtAuth } from '../auth/jwt.auth.js'
import setLastVisit from '../middlewares/lastVisit.middleware.js'
import validatePasswordChange from '../middlewares/changePassValidation.middleware.js'

const userRouter = Router()
const userController = new UserController()

// Route to get the registration form
userRouter.get('/register', 
    (req, res, next) => {
        userController.getRegister(req, res, next) 
})

// Route to post the registration data
userRouter.post('/register', 
    validateRegistration, 
    (req, res, next) => {
        userController.postRegister(req, res, next) 
    }
)

// Route to delete a user and handle jobs and applicants
userRouter.post('/deleteUser', jwtAuth,
    (req, res, next) => {
        userController.postDeleteUser(req, res, next)
    }
)

// Route to get the login form
userRouter.get('/login', 
    (req, res, next) => {
        userController.getLogin(req, res, next)
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

// Route to get the change password form
userRouter.get('/change-password', jwtAuth,
    (req, res, next) => {
        userController.getChangePassword(req, res, next)
    }
)

// Route to post the change password data
userRouter.post('/change-password', jwtAuth,
    validatePasswordChange,
    (req, res, next) => {
        userController.postChangePassword(req, res, next)
    }
)

export default userRouter
