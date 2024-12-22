import { GridFSBucket } from 'mongodb'
import mongoose from 'mongoose'

const deleteFileOnValidationError = async (req, res, next) => {
    if (!req.body.resumePath) return next()
    try {
        const db = mongoose.connection.db
        const bucket = new GridFSBucket(db, { bucketName: 'resumes' })

        req.on('finish', async () => {
            if (res.statusCode >= 400) {
                const fileId = new mongoose.Types.ObjectId(req.body.resumePath)
                await bucket.delete(fileId)
            }
        })
        next()
    } catch (error) {
        next(error)
    }
}

export default deleteFileOnValidationError
