import UserModel from "../models/user.model.js"

export default class UserController {
    getRegister(req,res) {
        res.status(200).render('register',{
            includeHeader: true, errors:null
        })
    }
    
    async postRegister(req,res) {
        const {name,email,pass} = req.body
        if(UserModel.userPresent(email)) {
            req.session.loginErr = 'user registerd with the email'
            return res.redirect(302, '/login')
        }
        await UserModel.addUser({name,email,pass})
        res.redirect(302,'/login')
    }

    getLogin(req,res) {
        if(!req.session.loginErr)
            return res.status(401).render('login', {includeHeader: true, err:false})
        else {
            let temp = req.session.loginErr
            req.session.loginErr = null
            res.status(401).render('login', {includeHeader: true, err:temp})
        }
    }
    
    postLogin(req, res) {
        const { email, pass } = req.body
        const isUser = UserModel.validateUser(email, pass)
        if (!isUser) {
            req.session.loginErr = 'Incorrect login credentials'
            return res.redirect(302, '/login')
        }
        // login message
        console.log('user logged in:', email)
        // start the session for current user
        req.session.userId = isUser._id
        const lastVisit = req.session.currentUser.lastVisit || new Date().toLocaleString()
        req.session.currentUser.lastVisit = lastVisit
        UserModel.setLastVisit(isUser.userId, lastVisit)
        // render the homepage
        res.redirect(302, '/')
    }
    
    getLogout(req, res) {
        const user = req.session.currentUser
        if (user) {
            UserModel.setLastVisit(user.userId, user.lastVisit)
        }
        // on logout, destroy the session
        req.session.destroy((err) => {
            if (err) {
                res.redirect(302, '/err')
            } else {
                console.log('user logged out:', user.email)
                res.clearCookie('lastVisit')
                res.redirect(302, '/')
            }
        })
    }

    getChangePassword(req, res) {
        let err = req.session.changePassErr ?
            req.session.changePassErr :
            false
        req.session.changePassErr = null
        res.locals.currentUser = req.session.currentUser
        res.status(200).render('change-password', { 
            includeHeader: true, err,
        })
    }

    async postChangePassword(req, res) {
        const { email, currentPassword, newPassword } = req.body
        const isUser = UserModel.validateUser(email, currentPassword)

        if (!isUser) {
            req.session.changePassErr = 'Incorrect password'
            return res.redirect('/change-pass')
        }

        try {
            req.session.currentUser = await UserModel.updateUserPassword(email, newPassword)
            console.log('password updated for:', req.session.currentUser.email)
            res.redirect('/')
        } catch (error) {
            res.status(500).render('change-password', { 
                includeHeader: true, 
                err: 'Failed to update password' 
            })
        }
    }


    async postDeleteUser(req,res,next) {
        try {
            let userid = req.session.currentUser.userId
            const jobsPosted = await UserModel.deleteUser(userid)
            res.locals.jobsPosted = jobsPosted
            res.locals.proceed = true
            next()
        } 
        catch(err) {
            console.log(err)
            res.locals.err = 'error occured while deleting your profile'
            res.redirect(302, '/err')
        }
    }
    
    async postUpdateJobPosted(req, res) {
        try {
            const {newJobId} = res.locals
            req.session.currentUser = await UserModel.addPostedJobId(
                req.session.currentUser.userId, newJobId
            )
            res.redirect(302, '/jobs')
        }
        catch(err) {
            console.log(err)
            req.session.err = 'error occured while uploading job to your profile'
            res.redirect(302, '/err')
        }
    }

    async postDeleteJobId(req,res) {
        try {
            const {deleteJob} = res.locals
            req.session.currentUser = await UserModel.deletePostedJobId(
                req.session.currentUser.userId, deleteJob
            )
            res.redirect(302, '/jobs')
        }
        catch(err) {
            console.log(err)
            req.session.err = "error occured while deleting deleted jobs from user's database"
            res.redirect(302, '/err')
        }
    }
}