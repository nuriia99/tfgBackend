import Entry from '../models/Entrada.js'

export const createEntry = async (req, res, next) => {
  try {
    const newEntry = new Entry({
      fecha: req.body.fecha,
      nota: req.body.nota,
      lenguaje: req.body.lenguaje,
      paciente: req.body.paciente,
      trabajador: req.body.trabajador
    })
    await newEntry.save()
    res.status(200).json(newEntry)
  } catch (error) {
    next(error)
  }
}

export const getEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id)
    res.status(200).json(entry)
  } catch (error) {
    next(error)
  }
}

export const getPatientEntries = async (req, res, next) => {
  try {
    const entries = await Entry.find({ paciente: req.params.id })
    res.status(200).json(entries)
  } catch (error) {
    next(error)
  }
}
