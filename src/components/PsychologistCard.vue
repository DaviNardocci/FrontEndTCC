<template>
  <div class="psychologist-row">
    <div class="psychologist-info">
      <div class="psychologist-photo">{{ initial }}</div>
      <div>
        <h2>{{ name }} {{ lastName }}</h2>
        <p>{{ specialization }}</p>
      </div>
    </div>

    <div class="psychologist-actions">
      <button class="edit-btn" @click="router.push(`/admin/update/${id}`)">
        <img
          width="24"
          height="24"
          src="https://img.icons8.com/forma-regular-sharp/ffffff/pencil.png"
          alt="editar"
        />
      </button>
      <button class="delete-btn" @click="router.push(`/admin/delete/${id}`)">
        <img
          width="25"
          height="25"
          src="https://img.icons8.com/ios-filled/50/ffffff/waste.png"
          alt="excluir"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  id: number
  name: string
  lastName: string
  specialization: string
}>()

const router = useRouter()
const initial = computed(() => props.name.charAt(0).toUpperCase())
</script>
