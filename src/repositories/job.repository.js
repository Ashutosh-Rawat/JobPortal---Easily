import JobModel from '../models/job.model.js'
import { handleDbError } from '../utils/dbErrorHandler.js'

class JobRepository {
    async listJobs() {
        try {
            return await JobModel.find()
        } catch (error) {
            console.error('Error listing jobs:', error)
            handleDbError(error)
        }
    }

    async findJobById(jobId) {
        try {
            return await JobModel.findById(jobId).populate('applicants')
        } catch (error) {
            console.error(`Error finding job with ID ${jobId}:`, error)
            handleDbError(error)
        }
    }

    async createJob(jobDetails) {
        try {
            const job = new JobModel(jobDetails)
            await job.save()
            console.log('Job created:', job)
            return job
        } catch (error) {
            console.error('Error creating job:', error)
            handleDbError(error)
        }
    }

    async updateJob(jobId, updates) {
        try {
            const updatedJob = await JobModel.findByIdAndUpdate(jobId, updates, { new: true })
            console.log(`Job updated: ${jobId}`)
            return updatedJob
        } catch (error) {
            console.error(`Error updating job with ID ${jobId}:`, error)
            handleDbError(error)
        }
    }

    async deleteJob(jobId) {
        try {
            const deletedJob = await JobModel.findByIdAndDelete(jobId)
            console.log(`Job deleted: ${jobId}`)
            return deletedJob
        } catch (error) {
            console.error(`Error deleting job with ID ${jobId}:`, error)
            handleDbError(error)
        }
    }

    async addApplicantToJob(jobId, applicantId) {
        try {
            const job = await JobModel.findByIdAndUpdate(
                jobId,
                { $push: { applicants: applicantId } },
                { new: true }
            )
            console.log(`Applicant added to job: ${applicantId} -> ${jobId}`)
            return job
        } catch (error) {
            console.error(`Error adding applicant ${applicantId} to job ${jobId}:`, error)
            handleDbError(error)
        }
    }

    async removeApplicantFromJob(jobId, applicantId) {
        try {
            const job = await JobModel.findByIdAndUpdate(
                jobId,
                { $pull: { applicants: applicantId } },
                { new: true }
            )
            console.log(`Applicant removed from job: ${applicantId} -> ${jobId}`)
            return job
        } catch (error) {
            console.error(`Error removing applicant ${applicantId} from job ${jobId}:`, error)
            handleDbError(error)
        }
    }
}

export default JobRepository
