import {Schema, model} from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: ['please provide name']
    },
    email: {
        type: String,
        required: ['please provide user email'],
        validate: {
            validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: 'Invalid email format'
        }
    },
    pass: {
        type: String,
        required: ['password is required']
    },
    postedJobs: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }],
    lastVisit: {
        type: String,
        default: null
    }
})

export default new model('User', userSchema)

