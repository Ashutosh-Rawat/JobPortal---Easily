import { GridFSBucket } from 'mongodb'
import mongoose from 'mongoose'

const deleteFileOnValidationError = async (req, res, next) => {
    if (!req.filesToDelete || req.filesToDelete.length === 0) return next()

    try {
        const db = mongoose.connection.db
        const bucket = new GridFSBucket(db, { bucketName: 'resumes' })

        // Use forEach loop to delete each file
        req.filesToDelete.forEach(async (filePath) => {
            const fileId = new mongoose.Types.ObjectId(filePath)
            await bucket.delete(fileId)
        })

        next()
    } catch (error) {
        next(error)
    }
}

export default deleteFileOnValidationError
