import ApplicantModel from '../models/applicant.model.js'

export default class ApplicantRepository {
    async createApplicant(applicantDetails) {
        try {
            const applicant = new ApplicantModel(applicantDetails)
            const newApplicant = await applicant.save()
            console.log(`Applicant created: ${newApplicant.email}`)
            return newApplicant
        } catch (error) {
            console.error('Error creating applicant:', error)
            throw error
        }
    }

    async deleteApplicant(applicantId) {
        try {
            const deletedApplicant = await ApplicantModel.findByIdAndDelete(applicantId)
            console.log(`Applicant deleted: ${deletedApplicant.email}`)
        } catch (error) {
            console.error('Error deleting applicant:', error)
            throw error
        }
    }
}
