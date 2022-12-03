import express from 'express'
import { createEntry, createNote, getEntry, createDiagnosis, getDiagnosisRec, updateDiagnosis, getPatientEntries, translateEntry, updateNote, deleteNote } from '../controllers/entries.js'
import { verifyUser } from '../middleware/verifyToken.js'
const router = express.Router()

router.get('/getEntry/:id', verifyUser, getEntry)
router.get('/getDiagnosisRec', verifyUser, getDiagnosisRec)
router.get('/patient/:id', verifyUser, getPatientEntries)
router.post('/createEntry', verifyUser, createEntry)
router.post('/createNote', verifyUser, createNote)
router.post('/translateEntry', verifyUser, translateEntry)
router.patch('/updateNote/:id', verifyUser, updateNote)
router.delete('/deleteNote/:id', verifyUser, deleteNote)

router.patch('/updateDiagnosis/:id', updateDiagnosis)
router.post('/createDiagnosis', createDiagnosis)

export default router
