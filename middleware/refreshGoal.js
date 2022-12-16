import Patient from '../models/Paciente.js'
import Objetivo from '../models/Objetivo.js'

export const refreshObj = async (obj, patientId) => {
  const pacientesTotales = []
  const pacientesCompletados = []
  const edad = obj.edad.split('-')
  const patient = await Patient.findById(patientId).select('edad entradas prescripciones').populate('entradas prescripciones')
  if (patient.edad > edad[0] && patient.edad < edad[1]) {
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
    if (arr.length > 0) {
      pacientesTotales.push(patient._id)
      const matchPres = patient.prescripciones.filter((x) => {
        return obj.medicamentos.includes(x.principioActivo)
      })
      if (matchPres.length > 0) pacientesCompletados.push(patient._id)
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
