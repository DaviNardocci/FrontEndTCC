<template>
  <div class="delete-psychologist">
    <div class="create-topbar">
      <button class="back-btn" @click="router.push('/admin/psychologist/list')">
        ← Voltar
      </button>
      <button class="top-option" @click="router.push('/admin/psychologist/create')">
        Cadastrar Psicólogo
      </button>
      <button class="top-option active" @click="router.push('/admin/psychologist/list')">
        Listar Psicólogos
      </button>
    </div>

    <div class="create-container">
      <div class="create-card">
        <h1>Excluir Psicólogo</h1>
        <p class="subtitle" v-if="loading">Carregando dados do psicólogo...</p>
        <p class="subtitle" v-else-if="notFound">Psicólogo não encontrado.</p>

        <div v-else class="delete-info">
          <p>Deseja realmente excluir o psicólogo</p>
          <p class="delete-name">{{ name }}</p>
          <p v-if="deleteError" class="delete-error">
            Não foi possível excluir. Verifique se existe agendamento ou vínculo com paciente para este psicólogo.
          </p>
          <div class="delete-actions">
            <button class="create-btn cancel" @click="router.push('/admin/psychologist/list')">
              Cancelar
            </button>
            <button class="create-btn danger" :disabled="deleting" @click="handleDelete">
              {{ deleting ? 'Excluindo...' : 'Excluir psicólogo' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getPsychologistById, deletePsychologist } from '../../../../services/api'
import getTokenData from '../../../../services/auth'

const router = useRouter()
const route = useRoute()
const id = computed(() => Number(route.params.id))

const loading = ref(true)
const notFound = ref(false)
const deleting = ref(false)
const deleteError = ref(false)
const name = ref('')

onMounted(async () => {
  const tokenData = getTokenData()
  if (tokenData?.role !== 'A') {
    // router.push('/login')
  }

  const data = await getPsychologistById(id.value)
  if (!data) {
    notFound.value = true
  } else {
    name.value = `${data.name} ${data.lastName} (CRP ${data.crp})`
  }
  loading.value = false
})

async function handleDelete() {
  deleting.value = true
  deleteError.value = false
  const success = await deletePsychologist(id.value)
  deleting.value = false

  if (success) {
    alert('Psicólogo excluído com sucesso!')
    router.push('/admin/psychologist/list')
  } else {
    deleteError.value = true
  }
}
</script>

<style scoped>
@import '../AdmCreatePsychologist/CreatePsychologist.css';

.delete-info {
  text-align: center;
  padding: 24px 0;
}

.delete-name {
  font-weight: 700;
  font-size: 18px;
  margin: 8px 0 16px;
}

.delete-error {
  color: #b91c1c;
  font-size: 14px;
  margin-bottom: 16px;
}

.delete-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.cancel {
  background: #6b7280;
}

.danger {
  background: #b91c1c;
}
</style>