import UserRepository from '../repositories/user.repository.js'
import JobRepository from '../repositories/job.repository.js'
import ApplicantRepository from '../repositories/applicant.repository.js'

export default class UserController {
    constructor() {
        this.userRepo = UserRepository
        this.jobRepo = JobRepository
        this.applicantRepo = ApplicantRepository
    }

    getRegister(req, res, next) {
        try {
            res.status(200).render('register', { includeHeader: true, errors: null })
        } catch (error) {
            next(error)
        }
    }

    async postRegister(req, res, next) {
        const { name, email, pass } = req.body
        try {
            const user = await this.userRepo.addUser({ name, email, pass })
            res.redirect('/login')
        } catch (error) {
            next(error)
        }
    }

    getLogin(req, res, next) {
        try {
            res.status(401).render('login', { includeHeader: true, err: false })
        } catch (error) {
            next(error)
        }
    }

    async postLogin(req, res, next) {
        const { email, pass } = req.body
        try {
            const user = await this.userRepo.getUserByEmail(email)
            if (!user || user.pass !== pass) {
                throw new Error('Incorrect login credentials')
            }
            req.session.userId = user._id
            res.redirect('/')
        } catch (error) {
            next(error)
        }
    }

    getLogout(req, res, next) {
        try {
            req.session.destroy(err => {
                if (err) {
                    return next(err)
                }
                res.redirect('/')
            })
        } catch (error) {
            next(error)
        }
    }

    getChangePassword(req, res, next) {
        try {
            res.locals.currentUser = req.session.currentUser
            res.status(200).render('change-pass', { includeHeader: true, err: false })
        } catch (error) {
            next(error)
        }
    }

    async postChangePassword(req, res, next) {
        const { email, currentPassword, newPassword } = req.body
        try {
            const user = await this.userRepo.getUserByEmail(email)
            if (!user || user.pass !== currentPassword) {
                throw new Error('Incorrect password')
            }
            req.session.currentUser = await this.userRepo.updateUserPassword(email, newPassword)
            res.redirect('/')
        } catch (error) {
            next(error)
        }
    }

    async postDeleteUser(req, res, next) {
        try {
            const jobsPosted = await this.userRepo.deleteUser(req.session.currentUser.userId)
            res.locals.jobsPosted = jobsPosted
            res.locals.proceed = true
            next()
        } catch (error) {
            console.error(error)
            res.locals.err = 'Error occurred while deleting your profile'
            res.redirect('/err')
        }
    }

    async postUpdateJobPosted(req, res) {
        try {
            const newJobId = res.locals.newJobId
            req.session.currentUser = await this.userRepo.addPostedJobId(
                req.session.currentUser.userId, newJobId
            )
            res.redirect('/jobs')
        } catch (error) {
            console.error(error)
            req.session.err = 'Error occurred while uploading job to your profile'
            res.redirect('/err')
        }
    }

    async postDeleteJobId(req, res) {
        try {
            const deleteJob = res.locals.deleteJob
            req.session.currentUser = await this.userRepo.deletePostedJobId(
                req.session.currentUser.userId, deleteJob
            )
            res.redirect('/jobs')
        } catch (error) {
            console.error(error)
            req.session.err = "Error occurred while deleting deleted jobs from user's database"
            res.redirect('/err')
        }
    }
}
