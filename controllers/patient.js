import Patient from '../models/Paciente.js'

export const createPatient = async (req, res, next) => {
  try {
    const newPatient = new Patient({
      nombre: req.body.nombre,
      apellido1: req.body.apellido1,
      apellido2: req.body.apellido2,
      dni: req.body.dni,
      correo: req.body.correo,
      telefono: req.body.telefono,
      cip: req.body.cip,
      fechaNacimiento: req.body.fechaNacimiento,
      edad: req.body.edad,
      sexo: req.body.sexo,
      genero: req.body.genero,
      paisOrigen: req.body.paisOrigen,
      direccion: req.body.direccion,
      alergias: req.body.alergias,
      trabajadoresAsignados: req.body.trabajadoresAsignados,
      inteligenciaActiva: req.body.inteligenciaActiva,
      documentos: req.body.documentos,
      informes: req.body.informes,
      diagnosticos: req.body.diagnosticos,
      prescripciones: req.body.prescripciones
    })
    await newPatient.save()
    res.status(200).json(newPatient)
  } catch (error) {
    next(error)
  }
}

export const getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
    res.status(200).json(patient)
  } catch (error) {
    next(error)
  }
}
