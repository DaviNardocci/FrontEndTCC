<template>
  <div class="create-patient">
    <!-- Topo -->
    <div class="create-topbar">
      <button class="back-btn" @click="router.push('/admin')">
        ← Voltar
      </button>

      <button
        class="top-option active"
        @click="router.push('/admin/patient/create')"
      >
        Cadastrar Paciente
      </button>

      <button
        class="top-option"
        @click="router.push('/admin/patient/list')"
      >
        Listar Pacientes
      </button>
    </div>

    <!-- Formulário -->
    <div class="create-container">
      <div class="create-card">
        <h1>Cadastrar Paciente</h1>
        <p class="subtitle">
          Preencha as informações do paciente.
        </p>

        <form
          class="create-form"
          @submit.prevent="handleSubmit"
        >

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
                @input="
                  handleCpf(
                    ($event.target as HTMLInputElement).value
                  )
                "
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

          <!-- Psicólogo responsável -->
          <div class="field">
            <label>Psicólogo responsável</label>

            <select
              v-model="psychologistId"
              required
            >
              <option value="" disabled>
                Selecione o psicólogo responsável
              </option>

              <option
                v-for="psy in psychologists"
                :key="psy.id"
                :value="psy.id"
              >
                {{ psy.name }} {{ psy.lastName }} - {{ psy.specialization }}
              </option>
            </select>
          </div>

          <!-- Botão -->
          <button
            type="submit"
            class="create-btn"
            :disabled="loading"
          >
            {{ loading ? 'Cadastrando...' : 'Cadastrar Paciente' }}
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import getTokenData from '../../../../services/auth'
import { registerPatient, listPsychologists, type PsychologistDTO } from '../../../../services/api'

const router = useRouter()

const cpf = ref('')
const name = ref('')
const lastName = ref('')
const age = ref('')
const password = ref('')
const psychologistId = ref<number | ''>('')
const psychologists = ref<PsychologistDTO[]>([])
const loading = ref(false)

onMounted(async () => {
  const tokenData = getTokenData()

  if (tokenData?.role !== 'A') {
    // router.push('/login')
    // alert('Acesso negado. Você não tem permissão para acessar esta página.')
  }

  try {
    psychologists.value = await listPsychologists()
  } catch (error) {
    console.error('Erro ao buscar psicólogos:', error)
  }
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
  if (!psychologistId.value) {
    alert('Selecione um psicólogo responsável')
    return
  }

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
    alert('Paciente cadastrado com sucesso!')
    name.value = ''
    lastName.value = ''
    cpf.value = ''
    age.value = ''
    password.value = ''
    psychologistId.value = ''
  } else {
    alert('Erro ao cadastrar paciente. Verifique os dados ou tente novamente.')
  }
}
</script>

<style scoped>
@import './CreatePatient.css';
</style>