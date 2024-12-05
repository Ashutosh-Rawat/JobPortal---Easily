import { body, validationResult } from 'express-validator'

const validateJobApplication = async (req, res, next) => {
  const rules = [
    body('name').notEmpty().withMessage('Name field should not be empty'),
    body('email').isEmail().withMessage('Provide a proper email'),
    body('contact')
      .isLength({ min: 10, max: 10 }).withMessage('Contact must be exactly 10 digits')
      .isNumeric().withMessage('Contact must be a number'),
    body('resumePath').custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Resume file is required')
      }
      const file = req.file
      const allowedExtensions = /(\.pdf)$/i
      if (!allowedExtensions.exec(file.originalname)) {
        throw new Error('Only PDF files are allowed')
      }
      return true
    })
  ]

  await Promise.all(rules.map(rule => rule.run(req)))

  const errors = validationResult(req)
  res.locals.errors = errors
  next()
}

export default validateJobApplication
