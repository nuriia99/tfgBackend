import mongoose, { Schema } from 'mongoose'

const VisitaUrgenciasSchema = new mongoose.Schema({
  paciente: { type: Schema.ObjectId, ref: 'Paciente', required: true },
  centro: { type: String, required: true },
  agenda: { type: Schema.ObjectId, ref: 'Agenda', required: true },
  fechaEntrada: { type: Date, require: true },
  fechaAsistencia: { type: Date },
  fechaSalida: { type: Date },
  triaje: { type: Number, require: true },
  comentario: String
})

export default mongoose.model('VisitaUrgencias', VisitaUrgenciasSchema)
