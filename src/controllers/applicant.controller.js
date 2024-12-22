import ApplicantRepository from '../repositories/applicant.repository.js'
import JobRepository from '../repositories/job.repository.js'

export default class ApplicantController {
    constructor() {
        this.applicantRepo = new ApplicantRepository()
    }

    // Add new applicant
    async addApplicant(req, res, next) {
        try {
            const { name, email, contact, resumeLink } = req.body
            let resumePath = resumeLink

            if (req.file) {
                resumePath = req.file.path // Use the uploaded file path
            }

            const applicantDetails = { name, email, contact, resumePath }
            const newApplicant = await this.applicantRepo.createApplicant(applicantDetails)

            // Pass applicant id to job application process
            req.applicantId = newApplicant._id
            next() // Move to the next step to apply to the job
        } catch (error) {
            next(error)
        }
    }

    // Remove applicant from the system
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
