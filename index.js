import express, { urlencoded } from 'express'
import path from 'path'
import ejsLayouts from 'express-ejs-layouts'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
// functional middlewares
import getHome from './src/controllers/home.controller.js'
import getError from './src/controllers/error.controller.js'
import userRouter from './src/routes/user.routes.js'
import jobRouter from './src/routes/job.routes.js'
import applicantRouter from './src/routes/applicant.routes.js'

// declaration of express functions
const app = express()
// setting session
app.use(cookieParser())
app.use(urlencoded({extended:true}))
// for parsing json from req.body()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'secret-key-ABCD',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

// configure environmental variables
dotenv.config()
// public accesses
app.use(express.static(path.join('src','views')))
app.use(express.static(path.join('public')))
// middlewares
app.set('view engine', 'ejs')
app.set('views',path.resolve('src','views'))
app.use(ejsLayouts)

// --------------------------------------------------------------- //
// access routes
app.get('/', getHome)
app.get('/err', getError)

// user routes
app.use('/user', userRouter)
// job routes
app.use('/jobs', jobRouter)
// applicant routes
app.use('/applicant', applicantRouter)


export default app