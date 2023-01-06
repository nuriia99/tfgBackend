import mongoose, { Schema } from 'mongoose'

const CitaPreviaSchema = new mongoose.Schema({
  paciente: { type: Schema.ObjectId, ref: 'Paciente', required: true },
  trabajador: { type: Schema.ObjectId, ref: 'Trabajador' },
  agenda: { type: Schema.ObjectId, ref: 'Agenda', required: true },
  tipoVisita: { type: String, required: true },
  centro: { type: String, required: true },
  fecha: { type: Date, required: true },
  especialidad: { type: String, required: true },
  motivo: { type: String }
})

export default mongoose.model('CitaPrevia', CitaPreviaSchema)

// horaEntrada: { type: Date, required: true },
//   horaSalida: { type: Date, required: true },
//   horaAsistencia: { type: Date, required: true },
//   tipoVisita: { type: String, required: true },
//   procedencia: { type: String, required: true },
//   iniciativa: { type: String, required: true },
//   medioLlegada: { type: String, required: true },
//   descMotivo: { type: String, required: true },
//   exploracion: { type: String, required: true },
//   evaluacion: { type: String, required: true },
//   lenguaje: { type: String, required: true },
//   documento: { type: String, required: true },
//   paciente: { type: Schema.ObjectId, ref: 'Paciente' },
//   trabajadores: [{ type: Schema.ObjectId, ref: 'Trabajador' }],
//   diagnoticos: [{ type: Schema.ObjectId, ref: 'Diagnostico' }]
