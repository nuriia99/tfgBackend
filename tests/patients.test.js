import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../index.js'

const api = request(app)

const user = {
  username: '1Q2W3E4R',
  password: '1Q2W3E4R',
  id: '6378be9738938f2984193dbe',
  idTrabajador: '6378b7c938938f2984193d56',
  idSchedule: '63a1dc99536f565da1466a9f',
  centro: 'CUAP Gran Corazón'
}

describe('tests related to appointments', () => {
  let token
  let appointmentId
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    token = response.body.token
  })

  test('getSchedules return a 200 status code', async () => {
    await api.get('/schedules/getSchedules?centro=' + user.centro + '&name=Corral')
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
  })
  test('getSchedule return a 200 status code', async () => {
    await api.get('/schedules/getSchedule/' + user.idSchedule)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
  })
  test('createAppointment return a 200 status code', async () => {
    const newAppointment = {
      appointment: {
        paciente: user.id,
        trabajador: {
          _id: user.idTrabajador,
          turnos: [
            {
              horaInicio: '2022-10-20T07:00:00.000+00:00',
              horaFinal: '2023-10-20T07:00:00.000+00:00',
              rol: 'Medicina general',
              centro: 'CUAP Gran Corazón',
              _id: '63a1e03a536f565da1466ad1'
            },
            {
              horaInicio: '2022-09-20T07:00:00.000+00:00',
              horaFinal: '2022-10-20T07:00:00.000+00:00',
              rol: 'Medicina general',
              centro: 'CAP Antón de Borja',
              _id: '63a1e03a536f565da1466ad2'
            }
          ]
        },
        tipoVisita: 'Presencial 15min',
        centro: user.centro,
        fecha: '2023-04-12T00:00:00.511Z',
        especialidad: 'Medicina general',
        agenda: { _id: user.idSchedule },
        motivo: 'Es un test'
      }
    }
    const appointment = await api.post('/schedules/createAppointment')
      .send(newAppointment)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    appointmentId = appointment.body._id
  })
  test('it cant be created an appointment if the worker is not working', async () => {
    const newAppointment = {
      appointment: {
        paciente: user.id,
        trabajador: {
          _id: user.idTrabajador,
          turnos: [
            {
              horaInicio: '2022-10-20T07:00:00.000+00:00',
              horaFinal: '2023-10-20T07:00:00.000+00:00',
              rol: 'Medicina general',
              centro: 'CUAP Gran Corazón',
              _id: '63a1e03a536f565da1466ad1'
            },
            {
              horaInicio: '2022-09-20T07:00:00.000+00:00',
              horaFinal: '2022-10-20T07:00:00.000+00:00',
              rol: 'Medicina general',
              centro: 'CAP Antón de Borja',
              _id: '63a1e03a536f565da1466ad2'
            }
          ]
        },
        tipoVisita: 'Presencial 15min',
        centro: user.centro,
        fecha: '2024-04-12T00:00:00.511Z',
        especialidad: 'Medicina general',
        agenda: { _id: user.idSchedule },
        motivo: 'Es un test'
      }
    }
    const appointment = await api.post('/schedules/createAppointment')
      .send(newAppointment)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    expect(appointment.body.message).toEqual('El trabajador no tiene ese turno asignado')
  })
  test('it cant be created an appointment if the date has already been', async () => {
    const newAppointment = {
      appointment: {
        paciente: user.id,
        trabajador: {
          _id: user.idTrabajador,
          turnos: [
            {
              horaInicio: '2022-10-20T07:00:00.000+00:00',
              horaFinal: '2023-10-20T07:00:00.000+00:00',
              rol: 'Medicina general',
              centro: 'CUAP Gran Corazón',
              _id: '63a1e03a536f565da1466ad1'
            },
            {
              horaInicio: '2022-09-20T07:00:00.000+00:00',
              horaFinal: '2022-10-20T07:00:00.000+00:00',
              rol: 'Medicina general',
              centro: 'CAP Antón de Borja',
              _id: '63a1e03a536f565da1466ad2'
            }
          ]
        },
        tipoVisita: 'Presencial 15min',
        centro: user.centro,
        fecha: '2022-04-12T00:00:00.511Z',
        especialidad: 'Medicina general',
        agenda: { _id: user.idSchedule },
        motivo: 'Es un test'
      }
    }
    const appointment = await api.post('/schedules/createAppointment')
      .send(newAppointment)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    expect(appointment.body.message).toEqual('Las fecha ya ha pasado.')
  })
  test('it cant be created an appointment if the worker has already an appointment to that date', async () => {
    const newAppointment = {
      appointment: {
        paciente: user.id,
        trabajador: {
          _id: user.idTrabajador,
          turnos: [
            {
              horaInicio: '2022-10-20T07:00:00.000+00:00',
              horaFinal: '2023-10-20T07:00:00.000+00:00',
              rol: 'Medicina general',
              centro: 'CUAP Gran Corazón',
              _id: '63a1e03a536f565da1466ad1'
            },
            {
              horaInicio: '2022-09-20T07:00:00.000+00:00',
              horaFinal: '2022-10-20T07:00:00.000+00:00',
              rol: 'Medicina general',
              centro: 'CAP Antón de Borja',
              _id: '63a1e03a536f565da1466ad2'
            }
          ]
        },
        tipoVisita: 'Presencial 15min',
        centro: user.centro,
        fecha: '2023-04-12T00:00:00.511Z',
        especialidad: 'Medicina general',
        agenda: { _id: user.idSchedule },
        motivo: 'Es un test'
      }
    }
    const appointment = await api.post('/schedules/createAppointment')
      .send(newAppointment)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    expect(appointment.body.message).toEqual('Las fechas se solapan.')
  })
  test('updateAppointment returns a 200 status code', async () => {
    const newAppointment = {
      appointment: {
        paciente: user.id,
        trabajador: {
          _id: user.idTrabajador,
          turnos: [
            {
              horaInicio: '2022-10-20T07:00:00.000+00:00',
              horaFinal: '2023-10-20T07:00:00.000+00:00',
              rol: 'Medicina general',
              centro: 'CUAP Gran Corazón',
              _id: '63a1e03a536f565da1466ad1'
            },
            {
              horaInicio: '2022-09-20T07:00:00.000+00:00',
              horaFinal: '2022-10-20T07:00:00.000+00:00',
              rol: 'Medicina general',
              centro: 'CAP Antón de Borja',
              _id: '63a1e03a536f565da1466ad2'
            }
          ]
        },
        tipoVisita: 'Presencial 15min',
        centro: user.centro,
        fecha: '2023-04-12T00:00:00.511Z',
        especialidad: 'Medicina general',
        agenda: { _id: user.idSchedule },
        motivo: 'Es un test'
      }
    }
    await api.patch('/schedules/updateAppointment/' + appointmentId)
      .send(newAppointment)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
  })
  test('deleteAppointments returns a 200 status code', async () => {
    const data = {
      agenda: user.idSchedule,
      paciente: user.id
    }
    await api.delete('/schedules/deleteAppointment/' + appointmentId)
      .send(data)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
  })
})

