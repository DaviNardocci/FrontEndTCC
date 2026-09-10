<template>
  <div class="appointments-page">
    <div class="topbar">
      <button class="back-btn" @click="router.push('/patient')">← Voltar</button>
      <button class="top-option active">Minhas Consultas</button>
    </div>

    <div class="list-container">
      <div class="list-header">
        <h1>Minhas Consultas</h1>
        <span v-if="appointments.length" class="count">
          {{ appointments.length }}
          {{ appointments.length == 1 ? 'consulta' : 'consultas' }}
        </span>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Carregando consultas...</p>
      </div>

      <div v-else-if="appointments.length" class="appointment-list">
        <div v-for="appointment in appointments" :key="appointment.id" class="appointment-row">
          <div class="appointment-info">
            <div class="appointment-photo">{{ appointment.type === 'O' ? '💻' : '👤' }}</div>
            <div>
              <div class="row-top">
                <h2>{{ formatDate(appointment.date) }}</h2>
                <span :class="['badge', 'badge-' + appointment.status]">{{ statusLabel(appointment.status) }}</span>
              </div>
              <p>{{ appointment.type === 'O' ? 'Consulta Online' : 'Consulta Presencial' }} · {{ appointment.psychologistName }} {{ appointment.psychologistLastName }}</p>
            </div>
          </div>
          <div class="appointment-actions">
            <button
              v-if="appointment.status === 'pendente'"
              class="cancel-btn"
              @click="cancelAppointment(appointment)"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📅</div>
        <p>Nenhuma consulta agendada ainda.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPatientAppointments, updateAppointmentStatus, type AppointmentListDTO } from '@/services/api'
import getTokenData from '@/services/auth'

const router = useRouter()

const loading = ref(true)
const appointments = ref<AppointmentListDTO[]>([])

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pendente: 'Pendente',
    finalizado: 'Finalizado',
    cancelado: 'Cancelado'
  }
  return map[status] ?? status
}

async function fetchAppointments() {
  loading.value = true
  try {
    const tokenData = getTokenData()
    const patientId = tokenData?.id != null ? Number(tokenData.id) : undefined
    appointments.value = patientId != null ? await getPatientAppointments(patientId) : []
  } catch (error) {
    console.error('Erro ao buscar consultas:', error)
    appointments.value = []
  } finally {
    loading.value = false
  }
}

async function cancelAppointment(appointment: AppointmentListDTO) {
  if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return
  const ok = await updateAppointmentStatus(appointment.id, 'Cancelado')
  if (ok) {
    alert('Consulta cancelada com sucesso!')
    await fetchAppointments()
  } else {
    alert('Erro ao cancelar consulta. Tente novamente.')
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>

<style scoped>
.appointments-page {
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

.list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.list-header h1 {
  margin: 0;
  font-size: 32px;
  color: #1a1a1a;
}

.count {
  font-size: 13px;
  color: #888;
  background: #eee;
  padding: 6px 14px;
  border-radius: 999px;
}

.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.appointment-row {
  background: white;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: .2s;
}

.appointment-row:hover {
  border-color: #ccc;
}

.appointment-info {
  display: flex;
  align-items: center;
  gap: 18px;
}

.appointment-photo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.row-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.appointment-info h2 {
  margin: 0;
  font-size: 17px;
  color: #1a1a1a;
}

.appointment-info p {
  margin-top: 4px;
  color: #777;
  font-size: 14px;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}

.badge-pendente {
  background: #fff7e0;
  color: #b7791f;
}

.badge-finalizado {
  background: #dff5e7;
  color: #1d8a4a;
}

.badge-cancelado {
  background: #fde3e3;
  color: #c0392b;
}

.appointment-actions .cancel-btn {
  border: none;
  background: #ce0606;
  color: white;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: .2s;
}

.appointment-actions .cancel-btn:hover {
  background: #e60000;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: .5;
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
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
