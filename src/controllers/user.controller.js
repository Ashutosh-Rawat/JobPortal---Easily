import UserRepository from '../repositories/user.repository.js'
import JobRepository from '../repositories/job.repository.js'
import ApplicantRepository from '../repositories/applicant.repository.js'
import { hashPassword, comparePassword, createToken, clearToken } from '../auth/jwt.auth.js'

export default class UserController {
    constructor() {
        this.userRepo = UserRepository
        this.jobRepo = JobRepository
        this.applicantRepo = ApplicantRepository
    }

    async postRegister(req, res, next) {
        const { name, email, pass } = req.body
        try {
            const hashedPassword = await hashPassword(pass)
            const user = await this.userRepo.addUser({ name, email, pass: hashedPassword })
            const token = createToken({ id: user._id, name: user.name, email: user.email })
            res.cookie('token', token, { httpOnly: true })
            console.log(`user registered: ${email}`)
            res.redirect('/')
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    
    async postLogin(req, res, next) {
        const { email, pass } = req.body
        try {
            const user = await this.userRepo.getUserByEmail(email)
            if (!user || !(await comparePassword(pass, user.pass))) {
                throw new Error('Incorrect login credentials')
            }
            // get the user object
            const userObj = { 
                id: user._id, name: user.name, 
                email: user.email, lastVisit: user.lastVisit 
            }
            // Update last visit in the database
            const now = new Date().toISOString()
            await this.userRepo.setLastVisit(user._id, now)
            const token = createToken(userObj)
            res.cookie('token', token, { httpOnly: true })
            req.session.user = userObj
            console.log(`user logged in: ${req.session.user.email}`)
            res.redirect('/')
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    getLogout(req, res, next) {
        try {
            clearToken(res)
            const logged_user = req.session.user.email
            req.session.user = null
            console.log(`user logged out: ${logged_user}`)
            res.redirect('/')
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    getChangePassword(req, res, next) {
        try {
            res.locals.user = req.user
            res.status(200).render('change-pass', { includeHeader: true, err: false })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async postChangePassword(req, res, next) {
        const { currentPassword, newPassword } = req.body
        try {
            const user = await this.userRepo.getUserByEmail(req.user.email)
            if (!user || !(await comparePassword(currentPassword, user.pass))) {
                throw new Error('Incorrect current password')
            }
            const hashedPassword = await hashPassword(newPassword)
            await this.userRepo.updateUserPassword(req.user.email, hashedPassword)
            res.redirect('/')
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async postDeleteUser(req, res, next) {
        try {
            const user = await this.userRepo.deleteUser(req.user.id)
            if (user) {
                // Delete all jobs posted by the user
                await this.jobRepo.deleteMany({ _id: { $in: user.postedJobs } })
                // Delete all applicants associated with those jobs
                await this.applicantRepo.deleteMany({ jobId: { $in: user.postedJobs } })
                console.log(`User and their posted jobs deleted: ${user.email}`)
                res.locals.jobsPosted = user.postedJobs
                res.locals.proceed = true
                next()
            } else {
                throw new Error('User not found')
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async postUpdateJobPosted(req, res) {
        try {
            const newJobId = res.locals.newJobId
            req.user = await this.userRepo.addPostedJobId(req.user.id, newJobId)
            res.redirect('/jobs')
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async postDeleteJobId(req, res) {
        try {
            const deleteJob = res.locals.deleteJob
            req.user = await this.userRepo.deletePostedJobId(req.user.id, deleteJob)
            res.redirect('/jobs')
        } catch (error) {
            next(error)
        }
    }
}
