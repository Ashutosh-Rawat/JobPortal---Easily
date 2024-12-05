import { body,validationResult } from "express-validator"
const validateRequest = async (req,res,next) => {
    // request validation
    // 1. setup rules for validation
    const rules = [
        body('name').notEmpty()
        .withMessage('name should not be empty'),
        body('price').isFloat({min:0})
        .withMessage('price should be a positive value'),
        body('imageUrl').custom((value, {req}) => {
            if(!req.file) throw new Error('image is required')
            return true
        })
    ]
    // 2. run those rules
    await Promise.all(rules.map(rule=>rule.run(req)))
    // 3. checking if there are any errors
    const validationErrors = validationResult(req)
    // console.log(validationErrors.array())
    // 4. if errors, return error message
    if(validationErrors.array().length)
        return res.render('add-product', {errorMessage:validationErrors.array().map(error => error.msg)})
    // call the next middleware if not error
    next()
}

export default validateRequest