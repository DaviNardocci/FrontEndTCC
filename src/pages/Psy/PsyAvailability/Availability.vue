<template>
  <div class="availability-page">
    <aside class="sidebar">
      <button class="back-btn" @click="router.push('/psychologist')">
        ← Voltar
      </button>
      <div class="psy-card-info">
        <div class="photo">🙋</div>
        <h2>Minha Agenda</h2>
        <p>Configure os dias e horários em que você atende. Os pacientes só poderão agendar nos horários informados aqui.</p>
      </div>

      <div class="sidebar-summary" v-if="hasSelection">
        <div class="summary-item">
          <span class="summary-num">{{ selectedDays.length }}</span>
          <span class="summary-label">dias</span>
        </div>
        <div class="summary-item">
          <span class="summary-num">{{ selectedHours.length }}</span>
          <span class="summary-label">horários</span>
        </div>
        <div class="summary-item">
          <span class="summary-num">{{ selectedDays.length * selectedHours.length }}</span>
          <span class="summary-label">slots</span>
        </div>
      </div>

      <div class="sidebar-hint" v-else>
        <span class="hint-icon">✨</span>
        Escolha ao menos um dia e um horário para começar.
      </div>
    </aside>

    <main class="content">
      <div class="content-inner">
        <header class="page-header">
          <div>
            <h1>Configurar disponibilidade</h1>
            <p class="subtitle">Marque os dias da semana e os horários disponíveis para atendimento.</p>
          </div>
          <div class="header-status" :class="{ ready: hasSelection }">
            <span class="dot"></span>
            {{ hasSelection ? 'Pronto para salvar' : 'Seleção incompleta' }}
          </div>
        </header>

        <section class="card">
          <div class="card-head">
            <h2>Dias da semana</h2>
            <span class="card-count">{{ selectedDays.length }}/7 selecionados</span>
          </div>
          <div class="days-grid">
            <button
              v-for="day in weekDays"
              :key="day.value"
              class="day-pill"
              :class="{ active: selectedDays.includes(day.value) }"
              @click="toggleDay(day.value)"
            >
              <span class="pill-check">{{ selectedDays.includes(day.value) ? '✓' : '' }}</span>
              {{ day.label }}
            </button>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h2>Horários</h2>
            <span class="card-count">{{ selectedHours.length }} horários</span>
          </div>
          <div class="hours-grid">
            <button
              v-for="hora in hoursOptions"
              :key="hora"
              class="hour-pill"
              :class="{ active: selectedHours.includes(hora) }"
              @click="toggleHour(hora)"
            >
              <span class="pill-check">{{ selectedHours.includes(hora) ? '✓' : '' }}</span>
              {{ hora }}
            </button>
          </div>
          <p class="hours-note">
            Estes horários valerão para todos os dias selecionados acima.
          </p>
        </section>

        <div class="actions">
          <button class="save-btn" :disabled="saving || !hasSelection" @click="saveAvailability">
            <span v-if="saving" class="spinner"></span>
            {{ saving ? 'Salvando...' : 'Salvar disponibilidade' }}
          </button>
          <button class="clear-btn" :disabled="!hasSelection" @click="clearSelection">
            Limpar seleção
          </button>
        </div>

        <div v-if="saveMessage" class="message" :class="saveOk ? 'ok' : 'error'">
          <span class="message-icon">{{ saveOk ? '✓' : '⚠' }}</span>
          {{ saveMessage }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createServiceDays } from '../../../services/api'
import getTokenData from '../../../services/auth'

const router = useRouter()

const psychologistId = ref<number | null>(null)

const weekDays = [
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' }
]

const hoursOptions = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
]

const selectedDays = ref<number[]>([])
const selectedHours = ref<string[]>([])

const saving = ref(false)
const saveMessage = ref('')
const saveOk = ref(false)

const hasSelection = computed(() => selectedDays.value.length > 0 && selectedHours.value.length > 0)

