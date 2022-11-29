import express from 'express'
import { verifyUser } from '../middleware/verifyToken.js'
import { createGoal, getGoal } from '../controllers/goals.js'
const router = express.Router()

router.post('/createGoal', createGoal)
router.get('/getGoals/:id', verifyUser, getGoal)

export default router