describe('tests related to documents', () => {
  let token
  let documentId
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    token = response.body.token
  })

  test('deleteDocument return a 200 status code', async () => {
    const newDocuments = {
      documentos: [
        {
          nombre: 'Informe CUAP 4',
          pdfUrl: 'Informe4.pdf',
          fechaSubida: '2019-07-26T13:33:03.511Z'
        },
        {
          nombre: 'Informe CUAP 3',
          pdfUrl: 'Informe3.pdf',
          fechaSubida: '2018-05-17T13:33:03.511Z'
        },
        {
          nombre: 'Informe CUAP 2',
          pdfUrl: 'Informe2.pdf',
          fechaSubida: '2010-02-13T13:33:03.511Z'
        },
        {
          nombre: 'Informe CUAP 1',
          pdfUrl: 'Informe1.pdf',
          fechaSubida: '1999-07-26T13:33:03.511Z'
        }
      ]
    }
    await api.patch('/patients/' + user.id + '/updatePatient')
      .send(newDocuments)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    const patient = await api.get('/patients/' + user.id)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    documentId = patient.body.documentos[0]._id
    await api.delete('/patients/' + user.id + '/deleteDoc/' + documentId)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
  })
})

describe('tests related to prescriptions', () => {
  let token
  let prescriptionId
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    token = response.body.token
  })

  test('createPrescription return a 200 status code', async () => {
    const newPrescription = {
      newPrescription: {
        paciente: '6378be9738938f2984193dbe',
        fechaInicio: '2022-11-04T00:00:00.511Z',
        fechaFinal: '2023-11-18T00:00:00.511Z',
        instrucciones: 'Comer antes de ingerir el alimento.',
        trabajador: '6378b7c938938f2984193d56',
        nombreMedicamento: 'IBUPROFENO CINFA 100MG/5ML 200ML SUSPENSI ORAL EPG',
        principioActivo: 'IBUPROFENO',
        frecuencia: '1 x 12h',
        duracion: '14 dias',
        idMed: '6381f90c9a5838d84535daa5'
      },
      diagnostico: {
        _id: '6378cb4e3fd7f657a2b28e7d'
      },
      centre: 'CUAP Gran Corazón'
    }
    const prescription = await api.post('/prescriptions/createPrescription')
      .send(newPrescription)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    prescriptionId = prescription.body._id
  })

  test('updatePrescription return a 200 status code', async () => {
    const newPrescription = {
      newPrescription: {
        patient: '6378be9738938f2984193dbe',
        fechaInicio: '2022-11-04T00:00:00.511Z',
        fechaFinal: '2023-11-18T00:00:00.511Z',
        instrucciones: 'Comer antes de ingerir el alimento.',
        trabajador: '6378b7c938938f2984193d56',
        nombreMedicamento: 'IBUPROFENO CINFA 100MG/5ML 200ML SUSPENSI ORAL EPG',
        principioActivo: 'IBUPROFENO',
        frecuencia: '1 x 12h',
        duracion: '14 dias',
        idMed: '6381f90c9a5838d84535daa5'
      },
      diagnostico: {
        _id: '6378cb4e3fd7f657a2b28e7d'
      },
      centre: 'CUAP Gran Corazón',
      removedPrincipioActivo: ''
    }
    await api.patch('/prescriptions/updatePrescription/' + prescriptionId)
      .send(newPrescription)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
  })

  test('deletePrescription return a 200 status code', async () => {
    const newPrescription = {
      centre: 'CUAP Gran Corazón',
      removedPrincipioActivo: '',
      patient: '6378be9738938f2984193dbe',
      worker: '6378b7c938938f2984193d56'
    }
    await api.delete('/prescriptions/deletePrescription/' + prescriptionId)
      .send(newPrescription)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
  })
})

