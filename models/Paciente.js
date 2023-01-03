import mongoose, { Schema } from 'mongoose'
import { encrypt, decrypt } from '../middleware/verifyUser.js'

const PacienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, set: encrypt, get: decrypt },
    apellido1: { type: String, required: true, set: encrypt, get: decrypt },
    apellido2: { type: String, set: encrypt, get: decrypt },
    dni: { type: String, required: true, unique: true, set: encrypt, get: decrypt },
    correo: { type: String, required: true, set: encrypt, get: decrypt },
    telefono: { type: String, required: true, set: encrypt, get: decrypt },
    cip: { type: String, required: true, unique: true, set: encrypt, get: decrypt },
    fechaNacimiento: { type: Date, required: true },
    edad: { type: Number, required: true },
    sexo: { type: String, required: true },
    genero: { type: String, required: true },
    paisOrigen: { type: String, required: true },
    direccion: { type: String, required: true, set: encrypt, get: decrypt },
    antecedentes: { type: String },
    trabajadoresAsignados: [{
      rol: { type: String, required: true },
      trabajador: { type: Schema.ObjectId, ref: 'Trabajador' }
    }],
    inteligenciaActiva: [{
      name: { type: String, requiered: true },
      values: [{
        value: { type: String, requiered: true },
        date: { type: Date, requiered: true }
      }]
    }],
    documentos: [{
      nombre: { type: String, required: true },
      pdfUrl: { type: String, required: true },
      fechaSubida: { type: Date, required: true }
    }],
    citasPrevias: [{ type: Schema.ObjectId, ref: 'CitaPrevia' }],
    informes: [{ type: Schema.ObjectId, ref: 'Informe' }],
    diagnosticos: [{
      idDiagnostico: { type: Schema.ObjectId, ref: 'Diagnostico', required: true },
      fecha: { type: Date, required: true },
      estadoDiagnostico: { type: String, required: true }
    }],
    prescripciones: [{ type: Schema.ObjectId, ref: 'Prescripcion' }],
    entradas: [{ type: Schema.ObjectId, ref: 'Entrada' }]
  },
  {
    versionKey: false,
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true
  }
)

export default mongoose.model('Paciente', PacienteSchema)
