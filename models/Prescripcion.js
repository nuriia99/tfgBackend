import mongoose, { Schema } from 'mongoose'

const PrescripcionSchema = new mongoose.Schema({
  fechaInicio: { type: Date, required: true },
  fechaFinal: { type: Date, required: true },
  trabajador: { type: Schema.ObjectId, ref: 'Trabajador' },
  instrucciones: String,
  nombreMedicamento: { type: String, required: true },
  principioActivo: { type: String, required: true },
  frecuencia: { type: String, required: true },
  duracion: { type: String, required: true }
})

export default mongoose.model('Prescripcion', PrescripcionSchema)
