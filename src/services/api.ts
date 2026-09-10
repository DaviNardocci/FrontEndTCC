import axios from 'axios'
import { get } from 'v-calendar/dist/types/src/utils/helpers.js'
import getTokenData from './auth'

const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5095'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    const raw = error.response?.data
    const isHtml = typeof raw === 'string' && /^\s*<[^>]+>/i.test(raw)
    if (!error.response || isHtml) {
      window.dispatchEvent(
        new CustomEvent<{ message: string }>('api:error', {
          detail: {
            message: !error.response
              ? 'Falha de conexão com o servidor.'
              : 'O servidor retornou uma resposta inválida.',
          },
        })
      )
    }
    return Promise.reject(error)
  }
)

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface LoginResponse {
  id: number
  token: string
  role: string
}

export interface PatientDTO {
  id: number
  name: string
  lastName: string
  cpf: string
  age: string
  role: string
}

export interface PsychologistDTO {
  id: number
  name: string
  lastName: string
  cpf: string
  crp: string
  specialization: string
}

export interface UpdatePsychologistData {
  id: number
  name: string
  lastName: string
  cpf: string
  age: string
  password: string
  crp: string
  specialization: string
}

export interface PatientPsychologistDTO {
  patientId: number
  psychologistId: number
  name: string
  lastName: string
  specialization: string
}

export interface AvailabilityHour {
  hour: string
  available: boolean
}

export interface AvailabilityResponse {
  psychologistId: number
  date: string
  weekDay: number
  avaliability: boolean
  hours: AvailabilityHour[]
}

export interface AppointmentDTO {
  type: string
  dateAndTime: string
  notes?: string
  hadTreatment?: string
  physicalHealth?: string
  maritalStatus?: string
  habits?: string
  searchReason?: string
  patientId: number
  psychologistId: number
}

function normalizeRole(role?: string | null): string {
  return (role ?? '').toUpperCase()
}

function normalizePatient(patient: PatientDTO): PatientDTO {
  return { ...patient, role: normalizeRole(patient.role) }
}

export async function login(cpf: string, password: string): Promise<boolean> {
  try {
    const response = await api.post<ApiResponse<LoginResponse>>('/api/user/login', { cpf, password })

    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token)
      alert("Login realizado com sucesso!")
      return true
    }
    alert("Erro ao realizar o login. Credenciais inválidas!")
    console.log('Login failed:', response.data)
    return false
    
  } catch (error: any) {
    console.error('Erro ao fazer login:', error.response?.data ?? error)
    return false
  }
}

export async function registerPatient(data: {
  name: string
  lastName: string
  cpf: string
  age: string
  password: string
}): Promise<boolean> {
  try {
    const created = await api.post<ApiResponse<PatientDTO>>('/api/patient/createPatient', data)
    if (!(created.data.success && created.data.data)) return false
    const token = getTokenData()
    const idPsychologist = token?.id
    const linked = await api.post<ApiResponse<boolean>>('/api/patient/link-psychologist', {
      patientId: created.data.data.id,
      psychologistId: idPsychologist
    })
    return linked.data.success
  } catch (error) {
    console.error('Erro ao cadastrar/​vincular paciente:', error)
    return false
  }
}

export async function listPatients(psychologistId?: number): Promise<PatientDTO[]> {
  try {
    const response = await api.get<ApiResponse<PatientDTO[]>>('/api/patient/list', {
      params: psychologistId != null ? { psychologistId } : {},
    })
    return response.data.success ? response.data.data.map(normalizePatient) : []
  } catch (error) {
    console.error('Erro ao listar pacientes:', error)
    return []
  }
}

export async function getPatientById(id: number): Promise<PatientDTO | null> {
  try {
    const response = await api.get<ApiResponse<PatientDTO>>(`/api/patient/get-by-id/${id}`)
    return response.data.success ? normalizePatient(response.data.data) : null
  } catch (error) {
    console.error('Erro ao buscar paciente:', error)
    return null
  }
}

export async function registerPsychologist(data: {
  name: string
  lastName: string
  cpf: string
  age: string
  password: string
  crp: string
  specialization: string
}): Promise<boolean> {
  try {
    const response = await api.post<ApiResponse<PsychologistDTO>>('/api/psychologist/register', data)
    return response.data.success
  } catch (error) {
    console.error('Erro ao cadastrar psicólogo:', error)
    return false
  }
}

