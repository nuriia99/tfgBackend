import Worker from '../models/Trabajador.js'
import Medicamento from '../models/Medicamento.js'

export const getWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find()
    res.status(200).json(workers)
  } catch (error) {
    next(error)
  }
}

export const getWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id)
    res.status(200).json(worker)
  } catch (error) {
    next(error)
  }
}

export const updateWorker = async (req, res, next) => {
  try {
    const newWorker = req.body
    await Worker.findByIdAndUpdate(req.params.id, newWorker)
    res.status(200).json('update correctly')
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getRecs = async (req, res, next) => {
  try {
    const allElecs = await Worker.findById(req.params.id).select('eleccionMedicamento').populate({
      path: 'eleccionMedicamento.medicamento',
      module: Medicamento
    })
    const elecs = []
    allElecs.eleccionMedicamento.forEach((elec) => {
      if (elec.diagnostico.toString() === req.params.diagnosis) {
        elecs.push(elec)
      }
    })
    elecs.sort((a, b) => (a.fechas.length >= b.fechas.length) ? 1 : ((a.fechas.length < b.fechas.length) ? -1 : 0))
    const slicedElecs = elecs.slice(0, 4)
    res.status(200).json(slicedElecs)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const updateLenguage = async (req, res, next) => {
  try {
    const response = await Worker.updateOne({ _id: req.user.id }, { $set: { lenguaje: req.body.newLenguage } })
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
