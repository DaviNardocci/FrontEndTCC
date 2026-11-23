import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Profile from '@/pages/Profile/Profile.vue'

const { mockGetTokenData, mockGetPatientById, mockGetPsychologistById } = vi.hoisted(() => ({
  mockGetTokenData: vi.fn(),
  mockGetPatientById: vi.fn(),
  mockGetPsychologistById: vi.fn(),
}))

vi.mock('@/services/auth', () => ({ default: mockGetTokenData }))
vi.mock('@/services/api', () => ({
  getPatientById: mockGetPatientById,
  getPsychologistById: mockGetPsychologistById,
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/patient', component: { template: '<div>Patient</div>' } },
    { path: '/psychologist', component: { template: '<div>Psychologist</div>' } },
    { path: '/login', component: { template: '<div>Login</div>' } },
    { path: '/admin', component: { template: '<div>Admin</div>' } },
  ],
})

describe('Profile page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    router.push('/')

    mockGetPatientById.mockResolvedValue({
      id: 1,
      name: 'João',
      lastName: 'Silva',
      cpf: '12345678901',
      age: '25',
      role: 'C',
      isActive: true,
    })

    mockGetPsychologistById.mockResolvedValue({
      id: 2,
      name: 'Maria',
      lastName: 'Santos',
      cpf: '23456789012',
      age: '35',
      crp: '12345678',
      specialization: 'Clinical Psychology',
      isActive: true,
    })
  })

  it('shows only read-only patient data, without CRP or password', async () => {
    mockGetTokenData.mockReturnValue({ id: 1, role: 'C', exp: 0 })

    const wrapper = mount(Profile, { global: { plugins: [router] } })
    await flushPromises()

    const labels = wrapper.findAll('.profile-label').map((item) => item.text())
    expect(labels).toEqual(['Nome', 'Sobrenome', 'Idade', 'CPF'])

    const values = wrapper.findAll('.profile-value').map((item) => item.text())
    expect(values).toEqual(['João', 'Silva', '25 anos', '123.456.789-01'])

    expect(wrapper.findAll('input, textarea, select')).toHaveLength(0)
    expect(wrapper.text()).not.toContain('Senha')
    expect(wrapper.text()).not.toContain('CRP')
  })

  it('includes CRP for psychologist and still has no editable fields', async () => {
    mockGetTokenData.mockReturnValue({ id: 2, role: 'P', exp: 0 })

    const wrapper = mount(Profile, { global: { plugins: [router] } })
    await flushPromises()

    const labels = wrapper.findAll('.profile-label').map((item) => item.text())
    expect(labels).toEqual(['Nome', 'Sobrenome', 'Idade', 'CPF', 'CRP'])
    expect(wrapper.findAll('.profile-value')[4].text()).toBe('12345678')

    expect(wrapper.findAll('input, textarea, select')).toHaveLength(0)
    expect(wrapper.text()).not.toContain('Senha')
  })
})
