import mongoose from 'mongoose'

const MedicamentoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  principioActivo: { type: String, required: true },
  numComprimidos: { type: Number, required: true },
  recetaEnfPermitida: { type: Boolean, required: true },
  insPaciente: { type: String, required: true },
  insFarmacia: { type: String, required: true }
})

export default mongoose.model('Medicamento', MedicamentoSchema)
