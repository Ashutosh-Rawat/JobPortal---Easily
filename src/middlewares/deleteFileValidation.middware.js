import fs from 'fs'
import path from 'path'

const deleteFileOnValidationError = (req, res, next) => {
  const errors = res.locals.errors
  if (!errors.isEmpty() && req.file) {
    const filePath = path.join('public/savedResumes', req.file.filename)
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete file:', err)
      }
      console.log('uploaded file deleted on validation error')
      return res.status(400).render('job-application', {
        includeHeader: true,
        errors: errors.array(),
        currentUser: req.session.currentUser
      })
    })
  } else {
    next()
  }
}

export default deleteFileOnValidationError
