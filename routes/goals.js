import express from 'express'
import { verifyUser } from '../middleware/verifyUser.js'
import { createGoal, getGoals, updateGoal, getPatients, getPatientsLists } from '../controllers/goals.js'
const router = express.Router()

router.get('/getGoals/:id', verifyUser, getGoals)// -
router.get('/getPatientsListGoal', verifyUser, getPatients)// -
router.get('/getPatientsLists', verifyUser, getPatientsLists)

router.post('/createGoal', createGoal)// -
router.patch('/updateGoal/:id', updateGoal)// -

export default router
