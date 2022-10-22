import Worker from '../models/Trabajador.js'
import bcrypt from 'bcrypt'
import { handleError } from '../utils/errors.js'
import jwt from 'jsonwebtoken'

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
      pacientes: req.body.pacientes,
      centros: req.body.centros,
      citasPrevias: req.body.citasPrevias,
      visitasUrgencias: req.body.visitasUrgencias,
      informes: req.body.informes,
      eleccionMedicamento: req.body.eleccionMedicamento
    })
    await newWorker.save()
    res.status(200).json(newWorker)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const loginWorker = await Worker.findOne({ username: req.body.username })
    if (!loginWorker) return next(handleError(404, 'That worker does not exists!'))
    const passwordCorrect = await bcrypt.compare(req.body.password, loginWorker.password)
    if (!passwordCorrect) return next(handleError(400, 'The password or the username is incorrect!'))

    const token = jwt.sign({ id: loginWorker._doc._id }, process.env.JWT)

    const { password, ...otherDetails } = loginWorker._doc
    res.cookie('access_token', token, {
      httpOnly: true
    }).status(200).json(otherDetails)
  } catch (error) {
    next(error)
  }
}
