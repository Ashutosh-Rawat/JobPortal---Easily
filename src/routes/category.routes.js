import { Router } from "express"
import CategoryController from "../controllers/category.controller.js"

const categoryRouter = new Router()
const categoryController = new CategoryController()

categoryRouter.get('/',
    (req,res,next) => {
        categoryController.getCategories(req,res,next)
    }
)
categoryRouter.get('/designations/:category',
    (req,res,next) => {
        categoryController.getDesignations(req,res,next)
    }
)
categoryRouter.get('/skills/:category',
    (req,res,next) => {
        categoryController.getSkills(req,res,next)
    }
)

export default categoryRouter