import express from 'express'
import { getWorkers, getWorker, updateLenguage, updateWorker } from '../controllers/workers.js'
import { verifyUser } from '../middleware/verifyToken.js'
const router = express.Router()

router.get('/', getWorkers)
router.get('/:id', verifyUser, getWorker)
router.patch('/:id/updateLenguage', verifyUser, updateLenguage)
router.patch('/:id/updateWorker', updateWorker)
export default router
