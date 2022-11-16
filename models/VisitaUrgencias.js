import mongoose from 'mongoose'

const VisitaUrgenciasSchema = new mongoose.Schema({
  visitaUrgencia: [{
    paciente: { type: String, required: true },
    trabajadores: [{ type: String, requiered: true }],
    centro: { type: String, required: true },
    fecha: { type: Date, require: true },
    horaEntrada: { type: Date, require: true },
    horaAsistencia: { type: Date, require: true },
    horaSalida: { type: Date, require: true },
    tipoVisita: { type: String, required: true },
    motivo: { type: String, require: true },
    triaje: { type: Number, require: true },
    comentario: String
  }]
})

export default mongoose.model('VisitaUrgencias', VisitaUrgenciasSchema)
