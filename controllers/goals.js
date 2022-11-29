import Goal from '../models/Objetivo.js'
import Trabajador from '../models/Trabajador.js'
import Entrada from '../models/Entrada.js'
import Prescripcion from '../models/Prescripcion.js'

export const createGoal = async (req, res, next) => {
  try {
    const worker = await Trabajador.findById(req.body.trabajador).populate('pacientes').populate({
      path: 'pacientes',
      populate: [
        {
          path: 'entradas',
          module: Entrada
        },
        {
          path: 'prescripciones',
          module: Prescripcion
        }
      ]
    })
    const pacientesTotales = []
    const pacientesCompletados = []
    const edad = req.body.edad.split('-')
    worker.pacientes.forEach((patient) => {
      if (patient.edad > edad[0] && patient.edad < edad[1]) {
        const arr = []
        patient.entradas.every((entry) => {
          const arr2 = entry.notas.filter((x) => {
            return x.diagnostico.toString() === req.body.diagnostico
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
            return req.body.medicamentos.includes(x.principioActivo)
          })
          if (matchPres.length > 0) pacientesCompletados.push(patient._id)
        }
      }
    })
    const newGoal = new Goal({
      tipo: req.body.tipo,
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      objetivo: req.body.objetivo,
      pacientesTotales,
      pacientesCompletados,
      puntosTotales: req.body.puntosTotales,
      diagnostico: req.body.diagnostico,
      medicamentos: req.body.medicamentos,
      edad: req.body.edad
    })
    const goal = await newGoal.save()
    const centros = [...worker.centros]
    centros.every((centro) => {
      if (centro.nombre === req.body.centro) {
        centro.objetivos.push(goal)
        return true
      }
      return true
    })
    await Trabajador.updateOne({ _id: req.body.trabajador }, { $set: { centros } })
    res.status(200).json(goal)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getGoal = async (req, res, next) => {
  try {
    const worker = await Trabajador.findById(req.params.id).select('centros').populate({
      path: 'centros',
      populate: [
        {
          path: 'objetivos',
          module: Goal
        }
      ]
    })
    let objetivos
    worker.centros.every((centro) => {
      if (centro.nombre === req.body.centro) {
        objetivos = centro.objetivos
        return true
      }
      return true
    })
    res.status(200).json(objetivos)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
