import mongoose from 'mongoose'

const TrabajadorSchema = new mongoose.Schema({
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
  username: {
    type: String,
    requiered: true
  },
  password: {
    type: String,
    requiered: true
  },
  numColegiado: {
    type: String,
    requiered: true
  },
  pacientes: {
    type: [String]
  },
  centros: [{
    nombre: String,
    turnos: [{
      fechaInicio: {
        type: Date,
        required: true
      },
      fechaFinal: {
        type: Date,
        required: true
      },
      esDoctor: {
        type: Boolean,
        required: true
      },
      especialidad: {
        type: String
      }
    }]
  }],
  objetivos: {
    type: [String]
  },
  citasPrevias: [{
    paciente: {
      type: String,
      required: true
    },
    segundoTrabajador: {
      type: String
    },
    centro: {
      type: String,
      required: true
    },
    fecha: {
      type: Date,
      require: true
    }
  }],
  visitaUrgencia: [{
    paciente: {
      type: String,
      required: true
    },
    segundoTrabajador: {
      type: String
    },
    centro: {
      type: String,
      required: true
    },
    fecha: {
      type: Date,
      require: true
    },
    horaEntrada: {
      type: Date,
      require: true
    },
    horaAsistencia: {
      type: Date,
      require: true
    },
    horaSalida: {
      type: Date,
      require: true
    },
    motivo: {
      type: String,
      require: true
    },
    triaje: {
      type: Number,
      require: true
    },
    comentario: {
      type: String
    }
  }]
})

export default mongoose.model('Trabajador', TrabajadorSchema)
