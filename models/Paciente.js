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
  genero: {
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
    tabaquismo: [{
      value: {
        type: String,
        requiered: true,
        default: false
      },
      date: {
        type: Date,
        requiered: true
      }
    }],
    alcohol: [{
      value: {
        type: String,
        requiered: true,
        default: false
      },
      date: {
        type: Date,
        requiered: true
      }
    }],
    drogas: [{
      value: {
        type: String,
        requiered: true,
        default: false
      },
      date: {
        type: Date,
        requiered: true
      }
    }],
    actividadFisica: [{
      value: {
        type: String,
        requiered: true,
        default: false
      },
      date: {
        type: Date,
        requiered: true
      }
    }],
    valoracionPacientesCronicos: [{
      value: {
        type: String,
        requiered: true,
        default: false
      },
      date: {
        type: Date,
        requiered: true
      }
    }],
    frecuenciaCardiaca: [{
      value: {
        type: String,
        requiered: true,
        default: false
      },
      date: {
        type: Date,
        requiered: true
      }
    }],
    colesterolTotal: [{
      value: {
        type: String,
        requiered: true,
        default: false
      },
      date: {
        type: Date,
        requiered: true
      }
    }],
    peso: [{
      value: {
        type: String,
        requiered: true,
        default: false
      },
      date: {
        type: Date,
        requiered: true
      }
    }],
    estatura: [{
      value: {
        type: String,
        requiered: true,
        default: false
      },
      date: {
        type: Date,
        requiered: true
      }
    }]
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
  alergias: {
    type: [String]
  },
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
