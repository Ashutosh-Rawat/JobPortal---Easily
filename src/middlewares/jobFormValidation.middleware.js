import jobCategories from '../../public/js/jobCategories.js'
import { body, validationResult } from 'express-validator'

const validateJob = async (req, res, next) => {
  const rules = [
    body('jobCategory').notEmpty()
      .withMessage('Job category should not be empty'),
    body('jobDesign').notEmpty()
      .withMessage('Job designation should not be empty'),
    body('jobLocation').notEmpty()
      .withMessage('Job location should not be empty'),
    body('companyName').notEmpty()
      .withMessage('Company name should not be empty'),
    body('salary').isFloat({ min: 0, max: 100 })
      .withMessage('Salary should be a number between 0 and 100'),
    body('applyBy').isDate()
      .withMessage('Apply by date should be a valid date'),
    body('numberOfOpenings').isInt({ min: 1 }).withMessage('Number of openings should be a positive integer'),
  ]

  await Promise.all(rules.map(rule => rule.run(req)))

  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map(error => error.msg)
    return res.render(req.originalUrl.includes('update') ? 'update-job' : 'add-job', {
      includeHeader: true,
      formErr: errors.join(', '),
      data: req.body,
      jobs: jobCategories,
    })
  }
  next()
}

export default validateJob
