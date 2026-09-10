import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home/Home.vue'

vi.mock('@emailjs/browser')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: { template: '<div>Login</div>' } }
  ]
})

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    router.push('/')
  })

  it('renders hero section with correct content', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('h1').text()).toContain('Organize seu consultório')
    expect(wrapper.find('p').text()).toContain('plataforma que ajuda psicólogos')
  })

  it('renders navigation with correct links', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    const navLinks = wrapper.findAll('.nav-links a')
    expect(navLinks).toHaveLength(3)
    expect(navLinks[0].text()).toBe('Início')
    expect(navLinks[1].text()).toBe('Como funciona')
    expect(navLinks[2].text()).toBe('Contato')
  })

  it('renders login button as router-link', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    const loginLink = wrapper.find('.nav-actions .btn-primary')
    expect(loginLink.exists()).toBe(true)
    expect(loginLink.text()).toBe('Entrar')
  })

  it('renders features section with all features', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    const features = wrapper.findAll('.feature')
    expect(features).toHaveLength(4)
    expect(features[0].text()).toContain('Agenda do consultório')
    expect(features[1].text()).toContain('Cadastro de pacientes')
    expect(features[2].text()).toContain('Pagamentos')
    expect(features[3].text()).toContain('Prontuário seguro')
  })

  it('renders how it works steps', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    const steps = wrapper.findAll('.step')
    expect(steps).toHaveLength(3)
    expect(steps[0].text()).toContain('Psicólogo cadastra o paciente')
    expect(steps[1].text()).toContain('Paciente recebe as credenciais')
    expect(steps[2].text()).toContain('Sessão acontece')
  })

  it('renders contact form with required fields', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('input[name="name"]').exists()).toBe(true)
    expect(wrapper.find('input[name="crp"]').exists()).toBe(true)
    expect(wrapper.find('input[name="email"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="observations"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('renders footer with current year', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    const currentYear = new Date().getFullYear()
    expect(wrapper.find('footer p').text()).toContain(String(currentYear))
  })

  it('renders preview sessions', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    const sessions = wrapper.findAll('.session')
    expect(sessions).toHaveLength(3)
    expect(sessions[0].text()).toContain('Ana Pereira')
    expect(sessions[1].text()).toContain('Bruno Lima')
    expect(sessions[2].text()).toContain('Carla Souza')
  })
})