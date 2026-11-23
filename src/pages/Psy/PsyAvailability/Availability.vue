<template>
  <div class="availability-page">
    <div class="create-topbar">
      <button class="back-btn" @click="router.push('/psychologist')">
        ← Voltar
      </button>

      <button class="top-option active">
        Horários
      </button>
    </div>

    <div class="list-container">
      <div class="list-header">
        <h1>Configurar horários</h1>

        <span v-if="!loading" class="selection-summary">
          {{ selectedDays.length }}/7 dias · {{ selectedHours.length }}/24 horários
        </span>
      </div>

      <p class="page-description">
        Marque os dias e os horários em que você atende. Os pacientes só poderão agendar nos horários informados aqui.
      </p>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Carregando horários...</p>
      </div>

      <template v-else>
        <section class="card">
          <div class="card-head">
            <h2>Dias da semana</h2>
            <span class="card-count">{{ selectedDays.length }}/7</span>
          </div>

          <div class="days-grid">
            <button
              v-for="day in weekDays"
              :key="day.value"
              type="button"
              class="day-pill"
              :class="{ active: selectedDays.includes(day.value) }"
              @click="toggleDay(day.value)"
            >
              {{ day.label }}
            </button>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h2>Horários</h2>
            <span class="card-count">{{ selectedHours.length }}/24</span>
          </div>

          <div class="hours-grid">
            <button
              v-for="hora in hoursOptions"
              :key="hora"
              type="button"
              class="hour-pill"
              :class="{ active: selectedHours.includes(hora) }"
              @click="toggleHour(hora)"
            >
              {{ hora }}
            </button>
          </div>

          <p class="hours-note">
            De 00:00 (meia-noite) até 23:00. Os horários valem para todos os dias selecionados.
          </p>
        </section>

        <div class="actions">
          <button class="save-btn" :disabled="saving || !hasSelection" @click="saveAvailability">
            <span v-if="saving" class="spinner"></span>
            {{ saving ? 'Salvando...' : 'Salvar horários' }}
          </button>

          <button class="clear-btn" :disabled="!hasSelection" @click="clearSelection">
            Limpar seleção
          </button>
        </div>

        <div v-if="saveMessage" class="message" :class="saveOk ? 'ok' : 'error'">
          {{ saveMessage }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createServiceDays, getServiceDays } from '../../../services/api'
import getTokenData from '../../../services/auth'

const router = useRouter()

const weekDays = [
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
]

