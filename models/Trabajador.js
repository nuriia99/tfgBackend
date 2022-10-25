import mongoose from 'mongoose'

const TrabajadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido1: {
    type: String,
    required: true
  },
  apellido2: {
    type: String
  },
  dni: {
    type: String,
    required: true,
    unique: true
  },
  correo: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  esDoctor: {
    type: Boolean,
    required: true
  },
  numColegiado: {
    type: String,
    required: true,
    unique: true
  },
  pacientes: {
    type: [String]
  },
  especialidades: {
    type: [String],
    required: true
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
      required: true
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
      required: true
    },
    diagnostico: {
      type: String,
      required: true
    },
    fecha: {
      type: [Date],
      required: true
    }
  }]
})

export default mongoose.model('Trabajador', TrabajadorSchema)