onMounted(() => {
  const tokenData = getTokenData()
  if (tokenData?.role !== 'P') {
    // router.push('/login')
  }
  if (tokenData?.id != null) {
    psychologistId.value = Number(tokenData.id)
  }
})

function toggleDay(value: number) {
  if (selectedDays.value.includes(value)) {
    selectedDays.value = selectedDays.value.filter((d) => d !== value)
  } else {
    selectedDays.value.push(value)
  }
}

function toggleHour(hora: string) {
  if (selectedHours.value.includes(hora)) {
    selectedHours.value = selectedHours.value.filter((h) => h !== hora)
  } else {
    selectedHours.value.push(hora)
  }
}

function clearSelection() {
  selectedDays.value = []
  selectedHours.value = []
  saveMessage.value = ''
}

async function saveAvailability() {
  if (!psychologistId.value || !hasSelection.value) return

  saving.value = true
  saveMessage.value = ''

  const days = selectedDays.value.map((day) => ({
    weekDay: day,
    hours: [...selectedHours.value]
  }))

  const ok = await createServiceDays(psychologistId.value, days)

  saving.value = false
  saveOk.value = ok
  saveMessage.value = ok
    ? 'Disponibilidade salva com sucesso!'
    : 'Erro ao salvar. Verifique se você está autenticado como psicólogo e tente novamente.'
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.availability-page {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 60%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
}

.sidebar {
  width: 320px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #4f46e5 0%, #4338ca 100%);
  color: #fff;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
}

.back-btn {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  padding: 9px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  align-self: flex-start;
  transition: all 0.2s;
  font-family: inherit;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-2px);
}

.psy-card-info {
  margin-top: 40px;
}

.psy-card-info .photo {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.psy-card-info h2 {
  margin: 18px 0 8px;
  font-size: 22px;
  font-weight: 700;
}

.psy-card-info p {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.92;
  margin: 0;
}

.sidebar-summary {
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-num {
  font-size: 26px;
  font-weight: 700;
}

.summary-label {
  font-size: 12px;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-hint {
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.5;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.hint-icon {
  font-size: 16px;
}

.content {
  flex: 1;
  padding: 40px 48px;
  display: flex;
  justify-content: center;
}

.content-inner {
  width: 100%;
  max-width: 760px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  gap: 16px;
  flex-wrap: wrap;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
  color: #1e293b;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.subtitle {
  color: #64748b;
  margin: 8px 0 0;
  font-size: 15px;
}

.header-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.header-status.ready {
  color: #059669;
  border-color: #a7f3d0;
  background: #f0fdf4;
}

.header-status .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
}

.header-status.ready .dot {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.card-head h2 {
  margin: 0;
  font-size: 17px;
  color: #1e293b;
  font-weight: 700;
}

.card-count {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 999px;
}

.days-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hours-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.day-pill,
.hour-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #334155;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

.pill-check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: transparent;
  transition: all 0.18s;
}

.day-pill:hover,
.hour-pill:hover {
  border-color: #6366f1;
  background: #eef2ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.12);
}

.day-pill.active,
.hour-pill.active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: #fff;
  box-shadow: 0 5px 14px rgba(79, 70, 229, 0.3);
}

.day-pill.active .pill-check,
.hour-pill.active .pill-check {
  border-color: #fff;
  color: #4f46e5;
  background: #fff;
}

.hours-note {
  margin: 6px 0 0;
  font-size: 12.5px;
  color: #94a3b8;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 8px;
}

.save-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #4f46e5;
  color: #fff;
  border: none;
  padding: 14px 26px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
  transition: all 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.clear-btn {
  background: transparent;
  border: 1.5px solid #e2e8f0;
  color: #64748b;
  padding: 13px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.clear-btn:hover:not(:disabled) {
  border-color: #cbd5e1;
  color: #334155;
  background: #f8fafc;
}

.clear-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 18px;
}

.message-icon {
  font-size: 16px;
  font-weight: 700;
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

@media (max-width: 860px) {
  .availability-page {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
  .content {
    padding: 24px;
  }
}
</style>
