<template>
  <div class="create-patient">
    <!-- Topo -->
    <div class="create-topbar">
      <button class="back-btn" @click="router.push('/psychologist')">
        ← Voltar
      </button>

      <button
        class="top-option active"
        @click="router.push('/patient/create')"
      >
        Cadastrar Paciente
      </button>

      <button
        class="top-option"
        @click="router.push('/patient/list')"
      >
        Listar Pacientes
      </button>
    </div>

    <!-- Form -->
    <div class="create-container">
      <div class="create-card">

        <h1>Cadastrar Paciente</h1>
        <p class="subtitle">
          Preencha as informações do paciente.
        </p>

        <form class="create-form" @submit.prevent="handleSubmit">

          <!-- Nome + Sobrenome -->
          <div class="form-row">
            <div class="field small-field">
              <label>Nome</label>
              <input
                type="text"
                placeholder="Digite o nome"
                v-model="name"
                required
              />
            </div>

            <div class="field large-field">
              <label>Sobrenome</label>
              <input
                type="text"
                placeholder="Digite o sobrenome"
                v-model="lastName"
                required
              />
            </div>
          </div>

          <!-- CPF + Idade -->
          <div class="form-row">
            <div class="field medium-field">
              <label>CPF</label>

              <input
                type="text"
                placeholder="000.000.000-00"
                :value="cpf"
                @input="handleCpf(($event.target as HTMLInputElement).value)"
                required
              />
            </div>

            <div class="field tiny-field">
              <label>Idade</label>

              <input
                type="number"
                placeholder="Idade"
                v-model="age"
                required
              />
            </div>
          </div>

          <!-- Senha -->
          <div class="field">
            <label>Senha</label>

            <input
              type="password"
              placeholder="Digite a senha"
              v-model="password"
              required
            />
          </div>

          <button class="create-btn" type="submit" :disabled="loading">
            {{ loading ? 'Cadastrando...' : 'Cadastrar Paciente' }}
          </button>

        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerPatient } from '../../../../services/api'
import { useToast } from "vue-toastification"


const router = useRouter()
const toast = useToast()

const cpf = ref('')
const name = ref('')
const lastName = ref('')
const age = ref('')
const password = ref('')
const loading = ref(false)

function handleCpf(value: string) {
  value = value.replace(/\D/g, '')
  value = value.slice(0, 11)
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

  cpf.value = value
}

async function handleSubmit() {
  loading.value = true

  const payload = {
    name: name.value,
    lastName: lastName.value,
    cpf: cpf.value.replace(/\D/g, ''),
    age: String(age.value),
    password: password.value,
  }

  const sucesso = await registerPatient(payload)

  loading.value = false

  if (sucesso) {
    toast.success('Paciente cadastrado com sucesso!')
    name.value = ''
    lastName.value = ''
    cpf.value = ''
    age.value = ''
    password.value = ''
  } else {
    alert('Erro ao cadastrar paciente. Verifique os dados ou tente novamente.')
  }
}
</script>

<style scoped>
@import './CreatePatient.css';
</style>