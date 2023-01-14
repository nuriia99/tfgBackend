import express from 'express'
import { searchMed, createMed, createPrescription, deletePrescription, searchDiagnosis, updatePrescription } from '../controllers/prescription.js'
import { verifyUser, verifyAdmin } from '../middleware/verifyUser.js'
const router = express.Router()

router.get('/searchMed', verifyUser, searchMed)// 893
router.get('/searchDiagnosis', verifyUser, searchDiagnosis)// 893
router.post('/createPrescription', verifyUser, createPrescription)// 891
router.patch('/updatePrescription/:id', verifyUser, updatePrescription)// 1,01
router.delete('/deletePrescription/:id', verifyUser, deletePrescription)// 1,20

router.post('/createMed', verifyAdmin, createMed)// -

export default router
