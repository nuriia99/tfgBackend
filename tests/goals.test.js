import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../index.js'

const api = request(app)

const user = {
  username: '1Q2W3E4R',
  password: '1Q2W3E4R',
  id: '6378b7c938938f2984193d56'
}

describe('tests related to patients lists', () => {
  let token
  let goal
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    token = response.body.token
  })
  test('getPatientsList returns a 200 status code', async () => {
    const query = {
      parameters: {
        minAge: '59',
        maxAge: '90',
        sex: 'B',
        startDate: '2022-11-30T10:01:13.603Z',
        endDate: '2022-12-30T10:01:13.603Z',
        currentSelect: 'Todos los pacientes'
      },
      centros: [
        {
          nombre: 'CUAP Gran Corazón',
          objetivos: [
            '63864049451fbc6cc4409be5',
            '638659a87d93b8e9cdab77d6',
            '638676f2d9058d78b2578a8e',
            '638676ffd9058d78b2578aed'
          ],
          pacientes: ['63866ceb8a592a2aa398a23e'],
          agenda: '63aac6ffc7cfeb833d84fbf5'
        },
        {
          nombre: 'CAP Antón de Borja',
          pacientes: ['6378cf259172ee3d235c102d'],
          agenda: '63a1dc99536f565da1466a9f'
        },
        {
          nombre: 'CAP San Genís',
          pacientes: ['6378cf259172ee3d235c102d'],
          agenda: '63a1dcaa536f565da1466aa1'
        }
      ]
    }
    const goals = await api.post('/goals/getPatientsLists')
      .set({
        authorization: `Bearer ${token}`
      })
      .send(query)
      .expect(200)
    goal = goals.body
    expect(goal[0].nombre).toEqual('Dario')
  })
})

describe('tests related to goals list', () => {
  let token
  let goal
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    token = response.body.token
  })
  test('getGoal return a 200 status code', async () => {
    const goals = await api.get('/goals/getGoals/' + user.id)
      .set({
        authorization: `Bearer ${token}`
      })
      .query({
        centro: 'CUAP Gran Corazón'
      })
      .expect(200)
    goal = goals.body
  })
  test('getPatientList return a 200 status code', async () => {
    await api.get('/goals/getPatientsListGoal')
      .set({
        authorization: `Bearer ${token}`
      })
      .query({
        pacientesTotales: goal.pacientesTotales,
        pacientesCompletados: goal.pacientesCompletados
      })
      .expect(200)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
