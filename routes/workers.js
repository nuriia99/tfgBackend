import express from 'express'
import { getWorkers, getWorker } from '../controllers/workers.js'
const router = express.Router()

router.get('/', getWorkers)
router.get('/:id', getWorker)

export default router
