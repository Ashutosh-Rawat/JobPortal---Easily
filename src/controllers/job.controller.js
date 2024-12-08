import JobRepository from '../repositories/job.repository.js'

class JobController {
    constructor() {
        this.jobRepo = new JobRepository()
    }

    async listJobs(req, res, next) {
        try {
            const jobs = await this.jobRepo.listJobs()
            res.render('job-listing', { jobs, includeHeader: true })
        } catch (error) {
            next(error)
        }
    }

    async getJobDetails(req, res, next) {
        try {
            const { id: jobId } = req.params
            const job = await this.jobRepo.findJobById(jobId)
            res.render('job-details', { job, includeHeader: true })
        } catch (error) {
            next(error)
        }
    }

    async createJob(req, res, next) {
        try {
            const jobDetails = req.body
            const recruiterId = req.session.currentUser?._id
            const newJob = await this.jobRepo.createJob({ ...jobDetails, recruiter: recruiterId })
            res.redirect(`/jobs/${newJob._id}`)
        } catch (error) {
            next(error)
        }
    }

    async updateJob(req, res, next) {
        try {
            const { id: jobId } = req.params
            const updates = req.body
            const updatedJob = await this.jobRepo.updateJob(jobId, updates)
            res.redirect(`/jobs/${updatedJob._id}`)
        } catch (error) {
            next(error)
        }
    }

    async deleteJob(req, res, next) {
        try {
            const { id: jobId } = req.params
            await this.jobRepo.deleteJob(jobId)
            res.redirect('/jobs')
        } catch (error) {
            next(error)
        }
    }

    async applyToJob(req, res, next) {
        try {
            const { id: jobId } = req.params
            const { applicantId } = res.locals
            await this.jobRepo.addApplicantToJob(jobId, applicantId)
            next()
        } catch (error) {
            next(error)
        }
    }

    async removeApplicant(req, res, next) {
        try {
            const { id: jobId } = req.params
            const { applicantId } = req.body
            await this.jobRepo.removeApplicantFromJob(jobId, applicantId)
            res.redirect(`/jobs/${jobId}/applicants`)
        } catch (error) {
            next(error)
        }
    }
}

export default JobController
