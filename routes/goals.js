import express from 'express'
import { verifyUser } from '../middleware/verifyToken.js'
import { createGoal, getGoals, updateGoal, getPatients } from '../controllers/goals.js'
const router = express.Router()

router.get('/getGoals/:id', verifyUser, getGoals)// -
router.get('/getPatientsListGoal', verifyUser, getPatients)// -

router.post('/createGoal', createGoal)// -
router.patch('/updateGoal/:id', updateGoal)// -

export default router
