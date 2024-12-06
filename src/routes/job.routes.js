import express,{Router} from 'express'
import JobController from '../controllers/job.controller'

const jobRouter = Router()
const jobController = new JobController()

export default jobRouter