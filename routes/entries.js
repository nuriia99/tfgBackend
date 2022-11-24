import express from 'express'
import { createEntry, createNote, getEntry, getPatientEntries, translateEntry } from '../controllers/entries.js'
import { verifyUser } from '../middleware/verifyToken.js'
const router = express.Router()

router.post('/createEntry', verifyUser, createEntry)
router.post('/createNote', verifyUser, createNote)
router.get('/:id', verifyUser, getEntry)
router.get('/patient/:id', verifyUser, getPatientEntries)
router.post('/translateEntry', verifyUser, translateEntry)

export default router
