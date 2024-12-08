import { Router } from 'express'
import JobController from '../controllers/job.controller.js'
import auth from '../middlewares/auth.middleware.js'
import validateJob from '../middlewares/jobFormValidation.middleware.js'
import validateJobApplication from '../middlewares/validateJobApplication.middleware.js'
import deleteFileOnValidationError from '../middlewares/deleteFileValidation.middware.js'
import sendMail from '../middlewares/sendMail.middleware.js'

const jobRouter = Router()
const jobController = new JobController()

// Path to list all jobs
jobRouter.get('/', 
    (req, res, next) => {
        jobController.listJobs(req, res, next)
    }
)

// Path to display form for adding a job
jobRouter.get('/add', auth,
    (req, res, next) => {
        res.render('add-job', { includeHeader: true })
    }
)

// Path to post a new job
jobRouter.post('/add', auth, 
    validateJob,
    (req, res, next) => {
        jobController.createJob(req, res, next)
    }
)

// Path to view job details
jobRouter.get('/:id', 
    (req, res, next) => {
        jobController.getJobDetails(req, res, next)
    }
)

// Path to update a job
jobRouter.post('/:id/update', auth, validateJob,
    (req, res, next) => {
        jobController.updateJob(req, res, next)
    }
)

// Path to delete a job
jobRouter.post('/:id/delete', auth,
    (req, res, next) => {
        jobController.deleteJob(req, res, next)
    }
)

// Path to apply for a job
jobRouter.post('/:id/apply', auth,
    validateJobApplication,
    deleteFileOnValidationError,
    (req, res, next) => {
        jobController.applyToJob(req, res, next)
    },
    sendMail
)

export default jobRouter
