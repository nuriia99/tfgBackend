import express from 'express'
import { verifyUser, verifyAdmin } from '../middleware/verifyUser.js'
import { createGoal, getGoals, updateGoal, getPatients, getPatientsLists } from '../controllers/goals.js'
const router = express.Router()

router.get('/getGoals/:id', verifyUser, getGoals)// 579
router.get('/getPatientsListGoal', verifyUser, getPatients)// 906
router.post('/getPatientsLists', verifyUser, getPatientsLists)// 1,21

router.post('/createGoal', verifyAdmin, createGoal)// -
router.patch('/updateGoal/:id', verifyAdmin, updateGoal)// -

export default router
