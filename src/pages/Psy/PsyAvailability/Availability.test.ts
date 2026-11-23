import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Availability from '@/pages/Psy/PsyAvailability/Availability.vue'

const { mockGetTokenData, mockGetServiceDays, mockCreateServiceDays } = vi.hoisted(() => ({
  mockGetTokenData: vi.fn(),
  mockGetServiceDays: vi.fn(),
  mockCreateServiceDays: vi.fn(),
}))

vi.mock('@/services/auth', () => ({ default: mockGetTokenData }))
vi.mock('@/services/api', () => ({
  getServiceDays: mockGetServiceDays,
  createServiceDays: mockCreateServiceDays,
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/psychologist', component: { template: '<div>Psychologist</div>' } },
  ],
})

describe('Availability page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    router.push('/')

    mockGetTokenData.mockReturnValue({ id: 10, role: 'P', exp: 0 })
    mockGetServiceDays.mockResolvedValue([
      { weekDay: 2, hours: ['09:00', '14:00'] },
      { weekDay: 3, hours: ['10:00'] },
    ])
    mockCreateServiceDays.mockResolvedValue(true)
  })

  it('offers all 24 hours from 00:00 to 23:00', async () => {
    const wrapper = mount(Availability, { global: { plugins: [router] } })
    await flushPromises()

    const hours = wrapper.findAll('.hour-pill').map((item) => item.text())
    expect(hours).toHaveLength(24)
    expect(hours[0]).toBe('00:00')
    expect(hours[23]).toBe('23:00')
  })

  it('preselects the schedule already saved for the psychologist', async () => {
    const wrapper = mount(Availability, { global: { plugins: [router] } })
    await flushPromises()

    const activeDays = wrapper
      .findAll('.day-pill')
      .filter((item) => item.classes().includes('active'))
      .map((item) => item.text())
    expect(activeDays).toEqual(['Terça', 'Quarta'])

    const activeHours = wrapper
      .findAll('.hour-pill')
      .filter((item) => item.classes().includes('active'))
      .map((item) => item.text())
    expect(activeHours).toEqual(['09:00', '10:00', '14:00'])
  })

  it('saves the selected days and hours', async () => {
    const wrapper = mount(Availability, { global: { plugins: [router] } })
    await flushPromises()

    await wrapper.find('.save-btn').trigger('click')
    await flushPromises()

    expect(mockCreateServiceDays).toHaveBeenCalledWith(10, [
      { weekDay: 2, hours: ['09:00', '10:00', '14:00'] },
      { weekDay: 3, hours: ['09:00', '10:00', '14:00'] },
    ])
    expect(wrapper.find('.message.ok').text()).toContain('Horários salvos com sucesso!')
  })
})
