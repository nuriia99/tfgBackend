import mongoose, { Schema } from 'mongoose'

const CitaPreviaSchema = new mongoose.Schema({
  paciente: { type: Schema.ObjectId, ref: 'Paciente', required: true },
  primerTrabajador: { type: Schema.ObjectId, ref: 'Trabajador', required: true },
  segundoTrabajador: { type: Schema.ObjectId, ref: 'Trabajador' },
  centro: { type: String, required: true },
  fecha: { type: Date, required: true }
})

export default mongoose.model('CitaPrevia', CitaPreviaSchema)
