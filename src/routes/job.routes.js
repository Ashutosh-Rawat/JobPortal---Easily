import express,{Router} from 'express'
import JobController from '../controllers/job.controller.js'
import auth from '../middlewares/auth.middleware.js'
import validateJob from '../middlewares/jobFormValidation.middleware.js'
import validateJobApplication from '../middlewares/validateJobApplication.middleware.js'
import deleteFileOnValidationError from '../middlewares/deleteFileValidation.middware.js'
import sendMail from '../middlewares/sendMail.middleware.js'
const jobRouter = Router()
const jobController = new JobController()

jobRouter.get('/', (req,res,next) => {
    jobController.getJobListing(req,res,next)
})
jobRouter.get('/add', auth, 
    (req,res,next) => {
        jobController.getNewJob(req,res,next)
    }
)
// get user's posted jobs
jobRouter.get('/postedJobs', auth,
    (req,res,next) => {
        jobController.getPostedJobListing(req,res,next)
    }
)

// route for updating job 
// (followed by adding jobid to user)
jobRouter.post('/jobs/add', auth,
    validateJob,
    (req,res,next) => {
        jobController.postNewJob(req,res,next)
    }
    // userControllerObj.postUpdateJobPosted
)

// specific job routes
jobRouter.get('/jobs/:id',
    (req,res,next) => {
        jobController.getJobDetails(req,res,next)
    }
)
jobRouter.get('/jobs/:id/update', auth,
    (req,res,next) => {
        jobController.getUpdateJob(req,res,next)
    }
)
jobRouter.post('/jobs/:id/update', auth,
    validateJob,
    (req,res,next) => {
        jobController.postUpdateJob(req,res,next)
    }
)

// route for deleting job 
// (followed by deleting job applications if present)
jobRouter.post('/jobs/:id/delete', auth,
    (res,res,next) => {
        jobController.postDeleteJob(req,res,next)
    }
    // applicantControllerObj.postDeleteApplicants,
    // userControllerObj.postDeleteJobId
)

// display job applicants
jobRouter.get('/jobs/:id/applicants', auth,
    (req,res,next) => {
        jobController.getJobApplicants(req,res,next)
    }
)

// applying job
jobRouter.get('/jobs/:id/apply',
    (req,res,next) => {
        applicantControllerObj.getJobApplication(req,res,next)
    }
)

// route for applying job application 
// (followed by adding applicants to respective jobs)
// (followed by sending mail to the applicant)
jobRouter.post('/jobs/:id/apply',
    uploadFile.single('resumePath'), 
    validateJobApplication,
    deleteFileOnValidationError,
    // applicantControllerObj.postJobApplication,
    (req,res,next) => {
        jobController.postAddApplicants(req,res,next)
    },
    sendMail
)

export default jobRouter