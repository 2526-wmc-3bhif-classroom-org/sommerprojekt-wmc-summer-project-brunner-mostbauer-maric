<template>
  <Background>
    <div class="min-h-screen px-4 py-8 md:py-16 flex flex-col items-center relative">
      <div
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
        class="w-full max-w-xl"
      >
        <div class="bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">
          <div class="bg-black px-10 pt-12 pb-24">
            <div class="flex items-center gap-6">
              <button
                @click="showImageModal = true"
                class="group relative w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center shrink-0 overflow-hidden transition-all hover:border-white/40 cursor-pointer"
              >
                <img v-if="displayImage" :src="displayImage" class="w-full h-full object-cover" />
                <i v-else class="pi pi-user text-white text-3xl group-hover:opacity-0 transition-opacity"></i>
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <i class="pi pi-camera text-white text-xl"></i>
                </div>
              </button>
              <div>
                <p class="text-white text-xl font-semibold mb-1">{{ displayName || t('profile.name') }}</p>
                <p class="text-white/50 text-sm">{{ displayEmail || t('profile.email') }}</p>
              </div>
            </div>
          </div>

          <div class="-mt-10 mx-4 mb-8 bg-white rounded-2xl shadow-md border border-black/5 px-8 py-8 flex flex-col gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-widest text-black/40 field-label">{{ t('profile.name') }}</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-user text-sm"></i></span>
                <input
                  v-model="userName"
                  @input="errors.userName = ''"
                  type="text"
                  :placeholder="t('profile.namePlaceholder')"
                  :class="[errors.userName ? 'border-red-500 focus:ring-red-200' : 'border-black/10 focus:ring-black/20']"
                  class="w-full bg-black/[0.03] border rounded-2xl pl-10 pr-4 py-4 text-black placeholder-black/25 text-sm focus:outline-none focus:ring-2 transition-all"
                />
              </div>
              <p v-if="errors.userName" class="text-red-500 text-xs mt-2 ml-1">{{ errors.userName }}</p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-widest text-black/40 field-label">{{ t('profile.email') }}</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-envelope text-sm"></i></span>
                <input
                  v-model="email"
                  @input="errors.email = ''"
                  type="email"
                  :placeholder="t('profile.emailPlaceholder')"
                  :class="[errors.email ? 'border-red-500 focus:ring-red-200' : 'border-black/10 focus:ring-black/20']"
                  class="w-full bg-black/[0.03] border rounded-2xl pl-10 pr-4 py-4 text-black placeholder-black/25 text-sm focus:outline-none focus:ring-2 transition-all"
                />
              </div>
              <p v-if="errors.email" class="text-red-500 text-xs mt-2 ml-1">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-widest text-black/40 field-label">{{ t('profile.location') }}</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-map-marker text-sm"></i></span>
                <input
                  v-model="userLocation"
                  @input="errors.userLocation = ''"
                  type="text"
                  :placeholder="t('profile.locationPlaceholder')"
                  :class="[errors.userLocation ? 'border-red-500 focus:ring-red-200' : 'border-black/10 focus:ring-black/20']"
                  class="w-full bg-black/[0.03] border rounded-2xl pl-10 pr-12 py-4 text-black placeholder-black/25 text-sm focus:outline-none focus:ring-2 transition-all"
                />
                <button
                  @click="detectUserLocation"
                  :disabled="detectingLocation"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors cursor-pointer disabled:opacity-40"
                  title="Detect location"
                >
                  <i :class="detectingLocation ? 'pi pi-spin pi-spinner' : 'pi pi-crosshair'"></i>
                </button>
              </div>
              <p v-if="errors.userLocation" class="text-red-500 text-xs mt-2 ml-1">{{ errors.userLocation }}</p>
            </div>

            <template v-if="authStore.isSchool">
              <div class="flex items-center gap-3" style="margin-top: 0.5rem;">
                <div class="flex-1 h-px bg-black/10"></div>
                <span class="text-xs text-black/30 font-medium">{{ t('profile.schoolData') }}</span>
                <div class="flex-1 h-px bg-black/10"></div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-widest text-black/40 field-label">{{ t('profile.address') }}</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-map-marker text-sm"></i></span>
                  <input v-model="schoolLocation" type="text" :placeholder="t('profile.addressPlaceholder')" class="w-full bg-black/[0.03] border border-black/10 rounded-2xl pl-10 pr-4 py-4 text-black placeholder-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-widest text-black/40 field-label">{{ t('profile.owner') }}</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-id-card text-sm"></i></span>
                  <input v-model="schoolOwner" type="text" :placeholder="t('profile.ownerPlaceholder')" class="w-full bg-black/[0.03] border border-black/10 rounded-2xl pl-10 pr-4 py-4 text-black placeholder-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-widest text-black/40 field-label">{{ t('profile.phone') }}</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-phone text-sm"></i></span>
                  <input v-model="schoolPhone" type="tel" :placeholder="t('profile.phonePlaceholder')" class="w-full bg-black/[0.03] border border-black/10 rounded-2xl pl-10 pr-4 py-4 text-black placeholder-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-widest text-black/40 field-label">{{ t('profile.website') }}</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-globe text-sm"></i></span>
                  <input v-model="schoolWebsite" type="url" :placeholder="t('profile.websitePlaceholder')" class="w-full bg-black/[0.03] border border-black/10 rounded-2xl pl-10 pr-4 py-4 text-black placeholder-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-widest text-black/40 field-label">{{ t('profile.openingDays') }}</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="day in allWeekdays" :key="day" class="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      @click="toggleOpeningDay(day)"
                      class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0"
                      :class="schoolOpeningDays.includes(day) ? 'bg-black border-black' : 'bg-white border-black/20 hover:border-black/50'"
                    >
                      <i v-if="schoolOpeningDays.includes(day)" class="pi pi-check text-white text-[10px]"></i>
                    </div>
                    <span class="text-sm text-black/70 font-semibold">{{ day }}</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-widest text-black/40 field-label">{{ t('profile.openingHours') }}</label>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] text-black/30 font-semibold mb-1">{{ t('profile.from') }}</label>
                    <input v-model="schoolOpeningTimeFrom" type="time" class="w-full bg-black/[0.03] border border-black/10 rounded-2xl px-4 py-4 text-black text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" />
                  </div>
                  <div>
                    <label class="block text-[10px] text-black/30 font-semibold mb-1">{{ t('profile.to') }}</label>
                    <input v-model="schoolOpeningTimeTo" type="time" class="w-full bg-black/[0.03] border border-black/10 rounded-2xl px-4 py-4 text-black text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" />
                  </div>
                </div>
              </div>
            </template>

            <button @click="saveProfile" class="mt-6 w-full bg-black text-white text-sm font-semibold py-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10">
              {{ t('profile.saveChanges') }}
            </button>

            <div class="flex items-center gap-3 mt-4 mb-2">
              <div class="flex-1 h-px bg-black/10"></div>
              <span class="text-xs text-black/30 font-medium">{{ t('profile.or') }}</span>
              <div class="flex-1 h-px bg-black/10"></div>
            </div>

            <button @click="showPasswordModal = true" class="w-full bg-white text-black text-sm font-semibold py-4 rounded-2xl cursor-pointer border border-black/10 transition-all duration-300 hover:scale-[1.02] hover:bg-black/[0.03] active:scale-[0.98] flex items-center justify-center gap-2">
              <i class="pi pi-lock text-sm"></i> {{ t('profile.changePassword') }}
            </button>

            <div class="flex items-center gap-3 mt-4 mb-2">
              <div class="flex-1 h-px bg-black/10"></div>
              <span class="text-xs text-black/30 font-medium">{{ t('profile.or') }}</span>
              <div class="flex-1 h-px bg-black/10"></div>
            </div>

            <button @click="showDeleteModal = true" class="w-full bg-white text-red-500 text-sm font-semibold py-4 rounded-2xl cursor-pointer border border-red-200 transition-all duration-300 hover:scale-[1.02] hover:bg-red-50 active:scale-[0.98] flex items-center justify-center gap-2">
              <i class="pi pi-trash text-sm"></i> {{ t('profile.deleteAccount') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- IMAGE MODAL -->
    <Transition name="fade">
      <div v-if="showImageModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeImageModal"></div>
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="bg-black px-8 py-6 flex items-center justify-between text-white">
            <h2 class="font-semibold text-lg">{{ t('profile.photo.title') }}</h2>
            <button @click="closeImageModal" class="cursor-pointer hover:opacity-70 transition-opacity"><i class="pi pi-times"></i></button>
          </div>
          <div class="p-8">
            <div
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onFileDrop"
              :class="[errors.image ? 'border-red-500 bg-red-50' : isDragging ? 'border-black bg-black/[0.03]' : 'border-black/10 bg-black/[0.01]']"
              class="w-full h-56 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden"
            >
              <img v-if="displayImage" :src="displayImage" class="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />
              <i class="pi pi-cloud-upload text-3xl z-10" :class="errors.image ? 'text-red-400' : 'text-black/20'"></i>
              <p class="text-sm font-medium z-10" :class="errors.image ? 'text-red-500' : 'text-black/60'">{{ t('profile.photo.drag') }}</p>
            </div>
            <p v-if="errors.image" class="text-red-500 text-center text-xs mt-4">{{ errors.image }}</p>
            <div class="h-8"></div>
            <input type="file" ref="fileInput" class="hidden" @change="onFileSelect" accept="image/*" />
            <button @click="$refs.fileInput.click()" class="w-full py-4 bg-black/[0.03] border border-black/10 rounded-2xl text-sm font-semibold text-black hover:bg-black/5 transition-all cursor-pointer">
              {{ t('profile.photo.select') }}
            </button>
            <button v-if="avatarUrl" @click="deleteAvatar" style="margin-top: 20px;" class="w-full py-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-100 transition-all cursor-pointer flex items-center justify-center gap-2">
              <i class="pi pi-trash"></i> {{ t('profile.photo.remove') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- PASSWORD MODAL -->
    <Transition name="fade">
      <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closePasswordModal"></div>
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="bg-black px-8 py-6 flex items-center justify-between text-white">
            <h2 class="font-semibold text-lg">{{ t('profile.password.title') }}</h2>
            <button @click="closePasswordModal" class="cursor-pointer hover:opacity-70 transition-opacity"><i class="pi pi-times"></i></button>
          </div>
          <div class="px-8 py-10 flex flex-col gap-5">
            <div>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-lock text-sm"></i></span>
                <input v-model="passwords.current" @input="errors.currentPass = ''" type="password" :placeholder="t('profile.password.current')" :class="[errors.currentPass ? 'border-red-500' : 'border-black/10']" class="w-full bg-black/[0.03] border rounded-2xl pl-10 pr-4 py-4 text-sm text-black focus:outline-none transition-all" />
              </div>
              <p v-if="errors.currentPass" class="text-red-500 text-xs mt-1.5 ml-1">{{ errors.currentPass }}</p>
            </div>
            <div class="h-px bg-black/5 my-1"></div>
            <div>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-key text-sm"></i></span>
                <input v-model="passwords.new" @input="errors.newPass = ''" type="password" :placeholder="t('profile.password.new')" :class="[errors.newPass ? 'border-red-500' : 'border-black/10']" class="w-full bg-black/[0.03] border rounded-2xl pl-10 pr-4 py-4 text-sm text-black focus:outline-none transition-all" />
              </div>
              <p v-if="errors.newPass" class="text-red-500 text-xs mt-1.5 ml-1">{{ errors.newPass }}</p>
            </div>
            <div>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-shield text-sm"></i></span>
                <input v-model="passwords.confirm" @input="errors.confirmPass = ''" type="password" :placeholder="t('profile.password.confirm')" :class="[errors.confirmPass ? 'border-red-500' : 'border-black/10']" class="w-full bg-black/[0.03] border rounded-2xl pl-10 pr-4 py-4 text-sm text-black focus:outline-none transition-all" />
              </div>
              <p v-if="errors.confirmPass" class="text-red-500 text-xs mt-1.5 ml-1">{{ errors.confirmPass }}</p>
            </div>
            <button @click="updatePassword" class="mt-4 w-full bg-black text-white py-4 rounded-2xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-black/10">
              {{ t('profile.password.update') }}
            </button>
            <button @click="closePasswordModal" class="text-black/40 text-sm py-2 hover:text-black/70 transition-colors cursor-pointer">
              {{ t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- DELETE ACCOUNT MODAL -->
    <Transition name="fade">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showDeleteModal = false"></div>
        <div class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="px-8 py-10 flex flex-col items-center text-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
              <i class="pi pi-exclamation-triangle text-red-400 text-2xl"></i>
            </div>
            <div>
              <h2 class="font-black text-xl text-slate-900 mb-2">{{ t('profile.deleteModal.title') }}</h2>
              <p class="text-sm text-slate-500">{{ t('profile.deleteModal.description') }}</p>
            </div>
            <p v-if="deleteError" class="text-red-500 text-xs w-full text-left">{{ deleteError }}</p>
            <div class="flex gap-3 w-full" style="margin-top: 0.5rem">
              <button @click="showDeleteModal = false" class="flex-1 py-3.5 rounded-2xl border border-black/10 text-slate-600 font-semibold text-sm hover:bg-black/[0.03] transition-all cursor-pointer">
                {{ t('common.cancel') }}
              </button>
              <button @click="deleteAccount" class="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold text-sm transition-all shadow-md cursor-pointer">
                {{ t('common.delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="showSuccessToast" class="absolute top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
        <div class="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-200 flex items-center gap-3">
          <i class="pi pi-check-circle text-lg"></i>
          <span class="font-semibold text-sm">{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>

    <FooterCmp />
  </Background>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Background from '@/components/Background.vue'
import FooterCmp from '@/components/FooterCmp.vue'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types.ts'

const { t } = useI18n()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const authStore = useAuthStore()
const userId = authStore.user.UserId

const showSuccessToast = ref(false)
const toastMessage = ref('')

const triggerToast = (message: string) => {
  toastMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 1000)
}

const avatarUrl = computed(() => {
  if (authStore.user?.AvatarPath) {
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '')
    const path = authStore.user.AvatarPath.startsWith('avatars/') ? authStore.user.AvatarPath : `avatars/${authStore.user.AvatarPath}`
    return `${baseUrl}/${path}`
  }
  return ''
})

const displayImage = computed(() => previewImage.value || avatarUrl.value)

const showPasswordModal = ref(false)
const showImageModal = ref(false)
const showDeleteModal = ref(false)
const deleteError = ref('')
const isDragging = ref(false)
const previewImage = ref<string | null>(null)

const userName = ref('')
const email = ref('')
const userLocation = ref('')
const displayName = ref(authStore.user.UserName)
const displayEmail = ref(authStore.user.Email)

const schoolLocation = ref('')
const schoolOwner = ref('')
const schoolPhone = ref('')
const schoolWebsite = ref('')
const schoolOpeningDays = ref<string[]>([])
const schoolOpeningTimeFrom = ref('')
const schoolOpeningTimeTo = ref('')
const allWeekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

function toggleOpeningDay(day: string) {
  const idx = schoolOpeningDays.value.indexOf(day)
  if (idx === -1) schoolOpeningDays.value.push(day)
  else schoolOpeningDays.value.splice(idx, 1)
}

const detectingLocation = ref(false)

async function detectUserLocation() {
  if (!navigator.geolocation) return
  detectingLocation.value = true
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      userLocation.value = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
      try {
        const revRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
          { headers: { 'User-Agent': 'DrivingSchoolApp/1.0' } }
        )
        if (revRes.ok) {
          const data = await revRes.json() as any
          if (data?.display_name) {
            const parts = data.display_name.split(', ')
            userLocation.value = parts.slice(0, 3).join(', ')
          }
        }
      } catch { /* fallback to coords */ }
      detectingLocation.value = false
    },
    () => { detectingLocation.value = false },
    { enableHighAccuracy: false, timeout: 15000 }
  )
}

async function geocodeLocation(address: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'DrivingSchoolApp/1.0' } }
    )
    if (response.ok) {
      const data = await response.json() as any[]
      if (data?.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
      }
    }
  } catch { /* ignore */ }
  return null
}

const passwords = reactive({ current: '', new: '', confirm: '' })
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  userName.value = authStore.user.UserName
  email.value = authStore.user.Email
  userLocation.value = authStore.user.Location ?? ''

  if (authStore.isSchool && authStore.user.DrivingSchoolId) {
    try {
      const res = await fetch(`${API_URL}/schools/${authStore.user.DrivingSchoolId}`, { headers: { Authorization: `Bearer ${authStore.token}` } })
      if (res.ok) {
        const school = await res.json()
        schoolLocation.value = school.Location ?? ''
        schoolOwner.value = school.Owner ?? ''
        schoolPhone.value = school.Phone ?? ''
        schoolWebsite.value = school.Website ?? ''
        schoolOpeningDays.value = school.OpeningDays ? school.OpeningDays.split(',') : []
        schoolOpeningTimeFrom.value = school.OpeningTimeFrom ?? ''
        schoolOpeningTimeTo.value = school.OpeningTimeTo ?? ''
      }
    } catch {}
  }
})

