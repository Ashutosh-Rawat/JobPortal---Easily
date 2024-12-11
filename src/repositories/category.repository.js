import CategoryModel from "../models/category.model.js"

class CategoryRepsitory {
    async getCategories() {
        return await CategoryModel.find()
    }
}

export default new CategoryRepsitory()