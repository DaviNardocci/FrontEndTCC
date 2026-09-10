<template>
  <Transition name="toast">
    <div v-if="visible" class="error-toast" role="alert">
      <span class="toast-icon">⚠️</span>
      <span class="toast-message">{{ message }}</span>
      <button class="toast-close" aria-label="Fechar" @click="visible = false">×</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const message = ref('')
let timeout: ReturnType<typeof setTimeout> | null = null

function showToast(detail: { message: string }) {
  message.value = detail.message
  visible.value = true
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    visible.value = false
  }, 6000)
}

function handleError(event: Event) {
  showToast((event as CustomEvent<{ message: string }>).detail)
}

onMounted(() => {
  window.addEventListener('api:error', handleError)
})

onUnmounted(() => {
  window.removeEventListener('api:error', handleError)
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
.error-toast {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 380px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #fff5f5;
  border: 1px solid #f5c2c2;
  color: #b91c1c;
  font-size: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.toast-icon {
  font-size: 18px;
}

.toast-message {
  flex: 1;
}

.toast-close {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>