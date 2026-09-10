<template>
  <div class="update-psychologist">
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
        <h1>Atualizar Psicólogo</h1>
        <p class="subtitle" v-if="loading">Carregando dados do psicólogo...</p>
        <p class="subtitle" v-else-if="notFound">Psicólogo não encontrado.</p>
        <p class="subtitle" v-else>Altere as informações abaixo e salve.</p>

        <form v-if="!loading && !notFound" class="create-form" @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="field small-field">
              <label>Nome</label>
              <input type="text" v-model="name" required />
            </div>
            <div class="field large-field">
              <label>Sobrenome</label>
              <input type="text" v-model="lastName" required />
            </div>
          </div>

          <div class="form-row">
            <div class="field medium-field">
              <label>CPF</label>
              <input type="text" placeholder="000.000.000-00" :value="cpf" @input="handleCpf(($event.target as HTMLInputElement).value)" required />
            </div>
            <div class="field tiny-field">
              <label>Idade</label>
              <input type="number" v-model="age" required />
            </div>
          </div>

          <div class="field">
            <label>Nova senha</label>
            <input type="password" v-model="password" required />
          </div>

          <div class="form-row">
            <div class="field small-field">
              <label>CRP</label>
              <input type="text" :value="crp" @input="handleCrp(($event.target as HTMLInputElement).value)" required />
            </div>
            <div class="field medium-field">
              <label>Especialização</label>
              <input type="text" v-model="specialization" required />
            </div>
          </div>

          <button type="submit" class="create-btn" :disabled="saving">
            {{ saving ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getPsychologistById, updatePsychologist } from '../../../../services/api'
import getTokenData from '../../../../services/auth'

const router = useRouter()
const route = useRoute()
const id = computed(() => Number(route.params.id))

const loading = ref(true)
const notFound = ref(false)
const saving = ref(false)

const name = ref('')
const lastName = ref('')
const cpf = ref('')
const age = ref('')
const password = ref('')
const crp = ref('')
const specialization = ref('')

onMounted(async () => {
  const tokenData = getTokenData()
  if (tokenData?.role !== 'A') {
    // router.push('/login')
  }

  const data = await getPsychologistById(id.value)
  if (!data) {
    notFound.value = true
  } else {
    name.value = data.name
    lastName.value = data.lastName
    cpf.value = data.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    crp.value = data.crp
    specialization.value = data.specialization
  }
  loading.value = false
})

function handleCpf(value: string) {
  value = value.replace(/\D/g, '')
  value = value.slice(0, 11)
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  cpf.value = value
}

function handleCrp(value: string) {
  crp.value = value.replace(/\D/g, '').slice(0, 8)
}

async function handleSubmit() {
  saving.value = true
  const payload = {
    id: id.value,
    name: name.value,
    lastName: lastName.value,
    cpf: cpf.value.replace(/\D/g, ''),
    age: String(age.value),
    password: password.value,
    crp: crp.value,
    specialization: specialization.value
  }

  const success = await updatePsychologist(payload)
  saving.value = false

  if (success) {
    alert('Psicólogo atualizado com sucesso!')
    router.push('/admin/psychologist/list')
  } else {
    alert('Erro ao atualizar psicólogo. Verifique os dados ou tente novamente.')
  }
}
</script>

<style scoped>
@import '../AdmCreatePsychologist/CreatePsychologist.css';
</style>