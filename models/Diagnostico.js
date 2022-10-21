import mongoose from 'mongoose'

const DiagnosticoSchema = new mongoose.Schema({
  cie: {
    type: String,
    require: true
  },
  nombre: {
    type: String,
    require: true
  },
  severidad: {
    type: String,
    require: true
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
