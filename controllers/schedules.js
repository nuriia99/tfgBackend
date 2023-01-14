import CitaPrevia from '../models/CitaPrevia.js'
import VisitaUrgencias from '../models/VisitaUrgencias.js'
import Agenda from '../models/Agenda.js'
import Paciente from '../models/Paciente.js'

export const getAppointments = async (req, res, next) => {
  try {
    let currentDay = new Date()
    currentDay = currentDay.setHours(0, 0, 0, 0)
    currentDay = new Date(currentDay)
    currentDay = currentDay.toISOString()
    const appointments = await CitaPrevia.find({ paciente: req.params.idPatient, fecha: { $gte: currentDay } }).populate('trabajador agenda')
    const sortAppointments = appointments.sort((a, b) => {
      const date1 = new Date(a.fecha)
      const date2 = new Date(b.fecha)
      return date1 - date2
    })
    res.status(200).json(sortAppointments)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getSchedule = async (req, res, next) => {
  try {
    const schedule = await Agenda.findById({ _id: req.params.id }).populate(
      [
        {
          path: 'citasPrevias',
          populate: [
            {
              path: 'paciente',
              module: Paciente
            }
          ]
        },
        {
          path: 'visitasUrgencia',
          populate: [
            {
              path: 'paciente',
              module: Paciente
            }
          ]
        }
      ]
    )
    let appointments = []
    if (schedule.citasPrevias) {
      appointments = schedule.citasPrevias.filter((cita) => {
        const currentDate = new Date(req.query.scheduleDay)
        const appointmentDate = new Date(cita.fecha)
        currentDate.setHours(currentDate.getHours() + 1)
        console.log(currentDate)
        if (appointmentDate.getHours() === 0) return currentDate.getFullYear() === appointmentDate.getFullYear() && currentDate.getMonth() === appointmentDate.getMonth() && currentDate.getDate() === (appointmentDate.getDate() - 1)
        return currentDate.getFullYear() === appointmentDate.getFullYear() && currentDate.getMonth() === appointmentDate.getMonth() && currentDate.getDate() === appointmentDate.getDate()
      })
      schedule.citasPrevias = appointments
    }
    res.status(200).json(schedule)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getSchedules = async (req, res, next) => {
  try {
    const name = req.query.name || ''
    const schedules = await Agenda.find({ centro: req.query.centro, nombre: { $regex: name, $options: 'i' } }).populate('trabajador citasPrevias')
    res.status(200).json(schedules)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const createAppointment = async (req, res, next) => {
  try {
    const newAppointment = new CitaPrevia({
      paciente: req.body.appointment.paciente,
      trabajador: req.body.appointment.trabajador?._id || null,
      tipoVisita: req.body.appointment.tipoVisita,
      centro: req.body.appointment.centro,
      fecha: req.body.appointment.fecha,
      especialidad: req.body.appointment.especialidad || 'Medicina general',
      agenda: req.body.appointment.agenda._id,
      motivo: req.body.appointment.motivo
    })
    if (new Date() > newAppointment.fecha) return res.status(200).json({ message: 'Las fecha ya ha pasado.' })
    const schedule = await Agenda.findById(req.body.appointment.agenda._id).populate('citasPrevias')
    let solapa = false
    schedule.citasPrevias.every((a) => {
      const timeAppointment = a.tipoVisita === 'Presencial 30min' || a.tipoVisita === 'Domicilio' ? 30 : 15
      const maxTime = new Date(a.fecha)
      maxTime.setMinutes(maxTime.getMinutes() + timeAppointment)
      if (newAppointment.fecha >= a.fecha && newAppointment.fecha < maxTime) {
        solapa = true
        return false
      }
      return true
    })
    if (solapa) return res.status(200).json({ message: 'Las fechas se solapan.' })
    solapa = false
    if (req.body.appointment.trabajador) {
      req.body.appointment.trabajador.turnos.every(t => {
        if (t.horaInicio < newAppointment.fecha.toISOString() && t.horaFinal > newAppointment.fecha.toISOString()) {
          solapa = true
          return false
        }
        return true
      })
    } else solapa = true
    if (!solapa) return res.status(200).json({ message: 'El trabajador no tiene ese turno asignado' })
    const appointment = await newAppointment.save()
    await Agenda.findByIdAndUpdate({ _id: req.body.appointment.agenda._id }, { $push: { citasPrevias: appointment } })
    await Paciente.findByIdAndUpdate({ _id: req.body.appointment.paciente }, { $push: { citasPrevias: appointment } })
    res.status(201).json(appointment)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const createUrgAppointment = async (req, res, next) => {
  try {
    const newAppointment = new VisitaUrgencias({
      paciente: req.body.paciente,
      fechaEntrada: req.body.fechaEntrada,
      tipoVisita: req.body.tipoVisita,
      centro: req.body.centro,
      triaje: req.body.triaje,
      agenda: req.body.agenda,
      comentario: req.body.comentario
    })
    const appointment = await newAppointment.save()
    await Agenda.findByIdAndUpdate({ _id: req.body.agenda }, { $push: { visitasUrgencia: appointment } })
    res.status(201).json(appointment)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const createSchedule = async (req, res, next) => {
  try {
    const newSchedule = new Agenda({
      centro: req.body.centro,
      trabajador: req.body.trabajador,
      nombre: req.body.nombre,
      citasPrevias: req.body.citasPrevias,
      visitasUrgencia: req.body.visitasUrgencia
    })
    await newSchedule.save()
    res.status(201).json(newSchedule)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const updateAppointment = async (req, res, next) => {
  try {
    await CitaPrevia.findByIdAndDelete(req.params.id)
    const newAppointment = new CitaPrevia({
      _id: req.params.id,
      paciente: req.body.appointment.paciente,
      trabajador: req.body.appointment.trabajador._id,
      tipoVisita: req.body.appointment.tipoVisita,
      centro: req.body.appointment.centro,
      fecha: req.body.appointment.fecha,
      especialidad: req.body.appointment.especialidad,
      agenda: req.body.appointment.agenda._id,
      motivo: req.body.appointment.motivo
    })
    if (new Date() > newAppointment.fecha) return res.status(200).json({ message: 'Las fecha ya ha pasado.' })
    const schedule = await Agenda.findById(req.body.appointment.agenda._id).populate('citasPrevias')
    let solapa = false
    schedule.citasPrevias.every((a) => {
      const timeAppointment = a.tipoVisita === 'Presencial 30min' || a.tipoVisita === 'Domicilio' ? 30 : 15
      const maxTime = new Date(a.fecha)
      maxTime.setMinutes(maxTime.getMinutes() + timeAppointment)
      if (newAppointment.fecha >= a.fecha && newAppointment.fecha < maxTime) {
        solapa = true
        return false
      }
      return true
    })
    if (solapa) return res.status(200).json({ message: 'Las fechas se solapan.' })
    solapa = false
    req.body.appointment.trabajador.turnos.every(t => {
      if (t.horaInicio < newAppointment.fecha.toISOString() && t.horaFinal > newAppointment.fecha.toISOString()) {
        solapa = true
        return false
      }
      return true
    })
    if (!solapa) return res.status(200).json({ message: 'El trabajador no tiene ese turno asignado' })
    const appointment = await newAppointment.save()
    await Agenda.findByIdAndUpdate({ _id: req.body.appointment.agenda._id }, { $push: { citasPrevias: appointment } })
    await Paciente.findByIdAndUpdate({ _id: req.body.appointment.paciente }, { $push: { citasPrevias: appointment } })
    res.status(200).json(newAppointment)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const deleteAppointment = async (req, res, next) => {
  try {
    const response = await CitaPrevia.findByIdAndDelete(req.params.id)
    await Agenda.findByIdAndUpdate(req.body.agenda, { $pull: { citasPrevias: req.params.id } })
    await Paciente.findByIdAndUpdate(req.body.paciente, { $pull: { citasPrevias: req.params.id } })
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const deleteUrgAppointment = async (req, res, next) => {
  try {
    const response = await VisitaUrgencias.findByIdAndDelete(req.params.id)
    await Agenda.findByIdAndUpdate(req.body.agenda, { $pull: { visitasUrgencia: req.params.id } })
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
