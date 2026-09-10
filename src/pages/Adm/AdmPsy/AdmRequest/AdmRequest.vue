<template>
  <div class="adm-request">

    <!-- Navbar -->
    <header class="header">
      <nav class="nav">

        <!-- Botão voltar para o Admin -->
        <router-link to="/admin" class="btn-back">
          ← Voltar
        </router-link>

        <!-- Nome da página -->
        <h1 class="page-title">
          ADM Request
        </h1>

      </nav>
    </header>


    <!-- Conteúdo -->
    <main class="main-content">

      <div class="content-header">
        <p class="eyebrow">Painel Administrativo</p>

        <h2>
          Solicitações de Cadastro
        </h2>

        <p class="description">
          Visualize e analise as solicitações enviadas pelos psicólogos
          para realizar o cadastro na plataforma.
        </p>
      </div>


      <!-- Área das solicitações -->
      <section class="requests-container">

        <div class="empty-state">
          <div class="empty-icon">
            ✓
          </div>

          <h3>
            Nenhuma solicitação encontrada
          </h3>

          <p>
            Quando um psicólogo enviar uma solicitação de cadastro,
            ela aparecerá aqui.
          </p>
        </div>

      </section>

    </main>

  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
@import './AdmRequest.css';
</style>