import { body, validationResult } from 'express-validator'

const validatePasswordChange = async (req, res, next) => {
  const rules = [
    body('email').isEmail().withMessage('Provide a proper email'),
    body('currentPassword').notEmpty().withMessage('Current password should not be empty'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('New password must have at least 8 characters')
      .matches(/\d/).withMessage('New password must contain a number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('New password must contain a special character')
  ]

  await Promise.all(rules.map(rule => rule.run(req)))

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).render('change-password', {
      includeHeader: true, 
      err: errors.array().map(error => error.msg).join(', ')
    })
  }

  next()
}

export default validatePasswordChange
