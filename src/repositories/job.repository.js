import {ObjectId} from 'mongodb'
import { ApplicationError } from "../middlewares/ApplicationError.middleware.js"
import JobModel from "../models/job.model.js"
import applicantModel from "../models/applicant.model.js"

class JobRepository {
    async createJob(jobData) {
        try {
            const job = await JobModel.create(jobData)
            console.log(`job listed for: ${job.desgination}`)
            return job
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getJobById(jobId) {
        try {
            return await JobModel.findById(jobId).populate('applicants')
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async jobPosted(userId) {
        try {
            const postedJobs = await JobModel.find({recruiter: ObjectId(userId)})
            if(!postedJobs) throw new ApplicationError({code: 404, message: 'User has not posted any jobs'})
        } catch(err) {
            console.log(err)
            throw err
        }
    }

    async updateJob(jobId, jobData) {
        try {
            const updatedJob = await JobModel.findByIdAndUpdate(jobId, jobData, { new: true })
            if (!updatedJob) throw new ApplicationError({ message: 'Error updating job', code: 404 })
            return updatedJob
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async deleteJob(jobId) {
        try {
            const deletedJob = await JobModel.findByIdAndDelete(jobId)
            if (!deletedJob) throw new ApplicationError({ message: 'Error deleting job', code: 404 })
            return deletedJob.applicants
        } catch (err) {
            console.log(err)
            throw err
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
            console.log(err)
            throw err
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
            console.log(err)
            throw err
        }
    }

    async getAllJobs() {
        try {
            const jobs = await JobModel.find().populate('applicants')
            return jobs
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

export default new JobRepository()