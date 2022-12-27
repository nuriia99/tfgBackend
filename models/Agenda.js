import mongoose, { Schema } from 'mongoose'

const AgendaSchema = new mongoose.Schema({
  centro: { type: String, required: true },
  trabajador: { type: Schema.ObjectId, ref: 'Trabajador' },
  especialidad: { type: String },
  nombre: { type: String, required: true },
  citasPrevias: [{ type: Schema.ObjectId, ref: 'CitaPrevia' }],
  visitasUrgencia: [{ type: Schema.ObjectId, ref: 'VisitaUrgencias' }]
})

export default mongoose.model('Agenda', AgendaSchema)
