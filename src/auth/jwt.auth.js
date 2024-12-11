import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.JWT_SECRET || 'default-secret-key'

// Function to hash a password
export const hashPassword = async (password) => {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}

// Function to compare a plain password with a hash
export const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

// Function to create a JWT
export const createToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn: '1h' })
}

// Middleware to verify JWT
export const jwtAuth = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).redirect('/login')
    }
    try {
        jwt.verify(token, secret)
        next()
    } catch (err) {
        res.status(401).redirect('/login')
    }
}

// Function to clear cookies on logout
export const clearToken = (res) => {
    res.clearCookie('token')
}
