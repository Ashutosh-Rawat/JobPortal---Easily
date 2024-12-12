import CategoryModel from "../models/category.model.js"

class CategoryRepsitory {
    async categoryList() {
        return await CategoryModel.find()
    }

    async jobsByCategory(category) {
        return await CategoryModel.find({jobCategory: category}, {jobNames})
    }
    async skillsByCategory(category) {
        return await CategoryModel.find({jobCategory: category}, {skillsNeeded})
    }
}

export default new CategoryRepsitory()