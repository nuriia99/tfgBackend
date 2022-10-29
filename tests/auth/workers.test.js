import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../../index.js'

const api = request(app)

describe('tests related to login', () => {
  test('a valid login should respond with a 200 status code and with the worker data and his token', async () => {
    const response = await api.post('/auth/login')
      .send({
        username: '1Q2W3E4R',
        password: '1Q2W3E4R'
      })
      .expect(200)
    // eslint-disable-next-line jest/valid-expect, no-prototype-builtins
    expect(response.body.hasOwnProperty('token', 'workerData'))
  })

  test('if user does not exist should respond with a 403 status code', async () => {
    await api.post('/auth/login')
      .send({
        username: 'furegou',
        password: 'fjoe'
      })
      .expect(404)
  })

  test('if password is incorrect should respond with a 400 status code', async () => {
    await api.post('/auth/login')
      .send({
        username: '1Q2W3E4R',
        password: 'fjoerjgpr'
      })
      .expect(400)
  })
})

describe('tests related to update workers', () => {
  let worker = null
  test('if the token and the id are valid respond with a 200 status code', async () => {
    const response = await api.post('/auth/login')
      .send({
        username: '1Q2W3E4R',
        password: '1Q2W3E4R'
      })
    worker = response.body.workerData
    await api.post('/trabajadores/' + worker._id + '/updateLenguage')
      .send({ lenguage: 'Español' })
      .set({
        Authoritation: `Bearer ${response.body.token}`
      })
      .expect(200)
  })
  test('if the token does not exist respond with a 401 status code', async () => {
    await api.post('/trabajadores/' + worker._id + '/updateLenguage')
      .send({ lenguage: 'Español' })
      .expect(401)
  })

  test('if the token is not valid respond with a 403 status code', async () => {
    await api.post('/trabajadores/' + worker._id + '/updateLenguage')
      .send({ lenguage: 'Español' })
      .set({
        Authoritation: 'hfehgifgoewi'
      })
      .expect(403)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})