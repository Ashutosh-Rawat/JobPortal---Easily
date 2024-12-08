import { body, validationResult } from 'express-validator'

const validateJobApplication = async (req, res, next) => {
  const rules = [
    body('name').notEmpty().withMessage('Applicant name is required'),
    body('email')
      .notEmpty().withMessage('Applicant email is required')
      .isEmail().withMessage('Invalid email format'),
    body('contact')
      .notEmpty().withMessage('Contact number is required')
      .isLength({ min: 10, max: 10 }).withMessage('Contact number must be 10 digits')
      .isNumeric().withMessage('Contact number must contain only numbers'),
    body('resumePath').custom((_, { req }) => {
      if (!req.file) throw new Error('Resume file is required')
      const file = req.file
      if (!/(\.pdf)$/i.test(file.originalname)) throw new Error('Only PDF files are allowed')
      return true
    }),
  ]

  await Promise.all(rules.map((rule) => rule.run(req)))

  const errors = validationResult(req)
  res.locals.errors = errors
  next()
}

export default validateJobApplication
