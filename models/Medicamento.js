import mongoose from 'mongoose'

const MedicamentoSchema = new mongoose.Schema({
  componente: {
    type: String,
    required: true
  },
  marca: {
    type: String,
    required: true
  },
  numComprimidos: {
    type: Number,
    required: true
  },
  recetaEnfPermitida: {
    type: Boolean,
    required: true
  },
  alergias: {
    type: [String],
    required: true
  }

})

export default mongoose.model('Medicamento', MedicamentoSchema)
