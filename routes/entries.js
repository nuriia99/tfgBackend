import express from 'express'
import { createEntry, getEntry, getPatientEntries, translateEntry } from '../controllers/entries.js'
import { verifyUser } from '../middleware/verifyToken.js'
const router = express.Router()

router.post('/createEntry/', createEntry)
router.get('/:id', verifyUser, getEntry)
router.get('/patient/:id', verifyUser, getPatientEntries)
router.post('/translateEntry', verifyUser, translateEntry)

export default router
