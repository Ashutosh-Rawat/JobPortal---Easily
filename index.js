import express, { urlencoded } from 'express'
import path from 'path'
import ejsLayouts from 'express-ejs-layouts'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
// validation middlewares
import auth from './src/middlewares/auth.middleware.js'
import validateRegistration from './src/middlewares/registration.middleware.js'
import validatePasswordChange from './src/middlewares/changePassValidation.middleware.js'
import validateJob from './src/middlewares/jobFormValidation.middleware.js'
import validateJobApplication from './src/middlewares/validateJobApplication.middleware.js'
import deleteFileOnValidationError from './src/middlewares/deleteFileValidation.middware.js'
// functional middelwares
import setLastVisit from './src/middlewares/lastVisit.middleware.js'
import uploadFile from './src/middlewares/fileupload.middleware.js'
import sendMail from './src/middlewares/sendMail.middleware.js'
import getHome from './src/controllers/home.controller.js'
import getError from './src/controllers/error.controller.js'
import userController from './src/controllers/user.controller.js'
import jobController from './src/controllers/job.controller.js'
import applicantController from './src/controllers/applicant.controller.js'

// declaration of express functions
const app = express()
const userControllerObj = new userController()
const jobControllerObj = new jobController()
const applicantControllerObj = new applicantController()
// setting session
app.use(cookieParser())
app.use(urlencoded({extended:true}))
// for parsing json from req.body()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'secret-key-ABCD',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

// public accesses
app.use(express.static(path.join('src','views')))
app.use(express.static(path.join('public')))
// middlewares
app.set('view engine', 'ejs')
app.set('views',path.resolve('src','views'))
app.use(ejsLayouts)

// --------------------------------------------------------------- //
// access routes
app.get('/', getHome)
app.get('/err', getError)

// user register
app.get('/register', userControllerObj.getRegister)
app.post('/register', 
    validateRegistration, 
    userControllerObj.postRegister
)

// route for deleting user
// (followed by deleting all jobs to that user)
// (followed by deleting all the job applications to those jobs)
app.post('/deleteUser', auth,
    userControllerObj.postDeleteUser,
    jobControllerObj.postDeleteMultipleJobs,
    applicantControllerObj.postDeleteApplicants,
    userControllerObj.getLogout
)

// user login/logout
app.get('/login', userControllerObj.getLogin)
app.post('/login', setLastVisit, userControllerObj.postLogin)
app.get('/logout', auth, userControllerObj.getLogout)

// more user pages
app.get('/change-pass', auth, 
    userControllerObj.getChangePassword
)
app.post('/change-pass', auth,
    validatePasswordChange,
    userControllerObj.postChangePassword
)
// job pages
app.get('/jobs', jobControllerObj.getJobListing)
app.get('/jobs/add', auth, jobControllerObj.getNewJob)
// get user's posted jobs
app.get('/postedJobs', auth,
    jobControllerObj.getPostedJobListing
)

// route for updating job 
// (followed by adding jobid to user)
app.post('/jobs/add', auth,
    validateJob,
    jobControllerObj.postNewJob,
    userControllerObj.postUpdateJobPosted
)

// specific job routes
app.get('/jobs/:id',
    jobControllerObj.getJobDetails
)
app.get('/jobs/:id/update', auth,
    jobControllerObj.getUpdateJob
)
app.post('/jobs/:id/update', auth,
    validateJob,
    jobControllerObj.postUpdateJob
)

// route for deleting job 
// (followed by deleting job applications if present)
app.post('/jobs/:id/delete', auth,
    jobControllerObj.postDeleteJob,
    applicantControllerObj.postDeleteApplicants,
    userControllerObj.postDeleteJobId
)

// display job applicants
app.get('/jobs/:id/applicants', auth,
    jobControllerObj.getJobApplicants
)

// applying job
app.get('/jobs/:id/apply',
    applicantControllerObj.getJobApplication
)

// route for applying job application 
// (followed by adding applicants to respective jobs)
// (followed by sending mail to the applicant)
app.post('/jobs/:id/apply',
    uploadFile.single('resumePath'), 
    validateJobApplication,
    deleteFileOnValidationError,
    applicantControllerObj.postJobApplication,
    jobControllerObj.postAddApplicants,
    sendMail
)


export default app