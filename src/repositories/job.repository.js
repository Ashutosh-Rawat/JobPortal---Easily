import JobModel from '../models/job.model.js'
import { Types } from 'mongoose'

class JobRepository {
    async listJobs() {
        try {
            return await JobModel.find()
        } catch (error) {
            console.error('Error listing jobs:', error)
        }
    }

    async searchJobs(query) {
        try {
            const regex = new RegExp(query, 'i')
            return await JobModel.find({ designation: regex })
        } catch (error) {
            console.error(`Error searching jobs by designation "${query}":`, error)
        }
    }

    async findJobById(jobId) {
        try {
            return await JobModel.findById(jobId).populate('applicants')
        } catch (error) {
            console.error(`Error finding job with ID ${jobId}:`, error)
        }
    }

    async createJob(jobDetails) {
        try {
            const job = new JobModel(jobDetails)
            await job.save()
            console.log('Job created:', job)

            // Add job ID to the user's list of posted jobs
            await UserRepository.addJobToUser(job.postedBy, job._id)

            return job
        } catch (error) {
            console.error('Error creating job:', error)
        }
    }

    async updateJob(jobId, updates) {
        try {
            const updatedJob = await JobModel.findByIdAndUpdate(jobId, updates, { new: true })
            console.log(`Job updated: ${jobId}`)
            return updatedJob
        } catch (error) {
            console.error(`Error updating job with ID ${jobId}:`, error)
        }
    }

    async deleteJob(jobId) {
        try {
            const deletedJob = await JobModel.findByIdAndDelete(jobId)
            console.log(`Job deleted: ${jobId}`)

            if (deletedJob) {
                // Remove job ID from user's postedJobs list
                await UserRepository.removeJobFromUser(deletedJob.postedBy, jobId)
            }

            return deletedJob
        } catch (error) {
            console.error(`Error deleting job with ID ${jobId}:`, error)
        }
    }

    async addApplicantToJob(jobId, applicantId) {
        try {
            const job = await JobModel.findByIdAndUpdate(
                jobId,
                { $push: { applicants: Types.ObjectId(applicantId) } },
                { new: true }
            )
            console.log(`Applicant added to job: ${applicantId} -> ${jobId}`)
            return job
        } catch (error) {
            console.error(`Error adding applicant ${applicantId} to job ${jobId}:`, error)
        }
    }

    async removeApplicantFromJob(jobId, applicantId) {
        try {
            const job = await JobModel.findByIdAndUpdate(
                jobId,
                { $pull: { applicants: Types.ObjectId(applicantId) } },
                { new: true }
            )
            console.log(`Applicant removed from job: ${applicantId} -> ${jobId}`)
            return job
        } catch (error) {
            console.error(`Error removing applicant ${applicantId} from job ${jobId}:`, error)
        }
    }
}

export default new JobRepository()
