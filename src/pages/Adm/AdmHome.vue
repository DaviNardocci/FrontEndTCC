<template>
  <div class="adm-home">
    <button class="back-btn-home" @click="disconnect">
      <img class="icone" width="35" height="35" src="https://img.icons8.com/sf-black/64/ffffff/left.png" alt="left" />
      <span>Desconectar</span>
    </button>

    <div class="adm-container">
      <div class="adm-profile">
        <div class="adm-photo">A</div>
        <h1>Administrador</h1>
        <p>Painel de gerenciamento Sereno</p>
      </div>

      <div class="adm-grid">
        <router-link to="/admin/psychologist/create" class="adm-card">
          <h2>Psicólogos</h2>
          <p>Gerenciar psicólogos cadastrados</p><br>
          <div class="emoji">🧑‍⚕️</div>
        </router-link>

        <router-link to="/admin/patient/create" class="adm-card">
          <h2>Pacientes</h2>
          <p>Gerenciar pacientes cadastrados</p><br>
          <div class="emoji">👥</div>
        </router-link>

        <router-link to="/admin/request" class="adm-card">
          <h2>Solicitações</h2>
          <p>Analise os pedidos de cadastro</p><br>
          <div class="emoji">⚙️</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import getTokenData from '../../services/auth'

const router = useRouter()
const auth = ref(false)

onMounted(() => {
  const tokenData = getTokenData()
  if (tokenData?.role !== 'A') {
    //router.push('/login')
   // alert('Acesso negado. Você não tem permissão para acessar esta página.')
    return
  }
  auth.value = true
})

function disconnect() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
@import './AdmHome.css';
</style>
