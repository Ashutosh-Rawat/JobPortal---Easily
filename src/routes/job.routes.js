import { Router } from 'express'
import JobController from '../controllers/job.controller.js'
import { jwtAuth } from '../auth/jwt.auth.js'
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

// Path to post a new job
jobRouter.post('/add', jwtAuth, 
    // validateJob,
    (req, res, next) => {
        jobController.createJob(req, res, next)
    }
)

jobRouter.get('/categories', 
    (req, res, next) => 
        jobController.getJobCategories(req, res, next)
)

// Path to view job details
jobRouter.get('/:id', 
    (req, res, next) => {
        jobController.getJobDetails(req, res, next)
    }
)

// Path to update a job
jobRouter.post('/:id/update', jwtAuth, 
    // validateJob,
    (req, res, next) => {
        jobController.updateJob(req, res, next)
    }
)

// Path to delete a job
jobRouter.post('/:id/delete', jwtAuth,
    (req, res, next) => {
        jobController.deleteJob(req, res, next)
    }
)

// Path to apply for a job
jobRouter.post('/:id/apply', jwtAuth,
    deleteFileOnValidationError,
    (req, res, next) => {
        jobController.applyToJob(req, res, next)
    },
    sendMail
)

export default jobRouter
