import JobRepository from '../repositories/job.repository.js'
import ApplicantRepository from '../repositories/applicant.repository.js'
import UserRepository from '../repositories/user.repository.js'
import CategoryRepository from '../repositories/category.repository.js'

export default class JobController {
    constructor() {
        this.userRepo = UserRepository
        this.jobRepo = JobRepository
        this.applicantRepo = ApplicantRepository
        this.categoryRepo = CategoryRepository
    }

    async listJobs(req, res, next) {
        try {
            const { search } = req.query
            let jobs

            if (search) {
                jobs = await this.jobRepo.searchJobs(search)
            } else {
                jobs = await this.jobRepo.listJobs()
            }

            res.status(200).render('job-listing', { 
                data: jobs, includeHeader: true, 
                user: req.session.user, posted: false
            })
        } catch (error) {
            next(error)
        }
    }

    async getPostedJobs(req,res,next) {
        try {
            const jobs = req.session.user ? 
                await this.jobRepo.postedJobs(req.session.user.id) : null
            res.status(200).render('job-listing', { 
                data: jobs, includeHeader: true, 
                user: req.session.user, posted: true
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async getJobDetails(req, res, next) {
        try {
            if(req.params.id) {
                const job = await this.jobRepo.findJobById(req.params.id)
                if (!job) throw new Error('Job not found')
    
                res.status(200).render('job-details', { 
                    job, includeHeader: true
                })
            }
        } catch (error) {
            next(error)
        }
    }

    async createJob(req, res, next) {
        try {
            const jobDetails = { ...req.body, postedBy: req.session.user.id }
            const newJob = await this.jobRepo.createJob(jobDetails)
            await this.userRepo.addJobToUser(req.session.user.id, newJob._id)
            res.status(302).redirect(`/job/${newJob._id}`)
        } catch (error) {
            next(error)
        }
    }

    async updateJob(req, res, next) {
        try {
            const updatedJob = await this.jobRepo.updateJob(req.params.id, req.body)
            if (!updatedJob) throw new Error('Job not found')

            res.status(302).redirect(`/job/${updatedJob._id}`)
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

    async applyToJob(req, res, next) {
        try {
            // Example: Validate the request
            if (!req.body.name || !req.body.email || !req.body.resumePath) {
                req.emit('validationFailed') // Trigger file deletion
                throw new Error('Validation failed: Missing required fields')
            }
    
            // Proceed with applicant creation and job linking
            const applicantData = { ...req.body }
            const newApplicant = await this.applicantRepo.createApplicant(applicantData)
            if (!newApplicant) throw new Error('Failed to create applicant')
    
            const updatedJob = await this.jobRepo.addApplicantToJob(req.params.id, newApplicant._id)
            if (!updatedJob) throw new Error('Failed to link applicant to the job')
    
            res.status(302).redirect('/jobs')
        } catch (error) {
            next(error)
        }
    }

    async getJobCategories(req, res, next) {
        try {
            const categories = await this.categoryRepo.categoryList()
            res.json(categories)
        } catch (error) {
            next(error)
        }
    }

    async getJobNames(req, res, next) {
        try {
            const jobNames = await this.categoryRepo.jobsByCategory(req.params.id)
            res.json(jobNames)
        } catch (error) {
            next(error)
        }
    }

    async getSkills(req, res, next) {
        try {
            const skills = await this.categoryRepo.skillsByCategory(req.params.id)
            res.json(skills)
        } catch (error) {
            next(error)
        }
    }
}
