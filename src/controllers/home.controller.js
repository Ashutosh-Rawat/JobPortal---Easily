import CategoryRepository from "../repositories/category.repository.js"
const categoryRepo = new CategoryRepository()

const getHome = async (req,res) => { 
    const categories = await categoryRepo.categoryList()
    res.render('home',{
        includeHeader: true,
        user: req.session.user,
        jobCategories: categories
    })
}
export default getHome
