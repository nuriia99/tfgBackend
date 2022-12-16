import Entry from '../models/Entrada.js'
import Patient from '../models/Paciente.js'
import axios from 'axios'
import Diagnostico from '../models/Diagnostico.js'
import Objetivo from '../models/Objetivo.js'
import Trabajador from '../models/Trabajador.js'
import { refreshObj, deletePatientObj } from '../middleware/verifyObj.js'
import { handleError } from '../middleware/handleErrors.js'

export const createEntry = async (req, res, next) => {
  try {
    const newEntry = new Entry({
      paciente: req.body.newEntry.paciente,
      fecha: req.body.newEntry.fecha,
      notas: req.body.newEntry.notas,
      lenguaje: req.body.newEntry.lenguaje,
      trabajador: req.body.newEntry.trabajador
    })
    newEntry.notas.forEach((nota) => {
      nota.diagnostico = nota.diagnostico._id
      const prescripciones = []
      nota.prescripciones.forEach((prescription) => {
        if (prescription._id) prescripciones.push(prescription._id)
        else prescripciones.push(prescription)
      })
      nota.prescripciones = prescripciones
    })
    const entry = await newEntry.save()
    const centros = await Trabajador.findById(req.body.newEntry.trabajador.id).select('centros').populate({
      path: 'centros.objetivos',
      module: Objetivo
    })
    const objs = []
    centros.centros.every((c) => {
      if (c.nombre === req.body.centre) {
        c.objetivos.forEach((obj) => {
          if (obj.diagnostico.toString() === newEntry.notas[0].diagnostico.toString()) {
            objs.push(obj)
          }
        })
        return false
      }
      return true
    })
    if (objs.length > 0) {
      objs.forEach(obj => {
        refreshObj(obj, req.body.newEntry.paciente)
      })
    }
    await Patient.updateOne({ _id: req.body.newEntry.paciente }, { $push: { entradas: { $each: [entry._id], $position: 0 } } })
    res.status(200).json(entry)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const createNote = async (req, res, next) => {
  try {
    const newNote = req.body.newNote
    const entryId = newNote.entryId
    delete newNote.entryId
    newNote.diagnostico = newNote.diagnostico._id
    const prescripciones = []
    newNote.prescripciones.forEach((prescription) => {
      if (prescription._id) prescripciones.push(prescription._id)
      else prescripciones.push(prescription)
    })
    newNote.prescripciones = prescripciones
    const entry = await Entry.updateOne({ _id: entryId }, { $push: { notas: newNote } })
    const centros = await Trabajador.findById(req.body.worker).select('centros').populate({
      path: 'centros.objetivos',
      module: Objetivo
    })
    const objs = []
    centros.centros.every((c) => {
      if (c.nombre === req.body.centre) {
        c.objetivos.forEach((obj) => {
          if (obj.diagnostico.toString() === newNote.diagnostico.toString()) {
            objs.push(obj)
          }
        })
        return false
      }
      return true
    })
    if (objs.length > 0) {
      objs.forEach(obj => {
        refreshObj(obj, req.body.patient)
      })
    }
    res.status(200).json(entry)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const updateNote = async (req, res, next) => {
  try {
    const newNotes = req.body.newNotes
    const entryId = req.params.id
    newNotes.forEach((nota) => {
      nota.diagnostico = nota.diagnostico._id
      const prescripciones = []
      nota.prescripciones.forEach((prescription) => {
        if (prescription._id) prescripciones.push(prescription._id)
        else prescripciones.push(prescription)
      })
      nota.prescripciones = prescripciones
    })
    const entry = await Entry.updateOne({ _id: entryId }, { $set: { notas: newNotes } })
    const worker = await Trabajador.findById(req.body.worker).select('centros').populate(
      {
        path: 'centros.objetivos',
        module: Objetivo
      }
    )
    const objs = []
    const objsRemoved = []
    const diagnosticos = []
    newNotes.forEach((nota) => {
      diagnosticos.push(nota.diagnostico)
    })
    worker.centros.every((c) => {
      if (c.nombre === req.body.centre) {
        c.objetivos.forEach((obj) => {
          if (diagnosticos.includes(obj.diagnostico.toString())) {
            objs.push(obj)
          }
          if (obj.diagnostico.toString() === req.body.removedDiagnosis) {
            objsRemoved.push(obj)
          }
        })
        return false
      }
      return true
    })
    if (objsRemoved.length > 0) {
      objsRemoved.forEach(obj => {
        deletePatientObj(obj, req.body.patient)
      })
    }
    if (objs.length > 0) {
      objs.forEach(obj => {
        refreshObj(obj, req.body.patient)
      })
    }
    res.status(200).json(entry)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const deleteNote = async (req, res, next) => {
  try {
    const newNotes = req.body.newNotes
    const entryId = req.params.id
    if (newNotes.length === 0) {
      await Entry.findOneAndDelete({ _id: entryId })
      await Patient.updateOne({ _id: req.body.patient }, { $pull: { entradas: entryId } })
    } else {
      await Entry.updateOne({ _id: entryId }, { $set: { notas: newNotes } })
    }
    const worker = await Trabajador.findById(req.body.worker).select('centros').populate(
      {
        path: 'centros.objetivos',
        module: Objetivo
      }
    )
    const objsRemoved = []
    const diagnosticos = []
    newNotes.forEach((nota) => {
      diagnosticos.push(nota.diagnostico)
    })
    worker.centros.every((c) => {
      if (c.nombre === req.body.centre) {
        c.objetivos.forEach((obj) => {
          if (obj.diagnostico.toString() === req.body.removedDiagnosis) {
            objsRemoved.push(obj)
          }
        })
        return false
      }
      return true
    })
    if (objsRemoved.length > 0) {
      objsRemoved.forEach(obj => {
        deletePatientObj(obj, req.body.patient)
      })
    }
    res.status(200).json('Has been deleted.')
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const createDiagnosis = async (req, res, next) => {
  try {
    const newDiagnosis = new Diagnostico({
      nombre: req.body.nombre,
      severidad: req.body.severidad,
      informes: req.body.informes,
      entradas: req.body.entradas,
      pacientes: req.body.pacientes,
      palabrasClave: req.body.palabrasClave
    })
    await newDiagnosis.save()
    res.status(200).json(newDiagnosis)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id)
    if (entry === null) next(handleError(404))
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

export const translateEntry = async (req, res, next) => {
  try {
    const lengWorker = req.body.lengWorker
    const notes = req.body.notas
    let originalLenguage = 'es'
    let translationLenguage = 'ca'
    if (lengWorker === 'es') {
      originalLenguage = 'ca'
      translationLenguage = 'es'
    }
    const newNotes = await Promise.all(
      notes.map(async (note) => {
        const newNote = { ...note }
        if (note.motivo !== '') {
          const motivo = await axios.get('https://api.mymemory.translated.net/get?q=' + note.motivo + '!&langpair=' + originalLenguage + '|' + translationLenguage + '&de=' + process.env.email)
          newNote.motivo = motivo.data.responseData.translatedText.substring(0, motivo.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        }
        if (note.descDiagnostico !== '') {
          const descDiagnostico = await axios.get('https://api.mymemory.translated.net/get?q=' + note.descDiagnostico + '!&langpair=' + originalLenguage + '|' + translationLenguage + '&de=' + process.env.email)
          newNote.descDiagnostico = descDiagnostico.data.responseData.translatedText.substring(0, descDiagnostico.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        }
        if (note.antecedentes !== '') {
          const antecedentes = await axios.get('https://api.mymemory.translated.net/get?q=' + note.antecedentes + '!&langpair=' + originalLenguage + '|' + translationLenguage + '&de=' + process.env.email)
          newNote.antecedentes = antecedentes.data.responseData.translatedText.substring(0, antecedentes.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        }
        if (note.clinica !== '') {
          const clinica = await axios.get('https://api.mymemory.translated.net/get?q=' + note.clinica + '!&langpair=' + originalLenguage + '|' + translationLenguage + '&de=' + process.env.email)
          newNote.clinica = clinica.data.responseData.translatedText.substring(0, clinica.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        }
        if (note.exploracion !== '') {
          const exploracion = await axios.get('https://api.mymemory.translated.net/get?q=' + note.exploracion + '!&langpair=' + originalLenguage + '|' + translationLenguage + '&de=' + process.env.email)
          newNote.exploracion = exploracion.data.responseData.translatedText.substring(0, exploracion.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        }
        if (note.pruebasComplementarias !== '') {
          const pruebasComplementarias = await axios.get('https://api.mymemory.translated.net/get?q=' + note.pruebasComplementarias + '!&langpair=' + originalLenguage + '|' + translationLenguage + '&de=' + process.env.email)
          newNote.pruebasComplementarias = pruebasComplementarias.data.responseData.translatedText.substring(0, pruebasComplementarias.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        }
        if (note.planTerapeutico !== '') {
          const planTerapeutico = await axios.get('https://api.mymemory.translated.net/get?q=' + note.planTerapeutico + '!&langpair=' + originalLenguage + '|' + translationLenguage + '&de=' + process.env.email)
          newNote.planTerapeutico = planTerapeutico.data.responseData.translatedText.substring(0, planTerapeutico.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        }
        return newNote
      })
    )
    res.status(200).json(newNotes)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const updateDiagnosis = async (req, res, next) => {
  try {
    const newDiagnosis = {
      nombre: req.body.nombre,
      severidad: req.body.severidad,
      informes: req.body.apellidinformeso2,
      entradas: req.body.entradas,
      pacientes: req.body.pacientes,
      palabrasClave: req.body.palabrasClave
    }
    await Diagnostico.findByIdAndUpdate(req.params.id, newDiagnosis)
    res.status(200).json('update correctly')
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getDiagnosisRec = async (req, res, next) => {
  try {
    // eslint-disable-next-line quotes
    const allWords = ["disnea", "tos", "tos seca", "fiebre", "febril", "dolor de cabeza", "ronchas", "piel", "picor", "inflamacion", "dificultad", "diarrea", "nauseas", "vomitos", "dolor", "fiebre", "pecho", "meareo", "fatiga", "debilidad", "aliento", "latidos", "apetito", "malestar", "picazón", "resequedad", "peso"]
    const clinicaWords = req.query.clinica.split(' ')
    const matchWords = []
    clinicaWords.forEach((word) => {
      if (allWords.includes(word)) matchWords.push(word)
    })
    const result = await Diagnostico.find({ palabrasClave: { $in: matchWords } })
    const docArray = result.map(function (Diagnostico) { return Diagnostico.toObject() })
    docArray.forEach((res) => {
      const count = res.palabrasClave.filter((x) => {
        return matchWords.includes(x)
      })
      res.count = count.length
    })
    docArray.sort((a, b) => {
      return b.count - a.count || b.pacientes.length - a.pacientes.length
    })
    const slicedResult = docArray.slice(0, 4)
    res.status(200).json(slicedResult)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
