import fs from 'fs'
import { ApplicationError } from './ApplicationError.middleware.js'

const deleteFileOnValidationError = (req, res, next) => {
    if (req.filesToDelete) {
        try {
            req.filesToDelete.forEach((filePath) => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
                }
            })
        } catch (err) {
            return next(new ApplicationError({ code: 500, message: 'Error cleaning up files' }))
        }
    }
    next()
}

export default deleteFileOnValidationError
