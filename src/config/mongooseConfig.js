import mongoose from "mongoose"
import dotenv from 'dotenv'
import jobCategories from "../../public/js/jobCategories.js"
import CategoryModel from "../models/category.model.js"

dotenv.config()
const url = process.env.DB_URL

const connectMongoose = async() => {
    try {
        await mongoose.connect(url)
        await loadJobCategories()
        console.log('mongoose connected')
    } catch(err) {
        console.log(err)
    }
}

const loadJobCategories = async() => {
    const categories = await CategoryModel.find()
    if(!categories || !categories.length) {
        await jobCategoryModel.insertMany(jobCategories)
    }
    console.log('job categories added')
}

export default connectMongoose