const errors = reactive({ userName: '', email: '', userLocation: '', currentPass: '', newPass: '', confirmPass: '', image: '' })

const uploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append('avatar', file)
  try {
    const response = await fetch(API_URL + `/users/${userId}/avatar`, { method: 'POST', body: formData, headers: { Authorization: `Bearer ${authStore.token}` } })
    if (response.ok) {
      const data = await response.json()
      authStore.updateUser({ AvatarPath: data.data.avatarPath })
    } else {
      const err = await response.json()
      errors.image = err.message || t('profile.errors.uploadFailed')
    }
  } catch {
    errors.image = t('profile.errors.networkUpload')
  }
}

const deleteAvatar = async () => {
  try {
    const response = await fetch(API_URL + `/users/${userId}/avatar`, { method: 'DELETE', headers: { Authorization: `Bearer ${authStore.token}` } })
    if (response.ok) {
      authStore.updateUser({ AvatarPath: null })
      previewImage.value = null
      closeImageModal()
    } else {
      const err = await response.json()
      errors.image = err.error?.message || t('profile.errors.deleteFailed')
    }
  } catch {
    errors.image = t('profile.errors.networkDelete')
  }
}

const saveProfile = async () => {
  let valid = true
  if (!userName.value) { errors.userName = t('profile.errors.userName'); valid = false }
  if (!email.value) { errors.email = t('profile.errors.email'); valid = false }
  if (!valid) return

  let lat = authStore.user.Latitude ?? null
  let lng = authStore.user.Longitude ?? null

  if (userLocation.value && (lat === null || lng === null || userLocation.value !== authStore.user.Location)) {
    const coords = await geocodeLocation(userLocation.value)
    if (coords) {
      lat = coords.lat
      lng = coords.lon
    }
  }

  try {
    const response = await fetch(API_URL + `/users/${userId}`, { method: 'PUT', headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ userName: userName.value, email: email.value, location: userLocation.value || null, latitude: lat, longitude: lng }) })
    if (!response.ok) throw new Error()

    if (authStore.isSchool && authStore.user.DrivingSchoolId) {
      await fetch(API_URL + `/schools/${authStore.user.DrivingSchoolId}`, { method: 'PUT', headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: userName.value, location: schoolLocation.value || undefined, owner: schoolOwner.value || undefined, email: email.value, website: schoolWebsite.value || undefined, phone: schoolPhone.value || undefined, openingDays: schoolOpeningDays.value.length > 0 ? schoolOpeningDays.value.join(',') : undefined, openingTimeFrom: schoolOpeningTimeFrom.value || undefined, openingTimeTo: schoolOpeningTimeTo.value || undefined }) })
    }

    displayName.value = userName.value
    displayEmail.value = email.value
    authStore.updateUser({ UserName: userName.value, Email: email.value, Location: userLocation.value || null, Latitude: lat as number | null, Longitude: lng as number | null })

    triggerToast(t('profile.saveSuccess'))
  } catch {
    errors.userName = t('profile.errors.networkSave')
    errors.email = t('profile.errors.networkSave')
  }
}

