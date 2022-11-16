import mongoose from 'mongoose'

const DiagnosticoSchema = new mongoose.Schema({
  cie: { type: String, required: true },
  nombre: { type: String, required: true },
  severidad: { type: String, required: true },
  informes: [String],
  entradas: [String],
  pacientes: [String]
})

export default mongoose.model('Diagnostico', DiagnosticoSchema)
