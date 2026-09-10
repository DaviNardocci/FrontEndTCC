
<template>
  <div class="psy-home">

    <!-- BOTÃO DESCONECTAR -->
    <button class="back-btn-home" @click="disconnect">
      <img
        class="icone"
        src="https://img.icons8.com/sf-black/64/ffffff/left.png"
        alt="left"
      />
      <span>Desconectar</span>
    </button>


    <!-- TABLET -->
    <div class="tablet">

      <div class="tablet-screen">

        <!-- MARCA -->
        <div class="sereno-brand">
          <span class="brand-dot"></span>
          <span>Sereno</span>
        </div>


        <!-- CONTEÚDO PRINCIPAL -->
        <main class="psy-container">

          <!-- INTRODUÇÃO FIXA -->
          <section class="psy-profile">

            <span class="profile-label">
              PAINEL PROFISSIONAL
            </span>

            <h1>
              Olá, <strong>Psicólogo.</strong>
            </h1>

            <p>
              Seu painel de gerenciamento Sereno.<br />
              Aqui você encontra tudo o que precisa para o seu dia a dia.
            </p>

          </section>


          <!-- =================================================
               ÁREA DOS APPS
               SOMENTE OS APPS DESLIZAM
          ================================================== -->

          <div class="menu-area">

            <div
              class="menu-slider"
              :style="{
                transform: `translateX(-${currentPage * 50}%)`
              }"
            >

              <!-- =============================================
                   SEÇÃO 1 — 3 APPS
              ============================================== -->

              <section class="menu-page">

                <div class="psy-grid three-apps">

                  <!-- CADASTRAR PACIENTE -->
                  <router-link
                    to="/patient/create"
                    class="psy-card patient-card"
                  >

                    <div class="app-icon patient-icon">
                      <img width="64" height="64" src="https://img.icons8.com/pastel-glyph/64/person-male--v3.png" alt="person-male--v3"/>

                    </div>

                    <div class="card-info">

                      <span class="card-category">
                        PACIENTES
                      </span>

                      <h2>
                        Gerenciar Pacientes
                      </h2>

                      <p>
                        Adicione ou Modifique um paciente ao sistema.
                      </p>

                    </div>

                    <span class="card-arrow">
                      →
                    </span>

                  </router-link>


                  <!-- DISPONIBILIDADE -->
                  <router-link
                    to="/psychologist/availability"
                    class="psy-card availability-card"
                  >

                    <div class="app-icon availability-icon">

                      <img width="64" height="64" src="https://img.icons8.com/windows/64/overtime.png" alt="overtime"/>
                    </div>

                    <div class="card-info">

                      <span class="card-category">
                        AGENDA
                      </span>

                      <h2>
                        Disponibilidade
                      </h2>

                      <p>
                        Configure seus dias e horários de atendimento.
                      </p>

                    </div>

                    <span class="card-arrow">
                      →
                    </span>

                  </router-link>


                  <!-- CONSULTAS -->
                  <router-link
                    to="/psychologist/appointments"
                    class="psy-card appointments-card"
                  >

                    <div class="app-icon consultations-icon">
                      <img width="48" height="48" src="https://img.icons8.com/fluency-systems-regular/48/approval.png" alt="approval"/>
                    </div>

                    <div class="card-info">

                      <span class="card-category">
                        ATENDIMENTOS
                      </span>

                      <h2>
                        Consultas
                      </h2>

                      <p>
                        Gerencie os status das suas consultas.
                      </p>

                    </div>

                    <span class="card-arrow">
                      →
                    </span>

                  </router-link>

                </div>

              </section>


              <!-- =============================================
                   SEÇÃO 2 — 2 APPS
              ============================================== -->

              <section class="menu-page">

                <div class="psy-grid two-apps">

                 


                  <!-- PAGAMENTOS
                       Futuramente pode virar:
                       <router-link to="/psychologist/payment">
                  -->
                  <div
                    class="psy-card payment-card"
                    role="button"
                    tabindex="0"
                  >

                    <div class="app-icon payment-app-icon">

                      <div class="wallet-icon">
                        <span class="wallet-line"></span>
                        <span class="wallet-dot"></span>
                      </div>

                    </div>

                    <div class="card-info">

                      <span class="card-category">
                        FINANCEIRO
                      </span>

                      <h2>
                        Pagamentos
                      </h2>

                      <p>
                        Consulte sua assinatura e informações financeiras.
                      </p>

                    </div>

                    <span class="card-arrow">
                      →
                    </span>

                  </div>

                   <!-- PERFIL
                       Futuramente pode virar:
                       <router-link to="/psychologist/profile">
                  -->
                  <div
                    class="psy-card profile-card"
                    role="button"
                    tabindex="0"
                  >

                    <div class="app-icon profile-app-icon">

                      <div class="profile-icon">
                        <span class="profile-head"></span>
                        <span class="profile-body"></span>
                      </div>

                    </div>

                    <div class="card-info">

                      <span class="card-category">
                        CONTA
                      </span>

                      <h2>
                        Perfil
                      </h2>

                      <p>
                        Visualize e edite suas informações profissionais.
                      </p>

                    </div>

                    <span class="card-arrow">
                      →
                    </span>

                  </div>

                </div>

              </section>

            </div>

          </div>

        </main>


        <!-- =================================================
             SETA ESQUERDA
             Só aparece na segunda seção
        ================================================== -->

        <button
          v-if="currentPage === 1"
          class="page-arrow left-arrow"
          @click="prevPage"
          aria-label="Voltar"
        >
          ←
        </button>


        <!-- =================================================
             SETA DIREITA
             Só aparece na primeira seção
        ================================================== -->

        <button
          v-if="currentPage === 0"
          class="page-arrow right-arrow"
          @click="nextPage"
          aria-label="Avançar"
        >
          →
        </button>


        <!-- =================================================
             INDICADORES
             Apenas 2 seções
        ================================================== -->

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


        <!-- FOOTER -->
        <footer class="tablet-footer">

          <div class="footer-brand">
            <span class="footer-dot"></span>
            Sereno
          </div>

          <span class="footer-page">
            {{ pageName }}
          </span>

        </footer>


        <!-- BARRA INFERIOR -->
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

const currentPage = ref(0)


const pageName = computed(() => {

  if (currentPage.value === 1) {
    return 'Ferramentas profissionais'
  }

  return 'Painel profissional'

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

  // if (tokenData?.role !== 'P') {
  //   router.push('/login')
  //   return
  // }

  auth.value = true

})


function disconnect() {

  localStorage.removeItem('token')

  router.push('/')

}

</script>


<style scoped>

@import './PsyHome.css';

</style>

