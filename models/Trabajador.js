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
    requiered: true,
    unique: true
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
    requiered: true,
    unique: true
  },
  password: {
    type: String,
    requiered: true
  },
  esDoctor: {
    type: Boolean,
    required: true
  },
  numColegiado: {
    type: String,
    requiered: true,
    unique: true
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
      rol: {
        type: String,
        required: true
      }
    }],
    objetivos: {
      type: [String]
    }
  }],
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
  visitasUrgencias: {
    type: [String]
  },
  informes: {
    type: [String]
  },
  eleccionMedicamento: [{
    medicamento: {
      type: String,
      require: true
    },
    diagnostico: {
      type: String,
      require: true
    },
    fecha: {
      type: [Date],
      require: true
    }
  }]
})

export default mongoose.model('Trabajador', TrabajadorSchema)
