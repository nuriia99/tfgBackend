import mongoose, { Schema } from 'mongoose'

const EntradaSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  lenguaje: { type: String, required: true },
  notas: [{
    asunto: { type: String, required: true },
    exploracion: { type: String, required: true },
    tratamiento: { type: String, required: true },
    diagnostico: { type: Schema.ObjectId, ref: 'Diagnostico', required: true },
    estado: { type: String, required: true },
    prescripciones: [{ type: Schema.ObjectId, ref: 'Prescripcion' }]
  }],
  trabajador: {
    id: { type: Schema.ObjectId, ref: 'Trabajador', required: true },
    role: { type: String, required: true }
  }
})

export default mongoose.model('Entrada', EntradaSchema)