describe('tests related to entries and notes', () => {
  let token
  let entryId
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    token = response.body.token
  })

  test('createEntry return a 201 status code', async () => {
    const newEntry = {
      newEntry: {
        paciente: '6378be9738938f2984193dbe',
        trabajador: {
          id: '6378b7c938938f2984193d56',
          role: 'Medicina general'
        },
        fecha: '2022-04-22T16:00:00.511Z',
        lenguaje: 'es',
        notas: [
          {
            motivo: 'Mujer acude a urgencias por disnea, tos seca y fiebre.',
            antecedentes: 'Fumadora desde los 11 años hasta los 19 años, no FRCV ni  cadipatías conocidas, sobrepeso y asma desde los 14-15 años. Nació en parto eutócico y fue diagnosticada de asma en la adolescencia. Refiere otitis y bronquitis, pero ningún ingreso por crisis asmáticas.',
            clinica: '3-4 días de evolución de disnea a moderados esfuerzos, tos seca sin expectoración y pico febril de 38º sin tiritona. R efiere empeoramiento de lo síntomas con los ácaros y la humedad.',
            exploracion: '',
            pruebasComplementarias: 'Analítica: reactantes de fase aguda discretamente elevados.\nGasometría arterial(FiO2 31%): HCO3 20\'7, lactato 3\'9, PaFi 162.\nPCR de virus: positivo para gripe A \nRadiografía de tórax: sin alteraciones.',
            planTerapeutico: 'Se inicia tratamiento con oxigenoterapia (FiO2 50% al inicio), nebulizaciones (Salbutamol + Bromuro de Ipratropio) y corticoides sistémicos. Se decide ingresar al paciente en la planta de neumología por persistenica de broncoespasmo e insuficiencia cardiaca respiratioria moderada.',
            diagnostico: '6378cb4e3fd7f657a2b28e7d',
            descDiagnostico: '',
            prescripciones: [],
            estado: 'inactivo'
          }
        ]
      },
      centre: 'CUAP Gran Corazón'
    }
    const entry = await api.post('/entries/createEntry')
      .send(newEntry)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    entryId = entry.body._id
  })

  test('createNote return a 201 status code', async () => {
    const newNote = {
      newNote: {
        motivo: 'Mujer acude a urgencias por disnea, tos seca y fiebre.',
        antecedentes: 'Fumadora desde los 11 años hasta los 19 años, no FRCV ni  cadipatías conocidas, sobrepeso y asma desde los 14-15 años. Nació en parto eutócico y fue diagnosticada de asma en la adolescencia. Refiere otitis y bronquitis, pero ningún ingreso por crisis asmáticas.',
        clinica: '3-4 días de evolución de disnea a moderados esfuerzos, tos seca sin expectoración y pico febril de 38º sin tiritona. R efiere empeoramiento de lo síntomas con los ácaros y la humedad.',
        exploracion: '',
        pruebasComplementarias: 'Analítica: reactantes de fase aguda discretamente elevados.\nGasometría arterial(FiO2 31%): HCO3 20\'7, lactato 3\'9, PaFi 162.\nPCR de virus: positivo para gripe A \nRadiografía de tórax: sin alteraciones.',
        planTerapeutico: 'Se inicia tratamiento con oxigenoterapia (FiO2 50% al inicio), nebulizaciones (Salbutamol + Bromuro de Ipratropio) y corticoides sistémicos. Se decide ingresar al paciente en la planta de neumología por persistenica de broncoespasmo e insuficiencia cardiaca respiratioria moderada.',
        diagnostico: {
          _id: '6378cb4e3fd7f657a2b28e7d'
        },
        descDiagnostico: '',
        prescripciones: [],
        estado: 'inactivo',
        entryId
      },
      worker: '6378b7c938938f2984193d56',
      centre: 'CUAP Gran Corazón',
      patient: '6378be9738938f2984193dbe'
    }
    await api.post('/entries/createNote')
      .send(newNote)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
  })

  test('updateNote return a 200 status code', async () => {
    const newNotes = {
      newNotes: [
        {
          motivo: 'Mujer acude a urgencias por disnea, tos seca y fiebre.',
          antecedentes: 'Fumadora desde los 11 años hasta los 19 años, no FRCV ni  cadipatías conocidas, sobrepeso y asma desde los 14-15 años. Nació en parto eutócico y fue diagnosticada de asma en la adolescencia. Refiere otitis y bronquitis, pero ningún ingreso por crisis asmáticas.',
          clinica: '3-4 días de evolución de disnea a moderados esfuerzos, tos seca sin expectoración y pico febril de 38º sin tiritona. R efiere empeoramiento de lo síntomas con los ácaros y la humedad.',
          exploracion: '',
          pruebasComplementarias: 'Analítica: reactantes de fase aguda discretamente elevados.\nGasometría arterial(FiO2 31%): HCO3 20\'7, lactato 3\'9, PaFi 162.\nPCR de virus: positivo para gripe A \nRadiografía de tórax: sin alteraciones.',
          planTerapeutico: 'Se inicia tratamiento con oxigenoterapia (FiO2 50% al inicio), nebulizaciones (Salbutamol + Bromuro de Ipratropio) y corticoides sistémicos. Se decide ingresar al paciente en la planta de neumología por persistenica de broncoespasmo e insuficiencia cardiaca respiratioria moderada.',
          diagnostico: '6378cb4e3fd7f657a2b28e7d',
          descDiagnostico: '',
          prescripciones: [],
          estado: 'activo'
        }
      ],
      worker: '6378b7c938938f2984193d56',
      centre: 'CUAP Gran Corazón',
      patient: '6378be9738938f2984193dbe',
      removedDiagnosis: ''
    }
    await api.patch('/entries/updateNote/' + entryId)
      .send(newNotes)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
  })

  test('deleteNote return a 200 status code and if it is the last note the entry is deleted too', async () => {
    const newNotes = {
      newNotes: [],
      worker: '6378b7c938938f2984193d56',
      centre: 'CUAP Gran Corazón',
      patient: '6378be9738938f2984193dbe',
      removedDiagnosis: ''
    }
    await api.delete('/entries/deleteNote/' + entryId)
      .send(newNotes)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    await api.get('/entries/getEntry/' + entryId)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(404)
  })
})

