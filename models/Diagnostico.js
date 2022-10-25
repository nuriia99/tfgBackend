import mongoose from 'mongoose'

const DiagnosticoSchema = new mongoose.Schema({
  cie: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  severidad: {
    type: String,
    required: true
  },
  informes: {
    type: [String]
  },
  entradas: {
    type: [String]
  },
  pacientes: {
    type: [String]
  }
})

export default mongoose.model('Diagnostico', DiagnosticoSchema)
