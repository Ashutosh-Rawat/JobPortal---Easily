import categoryRepository from "../repositories/category.repository.js"

const getHome = async (req,res) => { 
    const categories = await categoryRepository.categoryList()
    res.render('home',{
        includeHeader: true,
        user: req.session.user,
        jobCategories: categories
    })
}
export default getHome
