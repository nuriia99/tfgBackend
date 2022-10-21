import mongoose from 'mongoose'

const DiagnosticoSchema = new mongoose.Schema({
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
