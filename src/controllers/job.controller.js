import JobRepository from '../repositories/job.repository.js'
import ApplicantRepository from '../repositories/applicant.repository.js'
import UserRepository from '../repositories/user.repository.js'
import CategoryRepository from '../repositories/category.repository.js'
import formatDate from '../../public/js/actions/formatDateActions.js'

export default class JobController {
    constructor() {
        this.userRepo = new UserRepository()
        this.jobRepo = new JobRepository()
        this.applicantRepo = new ApplicantRepository()
        this.categoryRepo = new CategoryRepository()
    }

    async listJobs(req, res, next) {
        try {
            const { search } = req.query
            const jobs = search ? 
                await this.jobRepo.searchJobs(search) : 
                await this.jobRepo.listJobs()
            res.status(200).render('job-listing', { 
                data: jobs, includeHeader: true, 
                user: req.session.user, posted: false,
                formatDate 
            })
        } catch (error) {
            next(error)
        }
    }

    async getPostedJobs(req, res, next) {
        try {
            const jobs = req.session.user ? 
                await this.jobRepo.postedJobs(req.session.user.id) : 
                null
            res.status(200).render('job-listing', { 
                data: jobs, includeHeader: true, 
                user: req.session.user, posted: true,
                formatDate 
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async getJobDetails(req, res, next) {
        try {
            const job = await this.jobRepo.findJobById(req.params.id)
            if (!job) throw new Error('Job not found')
            res.status(200).render('job-details', { 
                job, includeHeader: true,
                user: req.session.user, posted: false,
                formatDate
            })
        } catch (error) {
            next(error)
        }
    }

    async createJob(req, res, next) {
        try {
            const { category, designation, location, companyName, salary, applyBy, skills, openings } = req.body
            const jobDetails = {
                category, designation, location, companyName, salary, applyBy, skills, openings,
                recruiter: req.session.user.id
            }
            const newJob = await this.jobRepo.createJob(jobDetails)
            await this.userRepo.addJobToUser(req.session.user.id, newJob._id)
            res.status(302).redirect(`/jobs/${newJob._id}`)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async updateJob(req, res, next) {
        try {
            const { category, designation, location, companyName, salary, applyBy, skills, openings } = req.body
            const updatedDetails = { category, designation, location, companyName, salary, applyBy, skills, openings }
            const updatedJob = await this.jobRepo.updateJob(req.params.id, updatedDetails)
            if (!updatedJob) throw new Error('Job not found')
            res.status(302).redirect(`/jobs/${updatedJob._id}`)
        } catch (error) {
            next(error)
        }
    }

    async deleteJob(req, res, next) {
        try {
            const deletedJob = await this.jobRepo.deleteJob(req.params.id)
            await this.userRepo.removeJobFromUser(req.session.user.id, deletedJob._id)
            res.status(302).redirect('/jobs')
        } catch (error) {
            next(error)
        }
    }

    async addApplicantToJob(req, res, next) {
        try {
            const { jobId } = req.params
            const applicantId = req.applicantId
            await this.jobRepo.addApplicantToJob(jobId, applicantId)
            res.status(302).redirect(`/jobs/${jobId}`)
        } catch (err) {
            next(err)
        }
    }

    async removeApplicantFromJob(req, res, next) {
        try {
            const { jobId, applicantId } = req.params
            await this.jobRepo.removeApplicantFromJob(jobId, applicantId)
            res.status(302).redirect(`/jobs/${jobId}`)
        } catch (err) {
            next(err)
        }
    }

    async displayCategories(req, res, next) {
        try {
            const categories = await this.categoryRepo.categoryList()
            res.status(200).render('category-listing', {
                data: categories, includeHeader: true
            })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
}
