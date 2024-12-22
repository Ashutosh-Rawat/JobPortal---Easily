import { Router } from 'express'
import JobController from '../controllers/job.controller.js'
import { jwtAuth } from '../auth/jwt.auth.js'
import deleteFileOnValidationError from '../middlewares/deleteFileValidation.middware.js'
import sendMail from '../middlewares/sendMail.middleware.js'

const jobRouter = Router()
const jobController = new JobController()
const applicantController = new ApplicantController()

jobRouter.get('/', 
    (req, res, next) => {
        jobController.listJobs(req, res, next)
    }
)

jobRouter.post('/add', jwtAuth, 
    (req, res, next) => {
        jobController.createJob(req, res, next)
    }
)

jobRouter.get('/postedJobs', jwtAuth,
    (req,res,next) => {
        jobController.getPostedJobs(req,res,next)
    }
)

jobRouter.get('/categories', 
    (req, res, next) => 
        jobController.displayCategories(req, res, next)
)

jobRouter.get('/:id', 
    (req, res, next) => {
        jobController.getJobDetails(req, res, next)
    }
)

jobRouter.post('/:id/update', jwtAuth, 
    (req, res, next) => {
        jobController.updateJob(req, res, next)
    }
)

jobRouter.post('/:id/delete', jwtAuth,
    (req, res, next) => {
        jobController.deleteJob(req, res, next)
    },
    deleteFileOnValidationError
)

jobRouter.post('/:id/apply', jwtAuth, 
    uploadFile,
    (req, res, next) => {
        applicantController.addApplicant(req, res, next)
    },
    (req, res, next) => {
        jobController.addApplicantToJob(req, res, next)
    },
    sendMail,
    deleteFileOnValidationError
)

export default jobRouter
