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
      diagnosticos: req.body.diagnosticos,
      prescripciones: req.body.prescripciones
    })
    await newPatient.save()
    console.log(newPatient)
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
      alergias: patient.alergias,
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
    const entries = Object.entries(ai)
    const aiArray = []
    let row = []
    row.push('-')
    for (const date of dates) {
      const d = new Date(JSON.parse(date))
      let day = d.getDay()
      if (day < 10) day = '0' + day
      let month = d.getMonth()
      if (month < 10) month = '0' + month
      row.push(day + '/' + month + '/' + d.getFullYear())
    }
    aiArray.push(row)
    row = []
    entries.forEach((item) => {
      item.forEach((item2) => {
        if (typeof item2 === 'string') {
          row.push(_.startCase(item2))
        } else {
          let hasValue = false
          item2.forEach(item3 => {
            hasValue = true
            for (const date of dates) {
              if (date === JSON.stringify(item3.date)) {
                row.push(item3.value)
              } else {
                row.push('-')
              }
            }
          })
          if (!hasValue) {
            for (let i = 0; i <= dates.size; i++) {
              row.push('-')
            }
          }
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
