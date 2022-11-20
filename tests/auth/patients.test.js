import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../../index.js'

const api = request(app)

const user = {
  username: '1Q2W3E4R',
  password: '1Q2W3E4R',
  id: '6378be9738938f2984193dbe'
}

describe('tests related to active intelligence', () => {
  let token
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    token = response.body.token
  })

  test('getActiveIntelligence respond a 200 status code and the response is correct', async () => {
    const correctResponse = [
      [
        '-',
        '25/02/2009',
        '25/02/2011',
        '25/02/2012',
        '25/02/2017',
        '25/02/2018',
        'lastValues'
      ],
      [
        'Tabaquismo',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-'
      ],
      [
        'Drogas',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-'
      ],
      [
        'Alcohol',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-'
      ],
      [
        'Actividad Fisica',
        '-',
        '-',
        'Activa',
        '-',
        '-',
        'Activa'
      ],
      [
        'Valoracion Pacientes Cronicos',
        '-',
        'leve',
        '-',
        '-',
        '-',
        'leve'
      ],
      [
        'Frecuencia Cardiaca',
        '-',
        '-',
        '-',
        '85',
        '-',
        '85'
      ],
      [
        'Peso',
        '60',
        '-',
        '-',
        '-',
        '-',
        '60'
      ],
      [
        'Estatura',
        '-',
        '-',
        '-',
        '-',
        '175',
        '175'
      ],
      [
        'Colesterol Total',
        '-',
        '-',
        '-',
        '-',
        '153',
        '153'
      ],
      [
        'Alergias',
        '-',
        '-',
        '-',
        '-',
        'Al polen y al paracetamol.',
        'Al polen y al paracetamol.'
      ]
    ]
    const response = await api.get('/patients/' + user.id + '/activeIntelligence')
      .send(user)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    expect(correctResponse).toEqual(response.body)
  })

  test('getActiveIntelligence respond a 404 status code if the user does not exists', async () => {
    await api.get('/patients/636b763ec2a4bb041c4e637b/activeIntelligence')
      .send(user)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(404)
  })
})

describe('tests related to search patients', () => {
  let token
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    token = response.body.token
  })

  test('searchPatient respond a 200 status code and the response is correct', async () => {
    const response = await api.get('/patients/?dni=76456523C')
      .send(user)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    expect(response.body[0]._id).toEqual('6378cf259172ee3d235c102d')
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
