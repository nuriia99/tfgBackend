import express from 'express'
import { login, register } from '../controllers/auth.js'
import { verifyAdmin } from '../middleware/verifyUser.js'
const router = express.Router()

router.post('/register', verifyAdmin, register) // -
router.post('/login', login)// 912

export default router
