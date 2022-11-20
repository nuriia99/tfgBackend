import mongoose, { Schema } from 'mongoose'

const DiagnosticoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  severidad: { type: String, required: true },
  informes: [{ type: Schema.ObjectId, ref: 'Informe' }],
  entradas: [{ type: Schema.ObjectId, ref: 'Entrada' }],
  pacientes: [{ type: Schema.ObjectId, ref: 'Paciente' }]
})

export default mongoose.model('Diagnostico', DiagnosticoSchema)
