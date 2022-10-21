import mongoose from 'mongoose'

const ObjetivoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    requiered: true
  },
  descripcion: {
    type: String,
    requiered: true
  },
  tipo: {
    type: String,
    requiered: true
  },
  numPaciententesTotal: {
    type: Number,
    requiered: true
  },
  numPacientesCompletados: {
    type: Number,
    requiered: true
  }

})

export default mongoose.model('Objetivo', ObjetivoSchema)
