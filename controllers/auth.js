import Worker from '../models/Trabajador.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { handleError } from '../middleware/handleErrors.js'
import Agenda from '../models/Agenda.js'

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)
    const newWorker = new Worker({
      nombre: req.body.nombre,
      apellido1: req.body.apellido1,
      apellido2: req.body.apellido2,
      dni: req.body.dni,
      correo: req.body.correo,
      telefono: req.body.telefono,
      username: req.body.username,
      password: hash,
      esDoctor: req.body.esDoctor,
      numColegiado: req.body.numColegiado,
      lenguaje: req.body.lenguaje,
      pacientes: req.body.pacientes,
      especialidades: req.body.especialidades,
      centros: req.body.centros,
      turnos: req.body.turnos,
      citasPrevias: req.body.citasPrevias,
      visitasUrgencias: req.body.visitasUrgencias,
      informes: req.body.informes,
      entradas: req.body.entardas,
      eleccionMedicamento: req.body.eleccionMedicamento
    })
    await newWorker.save()

    res.status(200).json({ newWorker })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  const username = req.body.username
  try {
    const worker = await Worker.findOne({ username }).populate({
      path: 'centros',
      populate: [
        {
          path: 'agenda',
          module: Agenda
        }
      ]
    })
    if (!worker) return next(handleError(404, 'That user does not exists!'))
    const passwordCorrect = await bcrypt.compare(req.body.password, worker.password)
    if (!passwordCorrect) return next(handleError(400, 'The password or the username is incorrect!'))
    const token = createToken(worker.id)
    const shift = worker.turnos.filter((t) => {
      const currentDate = new Date()
      const begin = new Date(t.horaInicio)
      const end = new Date(t.horaFinal)
      return begin < currentDate && currentDate < end
    })

    const centros = worker._doc.centros.map(centro => centro.nombre)

    const workerData = {
      _id: worker._doc._id,
      nombre: worker._doc.nombre + ' ' + worker._doc.apellido1 + ' ' + worker._doc.apellido2,
      username: worker._doc.username,
      dni: worker._doc.dni,
      correo: worker._doc.correo,
      telefono: worker._doc.telefono,
      numColegiado: worker._doc.numColegiado,
      lenguaje: worker._doc.lenguaje,
      turno: shift[0],
      turnos: worker._doc.turnos,
      especialidades: worker._doc.especialidades,
      centros,
      centrosInfo: worker._doc.centros
    }
    res.status(200).json({ workerData, token })
  } catch (error) {
    next(error)
  }
}

export const redirectLogin = async (req, res, next) => {
  try {
    res.status(200)
  } catch (error) {
    next(error)
  }
}
