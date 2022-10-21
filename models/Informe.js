import mongoose from 'mongoose'

const InformeSchema = new mongoose.Schema({
  horaEntrada: {
    type: Date,
    required: true
  },
  horaSalida: {
    type: Date,
    required: true
  },
  horaAsistencia: {
    type: Date,
    required: true
  },
  motivo: {
    type: String,
    required: true
  },
  tipoVisita: {
    type: String,
    required: true
  },
  procedencia: {
    type: String,
    required: true
  },
  iniciativa: {
    type: String,
    required: true
  },
  medioLlegada: {
    type: String,
    required: true
  },
  descMotivo: {
    type: String,
    required: true
  },
  exploracion: {
    type: String,
    required: true
  }

})

export default mongoose.model('Informe', InformeSchema)
