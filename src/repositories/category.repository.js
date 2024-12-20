import CategoryModel from "../models/category.model.js"

export default class CategoryRepsitory {
    async categoryList() {
        return await CategoryModel.find()
    }

    async jobsByCategory(category) {
        return await CategoryModel.find({jobCategory: category}, {jobNames:1})
    }
    async skillsByCategory(category) {
        return await CategoryModel.find({jobCategory: category}, {skillsNeeded:1})
    }
}
