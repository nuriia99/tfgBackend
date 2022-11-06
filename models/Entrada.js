import mongoose from 'mongoose'

const EntradaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  lenguaje: {
    type: String,
    required: true
  },
  nota: [{
    asunto: {
      type: String,
      required: true
    },
    exploracion: {
      type: String,
      required: true
    },
    tratamiento: {
      type: String,
      required: true
    },
    diagnostico: {
      type: String,
      required: true
    },
    prescripciones: {
      type: [String],
      required: true
    }
  }],
  paciente: {
    type: String,
    required: true
  },
  trabajador: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  }

})

export default mongoose.model('Entrada', EntradaSchema)
