const auth = (req,res,next) => {
    if(req.session.currentUser) 
        next()
    else {
        req.session.loginErr = 'Please login to continue'
        res.redirect(302,'/login')
    }
}

export default auth