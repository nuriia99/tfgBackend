import mongoose from 'mongoose'

const PacienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    requiered: true
  },
  apellido1: {
    type: String,
    requiered: true
  },
  apellido2: {
    type: String
  },
  dni: {
    type: String,
    requiered: true
  },
  correo: {
    type: String,
    requiered: true
  },
  telefono: {
    type: String,
    requiered: true
  },
  CIP: {
    type: String,
    requiered: true
  },
  fechaNacimiento: {
    type: Date,
    requiered: true
  },
  edad: {
    type: Number,
    requiered: true
  },
  genero: {
    type: String,
    requiered: true
  },
  paisOrigen: {
    type: String,
    requiered: true
  },
  direccion: {
    type: String,
    requiered: true
  }

})

export default mongoose.model('Paciente', PacienteSchema)
