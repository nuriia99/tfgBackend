import mongoose, { Schema } from 'mongoose'

const InformeSchema = new mongoose.Schema({
  horaEntrada: { type: Date, required: true },
  horaSalida: { type: Date, required: true },
  horaAsistencia: { type: Date, required: true },
  tipoVisita: { type: String, required: true },
  procedencia: { type: String, required: true },
  iniciativa: { type: String, required: true },
  medioLlegada: { type: String, required: true },
  descMotivo: { type: String, required: true },
  exploracion: { type: String, required: true },
  evaluacion: { type: String, required: true },
  lenguaje: { type: String, required: true },
  documento: { type: String, required: true },
  paciente: { type: Schema.ObjectId, ref: 'Paciente' },
  trabajadores: [{ type: Schema.ObjectId, ref: 'Trabajador' }],
  diagnoticos: [{ type: Schema.ObjectId, ref: 'Diagnostico' }]
})

export default mongoose.model('Informe', InformeSchema)
