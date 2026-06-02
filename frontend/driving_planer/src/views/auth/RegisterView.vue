<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore.ts'
import Background from "@/components/Background.vue";

const { t } = useI18n()
const authStore = useAuthStore()

const userName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isDrivingSchool = ref(false)
const location = ref('')
const owner = ref('')
const phone = ref('')
const website = ref('')
const error = ref('')
const loading = ref(false)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const latitude = ref<number | null>(null)
const longitude = ref<number | null>(null)
const detectingLocation = ref(false)

async function detectUserLocation() {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by your browser'
    return
  }
  detectingLocation.value = true
  error.value = ''
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      latitude.value = position.coords.latitude
      longitude.value = position.coords.longitude
      try {
        const revUrl = `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
        const revRes = await fetch(revUrl, {
          headers: {
            'User-Agent': 'DrivingSchoolApp/1.0'
          }
        })
        if (revRes.ok) {
          const data = await revRes.json() as any
          if (data && data.display_name) {
            const parts = data.display_name.split(', ')
            location.value = parts.slice(0, 3).join(', ')
          } else {
            location.value = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          }
        } else {
          location.value = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        }
      } catch (err) {
        location.value = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
      } finally {
        detectingLocation.value = false
      }
    },
    (err) => {
      console.error(err)
      // Try again with high accuracy disabled if it was enabled, or report error
      error.value = 'Failed to detect location: ' + err.message
      detectingLocation.value = false
    },
    { enableHighAccuracy: false, timeout: 15000 }
  )
}

async function handleRegister() {
  if (!userName.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = t('auth.register.errors.fillAll')
    return
  }
  if (!email.value.includes('@')) {
    error.value = t('auth.register.errors.invalidEmail')
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = t('auth.register.errors.passwordMismatch')
    return
  }
  if (!location.value) {
    error.value = t('auth.register.errors.schoolAddress') || 'Address is required'
    return
  }
  
  error.value = ''
  loading.value = true

  // If user typed the address manually and coordinates are not set, geocode it
  if (location.value && (latitude.value === null || longitude.value === null)) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location.value)}&format=json&limit=1`, {
        headers: {
          'User-Agent': 'DrivingSchoolApp/1.0'
        }
      })
      if (response.ok) {
        const data = await response.json() as any[]
        if (data && data.length > 0) {
          latitude.value = parseFloat(data[0].lat)
          longitude.value = parseFloat(data[0].lon)
        }
      }
    } catch (err) {
      console.error('Failed to geocode manual location input:', err)
    }
  }

  try {
    await authStore.register({
      userName: userName.value,
      email: email.value,
      password: password.value,
      isDrivingSchool: isDrivingSchool.value,
      location: location.value || undefined,
      latitude: latitude.value || undefined,
      longitude: longitude.value || undefined,
      owner: owner.value || undefined,
      phone: phone.value || undefined,
      website: website.value || undefined
    })
  } catch (e: any) {
    console.error('Registration error:', e)
    if (e.message.includes('User already exists')) {
      error.value = t('auth.register.errors.emailExists')
    } else {
      error.value = t('auth.register.errors.failed', { message: e.message })
    }
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
            {{ t('auth.register.title') }}
          </h1>
        </div>

        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
          <input
            v-model="userName"
            type="text"
            :placeholder="t('auth.register.username')"
            class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-white transition-all rounded-xl hover:bg-white/10"
            required
          />

          <input
            v-model="email"
            type="email"
            :placeholder="t('auth.register.email')"
            class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-white transition-all rounded-xl hover:bg-white/10"
            required
          />

          <div class="w-full relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="t('auth.register.password')"
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
              :placeholder="t('auth.register.confirmPassword')"
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

          <div class="w-full relative flex gap-2">
            <input
              v-model="location"
              type="text"
              :placeholder="t('auth.register.address') || 'Adresse / Ort (z.B. Wien, AT)'"
              class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-white transition-all rounded-xl hover:bg-white/10"
              required
            />
            <button
              type="button"
              @click="detectUserLocation"
              class="px-4 bg-white/5 border-2 border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all rounded-xl flex items-center justify-center"
              title="Standort ermitteln"
            >
              <i v-if="detectingLocation" class="pi pi-spin pi-spinner text-sm"></i>
              <i v-else class="pi pi-map-marker text-sm"></i>
            </button>
          </div>

          <label class="flex items-center gap-3 text-white/70 cursor-pointer">
            <div
              v-motion
              :tap="{ scale: 0.9 }"
              :initial="{ scale: 1 }"
              class="relative"
            >
              <input
                v-model="isDrivingSchool"
                type="checkbox"
                class="w-5 h-5 rounded border-2 border-white/20 bg-white/5 text-lime-500 focus:ring-lime-500 focus:ring-offset-0 cursor-pointer accent-lime-500"
              />
            </div>
            <span class="text-sm">{{ t('auth.register.isDrivingSchool') }}</span>
          </label>

          <div v-if="isDrivingSchool" class="flex flex-col gap-4">
            <div class="border-t border-white/10" style="margin-top: 0.25rem;"></div>
            <p class="text-white/40 text-xs uppercase tracking-widest font-bold">{{ t('auth.register.schoolData') }}</p>

            <input
              v-model="owner"
              type="text"
              :placeholder="t('auth.register.owner')"
              class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-lime-500 transition-all rounded-xl hover:bg-white/10"
            />

            <input
              v-model="phone"
              type="tel"
              :placeholder="t('auth.register.phone')"
              class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-lime-500 transition-all rounded-xl hover:bg-white/10"
            />

            <input
              v-model="website"
              type="url"
              :placeholder="t('auth.register.website')"
              class="w-full p-4 border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-lime-500 transition-all rounded-xl hover:bg-white/10"
            />
          </div>

          <p v-if="error" class="text-red-500 text-xs font-bold uppercase tracking-widest mt-2">
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-lime-500 text-xl text-white font-black py-4 mt-6 rounded-xl shadow-[0_10px_30px_rgba(132,204,22,0.3)] hover:bg-lime-400 hover:scale-[1.03] active:scale-95 transition-all duration-300 uppercase tracking-widest"
          >
            <span v-if="!loading">{{ t('auth.register.submit') }}</span>
            <i v-else class="pi pi-spin pi-spinner"></i>
          </button>
        </form>

        <div class="pt-8 text-gray-500 text-sm text-center">
          {{ t('auth.register.hasAccount') }}
          <router-link to="/login" class="text-white font-bold hover:text-lime-500 transition-colors underline decoration-lime-500/30 underline-offset-4">
            {{ t('auth.register.loginHere') }}
          </router-link>
        </div>
      </div>
    </div>
  </Background>
</template>
