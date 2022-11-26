import mongoose from 'mongoose'

const MedicamentoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  principioActivo: { type: String, required: true },
  recetaEnfPermitida: { type: Boolean, required: true },
  insPaciente: String,
  insFarmacia: String,
  unidad: String,
  frecuencia: String,
  duracion: String
})

export default mongoose.model('Medicamento', MedicamentoSchema)
