<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/stores.js'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Background from "@/components/Background.vue";

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/')
  } catch (e: any) {
    error.value = 'Login hat nicht funktioniert. Bitte überprüfe deine Anmeldedaten.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Background>
    <div class="min-h-screen flex items-center justify-center p-4">

      <div
        class="h-auto w-full max-w-md border border-white/20 p-8 bg-black shadow-2xl  rounded-2xl"
        v-motion-pop-visible
      >
        <div>
          <div class="flex items-center justify-center p-5">
            <h1 class="text-4xl font-bold mb-8 text-center text-white">Login</h1>
          </div>

          <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
            <div class="w-full">
              <input
                v-model="email"
                type="email"
                placeholder="Email"
                oninput="this.setCustomValidity('')"
                oninvalid="this.setCustomValidity('Bitte gib eine gültige E-Mail-Adresse ein.')"
                class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-white transition-all duration-300 focus:scale-105"
              />
            </div>
            <div class="w-full">
              <input
                v-model="password"
                type="password"
                placeholder="Password"
                class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-white transition-all focus:scale-105 duration-300"
              />
            </div>

            <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-white text-xl text-black font-black py-4 mt-4 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Anmelden
            </button>
          </form>
          <div class="w-full justify-start pt-4">
            <p>
              Sie haben noch kein Konto? <span><router-link to="register" class="hover:text-white hover:underline transition-all duration-300">Registrieren Sie sich jetzt.</router-link></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Background>
</template>
