import mongoose, { Schema } from 'mongoose'

const PrescripcionSchema = new mongoose.Schema({
  paciente: { type: Schema.ObjectId, ref: 'Paciente' },
  fechaInicio: { type: Date, required: true },
  fechaFinal: { type: Date, required: true },
  trabajador: { type: Schema.ObjectId, ref: 'Trabajador' },
  instruccionesPaciente: String,
  instruccionesFarmacia: String,
  nombreMedicamento: { type: String, required: true },
  principioActivo: { type: String, required: true },
  frecuencia: { type: String, required: true },
  duracion: { type: String, required: true }
})

export default mongoose.model('Prescripcion', PrescripcionSchema)
