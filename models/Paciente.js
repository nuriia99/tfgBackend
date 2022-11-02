import mongoose from 'mongoose'

const PacienteSchema = new mongoose.Schema({
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
  cip: {
    type: String,
    required: true,
    unique: true
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  edad: {
    type: Number,
    required: true
  },
  sexo: {
    type: String,
    required: true
  },
  paisOrigen: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  trabajadoresAsignados: [{
    rol: {
      type: String,
      required: true
    },
    trabajador: {
      type: String,
      required: true
    }
  }],
  inteligenciaActiva: {
    tabaquismo: {
      type: Boolean
    },
    actividadFisica: {
      type: String
    },
    valoracionPacientesCronicos: {
      type: String
    },
    frecuenciaCardiaca: {
      type: Number
    },
    peso: {
      type: Number
    },
    estatura: {
      type: Number
    },
    colesterolTotal: {
      type: Number
    }
  },
  documentos: [{
    nombre: {
      type: String,
      required: true
    },
    pdfUrl: {
      type: String,
      required: true
    }
  }],
  informes: {
    type: [String]
  },
  diagnosticos: [{
    diagnostico: {
      type: String,
      required: true
    },
    activo: {
      type: Boolean,
      required: true
    }
  }],
  prescripciones: [{
    fechaInicio: {
      type: Date,
      required: true
    },
    fechaFinal: {
      type: Date,
      required: true
    },
    instrucciones: {
      type: String,
      required: true
    },
    trabajador: {
      type: String,
      required: true
    },
    medicamento: {
      type: String,
      required: true
    },
    dosis: {
      type: Number,
      required: true
    },
    frecuencia: {
      type: Number,
      required: true
    },
    duracion: {
      type: Number,
      required: true
    }
  }]

})

export default mongoose.model('Paciente', PacienteSchema)
