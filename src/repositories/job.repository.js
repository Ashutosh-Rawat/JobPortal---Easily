import { ApplicationError } from "../middlewares/ApplicationError.middleware.js"
import JobModel from "../models/job.model.js"

export default class JobRepository {
    async createJob(jobData) {
        try {
            const job = await JobModel.create(jobData)
            return job
        } catch (err) {
            throw new ApplicationError({ message: 'Error creating job', code: 500 })
        }
    }

    async getJobById(jobId) {
        try {
            const job = await JobModel.findById(jobId).populate('applicants')
            if (!job) throw new ApplicationError({ message: 'Job not found', code: 404 })
            return job
        } catch (err) {
            throw new ApplicationError({ message: 'Error fetching job', code: 500 })
        }
    }

    async updateJob(jobId, jobData) {
        try {
            const updatedJob = await JobModel.findByIdAndUpdate(jobId, jobData, { new: true })
            if (!updatedJob) throw new ApplicationError({ message: 'Job not found', code: 404 })
            return updatedJob
        } catch (err) {
            throw new ApplicationError({ message: 'Error updating job', code: 500 })
        }
    }

    async deleteJob(jobId) {
        try {
            const deletedJob = await JobModel.findByIdAndDelete(jobId)
            if (!deletedJob) throw new ApplicationError({ message: 'Job not found', code: 404 })
            return deletedJob.applicants
        } catch (err) {
            throw new ApplicationError({ message: 'Error deleting job', code: 500 })
        }
    }

    async addApplicantToJob(jobId, applicantId) {
        try {
            const updatedJob = await JobModel.findByIdAndUpdate(
                jobId,
                { $push: { applicants: applicantId } },
                { new: true }
            )
            if (!updatedJob) throw new ApplicationError({ message: 'Job not found', code: 404 })
            return updatedJob
        } catch (err) {
            throw new ApplicationError({ message: 'Error adding applicant', code: 500 })
        }
    }

    async removeApplicantFromJob(jobId, applicantId) {
        try {
            const updatedJob = await JobModel.findByIdAndUpdate(
                jobId,
                { $pull: { applicants: applicantId } },
                { new: true }
            )
            if (!updatedJob) throw new ApplicationError({ message: 'Job not found', code: 404 })
            return updatedJob
        } catch (err) {
            throw new ApplicationError({ message: 'Error removing applicant', code: 500 })
        }
    }

    async getAllJobs() {
        try {
            const jobs = await JobModel.find().populate('applicants')
            return jobs
        } catch (err) {
            throw new ApplicationError({ message: 'Error fetching jobs', code: 500 })
        }
    }
}
