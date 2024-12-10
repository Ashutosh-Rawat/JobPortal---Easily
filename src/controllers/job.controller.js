import JobRepository from '../repositories/job.repository.js'
import ApplicantRepository from '../repositories/applicant.repository.js'
import UserRepository from '../repositories/user.repository.js'

export default class JobController {
    constructor() {
        this.UserRepo = UserRepository
        this.jobRepo = JobRepository
        this.applicantRepo = ApplicantRepository
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
                data: jobs, includeHeader: true, currentUser: req.session.currentUser
            })
        } catch (error) {
            next(error)
        }
    }

    async getJobDetails(req, res, next) {
        try {
            const job = await this.jobRepo.findJobById(req.params.id)
            if (!job) throw new Error('Job not found')

            res.status(200).render('job-details', { 
                job, includeHeader: true
            })
        } catch (error) {
            next(error)
        }
    }

    async createJob(req, res, next) {
        try {
            const jobDetails = { ...req.body, postedBy: req.user.id }
            const newJob = await this.jobRepo.createJob(jobDetails)
            res.redirect(`/job/${newJob._id}`)
        } catch (error) {
            next(error)
        }
    }

    async updateJob(req, res, next) {
        try {
            const updatedJob = await this.jobRepo.updateJob(req.params.id, req.body)
            if (!updatedJob) throw new Error('Job not found')

            res.redirect(`/job/${updatedJob._id}`)
        } catch (error) {
            next(error)
        }
    }

    async deleteJob(req, res, next) {
        try {
            await this.jobRepo.deleteJob(req.params.id)
            res.redirect('/jobs')
        } catch (error) {
            next(error)
        }
    }

    applyToJob(req,res,next) {
        try {
            //  first import the req.body 
            //  get the filelocation from req.filepath or sth
            //  call the applicant repo for adding applicant using form
            //  get the applicant id and use add applicanttojob 
        } catch(error) {
            next(error)
        }
    }
}
