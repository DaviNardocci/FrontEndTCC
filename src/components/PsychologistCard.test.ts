import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import PsychologistCard from '@/components/PsychologistCard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/admin/psychologist/update/:id', component: { template: '<div>Update</div>' } },
    { path: '/admin/psychologist/delete/:id', component: { template: '<div>Delete</div>' } }
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

    expect(pushSpy).toHaveBeenCalledWith('/admin/psychologist/update/1')
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

    expect(pushSpy).toHaveBeenCalledWith('/admin/psychologist/delete/1')
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

  it('shows reactivate button for inactive psychologist', async () => {
    const wrapper = mount(PsychologistCard, {
      props: { ...defaultProps, isActive: false },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.status-badge').text()).toBe('Inativo')
    expect(wrapper.find('.edit-btn').exists()).toBe(false)
    expect(wrapper.find('.delete-btn').exists()).toBe(false)

    await wrapper.find('.reactivate-btn').trigger('click')
    expect(wrapper.emitted('reactivate')).toEqual([[1]])
  })
})