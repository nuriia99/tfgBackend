import Patient from '../models/Paciente.js'
import _ from 'lodash'

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
      entradas: req.body.entradas,
      diagnosticos: req.body.diagnosticos,
      prescripciones: req.body.prescripciones
    })
    await newPatient.save()
    res.status(200).json(newPatient)
  } catch (error) {
    next(error)
  }
}

export const updatePatient = async (req, res, next) => {
  try {
    await Patient.deleteOne({ _id: req.params.id })
    const newPatient = new Patient({
      _id: req.params.id,
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
      trabajadoresAsignados: req.body.trabajadoresAsignados,
      inteligenciaActiva: req.body.inteligenciaActiva,
      documentos: req.body.documentos,
      informes: req.body.informes,
      entradas: req.body.entradas,
      diagnosticos: req.body.diagnosticos,
      prescripciones: req.body.prescripciones
    })
    await newPatient.save()
    res.status(200).json('update correctly')
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

export const searchPatient = async (req, res, next) => {
  try {
    const nombre = req.query.nombre || ''
    const apellido1 = req.query.apellido1 || ''
    const apellido2 = req.query.apellido2 || ''
    const sex = req.query.sexo || ''
    const dni = req.query.dni || ''
    const cip = req.query.cip || ''

    const patients = await Patient
      .find({
        nombre: { $regex: nombre, $options: 'i' },
        apellido1: { $regex: apellido1, $options: 'i' },
        apellido2: { $regex: apellido2, $options: 'i' },
        sexo: { $regex: sex, $options: 'i' },
        dni: { $regex: dni, $options: 'i' },
        cip: { $regex: cip, $options: 'i' }
      })
      .sort({ apellido1: 1, apellido2: 1, nombre: 1 })

    res.status(200).json(patients)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getActiveIntelligence = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
    const ai = {
      tabaquismo: patient.inteligenciaActiva.tabaquismo,
      actividadFisica: patient.inteligenciaActiva.actividadFisica,
      valoracionPacientesCronicos: patient.inteligenciaActiva.valoracionPacientesCronicos,
      frecuenciaCardiaca: patient.inteligenciaActiva.frecuenciaCardiaca,
      peso: patient.inteligenciaActiva.peso,
      estatura: patient.inteligenciaActiva.estatura,
      colesterolTotal: patient.inteligenciaActiva.colesterolTotal,
      alergias: patient.inteligenciaActiva.alergias,
      alcohol: patient.inteligenciaActiva.alcohol,
      drogas: patient.inteligenciaActiva.drogas
    }
    const dates = new Set()
    const values = Object.values(ai)
    values.forEach((item) => {
      item.forEach((item2) => {
        dates.add(JSON.stringify(item2.date))
      })
    })
    const sortedDates = Array.from(dates).sort()
    const entries = Object.entries(ai)
    const aiArray = []
    let row = []
    row.push('-')
    for (const date of sortedDates) {
      const d = new Date(JSON.parse(date))
      let day = d.getDate()
      if (day < 10) day = '0' + day
      let month = d.getMonth() + 1
      if (month < 10) month = '0' + month
      row.push(day + '/' + month + '/' + d.getFullYear())
    }
    aiArray.push(row)
    row = []
    entries.forEach((item) => {
      item.forEach((item2) => {
        if (typeof item2 === 'string') {
          row.push(_.startCase(item2))
          for (let i = 0; i < sortedDates.length; i++) {
            row.push('-')
          }
        } else {
          item2.forEach(item3 => {
            const indice = sortedDates.indexOf(JSON.stringify(item3.date))
            row[indice + 1] = item3.value
          })
        }
      })
      aiArray.push(row)
      row = []
    })
    res.status(200).json(aiArray)
  } catch (error) {
    next(error)
  }
}
