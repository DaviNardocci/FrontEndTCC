import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import PsychologistCard from '@/components/PsychologistCard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/admin/update/:id', component: { template: '<div>Update</div>' } },
    { path: '/admin/delete/:id', component: { template: '<div>Delete</div>' } }
  ]
})

describe('PsychologistCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    router.push('/')
  })

  const defaultProps = {
    id: 1,
    name: 'Maria',
    lastName: 'Santos',
    specialization: 'Clinical Psychology'
  }

  it('renders psychologist information correctly', () => {
    const wrapper = mount(PsychologistCard, {
      props: defaultProps,
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('h2').text()).toBe('Maria Santos')
    expect(wrapper.find('p').text()).toBe('Clinical Psychology')
    expect(wrapper.find('.psychologist-photo').text()).toBe('M')
  })

  it('shows first letter of name as initial', () => {
    const wrapper = mount(PsychologistCard, {
      props: { ...defaultProps, name: 'João' },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.psychologist-photo').text()).toBe('J')
  })

  it('navigates to update page when edit button is clicked', async () => {
    const pushSpy = vi.spyOn(router, 'push')
    
    const wrapper = mount(PsychologistCard, {
      props: defaultProps,
      global: {
        plugins: [router]
      }
    })

    const editBtn = wrapper.find('.edit-btn')
    await editBtn.trigger('click')

    expect(pushSpy).toHaveBeenCalledWith('/admin/update/1')
  })

  it('navigates to delete page when delete button is clicked', async () => {
    const pushSpy = vi.spyOn(router, 'push')
    
    const wrapper = mount(PsychologistCard, {
      props: defaultProps,
      global: {
        plugins: [router]
      }
    })

    const deleteBtn = wrapper.find('.delete-btn')
    await deleteBtn.trigger('click')

    expect(pushSpy).toHaveBeenCalledWith('/admin/delete/1')
  })

  it('renders edit and delete icons', () => {
    const wrapper = mount(PsychologistCard, {
      props: defaultProps,
      global: {
        plugins: [router]
      }
    })

    const editIcon = wrapper.find('.edit-btn img')
    const deleteIcon = wrapper.find('.delete-btn img')

    expect(editIcon.attributes('alt')).toBe('editar')
    expect(deleteIcon.attributes('alt')).toBe('excluir')
  })
})