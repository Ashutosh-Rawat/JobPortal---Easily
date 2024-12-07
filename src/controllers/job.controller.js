import JobRepository from "../repositories/job.repository.js"
import CategoryModel from "../models/category.model.js"

const categories = await CategoryModel.find()

export default class JobController {
    async getJobListing(req, res, next) {
        try {
            const jobs = await JobRepository.getAllJobs()
            res.status(200).render('job-listing', {
                includeHeader: true,
                data: jobs,
                category: categories,
                currentUser: req.session.currentUser
            })
        } catch (err) {
            console.log(err)
            req.session.err = 'error fetching jobs'
            res.redirect(302, '/err')
        }
    }

    async getPostedJobListing(req, res, next) {
        try {
            if(req.session.currentUser) {
                if(req.session.currentUser.jobsPosted) {
                    const jobList = []
                    for (const jobid of req.session.currentUser.jobsPosted) {
                        const job = await JobRepository.getJobById(jobid)
                        jobList.push(job)
                    }
                    res.status(200).render('job-listing', {
                        includeHeader: true,
                        data: jobList || [],
                        category: categories,
                        currentUser: req.session.currentUser
                    })
                } else {
                    req.session.err = 'no jobs posted by user'
                    res.redirect(302, '/err')
                }
            } else {
                req.session.err = 'user not present'
                res.redirect(302, '/err')
            }
        } catch (err) {
            console.log(err)
            req.session.err = 'error fetching posted jobs'
            res.redirect(302, '/err')
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
            const jobid = await JobRepository.createJob(jobData)
            req.session.currentUser.jobsPosted.push(jobid)
            res.locals.newJobId = jobid
            next()
        } catch (err) {
            console.log(err)
            req.session.err = 'error occurred while submitting the job'
            res.redirect(302, '/err')
        }
    }

    async getUpdateJob(req, res) {
        try {
            const job = await JobRepository.getJobById(req.params.id)
            res.render('update-job', {
                includeHeader: true,
                data: job,
                currentUser: req.session.currentUser,
                jobs: categories
            })
        } catch (err) {
            console.log(err)
            req.session.err = 'error occurred while fetching job details for update'
            res.redirect(302, '/err')
        }
    }

    async postUpdateJob(req, res) {
        try {
            const jobData = { ...req.body }
            await JobRepository.updateJob(req.params.id, jobData)
            res.redirect(302, '/jobs')
        } catch (err) {
            console.log(err)
            req.session.err = 'error occurred while updating job'
            res.redirect(302, '/err')
        }
    }

    async postDeleteJob(req, res, next) {
        try {
            const applicants = await JobRepository.deleteJob(req.params.id)
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
            req.session.err = 'error occurred while deleting job'
            res.redirect(302, '/err')
        }
    }

    async postDeleteMultipleJobs(req, res, next) {
        try {
            const jobsPosted = res.locals.jobsPosted
            if (jobsPosted && jobsPosted.length) {
                const applicantList = []
                for (const jobid of jobsPosted) {
                    const applicants = await JobRepository.deleteJob(jobid)
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
            const job = await JobRepository.getJobById(req.params.id)
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
            const job = await JobRepository.getJobById(req.params.id)
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
            await JobRepository.addApplicantToJob(currentJobId, application._id)
            const { companyName, jobDesign } = await JobRepository.getJobById(currentJobId)
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
