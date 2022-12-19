import mongoose, { Schema } from 'mongoose'

const TrabajadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido1: { type: String, required: true },
  apellido2: String,
  dni: { type: String, required: true, unique: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  esDoctor: { type: Boolean, required: true },
  numColegiado: { type: String, required: true, unique: true },
  lenguaje: String,
  especialidades: { type: [String], required: true },
  centros: [{
    nombre: String,
    objetivos: [{ type: Schema.ObjectId, ref: 'Objetivo' }],
    pacientes: [{ type: Schema.ObjectId, ref: 'Paciente' }]
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
})

export default mongoose.model('Trabajador', TrabajadorSchema)
