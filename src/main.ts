import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

createApp(App)
  .use(router)
  .use(VCalendar, {})
  .use(Toast)
  .mount('#app')