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
router.patch('/:id/updatePatient', verifyUser, updatePatient)// cambiar a verify

router.post('/createPatient', createPatient)// -

export default router
