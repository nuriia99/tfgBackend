import Entry from '../models/Entrada.js'
import axios from 'axios'

export const createEntry = async (req, res, next) => {
  try {
    const newEntry = new Entry({
      fecha: req.body.fecha,
      notas: req.body.notas,
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
