import { Schema, model } from 'mongoose'

const jobSchema = new Schema({
    category: {
        type: String,
        required: ['job category is required']
    },
    designation: {
        type: String,
        required: ['job designation is required']
    },
    location: {
        type: String,
        required: ['job location is required']
    },
    companyName: {
        type: String,
        required: ['company name is required']
    },
    salary: {
        type: Number,
        required: ['salary is required']
    },
    applyBy: {
        type: Date,
        required: ['apply by date is required']
    },
    skills: {
        type: [String],
        required: ['skills required']
    },
    openings: {
        type: Number,
        min: [1, 'job openings should be at least 1'],
        required: ['number of openings are required'],
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    applicants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Applicant'
        }
    ]
})

const JobModel = model('Job', jobSchema)

export default JobModel
