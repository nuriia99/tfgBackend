import express from 'express'
import { createEntry, getEntry, getPatientEntries } from '../controllers/entries.js'
import { verifyUser } from '../utils/verifyToken.js'
const router = express.Router()

router.post('/createEntry', createEntry)
router.get('/:id', verifyUser, getEntry)
router.get('/patient/:id', verifyUser, getPatientEntries)

export default router
