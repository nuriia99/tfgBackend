import Med from '../models/Medicamento.js'
import Prescripcion from '../models/Prescripcion.js'
import Patient from '../models/Paciente.js'
import Diagnostico from '../models/Diagnostico.js'
import Trabajador from '../models/Trabajador.js'
import Objetivo from '../models/Objetivo.js'
import { refreshObj, deletePatientObj } from '../middleware/verifyObj.js'

export const searchMed = async (req, res, next) => {
  try {
    const role = req.query.role
    const name = req.query.name || ''
    let meds
    if (role === 'Enfermeria') {
      meds = await Med
        .find({
          $and: [{ recetaEnfPermitida: true },
            {
              $or: [
                { nombre: { $regex: name, $options: 'i' } },
                { principioActivo: { $regex: name, $options: 'i' } }
              ]
            }
          ]
        })
        .sort({ nombre: 1 })
    } else {
      meds = await Med
        .find({
          $or: [
            { nombre: { $regex: name, $options: 'i' } },
            { principioActivo: { $regex: name, $options: 'i' } }
          ]
        })
        .sort({ nombre: 1 })
    }
    res.status(200).json(meds)
  } catch (error) {
    console.log(error)
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
    res.status(201).json(newMed)
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
    await Patient.updateOne({ _id: newPres.paciente }, { $push: { prescripciones: prescription._id } })
    const worker = await Trabajador.findOne({ _id: newPrescription.trabajador }).select('eleccionMedicamento centros').populate(
      {
        path: 'centros.objetivos',
        module: Objetivo
      }
    )
    if (req.body.diagnostico) {
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
    }

    const objs = []
    worker.centros.every((c) => {
      if (c.nombre === req.body.centre) {
        c.objetivos.forEach((obj) => {
          if (obj.medicamentos.includes(newPres.principioActivo)) {
            objs.push(obj)
          }
        })
        return false
      }
      return true
    })
    if (objs.length > 0) {
      objs.forEach(obj => {
        refreshObj(obj, newPres.paciente)
      })
    }
    res.status(201).json(newPrescription)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const updatePrescription = async (req, res, next) => {
  try {
    const newPrescription = req.body.newPrescription
    const pres = await Prescripcion.findByIdAndUpdate(req.params.id, newPrescription)
    const objs = []
    const removedObjs = []
    const worker = await Trabajador.findById(newPrescription.trabajador).select('centros').populate(
      {
        path: 'centros.objetivos',
        module: Objetivo
      }
    )
    worker.centros.every((c) => {
      if (c.nombre === req.body.centre) {
        c.objetivos.forEach((obj) => {
          if (obj.medicamentos.includes(req.body.removedPrincipioActivo)) {
            removedObjs.push(obj)
          }
          if (obj.medicamentos.includes(newPrescription.principioActivo)) {
            objs.push(obj)
          }
        })
        return false
      }
      return true
    })
    if (removedObjs.length > 0) {
      removedObjs.forEach(obj => {
        deletePatientObj(obj, newPrescription.paciente)
      })
    }
    if (objs.length > 0) {
      objs.forEach(obj => {
        refreshObj(obj, newPrescription.paciente)
      })
    }
    res.status(200).json(pres)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const deletePrescription = async (req, res, next) => {
  try {
    await Prescripcion.findByIdAndDelete(req.params.id)
    const response = await Patient.updateOne({ _id: req.body.patient }, { $pull: { prescripciones: req.params.id } })
    const removedObjs = []
    const worker = await Trabajador.findById(req.body.worker).select('centros').populate(
      {
        path: 'centros.objetivos',
        module: Objetivo
      }
    )
    worker.centros.every((c) => {
      if (c.nombre === req.body.centre) {
        c.objetivos.forEach((obj) => {
          if (obj.medicamentos.includes(req.body.removedPrincipioActivo)) {
            removedObjs.push(obj)
          }
        })
        return false
      }
      return true
    })
    if (removedObjs.length > 0) {
      removedObjs.forEach(obj => {
        deletePatientObj(obj, req.body.patient)
      })
    }
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
