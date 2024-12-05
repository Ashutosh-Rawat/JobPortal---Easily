import path from 'path'
import ApplicantModel from '../models/applicant.model.js'

export default class applicantController {
    getJobApplication(req,res) {
        res.render('job-application', {
            includeHeader: true,
            currentUser: req.session.currentUser,
            errors: null
        })
    }
    
    async postJobApplication(req,res,next) {
        try {
            const {name,email,contact} = req.body
            const resumePath = path.join('savedResumes',req.file.filename)
            const applicationObject = await ApplicantModel.addApplicant({name,email,contact,resumePath})
            res.locals.application = applicationObject
            res.locals.currentJobId = req.params.id            
            next()
        }
        catch(err) {
            console.log(err)
            req.session.err = 'error occured while submitting your job application'
            res.redirect(302, '/jobs')
        }
    }

    async postDeleteApplicants(req,res,next) {
        try {
            const applicantIds = res.locals.applicantList
            if(applicantIds && applicantIds.length)
                await ApplicantModel.deleteApplicants(applicantIds)
            if(res.locals.proceed) next()
            else res.redirect(302, '/jobs')
        }
        catch(err) {
            console.log(err)
            req.session.err = 'error occured while deleting applicants'
            res.redirect(302, '/err')
        }
    }
}