const hoursOptions = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`)

const psychologistId = ref<number | null>(null)
const selectedDays = ref<number[]>([])
const selectedHours = ref<string[]>([])
const loading = ref(true)
const saving = ref(false)
const saveMessage = ref('')
const saveOk = ref(false)

const hasSelection = computed(() => selectedDays.value.length > 0 && selectedHours.value.length > 0)

function toggleDay(value: number) {
  selectedDays.value = selectedDays.value.includes(value)
    ? selectedDays.value.filter((day) => day !== value)
    : [...selectedDays.value, value]
}

function toggleHour(hour: string) {
  selectedHours.value = selectedHours.value.includes(hour)
    ? selectedHours.value.filter((item) => item !== hour)
    : [...selectedHours.value, hour]
}

function clearSelection() {
  selectedDays.value = []
  selectedHours.value = []
  saveMessage.value = ''
}

async function loadServiceDays() {
  if (psychologistId.value == null) {
    loading.value = false
    return
  }

  try {
    const days = await getServiceDays(psychologistId.value)
    selectedDays.value = days.map((day) => day.weekDay)
    selectedHours.value = [...new Set(days.flatMap((day) => day.hours))].sort()
  } catch (error) {
    console.error('Erro ao carregar horários cadastrados:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const tokenData = getTokenData()
  if (tokenData?.role !== 'P' || tokenData.id == null) {
    loading.value = false
    return
  }

  psychologistId.value = Number(tokenData.id)
  loadServiceDays()
})

async function saveAvailability() {
  if (psychologistId.value == null || !hasSelection.value) return

  saving.value = true
  saveMessage.value = ''

  const days = selectedDays.value.map((weekDay) => ({
    weekDay,
    hours: [...selectedHours.value].sort(),
  }))

  const ok = await createServiceDays(psychologistId.value, days)

  saving.value = false
  saveOk.value = ok
  saveMessage.value = ok
    ? 'Horários salvos com sucesso!'
    : 'Erro ao salvar. Tente novamente.'
}
</script>

<style scoped>
.availability-page {
  min-height: 100vh;
  background: #fcfbf8;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
}

/* Topbar */

.create-topbar {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #2a2a2a;
  background: #1a1a1a;
}

.back-btn {
  border: none;
  background: #111;
  color: #fcfbf8;
  padding: 0 28px;
  font-size: 14px;
  cursor: pointer;
  border-right: 1px solid #2a2a2a;
  transition: 0.2s;
  font-family: inherit;
}

.back-btn:hover {
  background: #2a2a2a;
}

.top-option {
  flex: 1;
  border: none;
  background: transparent;
  color: #fcfbf8;
  padding: 28px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
  font-family: inherit;
}

.top-option:hover {
  background: #2a2a2a;
}

.top-option.active {
  background: #000000;
  color: #ffffff;
}

/* Container */

.list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.list-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 500;
  color: #1a1a1a;
}

.selection-summary {
  font-size: 13px;
  font-weight: 500;
  color: #777;
  background: #eeeeee;
  padding: 6px 14px;
  border-radius: 999px;
  white-space: nowrap;
}

.page-description {
  margin: 0 0 32px;
  font-size: 14px;
  line-height: 1.6;
  color: #777;
}

/* Cards */

.card {
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 16px;
  padding: 26px;
  margin-bottom: 20px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-head h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #1a1a1a;
}

.card-count {
  font-size: 13px;
  font-weight: 500;
  color: #777;
  background: #eeeeee;
  padding: 6px 14px;
  border-radius: 999px;
}

/* Seleção */

.days-grid,
.hours-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.day-pill,
.hour-pill {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #ffffff;
  color: #1a1a1a;
  padding: 11px 18px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: 0.2s;
}

.day-pill:hover,
.hour-pill:hover {
  border-color: #1a1a1a;
}

.day-pill.active,
.hour-pill.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
}

.hour-pill {
  min-width: 84px;
  text-align: center;
}

.hours-note {
  margin: 16px 0 0;
  font-size: 13px;
  color: #999;
}

/* Ações */

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.save-btn,
.clear-btn {
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: 0.2s;
}

.save-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #1a1a1a;
  background: #1a1a1a;
  color: #ffffff;
}

.save-btn:hover:not(:disabled) {
  background: #333333;
  border-color: #333333;
}

.clear-btn {
  border: 1px solid #1a1a1a;
  background: #ffffff;
  color: #1a1a1a;
}

.clear-btn:hover:not(:disabled) {
  background: #1a1a1a;
  color: #ffffff;
}

.save-btn:disabled,
.clear-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Loading e mensagens */

.loading-state {
  text-align: center;
  padding: 80px 24px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #eeeeee;
  border-top-color: #1a1a1a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

.loading-state p {
  font-size: 14px;
  color: #aaaaaa;
}

.message {
  margin-top: 20px;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.message.ok {
  background: #f0fdf4;
  color: #065f46;
  border: 1px solid #bbf7d0;
}

.message.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Responsivo */

@media (max-width: 600px) {
  .create-topbar {
    flex-wrap: wrap;
  }

  .list-container {
    padding: 24px 16px;
  }

  .list-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .list-header h1 {
    font-size: 24px;
  }

  .card {
    padding: 18px;
  }

  .hour-pill {
    min-width: 72px;
  }
}
</style>
