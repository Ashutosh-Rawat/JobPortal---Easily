import JobModel from "../models/job.model.js"
import jobCategories from "../../public/js/jobCategories.js"

export default class JobController {
    getJobListing(req, res) {
        res.status(200).render('job-listing', {
            includeHeader: true,
            data: JobModel.jobList(),
            category: jobCategories,
            currentUser: req.session.currentUser
        })
    }

    getPostedJobListing(req, res) {
        if(req.session.currentUser) {
            if(req.session.currentUser.jobsPosted) {
                const jobList = []
                req.session.currentUser.jobsPosted.forEach(jobid =>
                    jobList.push(JobModel.getJobObj(jobid))
                )
                res.status(200).render('job-listing', {
                    includeHeader: true,
                    data: jobList || [],
                    category: jobCategories,
                    currentUser: req.session.currentUser
                })
            }
            else {
                req.session.err = 'no jobs posted by user'
                res.redirect(302, '/err')
            }
        }
        else {
            req.session.err = 'user not present'
            res.redirect(302, '/err')
        }
    }
    
    getNewJob(req, res) {
        res.render('add-job', {
            includeHeader: true,
            currentUser: req.session.currentUser,
            jobs: jobCategories,
        })
    }

    async postNewJob(req, res, next) {
        try {
            const jobData = { ...req.body}
            const jobid = await JobModel.addJob(jobData)
            req.session.currentUser.jobsPosted.push(jobid)
            res.locals.newJobId = jobid
            next()
        }
        catch(err) {
            console.log(err)
            req.session.err = 'error occured while submitting the job'
            res.redirect(302, '/err')
        }
    }

    getUpdateJob(req, res) {
        res.render('update-job', {
            includeHeader: true,
            data: JobModel.getJobObj(req.params.id),
            currentUser: req.session.currentUser,
            jobs: jobCategories
        })
    }

    async postUpdateJob(req, res) {
        const jobData = { ...req.body }
        await JobModel.updateJob(jobData)
        res.redirect(302, '/jobs')
    }

    async postDeleteJob(req, res, next) {
        try {
            let jobid = req.params.id
            const applicantList = await JobModel.deleteJob(jobid)
            if(applicantList && applicantList.length) {
                res.locals.proceed = true
                res.locals.deleteJob = jobid
                res.locals.applicantList = applicantList
                next()
            }
            else res.redirect(302, '/jobs')
        }
        catch(err){
            console.log(err)
            req.session.err = 'error occured while deleting job'
            res.redirect(302, '/err')
        }
    }
    async postDeleteMultipleJobs(req, res, next) {
        try {
            const applicantList = []
            const jobsPosted = res.locals.jobsPosted
            if (jobsPosted && jobsPosted.length) {
                let applicants = await JobModel.deleteMultipleJobs(jobsPosted)
                if(applicants && applicants.length)
                    applicantList.push(...applicants)
            }
            res.locals.applicantList = applicantList
            next()
        } 
        catch (err) {
            console.error(err)
            req.session.err = 'error occured while deleting jobs'
            res.redirect(302, '/err')
        }
    }

    getJobDetails(req, res) {
        let eligibleRecruiter = false
        // if currentUser exists and the jobsPosted includes the
        // current job id then eligibleRecruiter is true
        if(req.session.currentUser && 
            req.session.currentUser.jobsPosted.includes(
                Number(req.params.id)
            )
        ) eligibleRecruiter = true
        res.render('job-details', {
            includeHeader: true,
            data: JobModel.getJobObj(req.params.id),
            currentUser: req.session.currentUser,
            eligibleRecruiter
        })
    }

    getJobApplicants(req, res) {
        res.render('applicant-list', {
            includeHeader: true,
            data: JobModel.getJobObj(req.params.id),
            currentUser: req.session.currentUser
        })
    }

    async postAddApplicants(req,res,next) {
        try {
            const {application, currentJobId} = res.locals
            await JobModel.addApplicantOnApplicantList(currentJobId, application)
            const {companyName, jobDesign} = JobModel.getJobObj(currentJobId)
            res.locals.mailInfo = 
            {
                applicantName: application.name, 
                applicantEmail: application.email,
                companyName,jobDesign
            }
            if(next) next()
            else res.redirect(302,'/jobs')
        }
        catch(err) {
            console.log(err)
            req.session.err = 'error occured while uploading application on job portal'
            res.redirect(302, '/err')
        }
    }
}
