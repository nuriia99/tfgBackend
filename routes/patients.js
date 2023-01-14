import express from 'express'
import { getPatient, createPatient, getActiveIntelligence, uploadReport, updatePatient, searchPatient, deleteDocument, downloadReport } from '../controllers/patient.js'
import { verifyUser, verifyAdmin } from '../middleware/verifyUser.js'
const router = express.Router()

router.get('/:id', verifyUser, getPatient)// 1,06
router.get('/:id/activeIntelligence', verifyUser, getActiveIntelligence)// 875
router.get('/', verifyUser, searchPatient)// 885
router.delete('/:id/deleteDoc/:idDoc', verifyUser, deleteDocument)// 891
router.post('/report/upload', verifyUser, uploadReport)// 575
router.get('/report/download', verifyUser, downloadReport)// 575
router.patch('/:id/updatePatient', verifyUser, updatePatient)// 874

router.post('/createPatient', verifyAdmin, createPatient)// -

export default router
