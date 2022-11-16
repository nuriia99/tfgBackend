import mongoose from 'mongoose'

const ObjetivoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipo: { type: String, required: true },
  numPaciententesTotal: { type: Number, required: true },
  numPacientesCompletados: { type: Number, required: true }
})

export default mongoose.model('Objetivo', ObjetivoSchema)
