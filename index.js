import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import authRoute from './routes/auth.js'

const app = express()
dotenv.config()

const connect = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    await mongoose.connect(process.env.MONGO)
    console.log('connected to mongodb')
  } catch (error) {
    throw (error)
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB is disconnected')
})

mongoose.connection.on('connected', () => {
  console.log('MongoDB is connected')
})

// middlewares
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRoute)

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

app.listen(3000, () => {
  connect()
  console.log('connected')
})
