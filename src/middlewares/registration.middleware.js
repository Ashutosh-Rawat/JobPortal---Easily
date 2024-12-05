import { body, validationResult } from 'express-validator'

const validateRegistration = async (req, res, next) => {
  const rules = [
    body('name').notEmpty().withMessage('Name field should not be empty'),
    body('email').isEmail().withMessage('Provide a proper email'),
    body('pass')
      .isLength({ min: 8 }).withMessage('Password must have at least 8 characters')
      .matches(/\d/).withMessage('Password must contain a number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character')
  ]

  await Promise.all(rules.map(rule => rule.run(req)))

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).render('register', {
      includeHeader: true, 
      errors: errors.array(), 
      old: req.body
    })
  }

  next()
}

export default validateRegistration
