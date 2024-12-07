import { Schema, model } from 'mongoose'

const jobSchema = new Schema({
    jobCategory: {
        type: String,
        required: ['jobCategory not provided']
    },
    jobDesign: {
        type: String,
        required: ['jobDesign not provided']
    },
    jobLocation: {
        type: String,
        required: ['jobLocation not provided']
    },
    companyName: {
        type: String,
        required: ['companyName not provided']
    },
    salary: {
        type: Number,
        required: ['salary not provided']
    },
    applyBy: {
        type: Date,
        required: ['applyBy date not provided']
    },
    skillsRequired: {
        type: [String],
        required: ['skillsRequired not provided']
    },
    numberOfOpenings: {
        type: Number,
        required: ['numberOfOpenings not provided']
    },
    jobPosted: {
        type: Date,
        default: Date.now
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
