import type { PsychologistDTO } from './api-types'

export type { PsychologistDTO } from './api-types'

export interface PsychologistModel {
  id: number
  name: string
  lastName: string
  age: string
  specialization: string
}

export interface PsychologistModelForEdit {
  id: number
  name: string
  lastName: string
  age: string
  crp: string
  specialization: string
}

export function mapPsychologistToModel(p: PsychologistDTO): PsychologistModel {
  return {
    id: p.id,
    name: p.name,
    lastName: p.lastName,
    age: p.age,
    specialization: p.specialization,
  }
}

export function mapPsychologistToEditModel(p: PsychologistDTO): PsychologistModelForEdit {
  return {
    id: p.id,
    name: p.name,
    lastName: p.lastName,
    age: p.age,
    crp: p.crp,
    specialization: p.specialization,
  }
}