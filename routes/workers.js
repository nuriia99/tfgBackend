import express from 'express'
import { getWorkers, getWorker, updateLenguage } from '../controllers/workers.js'
import { verifyUser } from '../utils/verifyToken.js'
const router = express.Router()

router.get('/', getWorkers)
router.get('/:id', getWorker)
router.post('/:id/updateLenguage', verifyUser, updateLenguage)
export default router
