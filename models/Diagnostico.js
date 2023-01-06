import mongoose from 'mongoose'

const DiagnosticoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  severidad: { type: String, required: true },
  palabrasClave: [String]
})

export default mongoose.model('Diagnostico', DiagnosticoSchema)
