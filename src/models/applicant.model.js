import { Schema, model } from "mongoose"

const applicantSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Applicant name not provided']
    },
    email: {
        type: String,
        required: [true, 'Applicant email not provided'],
        validate: {
            validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: 'Invalid email format'
        }
    },
    contact: {
        type: Number,
        required: [true, 'Contact number not provided'],
        validate: {
            validator: (v) => /^[0-9]{10}$/.test(v.toString()),
            message: 'Contact number must be a valid 10-digit number'
        }
    },
    resumePath: {
        type: String,
        required: [true, 'Resume path not provided']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Export the Applicant model
export default model('Applicant', applicantSchema)



// import fs from 'fs/promises'
// import path from 'path'
// import { readData,writeData } from '../utils/fileHandling.util.js'

// const filePath = path.resolve('src', 'data', 'jobApplicant.json')

// export default class ApplicantModel {
//     static _applicantArray = []

//     constructor({name,email,contact,resumePath}) {
//         this.applicantId = ApplicantModel.generateApplicantId()
//         this.name = name
//         this.email = email
//         this.contact = Number(contact)
//         this.resumePath = resumePath
//     }

//     static applicantList = () => ApplicantModel._applicantArray

//     static getApplicantObj(appId) {
//         return ApplicantModel._applicantArray.find(
//             obj => obj.applicantId == appId
//         )
//     }
    
//     static async addApplicant(applicantData) {
//         const appObj = new ApplicantModel(applicantData)
//         ApplicantModel._applicantArray.push(appObj)
//         console.log('application submitted:', appObj.email)
//         await writeData(filePath, ApplicantModel._applicantArray)
//         return appObj
//     }
    
//     static async deleteApplicants(applicantIds) {
//         for (let appid of applicantIds) {
//             let applicantIndex = ApplicantModel._applicantArray.findIndex(
//                 obj => obj.applicantId == appid
//             )
//             if (applicantIndex !== -1) {
//                 let deletedApplicant = ApplicantModel._applicantArray[applicantIndex]
//                 ApplicantModel._applicantArray.splice(applicantIndex, 1)
//                 console.log(`deleted applicant: ${deletedApplicant.name}`)
                
//                 // Delete the resume file
//                 try {
//                     const updatedPath = deletedApplicant.resumePath.replace(
//                         'savedResumes', 'public/savedResumes'
//                     )
//                     await fs.unlink(updatedPath)
//                     console.log(`Deleted resume file: ${deletedApplicant.resumePath}`)
//                 } catch (err) {
//                     console.error(`Error deleting file: ${err.message}`)
//                 }
//             }
//         }
//         await writeData(filePath, ApplicantModel._applicantArray)
//     }

//     static generateApplicantId() {
//         if (!ApplicantModel._applicantArray.length) return 5000
//         let lastApplicantId = ApplicantModel._applicantArray[ApplicantModel._applicantArray.length - 1].applicantId
//         return lastApplicantId + 1
//     }

//     static async initializeApplicants() {
//         ApplicantModel._applicantArray = await readData(filePath)
//     }

// }

// await ApplicantModel.initializeApplicants()