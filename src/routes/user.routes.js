// src/routes/job.router.js
import express, { Router } from 'express'
import JobController from '../controllers/job.controller.js'
import UserController from '../controllers/user.controller.js'
import ApplicantController from '../controllers/applicant.controller.js'
import auth from '../middlewares/auth.middleware.js'
import validateJob from '../middlewares/jobFormValidation.middleware.js'
import validateJobApplication from '../middlewares/validateJobApplication.middleware.js'
import deleteFileOnValidationError from '../middlewares/deleteFileValidation.middware.js'
import sendMail from '../middlewares/sendMail.middleware.js'
import uploadFile from '../middlewares/fileUpload.middleware.js'

const jobRouter = Router()
const jobController = new JobController()
const userController = new UserController()
const applicantController = new ApplicantController()

// Route to display all job listings
jobRouter.get('/',
    (req, res, next) => {
        jobController.getJobListing(req, res, next)
    }
)

// Route to display the form for adding a new job
jobRouter.get('/add', auth,
    (req, res, next) => {
        jobController.getNewJob(req, res, next)
    }
)

// Route to get all jobs posted by the logged-in user
jobRouter.get('/postedJobs', auth,
    (req, res, next) => {
        jobController.getPostedJobListing(req, res, next)
    }
)

// Route to add a new job
// Validates job data and associates the job with the user
jobRouter.post('/jobs/add', auth,
    validateJob,
    (req, res, next) => {
        jobController.postNewJob(req, res, next)
    },
    (req, res, next) => {
        userController.postUpdateJobPosted(req, res, next)
    }
)

// Route to get details of a specific job by ID
jobRouter.get('/jobs/:id',
    (req, res, next) => {
        jobController.getJobDetails(req, res, next)
    }
)

// Route to display the update form for a specific job
jobRouter.get('/jobs/:id/update', auth,
    (req, res, next) => {
        jobController.getUpdateJob(req, res, next)
    }
)

// Route to update a specific job
jobRouter.post('/jobs/:id/update', auth,
    validateJob,
    (req, res, next) => {
        jobController.postUpdateJob(req, res, next)
    }
)

// Route to delete a specific job
// Deletes associated applications and updates the user's job list
jobRouter.post('/jobs/:id/delete', auth,
    (req, res, next) => {
        jobController.postDeleteJob(req, res, next)
    },
    (req, res, next) => {
        applicantController.postDeleteApplicants(req, res, next)
    },
    (req, res, next) => {
        userController.postDeleteJobId(req, res, next)
    }
)

// Route to display applicants for a specific job
jobRouter.get('/jobs/:id/applicants', auth,
    (req, res, next) => {
        jobController.getJobApplicants(req, res, next)
    }
)

// Route to display the application form for a job
jobRouter.get('/jobs/:id/apply',
    (req, res, next) => {
        applicantController.getJobApplication(req, res, next)
    }
)

// Route to submit a job application
// Handles validation, file uploads, and sending notifications
jobRouter.post('/jobs/:id/apply',
    uploadFile.single('resumePath'),
    validateJobApplication,
    deleteFileOnValidationError,
    (req, res, next) => {
        applicantController.postJobApplication(req, res, next)
    },
    (req, res, next) => {
        jobController.postAddApplicants(req, res, next)
    },
    (req, res, next) => {
        sendMail(req, res, next)
    }
)

export default jobRouter
