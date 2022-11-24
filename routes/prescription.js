import express from 'express'
import { searchMed, createMed, createPrescription, deletePrescription, searchDiagnosis } from '../controllers/prescription.js'
import { verifyUser } from '../middleware/verifyToken.js'
const router = express.Router()

router.get('/searchMed', verifyUser, searchMed)
router.get('/searchDiagnosis', verifyUser, searchDiagnosis)
router.post('/createMed', createMed)
router.post('/createPrescription', verifyUser, createPrescription)
router.delete('/deletePrescription/:id', verifyUser, deletePrescription)
export default router
