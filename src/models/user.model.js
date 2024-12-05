import path from 'path'
import { readData, writeData } from '../utils/fileHandling.util.js'

const userFilePath = path.resolve('src','data','users.json')

export default class UserModel {
    static _users = []

    constructor({name, email, pass, jobsPosted=[]}) {
        this.userId = UserModel.generateUserId()
        this.name = name
        this.email = email
        this.pass = pass
        this.jobsPosted = jobsPosted
        this.lastVisit = false
    }

    static getUserName(email) {
        return this._users.find(
            user => user.email === email
        ).name
    } 

    static userPresent(email) {
        return this._users.find(
            user => user.email == email
        )
    }

    static async addUser(userData) {
        const user = new UserModel(userData)
        UserModel._users.push(user)
        console.log(`user added: ${user.email}`)
        // writing data for users.json
        await writeData(userFilePath, UserModel._users)
    }

    static async deleteUser(userid) {
        let userIndex = UserModel._users.findIndex(
            obj => obj.userId == userid
        )
        let jobsPosted = UserModel._users[userIndex].jobsPosted
        let deletedUser = UserModel._users[userIndex].email
        UserModel._users.splice(userIndex,1)
        console.log(`user deleted: ${deletedUser}`)
        await writeData(userFilePath, UserModel._users)
        return jobsPosted
    }

    static jobsPostedList(userid) {
        return UserModel._users.find(user => 
            user.userId==userid 
        ).jobsPosted
    }

    static async addPostedJobId(userId, jobId) {
        const user = UserModel._users.find(user => user.userId == userId)
        if (user) {
            user.jobsPosted.push(jobId)
            console.log(`jobId: ${jobId} posted by recruiter: ${user.email}`)
            await writeData(userFilePath, UserModel._users)
            return user
        }
        else {
            req.session.err = 'user not found'
            res.redirect(302, '/err')
        }
    }

    static async deletePostedJobId(userid, jobid) {
        const user = UserModel._users.find(
            user => user.userId == userid
        )
        if(user) {
            let jobindex = user.jobsPosted.findIndex(jobId => jobId==jobid)
            user.jobsPosted.splice(jobindex,1)
            console.log(`jobid: ${jobid} removed from user: ${user.email}`)
            await writeData(userFilePath, UserModel._users)
            return user
        }
        else {
            req.session.err = "job not present in user's data"
            res.redirect(302, '/err')
        }
    }

    static validateUser(email, pass) {
        return this._users.find(user => user.email === email && user.pass === pass)
    }

    static async updateUserPassword(email, newPassword) {
        const user = this._users.find(
            user => user.email === email
        )
        if (user) {
            user.pass = newPassword
            await writeData(userFilePath, UserModel._users)
            return user
        }
        throw new Error('User not found')
    }

    static async setLastVisit(userid, val) {
        const user = UserModel._users.find(user => user.userId === userid)
        if (user) {
            console.log(`setting lastVisit for ${user.email} to ${val}`)
            user.lastVisit = val
            await writeData(userFilePath, UserModel._users)
        } else {
            console.error(`User with id ${userid} not found`)
        }
    }    

    static generateUserId() {
        if(!UserModel._users.length) return 1001
        let lastUserId = UserModel._users[UserModel._users.length - 1].userId
        return lastUserId+1
    }

    static async initializeUsers() {
        UserModel._users = await readData(userFilePath)
    }
}

await UserModel.initializeUsers()

if(!UserModel._users.length) {
    UserModel.addUser(
        {
            "userId": 1001,
            "name": "Arun Pratap",
            "email": "codingninjas2k16@gmail.com",
            "pass": "slwvvlczduktvhdj",
            "jobsPosted": []
        }
    ),
    UserModel.addUser(
        {
            "userId": 1003,
            "name": "testing user",
            "email": "no.name.236.23@gmail.com",
            "pass": "abcdef8*",
            "jobsPosted": []
        }
    )
}
