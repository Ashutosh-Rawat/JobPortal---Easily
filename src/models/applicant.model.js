import { Schema, model } from "mongoose"

const applicantSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Applicant name not provided']
    },
    email: {
        type: String,
        required: [true, 'Applicant email not provided'],
        validate: {
            validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: 'Invalid email format'
        }
    },
    contact: {
        type: Number,
        required: [true, 'Contact number not provided'],
        validate: {
            validator: (v) => /^[0-9]{10}$/.test(v.toString()),
            message: 'Contact number must be a valid 10-digit number'
        }
    },
    resumePath: {
        type: String,
        required: [true, 'Resume path not provided']
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, 'Job not provided']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default model('Applicant', applicantSchema)
