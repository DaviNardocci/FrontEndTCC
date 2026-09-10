<template>
  <div class="create-psychologist">
    <!-- Topo -->
    <div class="create-topbar">
      <button class="back-btn" @click="router.push('/admin')">
        ← Voltar
      </button>
      <button class="top-option active" @click="router.push('/admin/psychologist/create')">
        Cadastrar Psicólogo
      </button>
      <button class="top-option" @click="router.push('/admin/psychologist/list')">
        Listar Psicólogos
      </button>
    </div>

    <!-- Form -->
    <div class="create-container">
      <div class="create-card">
        <h1>Cadastrar Psicólogo</h1>
        <p class="subtitle">Preencha as informações do profissional.</p>

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

          <!-- CRP + Especialização -->
          <div class="form-row">
            <div class="field small-field">
              <label>CRP</label>
              <input
                type="text"
                placeholder="Digite o CRP"
                :value="crp"
                @input="handleCrp(($event.target as HTMLInputElement).value)"
                required
              />
            </div>
            <div class="field medium-field">
              <label>Especialização</label>
              <select v-model="specialization">
                <option value="Especialização 1">Especialização 1</option>
                <option value="Especialização 2">Especialização 2</option>
                <option value="Especialização 3">Especialização 3</option>
              </select>
            </div>
          </div>

          <button type="submit" class="create-btn">
            Cadastrar Psicólogo
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { registerPsychologist } from '../../../../services/psychologist'
import getTokenData from '../../../../services/auth'

const router = useRouter()

const cpf = ref('')
const crp = ref('')
const name = ref('')
const lastName = ref('')
const age = ref('')
const password = ref('')
const specialization = ref('Especialização 1')

onMounted(() => {
  const tokenData = getTokenData()
  if (tokenData?.role !== 'A') {
    //router.push('/login')
    //alert('Acesso negado. Você não tem permissão para acessar esta página.')
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

function handleCrp(value: string) {
  value = value.replace(/\D/g, '')
  value = value.slice(0, 8)
  crp.value = value
}

async function handleSubmit() {
  const payload = {
    name: name.value,
    lastName: lastName.value,
    cpf: cpf.value.replace(/\D/g, ''),
    age: String(age.value),
    password: password.value,
    crp: crp.value,
    specialization: specialization.value
  }

  const sucesso = await registerPsychologist(payload)

  if (sucesso) {
    alert('Psicólogo cadastrado com sucesso!')
    name.value = ''
    lastName.value = ''
    cpf.value = ''
    age.value = ''
    password.value = ''
    crp.value = ''
  } else {
    alert('Erro ao cadastrar psicólogo. Verifique os dados ou tente novamente.')
  }
}
</script>

<style scoped>
@import './CreatePsychologist.css';
</style>
