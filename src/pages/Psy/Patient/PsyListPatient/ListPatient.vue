<template>
  <div class="list-patients">
    <div class="create-topbar">
      <button class="back-btn" @click="router.push('/psychologist')">
        ← Voltar
      </button>

      <button
        class="top-option"
        @click="router.push('/patient/create')"
      >
        Cadastrar Paciente
      </button>

      <button class="top-option active"
              @click="router.push('/patient/list')">
        Listar Pacientes
      </button>
    </div>

    <div class="list-container">

      <div class="list-header">
        <h1>Pacientes cadastrados</h1>

        <span
          class="patient-count"
          v-if="patients.length"
        >
          {{ patients.length }}
          {{ patients.length == 1 ? 'registro' : 'registros' }}
        </span>
      </div>

      <div
        v-if="loading"
        class="loading-state"
      >
        <div class="loading-spinner"></div>
        <p>Carregando pacientes...</p>
      </div>

      <div
        v-else-if="patients.length"
        class="patient-list"
      >

        <div
          v-for="patient in patients"
          :key="patient.id"
          class="patient-row"
        >

          <div class="patient-info">

            <div class="patient-photo">
              {{ patient.name.charAt(0) }}
            </div>

            <div>
              <h2>{{ patient.name }} {{ patient.lastName }}</h2>
              <p>{{ formatCpf(patient.cpf) }}</p>
            </div>

          </div>

          <div class="patient-actions">

            <button class="edit-btn" @click="editPatient(patient)">
              ✏️
            </button>

            <button class="delete-btn" @click="deletePatient(patient.id)">
              🗑️
            </button>

          </div>

        </div>

      </div>

      <div
        v-else
        class="empty-state"
      >
        <div class="empty-icon">
          👥
        </div>

        <p>
          Nenhum paciente cadastrado ainda.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listPatients, type PatientDTO } from '../../../../services/api'
import getTokenData from '../../../../services/auth'

const router = useRouter()

const loading = ref(true)
const patients = ref<PatientDTO[]>([])

function formatCpf(cpf: string): string {
  const clean = cpf.replace(/\D/g, '')
  if (clean.length !== 11) return cpf
  return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`
}

async function fetchPatients() {
  loading.value = true
  try {
    const tokenData = getTokenData()
    const psychologistId = tokenData?.id != null ? Number(tokenData.id) : undefined
    patients.value = await listPatients(psychologistId)
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
    patients.value = []
  } finally {
    loading.value = false
  }
}

function editPatient(patient: PatientDTO) {
  // TODO: Implement edit functionality
  alert(`Editar paciente: ${patient.name} ${patient.lastName}`)
}

function deletePatient(id: number) {
  if (confirm('Tem certeza que deseja excluir este paciente?')) {
    // TODO: Implement delete functionality
    alert(`Excluir paciente ID: ${id}`)
  }
}

onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
@import './ListPatient.css';
</style>