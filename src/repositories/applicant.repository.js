import ApplicantModel from '../models/applicant.model.js'

class ApplicantRepository {
    async createApplicant(applicantData) {
        try {
            const applicant = new ApplicantModel(applicantData)
            await applicant.save()
            console.log('Applicant created:', applicant)
            return applicant
        } catch (error) {
            console.error('Error creating applicant:', error)
        }
    }

    async deleteApplicant(applicantId) {
        try {
            const deletedApplicant = await ApplicantModel.findByIdAndDelete(applicantId)
            console.log(`Applicant deleted: ${applicantId}`)
            return deletedApplicant
        } catch (error) {
            console.error(`Error deleting applicant with ID ${applicantId}:`, error)
        }
    }
}

export default ApplicantRepository
