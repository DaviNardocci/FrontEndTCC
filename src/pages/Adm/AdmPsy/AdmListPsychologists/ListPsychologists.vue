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

      <div v-if="!loading && inactivePsychologists.length" class="inactive-section">
        <div class="section-header">
          <h2>Psicólogos desativados</h2>
          <span class="psychologist-count">
            {{ inactivePsychologists.length }} {{ inactivePsychologists.length === 1 ? 'registro' : 'registros' }}
          </span>
        </div>

        <div class="psychologist-list">
          <PsychologistCard
            v-for="psychologist in inactivePsychologists"
            :key="psychologist.id"
            :id="psychologist.id"
            :name="psychologist.name"
            :last-name="psychologist.lastName"
            :specialization="psychologist.specialization"
            :is-active="psychologist.isActive"
            @reactivate="handleReactivate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PsychologistCard from '../../../../components/PsychologistCard.vue'
import { listPsychologistsForView, listNotActivePsychologistsForView } from '../../../../services/psychologist-list'
import { reactivatePsychologist } from '../../../../services/api'
import getTokenData from '../../../../services/auth'
import type { PsychologistModel } from '../../../../components/models/psychologist'

const router = useRouter()
const psychologists = ref<PsychologistModel[]>([])
const inactivePsychologists = ref<PsychologistModel[]>([])
const loading = ref<boolean>(true)

async function fetchPsychologists() {
  loading.value = true
  try {
    const [active, inactive] = await Promise.all([
      listPsychologistsForView(),
      listNotActivePsychologistsForView(),
    ])
    psychologists.value = active
    inactivePsychologists.value = inactive
  } catch (error) {
    console.error('Erro ao buscar psicólogos:', error)
  } finally {
    loading.value = false
  }
}

async function handleReactivate(id: number) {
  const ok = await reactivatePsychologist(id)
  if (ok) {
    alert('Psicólogo reativado com sucesso.')
    await fetchPsychologists()
  } else {
    alert('Não foi possível reativar o psicólogo.')
  }
}

onMounted(async () => {
  const tokenData = getTokenData()
  if (tokenData?.role !== 'A') {
    // router.push('/login')
    // alert('Acesso negado. Você não tem permissão para acessar esta página.')
  }

  await fetchPsychologists()
})
</script>

<style>
@import './ListPsychologists.css';
</style>