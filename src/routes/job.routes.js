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
jobRouter.get('/add', auth, jobController.getNewJob)
// get user's posted jobs
jobRouter.get('/postedJobs', auth,
    jobController.getPostedJobListing
)

// route for updating job 
// (followed by adding jobid to user)
jobRouter.post('/jobs/add', auth,
    validateJob,
    jobController.postNewJob,
    userControllerObj.postUpdateJobPosted
)

// specific job routes
jobRouter.get('/jobs/:id',
    jobController.getJobDetails
)
jobRouter.get('/jobs/:id/update', auth,
    jobController.getUpdateJob
)
jobRouter.post('/jobs/:id/update', auth,
    validateJob,
    jobController.postUpdateJob
)

// route for deleting job 
// (followed by deleting job applications if present)
jobRouter.post('/jobs/:id/delete', auth,
    jobController.postDeleteJob,
    applicantControllerObj.postDeleteApplicants,
    userControllerObj.postDeleteJobId
)

// display job applicants
jobRouter.get('/jobs/:id/applicants', auth,
    jobController.getJobApplicants
)

// applying job
jobRouter.get('/jobs/:id/apply',
    applicantControllerObj.getJobApplication
)

// route for applying job application 
// (followed by adding applicants to respective jobs)
// (followed by sending mail to the applicant)
jobRouter.post('/jobs/:id/apply',
    uploadFile.single('resumePath'), 
    validateJobApplication,
    deleteFileOnValidationError,
    applicantControllerObj.postJobApplication,
    jobController.postAddApplicants,
    sendMail
)

export default jobRouter