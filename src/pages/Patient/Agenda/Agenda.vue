<template>
  <div class="agenda-page">
    <aside class="sidebar">
      <button class="back-btn" @click="router.push('/patient')">
        ← Voltar
      </button>

```
  <div class="psychologist-card" v-if="psychologist">
    <div class="photo">👨‍⚕️</div>
    <h2>Psicólogo</h2>
    <p class="description">
      {{ psychologist.name }} {{ psychologist.lastName }}
    </p>

    <div class="info-list">
      <div class="info-item">
        <span>📅</span>
        <p>{{ psychologist.specialization }}</p>
      </div>
    </div>
  </div>

  <div class="psychologist-card" v-else>
    <p>Carregando informações do psicólogo...</p>
  </div>
</aside>

<main class="agenda-content">
  <h1>Agendar Consulta</h1>
  <p class="subtitle">
    Escolha uma data disponível para visualizar os horários.
  </p>

  <div class="calendar-card">
    <VDatePicker
      v-model="selectedDate"
      :min-date="new Date()"
      borderless
      expanded
      @dayclick="selectDay"
    />
  </div>
</main>

<!-- MODAL HORÁRIOS -->
<div v-if="showTimeModal" class="modal-overlay">
  <div class="modal time-modal">
    <h2>Horários disponíveis</h2>
    <p class="selected-day">{{ formattedDate }}</p>

    <div class="times-container">
      <div class="times-list">
        <button
          v-if="loadingTimes"
          disabled
          class="time-button"
        >
          Carregando...
        </button>

        <button
          v-else
          v-for="(time, index) in times"
          :key="time.hour"
          class="time-button"
          :disabled="!time.available"
          :style="{ animationDelay: `${index * 0.08}s` }"
          @click="selectTime(time)"
        >
          <span class="time-text">{{ time.hour }}</span>

          <span class="modality-icons">
            <span v-if="time.modalities.includes('online')">
              💻
            </span>

            <span v-if="time.modalities.includes('presencial')">
              👤
            </span>
          </span>
        </button>
      </div>
    </div>

    <div class="modal-actions">
      <button
        class="cancel-btn"
        @click="showTimeModal = false"
      >
        Cancelar
      </button>
    </div>
  </div>
</div>

<!-- MODAL ESCOLHA MODALIDADE -->
<div v-if="showModalityModal" class="modal-overlay">
  <div class="modal">
    <h2>Tipo de atendimento</h2>
    <p>Escolha como deseja realizar sua consulta:</p>

    <div class="modality-buttons">
      <button
        class="time-button"
        @click="chooseModality('online')"
      >
        💻 Online
      </button>

      <button
        class="time-button"
        @click="chooseModality('presencial')"
      >
        👤 Presencial
      </button>
    </div>
  </div>
</div>

<!-- CONFIRMAÇÃO -->
<div v-if="showConfirmModal" class="modal-overlay">
  <div class="modal">
    <h2>Confirmar consulta</h2>

    <p>
      Deseja agendar sua consulta para
      <strong>{{ formattedDate }}</strong>
      às
      <strong>{{ selectedHour }}</strong>?
      <br><br>

      Modalidade:
      <strong>
        {{
          selectedModality === 'online'
            ? '💻 Online'
            : '👤 Presencial'
        }}
      </strong>
    </p>

    <div class="modal-actions">
      <button
        class="cancel-btn"
        @click="showConfirmModal = false"
      >
        Cancelar
      </button>

      <button
        class="confirm-btn"
        @click="confirmAppointment"
        :disabled="confirmLoading"
      >
        {{ confirmLoading ? 'Agendando...' : 'Confirmar' }}
      </button>
    </div>
  </div>
</div>
```

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import {
  getAvailability,
  createAppointment,
  getPatientPsychologist,
  getPatientAgenda,
  type AvailabilityHour
} from '@/services/api'

import getTokenData from '@/services/auth'

const router = useRouter()

const selectedDate = ref(new Date())
const selectedHour = ref('')
const selectedModality = ref('')

const showTimeModal = ref(false)
const showModalityModal = ref(false)
const showConfirmModal = ref(false)

const loadingTimes = ref(false)
const confirmLoading = ref(false)

const psychologist = ref<{
  id: number
  name: string
  lastName: string
  specialization: string
} | null>(null)

const bookedDates = ref<string[]>([])

interface TimeWithModalities extends AvailabilityHour {
  modalities: string[]
}

const times = ref<TimeWithModalities[]>([])

async function fetchPsychologist() {
  const tokenData = getTokenData()

  if (!tokenData?.id) return

  try {
    const data = await getPatientPsychologist(Number(tokenData.id))

    if (data) {
      psychologist.value = {
        id: data.psychologistId,
        name: data.name,
        lastName: data.lastName,
        specialization: data.specialization
      }
    }
  } catch (error) {
    console.error('Erro ao buscar psicólogo:', error)
  }
}

