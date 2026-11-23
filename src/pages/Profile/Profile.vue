<template>
  <div class="profile-page">
    <div class="create-topbar">
      <button class="back-btn" @click="router.push(backPath)">
        ← Voltar
      </button>

      <button class="top-option active">
        Meu Perfil
      </button>
    </div>

    <div class="list-container">
      <div class="list-header">
        <h1>Meus dados</h1>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Carregando perfil...</p>
      </div>

      <div v-else-if="profile" class="profile-card">
        <div class="profile-identity">
          <div class="profile-photo">
            {{ initial }}
          </div>

          <div>
            <h2>{{ profile.name }} {{ profile.lastName }}</h2>
            <p>{{ roleLabel }}</p>
          </div>
        </div>

        <div class="profile-rows">
          <div
            v-for="row in rows"
            :key="row.label"
            class="profile-row"
          >
            <span class="profile-label">{{ row.label }}</span>
            <span class="profile-value">{{ row.value }}</span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">👤</div>
        <p>Não foi possível carregar seus dados.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import getTokenData from '../../services/auth'
import { getPatientById, getPsychologistById } from '../../services/api'

type Role = 'P' | 'C'

interface ProfileView {
  name: string
  lastName: string
  age: string
  cpf: string
  crp?: string
}

const router = useRouter()
const role = ref<Role | null>(null)
const profile = ref<ProfileView | null>(null)
const loading = ref(true)

const isPsychologist = computed(() => role.value === 'P')
const backPath = computed(() => (isPsychologist.value ? '/psychologist' : '/patient'))
const roleLabel = computed(() => (isPsychologist.value ? 'Psicólogo' : 'Paciente'))
const initial = computed(() => profile.value?.name.charAt(0).toUpperCase() ?? '?')

function formatCpf(cpf: string): string {
  const clean = cpf.replace(/\D/g, '')
  if (clean.length !== 11) return cpf
  return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`
}

const rows = computed(() => {
  const data = profile.value
  if (!data) return []

  const fields = [
    { label: 'Nome', value: data.name },
    { label: 'Sobrenome', value: data.lastName },
    { label: 'Idade', value: `${data.age} anos` },
    { label: 'CPF', value: formatCpf(data.cpf) },
  ]

  if (isPsychologist.value && data.crp) {
    fields.push({ label: 'CRP', value: data.crp })
  }

  return fields
})

onMounted(async () => {
  const tokenData = getTokenData()

  if (!tokenData || (tokenData.role !== 'P' && tokenData.role !== 'C')) {
    router.replace(tokenData?.role === 'A' ? '/admin' : '/login')
    loading.value = false
    return
  }

  role.value = tokenData.role

  try {
    if (tokenData.role === 'P') {
      const data = await getPsychologistById(tokenData.id)
      profile.value = data
        ? {
            name: data.name,
            lastName: data.lastName,
            age: data.age,
            cpf: data.cpf,
            crp: data.crp,
          }
        : null
    } else {
      const data = await getPatientById(tokenData.id)
      profile.value = data
        ? {
            name: data.name,
            lastName: data.lastName,
            age: data.age,
            cpf: data.cpf,
          }
        : null
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error)
    profile.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@import './Profile.css';
</style>
