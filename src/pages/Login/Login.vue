<template>
  <div class="login">
    <aside class="login-aside">
      <a href="/" class="login-logo">
        <span class="login-logo-mark">S</span>
        Sereno
      </a>

      <div class="login-quote">
        <p>
          "Cuidar de quem cuida. Uma plataforma só para o seu
          consultório."
        </p>
        <span>— Sereno, plataforma para psicólogos</span>
      </div>

      <p class="login-aside-footer">
        © {{ currentYear }} Sereno · Todos os direitos reservados
      </p>
    </aside>

    <main class="login-main">
      <div class="login-card">
        <a href="/" class="login-mobile-logo">
          <span class="login-logo-mark">S</span>
          Sereno
        </a>

        <h1>Entrar na sua conta</h1>
        <p class="subtitle">Use a senha que você recebeu.</p>

        <form class="login-form" @submit.prevent="handleSubmit">
          <div class="field">
            <label for="cpf">CPF</label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              autocomplete="cpf"
              placeholder="000.000.000-00"
              v-model="cpf"
              required
            />
          </div>

          <div class="field">
            <label for="password">Senha</label>
            <div class="password-wrap">
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                v-model="password"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <div class="row">
            <label class="remember">
              <input
                type="checkbox"
                name="remember"
                @change="handleCheckbox"
              />
              Lembrar de mim
            </label>
            <a href="#" class="forgot">Esqueci minha senha</a>
          </div>

          <button type="submit" class="login-btn">
            Entrar →
          </button>
        </form>

        <div class="hint">
          O acesso é fornecido pelo seu psicólogo. Caso ainda não
          tenha as informações de login, entre em contato com ele.
        </div>

        <div class="divider">ou</div>

        <p class="login-footer">
          Não atende ainda?
          <a href="/#contato">Entre em contato com a nossa equipe.</a>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { login } from '../../services/api'
  import { useToast } from "vue-toastification"
  import getTokenData from '../../services/auth'

  const router = useRouter()
  const toast = useToast()
  const currentYear = new Date().getFullYear()

  const cpf = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const success = ref(false)

  const rememberMe = localStorage.getItem('checkboxAtiva')

  onMounted(() => {
    const token = localStorage.getItem('token')
    if (rememberMe === 'true' && token !== null) {
      const tokenData = getTokenData()
      if (tokenData?.role === 'C') {
        router.push('/patient')
      } else if (tokenData?.role === 'P') {
        router.push('/psychologist')
      } else if (tokenData?.role === 'A') {
        router.push('/admin')
      }
    }
  })

  async function handleSubmit() {
    const cleanCpf = cpf.value.replace(/\D/g, '')
    const result = await login(cleanCpf, password.value)
    if (result) {
      success.value = true
      useToast.apply({
        type: 'success',
        content: 'Login realizado com sucesso!',
      })
    }
    else{
      toast.error("Erro ao realizar o login. Credenciais inválidas!")
    }
  }

  watch(success, (val) => {
    if (!val) return
    const tokenData = getTokenData()
    if (!tokenData) {
      router.push('/login')
    } else if (tokenData.role === 'C') {
      router.push('/patient')
    } else if (tokenData.role === 'P') {
      router.push('/psychologist')
    } else if (tokenData.role === 'A') {
      router.push('/admin')
    }
  })

  function handleCheckbox(e: Event) {
    const target = e.target as HTMLInputElement
    localStorage.setItem('checkboxAtiva', String(target.checked))
  }
</script>

<style scoped>
@import './Login.css';
</style>
