import mongoose from 'mongoose'

const MedicamentoSchema = new mongoose.Schema({
  componente: {
    type: String,
    requiered: true
  },
  marca: {
    type: String,
    requiered: true
  },
  numComprimidos: {
    type: Number,
    requiered: true
  },
  recetaEnfPermitida: {
    type: Boolean,
    requiered: true
  },
  alergias: {
    type: [String],
    requiered: true
  }

})

export default mongoose.model('Medicamento', MedicamentoSchema)