const updatePassword = async () => {
  let valid = true
  if (!passwords.current) { errors.currentPass = t('profile.errors.currentPass'); valid = false }
  if (!passwords.new) { errors.newPass = t('profile.errors.newPass'); valid = false }
  if (passwords.new !== passwords.confirm) { errors.confirmPass = t('profile.errors.passMismatch'); valid = false }
  if (!passwords.confirm) errors.confirmPass = t('profile.errors.newPass')

  if (valid) {
    try {
      const response = await fetch(API_URL + `/users/${userId}/password`, { method: 'PATCH', headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }) })
      if (response.ok) {
        closePasswordModal()
        triggerToast(t('profile.password.success'))
      } else {
        throw new Error()
      }
    } catch {
      errors.currentPass = t('profile.errors.passWrong')
    }
  }
}

const deleteAccount = async () => {
  deleteError.value = ''
  try {
    const enrollRes = await fetch(API_URL + `/users/${userId}/enrollments`, { headers: { Authorization: `Bearer ${authStore.token}` } })
    if (enrollRes.ok) {
      const enrollments = await enrollRes.json()
      if (Array.isArray(enrollments) && enrollments.length > 0) {
        const courseId = enrollments[0].LicenseProgramId
        await fetch(API_URL + `/programs/${courseId}/enroll`, { method: 'DELETE', headers: { Authorization: `Bearer ${authStore.token}` } })
      }
    }
    const response = await fetch(API_URL + `/users/${userId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${authStore.token}` } })
    if (response.ok) {
      authStore.logout()
    } else {
      const err = await response.json()
      deleteError.value = err.error?.message || t('profile.errors.deleteFailed')
    }
  } catch {
    deleteError.value = t('profile.errors.networkDelete')
  }
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  passwords.current = ''; passwords.new = ''; passwords.confirm = ''
  errors.currentPass = ''; errors.newPass = ''; errors.confirmPass = ''
}

const closeImageModal = () => { showImageModal.value = false; errors.image = '' }

const onDragOver = () => { isDragging.value = true; errors.image = '' }
const onDragLeave = () => { isDragging.value = false }
const onFileDrop = (e: DragEvent) => { isDragging.value = false; const file = e.dataTransfer?.files[0]; if (file) handleImageUpload(file) }
const onFileSelect = (e: Event) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) handleImageUpload(file) }

const handleImageUpload = (file: File) => {
  if (!file.type.startsWith('image/')) { errors.image = t('profile.errors.imageType'); return }
  if (file.size > 5 * 1024 * 1024) { errors.image = t('profile.errors.imageSize'); return }
  const reader = new FileReader()
  reader.onload = (e) => { previewImage.value = e.target?.result as string }
  reader.readAsDataURL(file)
  uploadAvatar(file)
  closeImageModal()
  triggerToast(t('profile.photo.success'))
}
</script>

<style scoped>
.field-label { margin-bottom: 0.5rem; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { opacity: 0; transform: translate(-50%, -20px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translate(-50%, -20px) scale(0.9); }
</style>
