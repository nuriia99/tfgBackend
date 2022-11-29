import Med from '../models/Medicamento.js'
import Prescripcion from '../models/Prescripcion.js'
import Patient from '../models/Paciente.js'
import Diagnostico from '../models/Diagnostico.js'
import Trabajador from '../models/Trabajador.js'

export const searchMed = async (req, res, next) => {
  try {
    const name = req.query.name || ''
    const meds = await Med
      .find({
        nombre: { $regex: name, $options: 'i' }
      })
      .sort({ nombre: 1 })
    res.status(200).json(meds)
  } catch (error) {
    next(error)
  }
}

export const searchDiagnosis = async (req, res, next) => {
  try {
    const name = req.query.name || ''
    const diagnosis = await Diagnostico
      .find({
        nombre: { $regex: name, $options: 'i' }
      })
      .sort({ nombre: 1 })
    res.status(200).json(diagnosis)
  } catch (error) {
    next(error)
  }
}

export const createMed = async (req, res, next) => {
  try {
    const newMed = new Med({
      nombre: req.body.nombre,
      principioActivo: req.body.principioActivo,
      marca: req.body.marca,
      numComprimidos: req.body.numComprimidos,
      recetaEnfPermitida: req.body.recetaEnfPermitida,
      insPaciente: req.body.insPaciente,
      insFarmacia: req.body.insFarmacia,
      unidad: req.body.unidad,
      frecuencia: req.body.frecuencia,
      duracion: req.body.duracion
    })
    await newMed.save()
    res.status(200).json(newMed)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const createPrescription = async (req, res, next) => {
  try {
    const newPres = req.body.newPrescription
    const newPrescription = new Prescripcion({
      paciente: newPres.paciente,
      fechaInicio: newPres.fechaInicio,
      fechaFinal: newPres.fechaFinal,
      instruccionesPaciente: newPres.instruccionesPaciente,
      instruccionesFarmacia: newPres.instruccionesFarmacia,
      trabajador: newPres.trabajador,
      nombreMedicamento: newPres.nombreMedicamento,
      principioActivo: newPres.principioActivo,
      frecuencia: newPres.frecuencia,
      duracion: newPres.duracion
    })
    const prescription = await newPrescription.save()
    const pat = await Patient.updateOne(req.body.patient, { $push: { prescripciones: prescription._id } })
    console.log(pat)
    const worker = await Trabajador.findOne({ _id: newPrescription.trabajador }).select('eleccionMedicamento')
    let find = false
    worker.eleccionMedicamento.every((eleccion) => {
      if (eleccion.diagnostico.toString() === req.body.diagnostico._id && eleccion.medicamento.toString() === req.body.newPrescription.idMed) {
        find = true
        const currentDate = new Date()
        eleccion.fechas.push(currentDate)
        return false
      }
      return true
    })
    if (!find) {
      const newEleccionMedicamento = {
        diagnostico: req.body.diagnostico._id,
        medicamento: req.body.newPrescription.idMed,
        fechas: [new Date()]
      }
      await Trabajador.updateOne({ _id: newPrescription.trabajador }, { $push: { eleccionMedicamento: newEleccionMedicamento } })
    } else await Trabajador.updateOne({ _id: newPrescription.trabajador }, { $set: { eleccionMedicamento: worker.eleccionMedicamento } })
    res.status(200).json(newPrescription)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const deletePrescription = async (req, res, next) => {
  try {
    await Prescripcion.findByIdAndDelete(req.params.id)
    const response = await Patient.updateOne(req.body.patient, { $pull: { prescripciones: req.params.id } })
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
