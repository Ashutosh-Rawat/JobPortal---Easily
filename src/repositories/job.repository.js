import JobModel from '../models/job.model.js'
import { Types } from 'mongoose'

export default class JobRepository {
    async listJobs() {
        try {
            return await JobModel.find()
        } catch (error) {
            console.error('Error listing jobs:', error)
        }
    }

    async postedJobs(userId) {
        try {
            return await JobModel.find({ recruiter: new Types.ObjectId(userId) })
        } catch (error) {
            console.log('Error finding posted jobs:', error)
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
            const jobObj = await JobModel.findById(jobId).populate('applicants')
            const job = jobObj.toObject()
            job._id = job._id.toString()
            job.recruiter = job.recruiter.toString()
            return job
        } catch (error) {
            console.error(`Error finding job with ID ${jobId}:`, error)
        }
    }

    async createJob(jobDetails) {
        try {
            jobDetails.recruiter = new Types.ObjectId(jobDetails.recruiter)
            const job = new JobModel(jobDetails)
            const newJob = await job.save()
            console.log('Job created:', JSON.stringify(job))
            return newJob
        } catch (error) {
            console.error('Error creating job:', error)
        }
    }

    async updateJob(jobId, updates) {
        try {
            console.log(jobId)
            console.log(updates)
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
            return deletedJob
        } catch (error) {
            console.error(`Error deleting job with ID ${jobId}:`, error)
        }
    }

    async addApplicantToJob(jobId, applicantId) {
        try {
            const job = await JobModel.findByIdAndUpdate(
                jobId,
                { $push: { applicants: new Types.ObjectId(applicantId) } },
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
                { $pull: { applicants: new Types.ObjectId(applicantId) } },
                { new: true }
            )
            console.log(`Applicant removed from job: ${applicantId} -> ${jobId}`)
            return job
        } catch (error) {
            console.error(`Error removing applicant ${applicantId} from job ${jobId}:`, error)
        }
    }
}