import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import mongoose from 'mongoose'

// MongoDB URI
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourDatabaseName'

// Create a Mongoose connection
const connection = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// GridFS Storage Configuration
const storage = new GridFsStorage({
    db: connection,
    file: (req, file) => {
        const fileInfo = {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: 'resumes'
        }
        return fileInfo
    }
})

// Multer configuration
const upload = multer({ storage }).single('resume')

export default (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return next(new Error('File upload failed: ' + err.message))
        }
        if (req.file) {
            req.body.resumePath = req.file.id
            req.body.filename = req.file.filename
        }
        next()
    })
}
