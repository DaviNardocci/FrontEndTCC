<template>
  <div class="home">
    <!-- Header -->
    <header class="header">
      <nav class="nav">
        <a href="#" class="logo">
          <span class="logo-mark">D</span>
          Dolphin
        </a>
        <ul class="nav-links">
          <li><a href="#inicio">Início</a></li>
          <li><a href="#como-funciona">Como funciona</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
        <div class="nav-actions">
          <router-link to="/login" class="btn-primary btn">Entrar</router-link>
        </div>
      </nav>
    </header>

    <!-- Hero -->
    <section id="inicio" class="hero">
      <span class="pill"><span class="dot"></span>Feito para a rotina do consultório</span>
      <h1>
        Organize seu consultório, <span class="muted">cuide do que importa.</span>
      </h1>
      <p>
        A plataforma que ajuda psicólogos a cadastrar pacientes, gerenciar a agenda
        e receber pagamentos — tudo em um só lugar.
      </p>
      <div class="hero-actions">
        <a href="#como-funciona" class="btn btn-ghost">Ver como funciona</a>
      </div>

      <!-- Preview -->
      <div class="preview">
        <div class="preview-inner">
          <div v-for="s in sessions" :key="s.date" class="session">
            <div class="session-top">
              <span>{{ s.day }}, mai {{ s.date }}</span>
              <span>{{ s.time }}</span>
            </div>
            <p class="session-name">{{ s.name }}</p>
            <p class="session-meta">Sessão online · 50min</p>
            <button>Confirmar</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Recursos -->
    <section id="como-funciona" class="section-alt">
      <div class="section-inner">
        <p class="eyebrow">Recursos</p>
        <h2>Tudo que o seu consultório precisa.</h2>
        <div class="features">
          <div v-for="f in features" :key="f.title" class="feature">
            <div class="feature-icon">●</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Como funciona -->
    <section class="section">
      <div class="how">
        <div>
          <p class="eyebrow">Como funciona</p>
          <h2>O psicólogo no controle, o paciente sem complicação.</h2>
          <p style="margin-top: 16px; color: #666; max-width: 420px;">
            O cadastro é feito pelo profissional. O paciente apenas recebe o login e
            acessa sua área para acompanhar sessões e pagamentos.
          </p>
        </div>
        <ol class="steps">
          <li v-for="s in steps" :key="s.n" class="step">
            <span class="step-n">{{ s.n }}</span>
            <div>
              <h3>{{ s.t }}</h3>
              <p>{{ s.d }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- CTA -->
    <section id="contato" class="cta">
      <article class="cta-text">
        <h2>Pronto para simplificar seu consultório?</h2>
        <p>Caso não tenha uma conta, entre em contato conosco:</p>
      </article>

      <form class="cta-form" @submit.prevent="sendEmail">
        <div class="info">
          <div class="field">
            <label>Nome:</label>
            <input name="name" type="text" placeholder="Nome Completo" required />
          </div>
          <div class="field">
            <label>CRP:</label>
            <input name="crp" type="text" placeholder="00/00000" required />
          </div>
        </div>
        <div class="field">
          <label>Email:</label>
          <input name="email" type="text" placeholder="exemplo@gmail.com" required />
        </div>
        <div class="field">
          <label>Observações:</label>
          <textarea name="observations" placeholder="..." required></textarea>
        </div>
        <button type="submit">Enviar</button>
      </form>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <p>© {{ currentYear }} Sereno. Todos os direitos reservados.</p>
        <div class="footer-links">
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
          <a href="#">Contato</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

const currentYear = new Date().getFullYear()

const sessions = [
  { day: 'Seg', date: '27', time: '14:00', name: 'Ana Pereira' },
  { day: 'Qua', date: '29', time: '09:30', name: 'Bruno Lima' },
  { day: 'Sex', date: '31', time: '18:00', name: 'Carla Souza' },
]

const features = [
  { title: 'Agenda do consultório', text: 'Veja sua semana e bloqueie horários em segundos.' },
  { title: 'Cadastro de pacientes', text: 'Crie o acesso do paciente e envie as credenciais por e-mail.' },
  { title: 'Pagamentos', text: 'Receba por Pix ou cartão com confirmação automática.' },
  { title: 'Prontuário seguro', text: 'Anotações por sessão com sigilo e conformidade LGPD.' },
]

const steps = [
  { n: '01', t: 'Psicólogo cadastra o paciente', d: 'Crie o usuário no painel e gere um login de acesso.' },
  { n: '02', t: 'Paciente recebe as credenciais', d: 'Acesso direto à área dele com agenda e pagamentos.' },
  { n: '03', t: 'Sessão acontece', d: 'Tudo registrado: horário, valor e prontuário em um só lugar.' },
]

// TODO: Implementar lógica de envio de email
function sendEmail(e: Event) {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  emailjs.sendForm(
    'service_54la62c',
    'template_gns4ncm',
    form,
    'xSuMRw2aBawnPOawT'
  )
    .then(() => {
      alert('Email enviado!')
    })
    .catch(() => {
      alert('Erro ao enviar.')
    })
}

</script>

<style scoped>
@import './Home.css';
</style>
