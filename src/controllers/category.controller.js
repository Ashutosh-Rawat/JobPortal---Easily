import CategoryRepository from "../repositories/category.repository.js"

export default class CategoryController {
    constructor() {
        this.categoryRepo = CategoryRepository
    }

    async getCategories(req,res,next) {
        try {
            const categories = await this.categoryRepo.categoryList()
            res.json(categories)
        } catch(err) {
            console.log(err)
            next(err)
        }
    }

    async getDesignations(req,res,next) {
        try {
            const category = req.params.category
            const designations = await this.categoryRepo.jobsByCategory(category)
            res.json(designations)
        } catch(err) {
            console.log(err)
            next(err)
        }
    }

    async getSkills(req,res,next) {
        try {
            const category = req.params.category
            const skills = await this.categoryRepo.skillsByCategory(category)
            res.json(skills)
        } catch(err) {
            console.log(err)
            next(err)
        }
    }
}