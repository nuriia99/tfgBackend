import mongoose from 'mongoose'

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
  pacientes: [String],
  especialidades: { type: [String], required: true },
  centros: [{
    nombre: String,
    objetivos: [String]
  }],
  turnos: [{ horaInicio: Date, horaFinal: Date, rol: 'String', centro: 'String' }],
  citasPrevias: [{
    paciente: { type: String, required: true },
    segundoTrabajador: String,
    centro: { type: String, required: true },
    fecha: { type: Date, required: true }
  }],
  visitasUrgencias: [String],
  informes: [String],
  entradas: [String],
  eleccionMedicamento: [{
    medicamento: { type: String, required: true },
    diagnostico: { type: String, required: true },
    fecha: { type: [Date], required: true }
  }]
})

export default mongoose.model('Trabajador', TrabajadorSchema)
