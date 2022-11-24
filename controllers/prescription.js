import Med from '../models/Medicamento.js'
import Prescripcion from '../models/Prescripcion.js'
import Patient from '../models/Paciente.js'
import Diagnostico from '../models/Diagnostico.js'

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
      insFarmacia: req.body.insFarmacia
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
    const newPrescription = new Prescripcion({
      paciente: req.body.paciente,
      fechaInicio: req.body.fechaInicio,
      fechaFinal: req.body.fechaFinal,
      instrucciones: req.body.instrucciones,
      trabajador: req.body.trabajador,
      nombreMedicamento: req.body.nombreMedicamento,
      principioActivo: req.body.principioActivo,
      frecuencia: req.body.frecuencia,
      duracion: req.body.duracion
    })
    const prescription = await newPrescription.save()
    await Patient.updateOne({ _id: req.body.patient }, { $push: { prescripciones: prescription._id } })
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
