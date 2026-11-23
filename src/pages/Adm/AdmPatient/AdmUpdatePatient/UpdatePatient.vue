<template>
  <div class="update-patient">
    <div class="create-topbar">
      <button class="back-btn" @click="router.push('/admin/patient/list')">
        ← Voltar
      </button>
      <button class="top-option" @click="router.push('/admin/patient/create')">
        Cadastrar Paciente
      </button>
      <button class="top-option active" @click="router.push('/admin/patient/list')">
        Listar Pacientes
      </button>
    </div>

    <div class="create-container">
      <div class="create-card">
        <h1>Atualizar Paciente</h1>
        <p class="subtitle" v-if="loading">Carregando dados do paciente...</p>
        <p class="subtitle" v-else-if="notFound">Paciente não encontrado.</p>
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
            <label>Nova senha (opcional)</label>
            <input type="password" placeholder="Deixe em branco para manter a senha atual" v-model="password" />
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
import { getPatientById, updatePatient } from '../../../../services/api'
import getTokenData from '../../../../services/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const id = computed(() => Number(route.params.id))

const loading = ref(true)
const notFound = ref(false)
const saving = ref(false)

const name = ref('')
const lastName = ref('')
const cpf = ref('')
const age = ref('')
const password = ref('')

onMounted(async () => {
  const tokenData = getTokenData()
  if (tokenData?.role !== 'A') {
    // router.push('/login')
  }

  const data = await getPatientById(id.value)
  if (!data) {
    notFound.value = true
  } else {
    name.value = data.name
    lastName.value = data.lastName
    cpf.value = data.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    age.value = data.age
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

async function handleSubmit() {
  saving.value = true
  const payload = {
    id: id.value,
    name: name.value,
    lastName: lastName.value,
    cpf: cpf.value.replace(/\D/g, ''),
    age: String(age.value),
    ...(password.value ? { password: password.value } : {})
  }

  const success = await updatePatient(payload)
  saving.value = false

  if (success) {
    toast.success('Paciente atualizado com sucesso!')
    router.push('/admin/patient/list')
  } else {
    toast.error('Erro ao atualizar paciente. Verifique os dados ou tente novamente.')
  }
}
</script>

<style scoped>
@import '../AdmCreatePatient/CreatePatient.css';
</style>