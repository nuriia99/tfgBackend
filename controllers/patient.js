import Patient from '../models/Paciente.js'
import Diagnostico from '../models/Diagnostico.js'
import Trabajador from '../models/Trabajador.js'
import _ from 'lodash'
import { handleError } from '../middleware/handleErrors.js'

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
    // console.log(newPatient)
    await newPatient.save()
    res.status(200).json(newPatient)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const updatePatient = async (req, res, next) => {
  try {
    const newPatient = req.body
    await Patient.findByIdAndUpdate(req.params.id, newPatient)
    res.status(200).json('update correctly')
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('prescripciones').populate({
      path: 'entradas',
      populate: [
        {
          path: 'notas.diagnostico',
          module: Diagnostico
        },
        {
          path: 'trabajador.id',
          module: Trabajador
        }
      ]
    })
    if (patient === null) next(handleError(404))
    res.status(200).json(patient)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const searchPatient = async (req, res, next) => {
  try {
    const nombre = req.query.nombre?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() || ''
    const apellido1 = req.query.apellido1?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() || ''
    const apellido2 = req.query.apellido2?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() || ''
    let sex = req.query.sexo || ''
    const dni = req.query.dni?.toLowerCase() || ''
    const cip = req.query.cip?.toLowerCase() || ''
    if (sex === 'all') sex = ''
    const patients = await Patient.find().select('nombre apellido1 apellido2 sexo dni cip edad direccion telefono')
    const filterPatients = patients.filter((patient) => {
      return patient.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(nombre) && patient.apellido1.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(apellido1) && patient.apellido2.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(apellido2) && patient.sexo.includes(sex) && patient.dni.toLowerCase().includes(dni) && patient.cip.toLowerCase().includes(cip)
    })
    filterPatients.sort((a, b) => {
      return (a.apellido1 < b.apellido1 ? -1 : 1) || (a.apellido2 < b.apellido2 ? -1 : 1) || (a.nombre < b.nombre ? -1 : 1)
    })
    res.status(200).json(filterPatients)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getActiveIntelligence = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
    if (patient === null) throw handleError(404, 'The user does not exists.')
    const ai = patient.inteligenciaActiva
    const dates = new Set()
    ai.forEach((item) => {
      item.values.forEach((item2) => {
        dates.add(JSON.stringify(item2.date))
      })
    })
    const sortedDates = Array.from(dates).sort()
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
    row.push('lastValues')
    aiArray.push(row)
    ai.forEach((item) => {
      row = []
      let lastValue = '-'
      row.push(_.startCase(item.name))
      for (let i = 0; i < sortedDates.length; i++) {
        row.push('-')
      }
      item.values.forEach((item2) => {
        const indice = sortedDates.indexOf(JSON.stringify(item2.date))
        row[indice + 1] = item2.value
        lastValue = item2.value
      })
      row.push(lastValue)
      aiArray.push(row)
    })
    res.status(200).json(aiArray)
  } catch (error) {
    next(error)
  }
}

export const deleteDocument = async (req, res, next) => {
  try {
    const response = await Patient.updateOne({ _id: req.params.id }, { $pull: { documentos: { _id: req.params.idDoc } } })
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const uploadReport = async (req, res, next) => {
  try {
    let currentDay = new Date()
    currentDay = currentDay.getTime()
    const doc = {
      nombre: 'Informe ' + req.body.report.center,
      pdfUrl: JSON.stringify(req.body.report),
      fechaSubida: new Date(currentDay)
    }
    await Patient.updateOne({ _id: req.body.report.paciente }, { $push: { documentos: doc } })
    res.status(200).json('upload')
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const downloadReport = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.query.patient).select('documentos')
    let doc
    patient.documentos.every(d => {
      if (d._id.toString() === req.query.document) {
        doc = d
        return false
      }
      return true
    })
    res.status(200).json(doc)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
