import mongoose, { Schema } from 'mongoose'

const EntradaSchema = new mongoose.Schema({
  paciente: { type: Schema.ObjectId, ref: 'Paciente' },
  fecha: { type: Date, required: true },
  lenguaje: { type: String, required: true },
  notas: [{
    motivo: String,
    antecedentes: String,
    clinica: String,
    exploracion: String,
    pruebasComplementarias: String,
    planTerapeutico: String,
    diagnostico: { type: Schema.ObjectId, ref: 'Diagnostico', required: true },
    descDiagnostico: String,
    estado: { type: String, required: true },
    prescripciones: [{ type: Schema.ObjectId, ref: 'Prescripcion' }]
  }],
  trabajador: {
    id: { type: Schema.ObjectId, ref: 'Trabajador', required: true },
    role: { type: String, required: true }
  }
})

export default mongoose.model('Entrada', EntradaSchema)
