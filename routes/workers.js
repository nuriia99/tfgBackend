import express from 'express'
import { getWorkers, getWorker, updateLenguage, updateWorker, getRecs } from '../controllers/workers.js'
import { verifyUser, verifyAdmin } from '../middleware/verifyUser.js'
const router = express.Router()

router.get('/:id/getRecs/:diagnosis', verifyUser, getRecs)// 575
router.patch('/:id/updateLenguage', verifyUser, updateLenguage)// 909

router.get('/', verifyAdmin, getWorkers)// -
router.get('/:id', verifyAdmin, getWorker)// -
router.patch('/:id/updateWorker', verifyAdmin, updateWorker)// -
export default router
