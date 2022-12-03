import express from 'express'
import { verifyUser } from '../middleware/verifyToken.js'
import { createGoal, getGoal, updateGoal, getPatients } from '../controllers/goals.js'
const router = express.Router()

router.post('/createGoal', createGoal)
router.get('/getGoals/:id', verifyUser, getGoal)
router.patch('/updateGoal/:id', updateGoal)
router.get('/getPatientsListGoal', verifyUser, getPatients)

export default router
