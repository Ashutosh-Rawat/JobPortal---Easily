import ApplicantRepository from "../repositories/applicant.repository.js";

export default class ApplicantController {
  constructor() {
    this.applicantRepo = new ApplicantRepository();
  }

  async addApplicant(req, res, next) {
    try {
      console.log("job id exists", req.params.id);
      const { name, email, contact, resumePath } = req.body;
      const applicantDetails = {
        name,
        email,
        contact,
        resumePath,
        job: req.params.id,
      };
      const newApplicant =
        await this.applicantRepo.createApplicant(applicantDetails);

      res.locals.applicantInfo = {
        applicantName: req.body.name,
        applicantEmail: req.body.email,
        jobId: req.params.id,
        applicantId: newApplicant._id,
      };
      next();
    } catch (error) {
      next(error);
    }
  }

  async removeApplicant(req, res, next) {
    try {
      const { applicantId } = req.params;
      await this.applicantRepo.deleteApplicant(applicantId);
      res.status(200).redirect("/");
    } catch (error) {
      next(error);
    }
  }
}
