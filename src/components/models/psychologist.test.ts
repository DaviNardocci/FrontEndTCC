import { describe, it, expect } from 'vitest'
import {
  mapPsychologistToModel,
  mapPsychologistToEditModel,
  type PsychologistDTO
} from '@/components/models/psychologist'

describe('Psychologist Model Mappers', () => {
  const mockPsychologistDTO: PsychologistDTO = {
    id: 1,
    name: 'Maria',
    lastName: 'Santos',
    cpf: '12345678901',
    crp: '12345678',
    specialization: 'Clinical Psychology'
  }

  describe('mapPsychologistToModel', () => {
    it('should map DTO to view model correctly', () => {
      const result = mapPsychologistToModel(mockPsychologistDTO)

      expect(result).toEqual({
        id: 1,
        name: 'Maria',
        lastName: 'Santos',
        specialization: 'Clinical Psychology'
      })
    })

    it('should not include CRP in view model', () => {
      const result = mapPsychologistToModel(mockPsychologistDTO)
      expect('crp' in result).toBe(false)
    })

    it('should not include CPF in view model', () => {
      const result = mapPsychologistToModel(mockPsychologistDTO)
      expect('cpf' in result).toBe(false)
    })
  })

  describe('mapPsychologistToEditModel', () => {
    it('should map DTO to edit model correctly', () => {
      const result = mapPsychologistToEditModel(mockPsychologistDTO)

      expect(result).toEqual({
        id: 1,
        name: 'Maria',
        lastName: 'Santos',
        crp: '12345678',
        specialization: 'Clinical Psychology'
      })
    })

    it('should include CRP in edit model', () => {
      const result = mapPsychologistToEditModel(mockPsychologistDTO)
      expect(result.crp).toBe('12345678')
    })

    it('should not include CPF in edit model', () => {
      const result = mapPsychologistToEditModel(mockPsychologistDTO)
      expect('cpf' in result).toBe(false)
    })
  })
})