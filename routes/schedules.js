import express from 'express'
import { getAppointments, createAppointment, getSchedules, deleteUrgAppointment, updateAppointment, createUrgAppointment, deleteAppointment, createSchedule, getSchedule } from '../controllers/schedules.js'
import { verifyUser } from '../middleware/verifyUser.js'
const router = express.Router()

router.get('/getAppointments/:idPatient', verifyUser, getAppointments)
router.get('/getSchedule/:id', verifyUser, getSchedule)
router.get('/getSchedules', verifyUser, getSchedules)
router.post('/createAppointment', verifyUser, createAppointment)
router.patch('/updateAppointment/:id', verifyUser, updateAppointment)
router.delete('/deleteAppointment/:id', verifyUser, deleteAppointment)
router.delete('/deleteUrgAppointment/:id', verifyUser, deleteUrgAppointment)

router.post('/createUrgAppointment', createUrgAppointment)
router.post('/createSchedule', createSchedule)

export default router
