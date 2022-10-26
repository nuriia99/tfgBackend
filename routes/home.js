import express from 'express'
import { verifyUser } from '../utils/verifyToken.js'
const router = express.Router()

router.get('/', verifyUser)

export default router
