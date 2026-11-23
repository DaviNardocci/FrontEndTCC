import { listPsychologists, listNotActivePsychologists, type PsychologistDTO } from './api'
import { mapPsychologistToModel, mapPsychologistToEditModel, type PsychologistModel, type PsychologistModelForEdit } from '../components/models/psychologist'

export { type PsychologistModel, type PsychologistModelForEdit }

export async function listPsychologistsForView(): Promise<PsychologistModel[]> {
  const psychologists = await listPsychologists()
  return psychologists.map(mapPsychologistToModel)
}

export async function listNotActivePsychologistsForView(): Promise<PsychologistModel[]> {
  const psychologists = await listNotActivePsychologists()
  return psychologists.map(mapPsychologistToModel)
}

export async function listPsychologistsForEdit(): Promise<PsychologistModelForEdit[]> {
  const psychologists = await listPsychologists()
  return psychologists.map(mapPsychologistToEditModel)
}