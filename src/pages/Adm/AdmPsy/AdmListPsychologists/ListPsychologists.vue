<template>
  <div class="list-psychologists">
    <div class="create-topbar">
      <button class="back-btn" @click="router.push('/admin')">
        ← Voltar
      </button>
      <button class="top-option" @click="router.push('/admin/psychologist/create')">
        Cadastrar Psicólogo
      </button>
      <button class="top-option active">
        Listar Psicólogos
      </button>
    </div>

    <div class="list-container">
      <div class="list-header">
        <h1>Psicólogos cadastrados</h1>
        <span class="psychologist-count" v-if="psychologists.length">
          {{ psychologists.length }} {{ psychologists.length === 1 ? 'registro' : 'registros' }}
        </span>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Carregando psicólogos...</p>
      </div>

      <div v-else-if="psychologists.length" class="psychologist-list">
        <PsychologistCard
          v-for="psychologist in psychologists"
          :key="psychologist.id"
          :id="psychologist.id"
          :name="psychologist.name"
          :last-name="psychologist.lastName"
          :specialization="psychologist.specialization"
        />
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🧑‍⚕️</div>
        <p>Nenhum psicólogo cadastrado ainda.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PsychologistCard from '../../../../components/PsychologistCard.vue'
import { listPsychologistsForView } from '../../../../services/psychologist-list'
import getTokenData from '../../../../services/auth'
import type { PsychologistModel } from '../../../../components/models/psychologist'

const router = useRouter()
const psychologists = ref<PsychologistModel[]>([])
const loading = ref<boolean>(true)

onMounted(async () => {
  const tokenData = getTokenData()
  if (tokenData?.role !== 'A') {
    // router.push('/login')
    // alert('Acesso negado. Você não tem permissão para acessar esta página.')
  }

  try {
    const data = await listPsychologistsForView()
    psychologists.value = data
  } catch (error) {
    console.error('Erro ao buscar psicólogos:', error)
  }
  loading.value = false
})
</script>

<style>
@import './ListPsychologists.css';
</style>