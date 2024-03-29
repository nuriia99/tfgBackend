import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../index.js'

const api = request(app)

const user = {
  username: '1Q2W3E4R',
  password: '1Q2W3E4R',
  id: '6378b7c938938f2984193d56'
}

describe('tests related to login', () => {
  test('a valid login should respond with a 200 status code and with the worker data and his token', async () => {
    const response = await api.post('/auth/login')
      .send(user)
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

describe('tests related to workers', () => {
  let worker
  let token
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    worker = response.body.workerData
    token = response.body.token
  })

  test('get recs meds returns and 200 code and the recs', async () => {
    const response = await api.get('/trabajadores/' + user.id + '/getRecs/6378cbdb3fd7f657a2b2bf65')
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    expect(response.body).toHaveLength(2)
  })

  test('update the worker lenguaje respond with a 200 status code', async () => {
    await api.patch('/trabajadores/' + worker._id + '/updateLenguage')
      .send({ lenguage: 'Español' })
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
  })
  test('if the token does not exist respond with a 401 status code', async () => {
    await api.patch('/trabajadores/' + worker._id + '/updateLenguage')
      .send({ lenguage: 'Español' })
      .expect(401)
  })

  test('if the token is not valid respond with a 403 status code', async () => {
    await api.patch('/trabajadores/' + worker._id + '/updateLenguage')
      .send({ lenguage: 'Español' })
      .set({
        authorization: 'hfehgifgoewi'
      })
      .expect(403)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