describe('tests related to translate a note', () => {
  let token
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    token = response.body.token
  })

  test('translations from spanish to catalan works correctly', async () => {
    const response = await api.post('/entries/translateEntry')
      .send({
        notas: [
          {
            motivo: 'Paciente viene a consulta tras sentir mucha fatiga al caminar. ',
            antecedentes: '',
            clinica: 'Paciente con dolor en el pecho, y fatiga al hacer deporte.',
            exploracion: '',
            pruebasComplementarias: '',
            planTerapeutico: '',
            diagnostico: '6385e68b40f241e46bac63ee',
            descDiagnostico: ''
          }
        ],
        lengWorker: 'ca'
      })
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    console.log(response)
    expect(response.body).toEqual([
      {
        motivo: 'Pacient ve a consulta després de sentir molta fatiga en caminar. ',
        antecedentes: '',
        clinica: 'Pacient amb dolor al pit, i fatiga en fer esport.',
        exploracion: '',
        pruebasComplementarias: '',
        planTerapeutico: '',
        diagnostico: '6385e68b40f241e46bac63ee',
        descDiagnostico: ''
      }
    ])
  })

  test('translations from catalan to spanish works correctly', async () => {
    const response = await api.post('/entries/translateEntry')
      .send({
        notas: [
          {
            motivo: 'Pacient ve a consulta després de sentir molta fatiga en caminar.',
            antecedentes: '',
            clinica: 'Pacient amb dolor al pit, i fatiga en fer esport.',
            exploracion: '',
            pruebasComplementarias: '',
            planTerapeutico: '',
            diagnostico: '6385e68b40f241e46bac63ee',
            descDiagnostico: ''
          }
        ],
        lengWorker: 'es'
      })
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
    expect(response.body).toEqual([
      {
        motivo: 'Paciente viene a consulta después de sentir mucha fatiga al andar.',
        antecedentes: '',
        clinica: 'Paciente con dolor en el pecho, y fatiga al hacer deporte',
        exploracion: '',
        pruebasComplementarias: '',
        planTerapeutico: '',
        diagnostico: '6385e68b40f241e46bac63ee',
        descDiagnostico: ''
      }
    ])
  })
})

