<template>
  <RouterView />
  <ErrorToast />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import ErrorToast from './components/ErrorToast.vue'

function limparDadosGlobais() {
  const checkboxAtiva = localStorage.getItem('checkboxAtiva')
  if (checkboxAtiva !== 'true') {
    localStorage.removeItem('token')
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', limparDadosGlobais)
  window.addEventListener('pagehide', limparDadosGlobais)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', limparDadosGlobais)
  window.removeEventListener('pagehide', limparDadosGlobais)
})
</script>
