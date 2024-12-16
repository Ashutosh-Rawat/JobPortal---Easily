import express, { urlencoded } from 'express'
import path from 'path'
import ejsLayouts from 'express-ejs-layouts'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
// routers
import userRouter from './src/routes/user.routes.js'
import jobRouter from './src/routes/job.routes.js'
import applicantRouter from './src/routes/applicant.routes.js'
import categoryRouter from './src/routes/category.routes.js'
// functional middlewares
import applicationErrorHandler, {ApplicationError} from './src/middlewares/ApplicationError.middleware.js'
// functional controllers
import getHome from './src/controllers/home.controller.js'
import getError from './src/controllers/error.controller.js'

// Express app declaration
const app = express()

// Middleware configuration
app.use(cookieParser())
app.use(urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key-ABCD',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}))

// Environmental variables configuration
dotenv.config()

// Static file paths
app.use(express.static(path.join('src', 'views')))
app.use(express.static(path.join('public')))

// View engine setup
app.set('view engine', 'ejs')
app.set('views', path.resolve('src', 'views'))
app.use(ejsLayouts)

// Routes
app.get('/', getHome)
app.get('/err', getError)

app.use('/user', userRouter)
app.use('/jobs', jobRouter)
app.use('/applicant', applicantRouter)
app.use('/categories', categoryRouter)
// ignore favicon request
app.get('/favicon.ico', (req, res) => res.status(204))
// Error handler middleware
app.use(applicationErrorHandler)
// Handling invalid routes
app.use((req, res, next) => {
    console.log(req.url)
    next(new ApplicationError({
        code: 404, message: 'Route not found' 
        })
    )
})

export default app
