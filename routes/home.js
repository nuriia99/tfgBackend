import express from 'express'
import { verifyUser } from '../middleware/verifyUser.js'
import { redirectLogin } from '../controllers/auth.js'
const router = express.Router()

router.get('/', verifyUser, redirectLogin)// -

export default router
