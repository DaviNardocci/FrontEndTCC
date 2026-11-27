<template>
  <div class="payments-page">
    <div class="topbar">
      <button class="back-btn" @click="router.push('/psychologist')">← Voltar</button>
      <button class="top-option active">Pagamentos</button>
    </div>

    <div class="content-container">
      <div class="page-header">
        <div>
          <h1>Pagamentos</h1>
          <p class="subtitle">Consultas finalizadas e valores a receber.</p>
        </div>
        <span v-if="appointments.length" class="count">
          {{ appointments.length }}
          {{ appointments.length === 1 ? 'consulta' : 'consultas' }}
        </span>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Carregando pagamentos...</p>
      </div>

      <template v-else-if="appointments.length">
        <div class="payment-grid">
          <article
            v-for="appointment in appointments"
            :key="appointment.id"
            class="payment-card"
          >
            <div class="card-head">
              <div class="patient-info">
                <div class="patient-avatar">
                  {{ initials(appointment.patientName, appointment.patientLastName) }}
                </div>
                <div class="patient-text">
                  <span class="patient-name">
                    {{ appointment.patientName }} {{ appointment.patientLastName }}
                  </span>
                </div>
              </div>
              <span :class="['badge', 'badge-' + appointment.status.toLowerCase()]">
                {{ statusLabel(appointment.status) }}
              </span>
            </div>

            <div class="card-body">
              <div class="info-row">
                <span class="label">Data</span>
                <span class="value">{{ formatDate(appointment.date) }}</span>
              </div>

              <div class="info-row">
                <span class="label">Horário</span>
                <span class="value">{{ formatTime(appointment.date) }}</span>
              </div>

              <div class="info-row">
                <span class="label">Valor a receber</span>
                <span class="value price">{{ formatCurrency(getValue(appointment)) }}</span>
              </div>
            </div>
          </article>
        </div>

        <div class="total-panel">
          <div class="total-info">
            <span class="total-label">Total a receber</span>
            <p class="total-detail">
              {{ appointments.length }}
              {{ appointments.length === 1 ? 'consulta finalizada' : 'consultas finalizadas' }}
            </p>
          </div>
          <strong class="total-value">{{ formatCurrency(total) }}</strong>
        </div>

        <p class="fake-note">* Valores simulados para fins de demonstração.</p>
      </template>

      <div v-else class="empty-state">
        <div class="empty-icon">💳</div>
        <p>Nenhuma consulta finalizada até o momento.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getPsychologistAppointments, type AppointmentListDTO } from '@/services/api'
import getTokenData from '@/services/auth'

const router = useRouter()

const loading = ref(true)
const appointments = ref<AppointmentListDTO[]>([])

// Valores fictícios: o backend ainda não expõe o valor das consultas.
const FAKE_VALUES = [150, 180, 200, 220]

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const total = computed(() =>
  appointments.value.reduce((sum, appointment) => sum + getValue(appointment), 0)
)

function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return iso
  return date.toLocaleDateString('pt-BR')
}

function formatTime(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '--:--'
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pendente: 'Pendente',
    finalizado: 'Finalizado',
    cancelado: 'Cancelado',
  }
  return map[status?.toLowerCase()] ?? status
}

function initials(name?: string, lastName?: string): string {
  return `${name?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase() || '?'
}

function getValue(appointment: AppointmentListDTO): number {
  return FAKE_VALUES[appointment.id % FAKE_VALUES.length]
}

async function fetchPayments() {
  loading.value = true
  try {
    const tokenData = getTokenData()
    const psychologistId = tokenData?.id != null ? Number(tokenData.id) : undefined
    const list = psychologistId != null ? await getPsychologistAppointments(psychologistId) : []

    appointments.value = list.filter(
      (appointment) => appointment.status?.toLowerCase() === 'finalizado'
    )
  } catch (error) {
    console.error('Erro ao buscar pagamentos do psicólogo:', error)
    appointments.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPayments()
})
</script>

<style scoped>
.payments-page {
  min-height: 100vh;
  background: #fcfbf8;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
}

.topbar {
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
}

.top-option.active {
  background: #000;
}

.content-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0;
  font-size: 32px;
  color: #1a1a1a;
}

.subtitle {
  margin: 8px 0 0;
  color: #777;
  font-size: 14px;
}

.count {
  font-size: 13px;
  color: #888;
  background: #eee;
  padding: 6px 14px;
  border-radius: 999px;
  white-space: nowrap;
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.payment-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 18px;
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: 0.2s;
}

.payment-card:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.patient-avatar {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 14px;
  background: #1a1a1a;
  color: #fcfbf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.patient-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.patient-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.badge-finalizado {
  background: #dff5e7;
  color: #1d8a4a;
}

.badge-pendente {
  background: #fff7e0;
  color: #b7791f;
}

.badge-cancelado {
  background: #fde3e3;
  color: #c0392b;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px dashed #eee;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #999;
  white-space: nowrap;
}

.value {
  font-size: 14px;
  color: #1a1a1a;
  text-align: right;
}

.value.price {
  font-size: 16px;
  font-weight: 700;
}

.total-panel {
  margin-top: 24px;
  background: #1a1a1a;
  color: #fcfbf8;
  border-radius: 20px;
  padding: 26px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.total-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #aaa;
}

.total-detail {
  margin: 0;
  font-size: 14px;
  color: #d8d5cd;
}

.total-value {
  font-size: 32px;
  letter-spacing: -0.02em;
}

.fake-note {
  margin: 12px 4px 0;
  font-size: 12px;
  color: #aaa;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  color: #aaa;
}

.loading-state {
  text-align: center;
  padding: 80px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #eee;
  border-top: 3px solid #1a1a1a;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .total-panel {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .total-value {
    font-size: 28px;
  }
}
</style>
