import mongoose, { Schema } from 'mongoose'

const PacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido1: { type: String, required: true },
  apellido2: { type: String },
  dni: { type: String, required: true, unique: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  cip: { type: String, required: true, unique: true },
  fechaNacimiento: { type: Date, required: true },
  edad: { type: Number, required: true },
  sexo: { type: String, required: true },
  genero: { type: String, required: true },
  paisOrigen: { type: String, required: true },
  direccion: { type: String, required: true },
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
})

export default mongoose.model('Paciente', PacienteSchema)
