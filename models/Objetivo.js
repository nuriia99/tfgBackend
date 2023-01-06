import mongoose, { Schema } from 'mongoose'

const ObjetivoSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  codigo: { type: String, required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  definicion: { type: String, required: true },
  objetivo: { type: Number, required: true },
  pacientesTotales: [{ type: Schema.ObjectId, ref: 'Paciente' }],
  pacientesCompletados: [{ type: Schema.ObjectId, ref: 'Paciente' }],
  puntosTotales: { type: Number, required: true },
  diagnostico: { type: Schema.ObjectId, ref: 'Diagnostico', required: true },
  medicamentos: [{ type: String, required: true }],
  edad: { type: String, required: true },
  months: [{ type: Number, required: true }]
})

export default mongoose.model('Objetivo', ObjetivoSchema)
