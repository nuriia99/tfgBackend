import Worker from '../models/Trabajador.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { handleError } from '../utils/errors.js'

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
      eleccionMedicamento: req.body.eleccionMedicamento
    })
    await newWorker.save()

    // create a token
    const token = createToken(newWorker.id)

    res.status(200).json({ newWorker, token })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  const username = req.body.username
  try {
    const worker = await Worker.findOne({ username })
    if (!worker) return next(handleError(404, 'That user does not exists!'))
    const passwordCorrect = await bcrypt.compare(req.body.password, worker.password)
    if (!passwordCorrect) return next(handleError(400, 'The password or the username is incorrect!'))

    const token = createToken(worker.id)

    const { password, ...workerData } = worker._doc
    res.status(200).json({ workerData, token })
  } catch (error) {
    next(error)
  }
}
