const getHome = (req,res) => { 
    res.render('home',{
        includeHeader: true,
        user: req.session.user
    })
}
export default getHome
