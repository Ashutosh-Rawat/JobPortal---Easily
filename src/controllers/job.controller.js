import jobRepository from "../repositories/job.repository.js"
import CategoryModel from "../models/category.model.js"
import { ApplicationError } from "../middlewares/ApplicationError.middleware.js"
import userRepository from "../models/user.repository.js"

const categories = await CategoryModel.find()

export default class JobController {
    async getJobListing(req, res, next) {
        try {
            const jobList = await jobRepository.getAllJobs()
            res.status(200).render('job-listing', {
                includeHeader: true,
                data: jobList,
                category: categories,
                currentUser: req.session.currentUser
            })
        } catch (err) {
            console.log(err)
            if(err instanceof ApplicationError) next(err)
            else throw new ApplicationError(500, 'Error occured while listing jobs')
        }
    }

    async getPostedJob(req, res, next) {
        try {
            const userId = req.session.userId
            const jobList = await userRepository.jobPosted(userId)
            res.status(200).render('job-listing', {
                includeHeader: true,
                data: jobList || [],
                category: categories,
                currentUser: req.session.currentUser
            })
        } catch (err) {
            console.log(err)
            if(err instanceof ApplicationError) next(err)
            else throw new ApplicationError(500, 'Error fetching jobs posted by user')
        }
    }

    getNewJob(req, res) {
        res.render('add-job', {
            includeHeader: true,
            currentUser: req.session.currentUser,
            jobs: categories,
        })
    }

    async postNewJob(req, res, next) {
        try {
            const jobData = { ...req.body }
            const jobid = await jobRepository.createJob(jobData)
            req.session.currentUser.jobsPosted.push(jobid)
            res.locals.newJobId = jobid
            next()
        } catch (err) {
            console.log(err)
            if(err instanceof ApplicationError) next(err)
            else throw new ApplicationError(500, 'Error occured on posting job')
        }
    }

    async getUpdateJob(req, res) {
        try {
            const job = await jobRepository.getJobById(req.params.id)
            res.render('update-job', {
                includeHeader: true,
                data: job,
                currentUser: req.session.currentUser,
                jobs: categories
            })
        } catch (err) {
            console.log(err)
            if(err instanceof ApplicationError) next(err)
            else throw new ApplicationError(500, 'Error getting job details')
        }
    }

    async postUpdateJob(req, res) {
        try {
            const jobData = { ...req.body }
            await jobRepository.updateJob(req.params.id, jobData)
            res.redirect(302, '/jobs')
        } catch (err) {
            console.log(err)
            if(err instanceof ApplicationError) next(err)
            else throw new ApplicationError(500, 'Error occured while updating job')
        }
    }

    async postDeleteJob(req, res, next) {
        try {
            const applicants = await jobRepository.deleteJob(req.params.id)
            if (applicants && applicants.length) {
                res.locals.proceed = true
                res.locals.deleteJob = req.params.id
                res.locals.applicantList = applicants
                next()
            } else {
                res.redirect(302, '/jobs')
            }
        } catch (err) {
            console.log(err)
            if(err instanceof ApplicationError) next(err)
                else throw new ApplicationError(500, 'Error occured while deleting job')
        }
    }

    async postDeleteMultipleJobs(req, res, next) {
        try {
            const jobsPosted = res.locals.jobsPosted
            if (jobsPosted && jobsPosted.length) {
                const applicantList = []
                for (const jobid of jobsPosted) {
                    const applicants = await jobRepository.deleteJob(jobid)
                    if (applicants && applicants.length) {
                        applicantList.push(...applicants)
                    }
                }
                res.locals.applicantList = applicantList
                next()
            } else {
                res.redirect(302, '/jobs')
            }
        } catch (err) {
            console.error(err)
            req.session.err = 'error occurred while deleting jobs'
            res.redirect(302, '/err')
        }
    }

    async getJobDetails(req, res) {
        try {
            const job = await jobRepository.getJobById(req.params.id)
            const eligibleRecruiter = req.session.currentUser &&
                                      req.session.currentUser.jobsPosted.includes(Number(req.params.id))
            res.render('job-details', {
                includeHeader: true,
                data: job,
                currentUser: req.session.currentUser,
                eligibleRecruiter
            })
        } catch (err) {
            console.log(err)
            req.session.err = 'error occurred while fetching job details'
            res.redirect(302, '/err')
        }
    }

    async getJobApplicants(req, res) {
        try {
            const job = await jobRepository.getJobById(req.params.id)
            res.render('applicant-list', {
                includeHeader: true,
                data: job,
                currentUser: req.session.currentUser
            })
        } catch (err) {
            console.log(err)
            req.session.err = 'error occurred while fetching job applicants'
            res.redirect(302, '/err')
        }
    }

    async postAddApplicants(req, res, next) {
        try {
            const application = res.locals.application
            const currentJobId = res.locals.currentJobId
            await jobRepository.addApplicantToJob(currentJobId, application._id)
            const { companyName, jobDesign } = await jobRepository.getJobById(currentJobId)
            res.locals.mailInfo = {
                applicantName: application.name,
                applicantEmail: application.email,
                companyName,
                jobDesign
            }
            next()
        } catch (err) {
            console.log(err)
            req.session.err = 'error occurred while uploading application on job portal'
            res.redirect(302, '/err')
        }
    }
}
