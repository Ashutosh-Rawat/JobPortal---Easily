import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import mongoose from 'mongoose'

// Multer storage configuration for uploading PDF resumes to GridFS
const storage = new GridFsStorage({
    url: process.env.DB_URL,
    file: (req, file) => {
        return {
            bucketName: 'resumes', // Define the bucket for GridFS
            filename: `${Date.now()}-${file.originalname}` // Generate unique file names
        }
    }
})

const upload = multer({ storage })

// Export as a middleware for use in routes
export const uploadFile = upload.single('resumeFile') // Upload single resume file
