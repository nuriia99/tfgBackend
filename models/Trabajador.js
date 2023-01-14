import mongoose, { Schema } from 'mongoose'
import { encrypt, decrypt } from '../middleware/verifyUser.js'

const TrabajadorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, set: encrypt, get: decrypt },
    apellido1: { type: String, required: true, set: encrypt, get: decrypt },
    apellido2: { type: String, set: encrypt, get: decrypt },
    dni: { type: String, required: true, unique: true, set: encrypt, get: decrypt },
    correo: { type: String, required: true, set: encrypt, get: decrypt },
    telefono: { type: String, required: true, set: encrypt, get: decrypt },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    esDoctor: { type: Boolean, required: true },
    esAdmin: { type: Boolean, default: false },
    numColegiado: { type: String, required: true, unique: true, set: encrypt, get: decrypt },
    lenguaje: String,
    especialidades: { type: [String], required: true },
    pacientes: [{ type: Schema.ObjectId, ref: 'Paciente' }],
    centros: [{
      nombre: String,
      objetivos: [{ type: Schema.ObjectId, ref: 'Objetivo' }],
      pacientes: [{ type: Schema.ObjectId, ref: 'Paciente' }],
      agenda: { type: Schema.ObjectId, ref: 'Agenda' }
    }],
    turnos: [{ horaInicio: Date, horaFinal: Date, rol: String, centro: String }],
    citasPrevias: [{ type: Schema.ObjectId, ref: 'CitaPrevia' }],
    visitasUrgencias: [{ type: Schema.ObjectId, ref: 'VisitaUrgencias' }],
    informes: [{ type: Schema.ObjectId, ref: 'Informe' }],
    entradas: [{ type: Schema.ObjectId, ref: 'Entrada' }],
    eleccionMedicamento: [{
      medicamento: { type: Schema.ObjectId, ref: 'Medicamento', required: true },
      diagnostico: { type: Schema.ObjectId, ref: 'Diagnostico', required: true },
      fechas: { type: [Date], required: true }
    }]
  },
  {
    versionKey: false,
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true
  }
)

export default mongoose.model('Trabajador', TrabajadorSchema)
