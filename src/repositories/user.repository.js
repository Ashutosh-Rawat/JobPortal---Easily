import UserModel from '../models/user.model.js'

class UserRepository {
    async addUser(userData) {
        try {
            const user = new UserModel(userData)
            await user.save()
            console.log(`User added: ${user.email}`)
            return user
        } catch (error) {
            console.error('Error adding user:', error)
            throw new Error('Error adding user')
        }
    }

    async deleteUser(userId) {
        try {
            const user = await UserModel.findByIdAndDelete(userId)
            if (user) {
                await JobModel.deleteMany({ _id: { $in: user.postedJobs } })
                await ApplicantModel.deleteMany({ jobId: { $in: user.postedJobs } })
                console.log(`User and their posted jobs deleted: ${user.email}`)
                return user
            } else {
                throw new Error('User not found')
            }
        } catch (error) {
            console.error('Error deleting user:', error)
            throw new Error('Error deleting user')
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email })
            return user
        } catch (error) {
            console.error('Error fetching user by email:', error)
            throw new Error('Error fetching user by email')
        }
    }

    async updateUserPassword(email, newPassword) {
        try {
            const user = await UserModel.findOneAndUpdate({ email }, { pass: newPassword }, { new: true })
            if (user) {
                console.log(`Password updated for user: ${email}`)
                return user
            } else {
                throw new Error('User not found')
            }
        } catch (error) {
            console.error('Error updating user password:', error)
            throw new Error('Error updating user password')
        }
    }

    async setLastVisit(userId, val) {
        try {
            const user = await UserModel.findByIdAndUpdate(userId, { lastVisit: val }, { new: true })
            if (user) {
                console.log(`Last visit updated for user: ${user.email}`)
                return user
            } else {
                throw new Error('User not found')
            }
        } catch (error) {
            console.error('Error setting last visit:', error)
            throw new Error('Error setting last visit')
        }
    }
}


export default new UserRepository()