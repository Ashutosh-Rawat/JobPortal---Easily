// src/routes/user.router.js
import express, { Router } from 'express'
import UserController from '../controllers/user.controller.js'
import ApplicantController from '../controllers/applicant.controller.js'
import JobController from '../controllers/job.controller.js'
import validateRegistration from '../middlewares/registration.middleware.js'
import auth from '../middlewares/auth.middleware.js'
import setLastVisit from '../middlewares/lastVisit.middleware.js'
import validatePasswordChange from '../middlewares/changePassValidation.middleware.js'

const userRouter = Router()
const userController = new UserController()
const applicantController = new ApplicantController()
const jobController = new JobController()

// Route to get the registration form
userRouter.get('/register', 
    // Retrieve registration form
  (req, res, next) => {
    userController.getRegister(req, res, next) 
})

// Route to post the registration data
userRouter.post('/register', 
  validateRegistration, 
    // Handle user registration
  (req, res, next) => {
    userController.postRegister(req, res, next) 
  }
)

// Route to delete a user
// First, delete the user account
// Then, delete all jobs posted by that user
// Finally, delete all job applications to those jobs
userRouter.post('/deleteUser', auth,
    // Delete user account
  (req, res, next) => {
    userController.postDeleteUser(req, res, next)
  },
    // Delete all job posted by user
  (req, res, next) => {
    jobController.postDeleteMultipleJobs(req, res, next) 
  },
    // Delete all job applications by user
  (req, res, next) => {
    applicantController.postDeleteApplicants(req, res, next)
  },
    // Logout user
  (req, res, next) => {
    userController.getLogout(req, res, next)
  }
)

// Route to get the login form
userRouter.get('/login', 
  (req, res, next) => {
    userController.getLogin(req, res, next)
  }
)

// Route to post the login data
userRouter.post('/login', 
  (req, res, next) => {
    setLastVisit(req, res, next)
  },
     
    // Handler user login
  (req, res, next) => {
    userController.postLogin(req, res, next)
  }
)

// Route to logout the user
userRouter.get('/logout', auth, 
    (req, res, next) => {
        userController.getLogout(req, res, next)
    }
)

// Route to get the change password form
userRouter.get('/change-pass', auth, 
    (req, res, next) => {
        userController.getChangePassword(req, res, next)
    }
)

// Route to post the new password
userRouter.post('/change-pass', auth, 
    validatePasswordChange, 
    (req, res, next) => {
        userController.postChangePassword(req, res, next)
    }
)

export default userRouter
