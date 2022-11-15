import express from 'express'
import { getWorkers, getWorker, updateLenguage } from '../controllers/workers.js'
import { verifyUser } from '../middleware/verifyToken.js'
const router = express.Router()

router.get('/', getWorkers)
router.get('/:id', verifyUser, getWorker)
router.post('/:id/updateLenguage', verifyUser, updateLenguage)
export default router