export async function listPsychologists(): Promise<PsychologistDTO[]> {
  try {
    const response = await api.get<ApiResponse<PsychologistDTO[]>>('/api/psychologist/list')
    return response.data.success ? response.data.data : []
  } catch (error) {
    console.error('Erro ao listar psicólogos:', error)
    return []
  }
}

export async function getPsychologistById(id: number): Promise<PsychologistDTO | null> {
  try {
    const response = await api.get<ApiResponse<PsychologistDTO>>(`/api/psychologist/get-by-id/${id}`)
    return response.data.success ? response.data.data : null
  } catch (error) {
    console.error('Erro ao buscar psicólogo:', error)
    return null
  }
}

export async function updatePsychologist(data: UpdatePsychologistData): Promise<boolean> {
  try {
    const response = await api.put<ApiResponse<boolean>>('/api/psychologist/edit', data)
    return response.data.success
  } catch (error) {
    console.error('Erro ao atualizar psicólogo:', error)
    return false
  }
}

export async function deletePsychologist(id: number): Promise<boolean> {
  try {
    const response = await api.delete<ApiResponse<boolean>>(`/api/psychologist/${id}`)
    return response.data.success
  } catch (error) {
    console.error('Erro ao excluir psicólogo:', error)
    return false
  }
}

export async function getPatientPsychologist(patientId: number): Promise<PatientPsychologistDTO | null> {
  try {
    const response = await api.get<ApiResponse<PatientPsychologistDTO>>(`/api/patient/${patientId}/psychologist`)
    return response.data.success ? response.data.data : null
  } catch (error) {
    console.error('Erro ao buscar psicólogo do paciente:', error)
    return null
  }
}

export async function getAvailability(psychologistId: number, date: string): Promise<AvailabilityResponse | null> {
  try {
    const response = await api.get<ApiResponse<AvailabilityResponse>>(`/api/appointment/availability/${psychologistId}`, {
      params: { date },
    })
    return response.data.success ? response.data.data : null
  } catch (error) {
    console.error('Erro ao buscar disponibilidade:', error)
    return null
  }
}

export async function createServiceDays(psychologistId: number, days: { weekDay: number; hours: string[] }[]): Promise<boolean> {
  try {
    const response = await api.post<ApiResponse<boolean>>('/api/appointment/availability', {
      psychologistId,
      days,
    })
    return response.data.success
  } catch (error) {
    console.error('Erro ao salvar dias de atendimento:', error)
    return false
  }
}

export interface AppointmentResult {
  success: boolean
  message?: string
}

export async function createAppointment(data: AppointmentDTO): Promise<AppointmentResult> {
  try {
    const response = await api.post<ApiResponse<boolean>>('/api/appointment/Create', data)
    return { success: response.data.success, message: response.data.message }
  } catch (error: any) {
    console.error('Erro ao criar agendamento:', error)
    const message = error?.response?.data?.message
    return { success: false, message }
  }
}

export async function getPatientAgenda(patientId: number): Promise<string[]> {
  try {
    const response = await api.get<ApiResponse<string[]>>(`/api/appointment/patient-agenda/${patientId}`)
    return response.data.success ? response.data.data : []
  } catch (error) {
    console.error('Erro ao buscar agenda do paciente:', error)
    return []
  }
}

export interface AppointmentListDTO {
  id: number
  type: string
  date: string
  status: string
  patientId: number
  psychologistId: number
  patientName: string
  patientLastName: string
  psychologistName: string
  psychologistLastName: string
}

export async function getPatientAppointments(patientId: number): Promise<AppointmentListDTO[]> {
  try {
    const response = await api.get<ApiResponse<AppointmentListDTO[]>>(`/api/appointment/patient/${patientId}`)
    return response.data.success ? response.data.data : []
  } catch (error) {
    console.error('Erro ao buscar consultas do paciente:', error)
    return []
  }
}

export async function getPsychologistAppointments(psychologistId: number): Promise<AppointmentListDTO[]> {
  try {
    const response = await api.get<ApiResponse<AppointmentListDTO[]>>(`/api/appointment/psychologist/${psychologistId}`)
    return response.data.success ? response.data.data : []
  } catch (error) {
    console.error('Erro ao buscar consultas do psicólogo:', error)
    return []
  }
}

export async function updateAppointmentStatus(id: number, status: string): Promise<boolean> {
  try {
    const response = await api.put<ApiResponse<boolean>>('/api/appointment/status', { id, status })
    return response.data.success
  } catch (error) {
    console.error('Erro ao atualizar status do agendamento:', error)
    return false
  }
}

export default api