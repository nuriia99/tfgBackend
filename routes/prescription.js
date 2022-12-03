import express from 'express'
import { searchMed, createMed, createPrescription, deletePrescription, searchDiagnosis, updatePrescription } from '../controllers/prescription.js'
import { verifyUser } from '../middleware/verifyToken.js'
const router = express.Router()

router.get('/searchMed', verifyUser, searchMed)
router.get('/searchDiagnosis', verifyUser, searchDiagnosis)
router.post('/createPrescription', verifyUser, createPrescription)
router.patch('/updatePrescription/:id', verifyUser, updatePrescription)
router.delete('/deletePrescription/:id', verifyUser, deletePrescription)

router.post('/createMed', createMed)

export default router
