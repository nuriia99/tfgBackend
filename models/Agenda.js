import mongoose, { Schema } from 'mongoose'

const AgendaSchema = new mongoose.Schema({
  centro: { type: String, required: true },
  trabajador: { type: Schema.ObjectId, ref: 'Trabajador' },
  nombre: { type: String, required: true },
  citasPrevias: [{ type: Schema.ObjectId, ref: 'CitaPrevia' }],
  visitasUrgencia: [{ type: Schema.ObjectId, ref: 'VisitaUrgencia' }]
})

export default mongoose.model('Agenda', AgendaSchema)
