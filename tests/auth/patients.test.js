import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../../index.js'

const api = request(app)

const user = {
  username: '1Q2W3E4R',
  password: '1Q2W3E4R',
  id: '63663957fff537e2cca3f844'
}

describe('tests related active intelligence', () => {
  let token
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    token = response.body.token
  })

  test('getActiveIntelligence respond a 200 status code and the response is correct', async () => {
    const correctResponse = [
      ['-', '25/02/2009', '25/02/2010', '25/02/2011', '25/02/2015', '25/02/2017', '25/02/2018'],
      ['Tabaquismo', '-', 'Sí', '-', '-', '-', '-'],
      ['Actividad Fisica', '-', '-', 'Sedentaria', '-', '-', '-'],
      ['Valoracion Pacientes Cronicos', '-', '-', 'leve', '-', '-', '-'],
      ['Frecuencia Cardiaca', '-', '-', '-', '-', '95', '-'],
      ['Peso', '55', '-', '-', '-', '-', '-'],
      ['Estatura', '-', '-', '-', '-', '-', '159'],
      ['Colesterol Total', '-', '-', '-', '-', '-', '150'],
      ['Alergias', 'Peroxido de benzoil', '-', '-', '-', '-'],
      ['Alcohol', '-', '-', '-', 'Sí', '-', '-'],
      ['Drogas', '-', '-', '-', '-', '-', '-']
    ]
    const response = await api.get('/patients/' + user.id + '/activeIntelligence')
      .send(user)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    expect(correctResponse).toEqual(response.body)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
