import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {MotionPlugin} from '@vueuse/motion'

import Tooltip from 'primevue/tooltip'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'



import App from './App.vue'
import router from './router'

const app = createApp(App)

app.directive('tooltip', Tooltip)
app.use(MotionPlugin)
app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(router)

app.mount('#app')