describe('tests related to get patient', () => {
  let token
  beforeEach(async () => {
    const response = await api.post('/auth/login')
      .send(user)
    token = response.body.token
  })

  test('getPatient respond a 200 status code and returns the patient', async () => {
    await api.get('/patients/' + user.id)
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(200)
  })

  test('getPatient respond a 404 status code if the user does not exists', async () => {
    const response = await api.get('/patients/636b763ec2a4bb041c4e637b')
      .set({
        authorization: `Bearer ${token}`
      })
      .expect(404)
    console.log(response.body)
  })
})

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
        '19/08/2018',
        'lastValues'
      ],
      ['Tabaquismo', '-', '-', '-', '-', '-', 'Sí', 'Sí'],
      ['Drogas', '-', '-', '-', '-', '-', '-', '-'],
      ['Alcohol', '-', '-', '-', '-', '-', '-', '-'],
      ['Actividad Fisica', '-', '-', 'Activa', '-', '-', '-', 'Activa'],
      [
        'Valoracion Pacientes Cronicos',
        '-',
        'leve',
        '-',
        '-',
        '-',
        '-',
        'leve'
      ],
      ['Frecuencia Cardiaca', '-', '-', '-', '85', '-', '-', '85'],
      [
        'Peso', '60',
        '-', '-',
        '-', '-',
        '-', '60'
      ],
      ['Estatura', '-', '-', '-', '-', '175', '-', '175'],
      ['Colesterol Total', '-', '-', '-', '-', '153', '-', '153'],
      [
        'Alergias',
        '-',
        '-',
        '-',
        '-',
        'Al polen y al paracetamol.',
        '-',
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
