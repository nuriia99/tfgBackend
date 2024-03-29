import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import authRoute from './routes/auth.js'
import workersRoute from './routes/workers.js'
import homeRoute from './routes/home.js'
import patientsRoute from './routes/patients.js'
import entriesRoute from './routes/entries.js'
import prescriptionRoute from './routes/prescription.js'
import goalsRoute from './routes/goals.js'
import schedulesRoute from './routes/schedules.js'
import cors from 'cors'
import url from 'url'
import path from 'path'

export const app = express()
dotenv.config()

app.use(cors()) // Use this after the variable declaration

export const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const connect = async () => {
  await mongoose.connect(process.env.MONGO)
  console.log('connected to mongodb')
}

app.use(express.json())
app.use(cookieParser())

// middlewares
app.use('/auth', authRoute)
app.use('/trabajadores', workersRoute)
app.use('/home', homeRoute)
app.use('/patients', patientsRoute)
app.use('/entries', entriesRoute)
app.use('/prescriptions', prescriptionRoute)
app.use('/goals', goalsRoute)
app.use('/schedules', schedulesRoute)

app.use((error, req, res, next) => {
  let errorStatus = error.status
  const errors = [200, 201, 400, 401, 403, 404]
  if (!errors.includes(errorStatus)) errorStatus = 500
  const descErrors = {
    200: 'La solicitud ha tenido éxito',
    201: 'La solicitud ha tenido éxito y se ha creado un nuevo recurso.',
    400: 'No se ha podido interpretar la solicitud debido a una sintaxis inválida.',
    401: 'Es necesario autentificar para obtener una respuesta.',
    403: 'El cliente no posee los permisos necesarios para obtener una respuesta.',
    404: 'El servidor no ha podido encontrar el contenido solicitado.',
    500: 'El servidor se ha encontrado con una situación que no sabe cómo manejarla.'
  }
  const errorMessage = descErrors[errorStatus]
  return res.status(errorStatus).json(errorMessage)
})
const PORT = process.env.PORT || 3000
export const server = app.listen(PORT, () => {
  connect()
  console.log('connected')
})
