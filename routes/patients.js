import express from 'express'
import { getPatient, createPatient, getActiveIntelligence, uploadReport, updatePatient, searchPatient, deleteDocument, downloadReport } from '../controllers/patient.js'
import { verifyUser } from '../middleware/verifyUser.js'
const router = express.Router()

router.get('/:id', verifyUser, getPatient)// -
router.get('/:id/activeIntelligence', verifyUser, getActiveIntelligence)// -
router.get('/', verifyUser, searchPatient)// -
router.delete('/:id/deleteDoc/:idDoc', verifyUser, deleteDocument)// -
router.post('/report/upload', verifyUser, uploadReport)
router.get('/report/download', verifyUser, downloadReport)

router.post('/createPatient', createPatient)// -
router.patch('/:id/updatePatient', updatePatient)// -

export default router
