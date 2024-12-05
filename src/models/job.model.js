import path from 'path'
import { readData, writeData } from '../utils/fileHandling.util.js'

const filePath = path.resolve('src', 'data', 'jobList.json')

export default class JobModel {
    static _jobsArray = []

    constructor({
        jobCategory, jobDesign, jobLocation,
        companyName, salary, applyBy, skillsRequired,
        numberOfOpenings, applicants
    }) {
        this.jobId = JobModel.generateJobId()
        this.jobCategory = jobCategory
        this.jobDesign = jobDesign
        this.jobLocation = jobLocation
        this.companyName = companyName
        this.salary = Number(salary)
        this.applyBy = applyBy
        this.skillsRequired = Array.isArray(skillsRequired) ? 
            skillsRequired : []
        this.numberOfOpenings = Number(numberOfOpenings)
        this.jobPosted = JobModel.formatDateTime(new Date())
        this.applicants = applicants || []
    }

    static jobList = () => JobModel._jobsArray

    static getJobObj(jobId) {
        return JobModel._jobsArray.find(
            obj => obj.jobId == jobId
        )
    }

    static getLastObj() {
        return JobModel._jobsArray[
            JobModel._jobsArray.length-1
        ].jobId
    }

    static async addJob(jobData) {
        const jobObj = new JobModel(jobData)
        JobModel._jobsArray.push(jobObj)
        console.log('job posted:', jobObj.jobDesign)
        await writeData(filePath, JobModel._jobsArray)
        return jobObj.jobId
    }    

    static async updateJob(jobObj) {
        let index = JobModel._jobsArray.findIndex(
            obj => obj.jobId == jobObj.jobId
        )
        jobObj.jobId = Number(jobObj.jobId)
        jobObj.jobPosted = JobModel._jobsArray[index].jobPosted
        jobObj.salary = parseFloat(jobObj.salary)
        jobObj.skillsRequired = jobObj.skillsRequired ?
            jobObj.skillsRequired :
            JobModel._jobsArray[index].skillsRequired
        jobObj.numberOfOpenings = Number(jobObj.numberOfOpenings)
    
        Object.keys(jobObj).forEach(key => {
            JobModel._jobsArray[index][key] = jobObj[key]
        })
        console.log('job updated:', jobObj.jobDesign)
        await writeData(filePath, JobModel._jobsArray)
    }    

    static async deleteJob(jobid, writeToFile=true) {
        try {
            let jobIndex = JobModel._jobsArray.findIndex(
                obj => obj.jobId == jobid
            )
            if (jobIndex === -1) throw new Error('Job not found')
            let applicantIds = JobModel._jobsArray[jobIndex].applicants.map(
                obj => obj.applicantId
            )
            let deletedJob = JobModel._jobsArray[jobIndex].jobDesign
            JobModel._jobsArray.splice(jobIndex, 1)
            console.log(`job removed: ${deletedJob}`)
            if (writeToFile) 
                await writeData(filePath, JobModel._jobsArray)
            return applicantIds
        } catch (err) {
            console.log(err)
            return []
        }
    }

    static async deleteMultipleJobs(jobList) {
        try {
            const applicantList = []
            for (let jobid of jobList) {
                let applicants = await JobModel.deleteJob(jobid, false)
                if (applicants && applicants.length) 
                    applicantList.push(...applicants)
            }
            await writeData(filePath, JobModel._jobsArray)
            return applicantList
        } catch (err) {
            console.log(err)
            return []
        }
    }

    static async addApplicantOnApplicantList(jobid,applicantObj) {
        JobModel._jobsArray.find(
            obj => obj.jobId == jobid
        ).applicants.push(applicantObj)
        console.log(`applicant: ${applicantObj.name} added for job: ${jobid}`)
        await writeData(filePath, JobModel._jobsArray)
    }

    static async deleteApplicantOnApplicantList(jobid,appid) {
        let jobIndex = JobModel._jobsArray.findIndex(
            obj => obj.jobId == jobid
        )
        let applicantIndex = JobModel._jobsArray[jobIndex].applicants.findIndex(
            appObj => appObj.applicantId==appid
        )
        JobModel._jobsArray[jobIndex].applicants.splice(applicantIndex,1)
        console.log(`applicant: ${appid} removed for job: ${jobid}`)
        await writeData(filePath, JobModel._jobsArray)
    } 


    static generateJobId() {
        if (!JobModel._jobsArray.length) return 3001
        let lastJobId = JobModel._jobsArray[JobModel._jobsArray.length - 1].jobId
        return lastJobId + 1
    }

    static async initializeJobs() {
        JobModel._jobsArray = await readData(filePath)
    }

    static formatDateTime(date) {
        const formattedDate = date.toLocaleDateString(undefined, { 
            year: 'numeric', month: '2-digit', day: '2-digit' })
        let hours = date.getHours()
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        const ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12
        hours = hours ? hours : 12
        const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`
    
        return `${formattedDate} ${formattedTime}`
    }
}

await JobModel.initializeJobs()