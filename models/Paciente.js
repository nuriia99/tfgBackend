import mongoose from 'mongoose'

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
    trabajador: { type: String, required: true }
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
  informes: [String],
  diagnosticos: [{
    diagnostico: { type: String, required: true },
    activo: { type: Boolean, required: true }
  }],
  prescripciones: [{
    fechaInicio: { type: Date, required: true },
    fechaFinal: { type: Date, required: true },
    instrucciones: String,
    trabajador: { type: String, required: true },
    nombreMedicamento: { type: String, required: true },
    principioActivo: { type: String, required: true },
    frecuencia: { type: String, required: true },
    duracion: { type: String, required: true }
  }],
  entradas: [String]
})

export default mongoose.model('Paciente', PacienteSchema)