async function selectDay(day: any) {
  const picked = new Date(day.date)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (picked < today) {
    alert('Não é possível agendar em datas passadas.')
    return
  }

  selectedDate.value = day.date

  await fetchAvailability()

  showTimeModal.value = true
}

async function fetchAvailability() {
  if (!psychologist.value) return

  const pad = (n: number) => String(n).padStart(2, '0')

  const date = new Date(selectedDate.value)

  const dateStr =
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}`

  loadingTimes.value = true

  const now = new Date()

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  const nowMinutes =
    now.getHours() * 60 + now.getMinutes()

  try {
    const availability = await getAvailability(
      psychologist.value.id,
      dateStr
    )

    if (availability) {
      times.value = availability.hours
        .map((h) => ({
          hour: h.hour,
          available: h.available,
          modalities: h.available
            ? ['online', 'presencial']
            : []
        }))
        .filter((t) => {
          if (!isToday) return true

          const [hh, mm] = t.hour
            .split(':')
            .map(Number)

          return hh * 60 + mm > nowMinutes
        })
    } else {
      times.value = []
    }
  } catch (error) {
    console.error(
      'Erro ao buscar disponibilidade:',
      error
    )

    times.value = []
  } finally {
    loadingTimes.value = false
  }
}

function selectTime(time: TimeWithModalities) {
  if (hasAppointmentOnSelectedDay()) return

  selectedHour.value = time.hour

  if (time.modalities.length === 1) {
    selectedModality.value = time.modalities[0]

    showTimeModal.value = false
    showConfirmModal.value = true
  } else {
    showTimeModal.value = false
    showModalityModal.value = true
  }
}

function hasAppointmentOnSelectedDay(): boolean {
  const picked = new Date(selectedDate.value)

  const pad = (n: number) => String(n).padStart(2, '0')

  const key =
    `${picked.getFullYear()}-` +
    `${pad(picked.getMonth() + 1)}-` +
    `${pad(picked.getDate())}`

  if (bookedDates.value.includes(key)) {
    alert('Você já tem uma consulta agendada neste dia.')
    return true
  }

  return false
}

function chooseModality(modality: string) {
  selectedModality.value = modality

  showModalityModal.value = false
  showConfirmModal.value = true
}

const formattedDate = computed(() => {
  return selectedDate.value.toLocaleDateString(
    'pt-BR',
    {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
  )
})

const selectedDateTime = computed(() => {
  const date = new Date(selectedDate.value)

  const [hours, minutes] =
    selectedHour.value.split(':').map(Number)

  date.setHours(hours)
  date.setMinutes(minutes)
  date.setSeconds(0)
  date.setMilliseconds(0)

  const pad = (n: number) =>
    String(n).padStart(2, '0')

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}T` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}:00`
  )
})

async function confirmAppointment() {
  const tokenData = getTokenData()

  if (!tokenData?.id || !psychologist.value) return

  confirmLoading.value = true

  try {
    const appointmentData = {
      type:
        selectedModality.value === 'online'
          ? 'O'
          : 'P',

      dateAndTime: selectedDateTime.value,

      patientId: Number(tokenData.id),

      psychologistId: psychologist.value.id
    }

    const result =
      await createAppointment(appointmentData)

    if (result.success) {
      alert('Consulta agendada com sucesso!')

      const pad = (n: number) =>
        String(n).padStart(2, '0')

      const picked =
        new Date(selectedDate.value)

      const key =
        `${picked.getFullYear()}-` +
        `${pad(picked.getMonth() + 1)}-` +
        `${pad(picked.getDate())}`

      if (!bookedDates.value.includes(key)) {
        bookedDates.value.push(key)
      }

      showConfirmModal.value = false
      selectedHour.value = ''
      selectedModality.value = ''

      await fetchAvailability()
    } else {
      const msgMap: Record<string, string> = {
        JA_TEM_CONSULTA:
          'Você já tem uma consulta agendada neste dia.',

        SLOT_INDISPONIVEL:
          'Esse horário não está mais disponível. Escolha outro.',

        DATA_PASSADA:
          'Não é possível agendar em datas passadas.',

        HORARIO_PASSADO:
          'Não é possível agendar em um horário que já passou.'
      }

      alert(
        msgMap[result.message ?? ''] ??
        'Erro ao agendar consulta. Tente novamente.'
      )
    }
  } catch (error) {
    console.error(
      'Erro ao confirmar agendamento:',
      error
    )

    alert(
      'Erro ao agendar consulta. Tente novamente.'
    )
  } finally {
    confirmLoading.value = false
  }
}

onMounted(() => {
  const tokenData = getTokenData()

  if (tokenData?.id != null) {
    getPatientAgenda(Number(tokenData.id))
      .then((dates) => {
        bookedDates.value = dates
      })
  }

  fetchPsychologist()
})
</script>

<style scoped>
@import './Agenda.css';
</style>
