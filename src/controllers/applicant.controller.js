import ApplicantRepository from '../repositories/applicant.repository.js'

export default class ApplicantController {
    constructor() {
        this.applicantRepo = new ApplicantRepository()
    }

    async addApplicant(req, res, next) {
        try {
            console.log('job id exists', req.params.id)
            const { name, email, contact, resumePath } = req.body
            const applicantDetails = { name, email, contact, resumePath, job: req.params.id }
            const newApplicant = await this.applicantRepo.createApplicant(applicantDetails)
            const jobDetails = await jobController.getJobDetails(req, res, next)

            res.locals.mailInfo = {
                applicantName: req.body.name,
                applicantEmail: req.body.email,
                companyName: jobDetails.companyName,
                jobDesign: jobDetails.designation
            }
            
            req.applicantId = newApplicant._id
            next()
        } catch (error) {
            next(error)
        }
    }    

    async removeApplicant(req, res, next) {
        try {
            const { applicantId } = req.params
            await this.applicantRepo.deleteApplicant(applicantId)
            res.status(200).redirect('/')
        } catch (error) {
            next(error)
        }
    }
}
