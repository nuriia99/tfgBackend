import express from 'express'
import { createEntry, createNote, getEntry, getDiagnosisRec, updateDiagnosis, getPatientEntries, translateEntry, updateNote, deleteNote } from '../controllers/entries.js'
import { verifyUser } from '../middleware/verifyToken.js'
const router = express.Router()

router.post('/createEntry', verifyUser, createEntry)
router.post('/createNote', verifyUser, createNote)
router.patch('/updateNote/:id', verifyUser, updateNote)
router.delete('/deleteNote/:id', verifyUser, deleteNote)
router.get('/getEntry/:id', verifyUser, getEntry)
router.get('/patient/:id', verifyUser, getPatientEntries)
router.post('/translateEntry', verifyUser, translateEntry)
router.patch('/updateDiagnosis/:id', updateDiagnosis)
router.get('/getDiagnosisRec', verifyUser, getDiagnosisRec)

export default router
