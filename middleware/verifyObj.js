import Patient from '../models/Paciente.js'
import Objetivo from '../models/Objetivo.js'

export const refreshObj = async (obj, patientId) => {
  const pacientesTotales = obj.pacientesTotales
  const pacientesCompletados = obj.pacientesCompletados
  const edad = obj.edad.split('-')
  const patient = await Patient.findById(patientId).select('edad entradas prescripciones').populate('entradas prescripciones')
  if (patient.edad > edad[0] && patient.edad < edad[1]) {
    if (!pacientesTotales.includes(patient._id)) pacientesTotales.push(patient._id)
    const matchPres = patient.prescripciones.filter((x) => {
      const currentDate = new Date()
      if ((new Date(x.fechaFinal).getTime() > currentDate.getTime()) === false) {
        return false
      }
      return obj.medicamentos.includes(x.principioActivo)
    })
    if (matchPres.length > 0) {
      if (!pacientesCompletados.includes(patient._id)) pacientesCompletados.push(patient._id)
    }
  }
  const d = new Date()
  const month = d.getMonth()
  obj.months[month] = pacientesCompletados.length
  const newGoal = {
    pacientesTotales,
    pacientesCompletados,
    months: obj.months
  }
  await Objetivo.findByIdAndUpdate(obj._id, newGoal)
}

export const deletePatientObj = async (obj, patientId) => {
  const pacientesTotales = obj.pacientesTotales
  const pacientesCompletados = obj.pacientesCompletados
  const patient = await Patient.findById(patientId).select('edad entradas prescripciones').populate('entradas prescripciones')
  const arr = []
  patient.entradas.every((entry) => {
    const arr2 = entry.notas.filter((x) => {
      return x.diagnostico.toString() === obj.diagnostico.toString()
    })
    if (arr2.length > 0) {
      arr.push(arr2)
      return false
    }
    return true
  })
  const matchPres = patient.prescripciones.filter((x) => {
    return obj.medicamentos.includes(x.principioActivo)
  })
  if (matchPres.length === 0) {
    pacientesCompletados.pull(patient._id)
  }
  if (arr.length === 0) {
    pacientesCompletados.pull(patient._id)
    pacientesTotales.pull(patient._id)
  }
  const d = new Date()
  const month = d.getMonth()
  obj.months[month] = pacientesCompletados.length
  const newGoal = {
    pacientesTotales,
    pacientesCompletados,
    months: obj.months
  }
  await Objetivo.findByIdAndUpdate(obj._id, newGoal)
}
