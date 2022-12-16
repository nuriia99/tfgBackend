import express from 'express'
import { getWorkers, getWorker, updateLenguage, updateWorker, getRecs } from '../controllers/workers.js'
import { verifyUser } from '../middleware/verifyToken.js'
const router = express.Router()

router.get('/:id/getRecs/:diagnosis', verifyUser, getRecs)// -
router.get('/:id', verifyUser, getWorker)// -
router.patch('/:id/updateLenguage', verifyUser, updateLenguage)// -
router.get('/', getWorkers)// -
router.patch('/:id/updateWorker', updateWorker)// -
export default router
