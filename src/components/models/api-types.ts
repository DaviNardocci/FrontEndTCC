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

export interface AvailabilityHour {
  hour: string
  available: boolean
  modalities?: string[]
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

export interface LoginResponse {
  id: number
  token: string
  role: string
}