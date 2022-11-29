import Entry from '../models/Entrada.js'
import Patient from '../models/Paciente.js'
import axios from 'axios'
import Diagnostico from '../models/Diagnostico.js'

export const createEntry = async (req, res, next) => {
  try {
    const newEntry = new Entry({
      paciente: req.body.paciente,
      fecha: req.body.fecha,
      notas: req.body.notas,
      lenguaje: req.body.lenguaje,
      trabajador: req.body.trabajador
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
    await Patient.updateOne({ _id: req.body.paciente }, { $push: { entradas: { $each: [entry._id], $position: 0 } } })
    res.status(200).json(entry)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const createNote = async (req, res, next) => {
  try {
    const newNote = req.body
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
    res.status(200).json(entry)
  } catch (error) {
    // console.log(error)
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
    console.log(entryId)
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
    console.log(req.body)
    const lengWorker = req.body.lengWorker
    const notes = req.body.notes
    let originalLenguage = 'es'
    let translationLenguage = 'ca'
    if (lengWorker === 'es') {
      originalLenguage = 'ca'
      translationLenguage = 'es'
    }
    const newNotes = await Promise.all(
      notes.map(async (note) => {
        const asunto = await axios.get('https://api.mymemory.translated.net/get?q=' + note.asunto + '!&langpair=' + originalLenguage + '|' + translationLenguage + '&de=' + process.env.email)
        const exploracion = await axios.get('https://api.mymemory.translated.net/get?q=' + note.exploracion + '!&langpair=' + originalLenguage + '|' + translationLenguage + '&de=' + process.env.email)
        const tratamiento = await axios.get('https://api.mymemory.translated.net/get?q=' + note.tratamiento + '!&langpair=' + originalLenguage + '|' + translationLenguage + '&de=' + process.env.email)

        const newNote = { ...note }
        newNote.asunto = asunto.data.responseData.translatedText.substring(0, asunto.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        newNote.exploracion = exploracion.data.responseData.translatedText.substring(0, exploracion.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        newNote.tratamiento = tratamiento.data.responseData.translatedText.substring(0, tratamiento.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
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
    const allWords = ["disnea", "tos", "tos seca", "fiebre", "febril", "dolor de cabeza", "ronchas", "piel", "picor", "inflamacion", "dificultad", "diarrea", "nauseas", "vomitos", "dolor", "fiebre", "pecho", "meareo", "fatiga", "debilidad", "aliento", "latidos"]
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
