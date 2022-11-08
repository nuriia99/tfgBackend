import express from 'express'
import { getPatient, createPatient, getActiveIntelligence, updatePatient, searchPatient } from '../controllers/patient.js'
import { verifyUser } from '../utils/verifyToken.js'
const router = express.Router()

router.post('/createPatient', createPatient)
router.post('/:id/updatePatient', updatePatient)
router.get('/:id', verifyUser, getPatient)
router.get('/:id/activeIntelligence', verifyUser, getActiveIntelligence)
router.get('/', verifyUser, searchPatient)
export default router
