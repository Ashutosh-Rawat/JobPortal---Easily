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
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Export the Applicant model
export default model('Applicant', applicantSchema)
