import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../index.js'

const api = request(app)

const user = {
  username: '1Q2W3E4R',
  password: '1Q2W3E4R',
  id: '6378b7c938938f2984193d56'
}

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
