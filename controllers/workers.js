import Worker from '../models/Trabajador.js'

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
