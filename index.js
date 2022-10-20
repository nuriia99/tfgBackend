import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import authRoute from './routes/auth.js'
import hotelsRoute from './routes/hotels.js'
import roomsRoute from './routes/rooms.js'
import usersRoute from './routes/users.js'

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
app.use('/users', usersRoute)
app.use('/hotels', hotelsRoute)
app.use('/rooms', roomsRoute)

app.use((error, req, res, next) => {
  const errorStatus = error.status || 500
  const errorMessage = error.message || 'Something went wrong'
  return res.status(errorStatus).json(errorMessage)
})

app.listen(8800, () => {
  connect()
  console.log('connected')
})
