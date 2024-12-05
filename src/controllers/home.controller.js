const getHome = (req,res) => { 
    res.render('home',{
        includeHeader: true,
        currentUser: req.session.currentUser
    })
}
export default getHome
