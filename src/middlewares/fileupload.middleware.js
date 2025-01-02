import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { ApplicationError } from './ApplicationError.middleware.js'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
const size_limit = 20 * 1024 * 1024

const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
auth.setCredentials({ refresh_token: REFRESH_TOKEN })

const drive = google.drive({ version: 'v3', auth })

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: size_limit },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png']
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new ApplicationError({ code: 400, message: 'Invalid file type' }))
        }
        cb(null, true)
    }
}).single('resumePath')

export const uploadFile = async (req, res, next) => {
    try {
        const authTest = await drive.files.list({
            pageSize: 1,
            fields: 'files(id, name)',
        })

        if (authTest.status !== 200) {
            console.error('[Google Auth Error] Authentication failed')
            return next(new ApplicationError({ code: 500, message: 'Google Drive authentication failed' }))
        }

        console.log('[Google Auth] Authentication successful')

        upload(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    return next(new ApplicationError({ code: 400, message: err.message }))
                }
                return next(new ApplicationError({ code: 500, message: 'File upload failed' }))
            }

            if (!req.file) {
                return next(new ApplicationError({ code: 400, message: 'No file uploaded' }))
            }

            // Proceed with Google Drive upload
            const filePath = req.file.path
            const fileName = path.basename(filePath)
            const folderName = 'clientResume'

            const fileMetadata = { name: fileName, parents: [folderName] }
            const media = { mimeType: req.file.mimetype, body: fs.createReadStream(filePath) }

            drive.files.create({ resource: fileMetadata, media, fields: 'id' }, (err, file) => {
                if (err) {
                    console.error('[Google Drive Error]', err)
                    return next(new ApplicationError({ code: 500, message: 'Failed to upload to Google Drive' }))
                }
                req.fileId = file.data.id
                fs.unlinkSync(filePath)
                next()
            })
        })
    } catch (error) {
        console.error('[Google Auth Error]', error.message)
        return next(new ApplicationError({ code: 500, message: 'Google Drive authentication failed' }))
    }
}
