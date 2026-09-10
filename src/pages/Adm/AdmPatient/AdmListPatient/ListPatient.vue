<template>
  <div class="list-patients">

    <!-- Menu superior -->
    <div class="create-topbar">

      <button
        class="back-btn"
        @click="router.push('/admin')"
      >
        ← Voltar
      </button>

      <button
        class="top-option"
        @click="router.push('/admin/patient/create')"
      >
        Cadastrar Paciente
      </button>

      <button class="top-option active">
        Listar Pacientes
      </button>

    </div>

    <!-- Conteúdo -->
    <div class="list-container">

      <div class="list-header">

        <h1>Pacientes cadastrados</h1>

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
import getTokenData from '../../../../services/auth'
import { listPatients, type PatientDTO } from '../../../../services/api'

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
    patients.value = await listPatients()
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

onMounted(async () => {
  const tokenData = getTokenData()

  if (tokenData?.role !== 'A') {
    // router.push('/login')
    // alert('Acesso negado. Você não tem permissão para acessar esta página.')
  }

  await fetchPatients()
})
</script>

<style scoped>
@import './ListPatient.css';
</style>