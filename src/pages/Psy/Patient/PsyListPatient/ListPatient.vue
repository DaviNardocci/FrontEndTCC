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
        v-if="!loading && inactivePatients.length"
        class="inactive-section"
      >

        <div class="section-header">
          <h2>Pacientes desativados</h2>
          <span class="patient-count">
            {{ inactivePatients.length }} {{ inactivePatients.length == 1 ? 'registro' : 'registros' }}
          </span>
        </div>

        <div class="patient-list">
          <div
            v-for="patient in inactivePatients"
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
                <span class="status-badge">Inativo</span>
              </div>
            </div>

            <div class="patient-actions">
              <button class="reactivate-btn" @click="reactivatePatientRow(patient.id)">
                Reativar
              </button>
            </div>
          </div>
        </div>

      </div>

      <div
        v-else-if="!loading && !patients.length && !inactivePatients.length"
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
import { listPatients, listNotActivePatientsByPsychologist, deletePatient as deactivatePatient, reactivatePatient as reactivatePatientApi, type PatientDTO } from '../../../../services/api'
import getTokenData from '../../../../services/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const loading = ref(true)
const patients = ref<PatientDTO[]>([])
const inactivePatients = ref<PatientDTO[]>([])

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
    const [active, inactive] = await Promise.all([
      listPatients(psychologistId),
      psychologistId != null ? listNotActivePatientsByPsychologist(psychologistId) : Promise.resolve([]),
    ])
    patients.value = active
    inactivePatients.value = inactive
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
    patients.value = []
  } finally {
    loading.value = false
  }
}

function editPatient(patient: PatientDTO) {
  router.push(`/patient/update/${patient.id}`)
}

async function deletePatient(id: number) {
  if (!confirm('Tem certeza que deseja desativar este paciente?')) return

  const ok = await deactivatePatient(id)
  if (ok) {
    toast.success('Paciente desativado com sucesso.')
    await fetchPatients()
  } else {
    toast.error('Não foi possível desativar o paciente. Verifique se ele está vinculado a você.')
  }
}

async function reactivatePatientRow(id: number) {
  const ok = await reactivatePatientApi(id)
  if (ok) {
    toast.success('Paciente reativado com sucesso.')
    await fetchPatients()
  } else {
    toast.error('Não foi possível reativar o paciente.')
  }
}

onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
@import './ListPatient.css';
</style>