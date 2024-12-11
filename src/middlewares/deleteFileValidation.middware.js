import { GridFSBucket } from 'mongodb'
import mongoose from 'mongoose'

const deleteFileOnValidationError = async (req, res, next) => {
    // If no file ID, skip the middleware
    if (!req.body.resumePath) {
        return next()
    }

    try {
        // Assuming `resumePath` holds the GridFS file ID
        const db = mongoose.connection.db
        const bucket = new GridFSBucket(db, { bucketName: 'resumes' })

        req.on('validationFailed', async () => {
            // Delete the uploaded file from GridFS if validation fails
            const fileId = new mongoose.Schema.Types.ObjectId(req.body.resumePath)
            await bucket.delete(fileId)
        })

        next()
    } catch (error) {
        next(error)
    }
}

export default deleteFileOnValidationError
