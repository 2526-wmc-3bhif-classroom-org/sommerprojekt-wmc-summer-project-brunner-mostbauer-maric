import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {MotionPlugin} from '@vueuse/motion'
import {Ripple} from "primevue";
import { i18n } from './i18n'

import Tooltip from 'primevue/tooltip'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)
app.use(MotionPlugin)
app.use(createPinia())
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(router)

app.mount('#app')

