import express from 'express'
import { getPatient, createPatient } from '../controllers/patient.js'
import { verifyUser } from '../utils/verifyToken.js'
const router = express.Router()

router.get('/createPatient', createPatient)
router.get('/:id', verifyUser, getPatient)

export default router
