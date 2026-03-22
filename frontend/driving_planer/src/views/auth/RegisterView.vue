<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/stores.js'
import Background from "@/components/Background.vue";

const router = useRouter()
const authStore = useAuthStore()

const userName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

// Visibility for password fields
const showPassword = ref(false)
const showConfirmPassword = ref(false)

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Die Passwörter stimmen nicht überein.'
    return
  }
  error.value = ''
  loading.value = true
  try {
    await authStore.register({ userName: userName.value, email: email.value, password: password.value })
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Registrierung fehlgeschlagen.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Background>
    <div class="min-h-screen flex items-center justify-center p-4">
      <div 
        class="h-auto w-full max-w-md border border-white/20 p-8 bg-black shadow-2xl rounded-2xl" 
        v-motion-pop-visible
      >
        
        <div 
          class="pt-4 pb-12 text-center"
          v-motion
          :initial="{ opacity: 0, y: -60 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 800, type: 'spring' } }"
        >
          <h1 class="text-5xl font-black text-white tracking-tight">
            Register
          </h1>
        </div>

        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
          <input
            v-model="userName"
            type="text"
            placeholder="Benutzername"
            class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-white transition-all rounded-xl hover:bg-white/10"
            required
          />

          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-white transition-all rounded-xl hover:bg-white/10"
            required
          />

          <div class="w-full relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Passwort"
              class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-white transition-all rounded-xl pr-12 hover:bg-white/10"
              required
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              <i :class="['pi', showPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
            </button>
          </div>

          <div class="w-full relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Passwort bestätigen"
              class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-white transition-all rounded-xl pr-12 hover:bg-white/10"
              required
            />
            <button 
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              <i :class="['pi', showConfirmPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
            </button>
          </div>

          <p v-if="error" class="text-red-500 text-xs font-bold uppercase tracking-widest mt-2">
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-lime-500 text-xl text-white font-black py-4 mt-6 rounded-xl shadow-[0_10px_30px_rgba(132,204,22,0.3)] hover:bg-lime-400 hover:scale-[1.03] active:scale-95 transition-all duration-300 uppercase tracking-widest"
          >
            <span v-if="!loading">Registrieren</span>
            <i v-else class="pi pi-spin pi-spinner"></i>
          </button>
        </form>
        
        <div class="pt-8 text-gray-500 text-sm text-center">
          Bereits ein Konto vorhanden? 
          <router-link to="/login" class="text-white font-bold hover:text-lime-500 transition-colors underline decoration-lime-500/30 underline-offset-4">
            Hier anmelden.
          </router-link>
        </div>
      </div>
    </div>
  </Background>
</template>