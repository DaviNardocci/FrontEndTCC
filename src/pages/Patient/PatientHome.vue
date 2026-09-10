```vue
<template>
  <div class="patient-home">

    <button class="back-btn-home" @click="disconnect">
      <img
        class="icone"
        width="35"
        height="35"
        src="https://img.icons8.com/sf-black/64/ffffff/left.png"
        alt="left"
      />
      <span>Desconectar</span>
    </button>

    <div class="tablet">

      <div class="tablet-screen">

        <div class="sereno-brand">
          <span class="brand-dot"></span>
          <span>Sereno</span>
        </div>

        <main class="patient-main">

          <section class="patient-profile">

            <span class="profile-label">
              PAINEL DO PACIENTE
            </span>

            <h1>
              Olá, <strong>Paciente.</strong>
            </h1>

            <p>
              Seu painel pessoal Sereno.<br />
              Aqui você encontra tudo o que precisa para acompanhar seus atendimentos.
            </p>

          </section>

          <div class="menu-area">

            <div
              class="menu-slider"
              :style="{
                transform: `translateX(-${currentPage * 50}%)`
              }"
            >

              <section class="menu-page">

                <div class="patient-grid">

                  <router-link
                    to="/patient/agenda"
                    class="patient-card consultations-card"
                  >
                    <div class="app-icon consultations-icon">
                      <!-- COLOQUE SEU ÍCONE AQUI -->
                    </div>

                    <div class="card-info">
                      <span class="card-category">
                        ATENDIMENTOS
                      </span>

                      <h2>
                        Consultas
                      </h2>

                      <p>
                        Visualize e agende seus próximos atendimentos.
                      </p>
                    </div>

                    <span class="card-arrow">
                      →
                    </span>
                  </router-link>

                  <router-link
                    to="/patient/appointments"
                    class="patient-card appointments-card"
                  >
                    <div class="app-icon my-appointments-icon">
                      <!-- COLOQUE SEU ÍCONE AQUI -->
                    </div>

                    <div class="card-info">
                      <span class="card-category">
                        ACOMPANHAMENTO
                      </span>

                      <h2>
                        Minhas Consultas
                      </h2>

                      <p>
                        Acompanhe o status das suas consultas.
                      </p>
                    </div>

                    <span class="card-arrow">
                      →
                    </span>
                  </router-link>

                  <router-link
                    to="/patient/payments"
                    class="patient-card payment-card"
                  >
                    <div class="app-icon payment-icon">
                      <!-- COLOQUE SEU ÍCONE AQUI -->
                    </div>

                    <div class="card-info">
                      <span class="card-category">
                        FINANCEIRO
                      </span>

                      <h2>
                        Pagamentos
                      </h2>

                      <p>
                        Consulte seus pagamentos e pendências.
                      </p>
                    </div>

                    <span class="card-arrow">
                      →
                    </span>
                  </router-link>

                </div>

              </section>

              <section class="menu-page">

                <div class="patient-grid">

                  <router-link
                    to="/patient/profile"
                    class="patient-card profile-card"
                  >
                    <div class="app-icon profile-icon">
                      <!-- COLOQUE SEU ÍCONE AQUI -->
                    </div>

                    <div class="card-info">
                      <span class="card-category">
                        CONTA
                      </span>

                      <h2>
                        Perfil
                      </h2>

                      <p>
                        Atualize suas informações pessoais.
                      </p>
                    </div>

                    <span class="card-arrow">
                      →
                    </span>
                  </router-link>

                </div>

              </section>

            </div>

          </div>

        </main>

        <button
          v-if="currentPage === 1"
          class="page-arrow left-arrow"
          @click="prevPage"
          aria-label="Voltar"
        >
          ←
        </button>

        <button
          v-if="currentPage === 0"
          class="page-arrow right-arrow"
          @click="nextPage"
          aria-label="Avançar"
        >
          →
        </button>

        <div class="page-indicators">

          <button
            :class="{ active: currentPage === 0 }"
            @click="goToPage(0)"
            aria-label="Primeira seção"
          ></button>

          <button
            :class="{ active: currentPage === 1 }"
            @click="goToPage(1)"
            aria-label="Segunda seção"
          ></button>

        </div>

        <footer class="tablet-footer">

          <div class="footer-brand">
            <span class="footer-dot"></span>
            Sereno
          </div>

          <span class="footer-page">
            {{ pageName }}
          </span>

        </footer>

        <div class="home-indicator"></div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import getTokenData from '../../services/auth'

const router = useRouter()

const auth = ref(false)
const id = ref<string | null>(null)
const currentPage = ref(0)

const pageName = computed(() => {
  if (currentPage.value === 1) {
    return 'Informações pessoais'
  }

  return 'Painel do paciente'
})

function nextPage() {
  if (currentPage.value < 1) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

function goToPage(page: number) {
  currentPage.value = page
}

onMounted(() => {
  const tokenData = getTokenData()

  if (!tokenData) return

  id.value = tokenData.id

  console.log('ID do paciente:', id.value)

  if (tokenData.role !== 'C') {
    // router.push('/login')
    // alert('Acesso negado.')
    return
  }

  auth.value = true
})

function disconnect() {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
@import './PatientHome.css';
</style>
```
