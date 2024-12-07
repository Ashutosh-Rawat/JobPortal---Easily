import {Schema, model} from "mongoose"

const jobCategorySchema = new Schema({
    jobCategory: {
        type: String,
        required: [true, 'cannot find job category']
    },
    jobNames: [{
        type: String,
        required: [true, 'jobs not listed for category']
    }],
    skillsNeeded: [{
        type: String,
        required: [true, 'skills not listed for category']
    }]
})

const CategoryModel = model('Category', jobCategorySchema)
export default CategoryModel