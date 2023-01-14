import express from 'express'
import { createEntry, createNote, getEntry, createDiagnosis, getDiagnosisRec, updateDiagnosis, translateEntry, updateNote, deleteNote } from '../controllers/entries.js'
import { verifyUser, verifyAdmin } from '../middleware/verifyUser.js'
const router = express.Router()

router.get('/getDiagnosisRec', verifyUser, getDiagnosisRec)// 578
router.post('/createEntry', verifyUser, createEntry)// 1,20
router.post('/createNote', verifyUser, createNote)// 1,20
router.post('/translateEntry', verifyUser, translateEntry)// 2,09
router.patch('/updateNote/:id', verifyUser, updateNote)// 738
router.delete('/deleteNote/:id', verifyUser, deleteNote)// 721

router.get('/getEntry/:id', verifyAdmin, getEntry) // -
router.patch('/updateDiagnosis/:id', verifyAdmin, updateDiagnosis)// -
router.post('/createDiagnosis', verifyAdmin, createDiagnosis)// -

export default router
