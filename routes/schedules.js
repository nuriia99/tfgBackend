import express from 'express'
import { getAppointments, createAppointment, getSchedules, updateAppointment, deleteAppointment, createSchedule, getSchedule } from '../controllers/schedules.js'
import { verifyUser } from '../middleware/verifyUser.js'
const router = express.Router()

router.get('/getAppointments/:idPatient', verifyUser, getAppointments)
router.get('/getSchedule/:id', verifyUser, getSchedule)
router.get('/getSchedules', verifyUser, getSchedules)
router.post('/createAppointment', verifyUser, createAppointment)
router.patch('/updateAppointment/:id', verifyUser, updateAppointment)
router.delete('/deleteAppointment/:id', verifyUser, deleteAppointment)

router.post('/createSchedule', createSchedule)

export default router
