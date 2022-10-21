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
  },
  trabajadoresAsignados: [{
    rol: {
      type: String,
      required: true
    },
    trabajador: {
      type: String,
      required: true
    },
    inteligenciaActiva: {
      tabaquismo: {
        type: Boolean
      },
      actividadFísica: {
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
    }
  }],
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
  recetas: [{
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
    medicamentos: [{
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
  }]

})

export default mongoose.model('Paciente', PacienteSchema)
