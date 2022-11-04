import express from 'express'
import { getPatient, createPatient, getActiveIntelligence } from '../controllers/patient.js'
import { verifyUser } from '../utils/verifyToken.js'
const router = express.Router()

router.post('/createPatient', createPatient)
router.get('/:id', verifyUser, getPatient)
router.get('/:id/activeIntelligence', verifyUser, getActiveIntelligence)

export default router
