import mongoose from 'mongoose'

const EntradaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  asunto: {
    type: String,
    required: true
  },
  exploracion: {
    type: String,
    required: true
  },
  evaluacion: {
    type: String,
    required: true
  },
  paciente: {
    type: String,
    required: true
  },
  trabajadores: {
    type: [String],
    required: true
  },
  diagnosticos: {
    type: [String],
    required: true
  }

})

export default mongoose.model('Entrada', EntradaSchema)
