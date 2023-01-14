import express from 'express'
import { getAppointments, createAppointment, getSchedules, deleteUrgAppointment, updateAppointment, createUrgAppointment, deleteAppointment, createSchedule, getSchedule } from '../controllers/schedules.js'
import { verifyUser, verifyAdmin } from '../middleware/verifyUser.js'
const router = express.Router()

router.get('/getSchedule/:id', verifyUser, getSchedule)// 1.27
router.get('/getAppointments/:idPatient', verifyUser, getAppointments)// 581
router.get('/getSchedules', verifyUser, getSchedules)// 928 ms
router.post('/createAppointment', verifyUser, createAppointment)// 1,38
router.patch('/updateAppointment/:id', verifyUser, updateAppointment)// 1,58
router.delete('/deleteAppointment/:id', verifyUser, deleteAppointment)// 1,03
router.delete('/deleteUrgAppointment/:id', verifyUser, deleteUrgAppointment)// -

router.post('/createUrgAppointment', verifyAdmin, createUrgAppointment)// -
router.post('/createSchedule', verifyAdmin, createSchedule)// -

export default router
