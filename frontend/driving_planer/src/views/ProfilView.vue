<template>
  <Background>
    <div class="min-h-screen px-4 py-20 md:py-32 flex flex-col items-center">
      <!-- Profile Card -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
        class="w-full max-w-xl"
      >
        <div class="bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">
          <!-- Avatar Banner Section -->
          <div class="bg-black px-10 pt-12 pb-24">
            <div class="flex items-center gap-6">
              <!-- Profile Image Button -->
              <button
                @click="showImageModal = true"
                class="group relative w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center shrink-0 overflow-hidden transition-all hover:border-white/40 cursor-pointer"
              >
                <img v-if="displayImage" :src="displayImage" class="w-full h-full object-cover" />
                <i
                  v-else
                  class="pi pi-user text-white text-3xl group-hover:opacity-0 transition-opacity"
                ></i>

                <div
                  class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <i class="pi pi-camera text-white text-xl"></i>
                </div>
              </button>

              <div>
                <p class="text-white text-xl font-semibold mb-1">
                  {{ displayName || 'Benutzername' }}
                </p>
                <p class="text-white/50 text-sm">{{ displayEmail || 'E-Mail Adresse' }}</p>
              </div>
            </div>
          </div>

          <!-- Form Fields Container -->
          <div
            class="-mt-10 mx-4 mb-8 bg-white rounded-2xl shadow-md border border-black/5 px-8 py-10 flex flex-col gap-6"
          >
            <!-- Name Field -->
            <div>
              <label
                class="block text-xs font-semibold uppercase tracking-widest text-black/40 mb-3"
                >Name</label
              >
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  ><i class="pi pi-user text-sm"></i
                ></span>
                <input
                  v-model="userName"
                  @input="errors.userName = ''"
                  type="text"
                  placeholder="Deinen Namen eingeben"
                  :class="[
                    errors.userName
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-black/10 focus:ring-black/20',
                  ]"
                  class="w-full bg-black/[0.03] border rounded-2xl pl-10 pr-4 py-4 text-black placeholder-black/25 text-sm focus:outline-none focus:ring-2 transition-all"
                />
              </div>
              <p v-if="errors.userName" class="text-red-500 text-xs mt-2 ml-1">
                {{ errors.userName }}
              </p>
            </div>

            <!-- Email Field -->
            <div>
              <label
                class="block text-xs font-semibold uppercase tracking-widest text-black/40 mb-3"
                >E-Mail</label
              >
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  ><i class="pi pi-envelope text-sm"></i
                ></span>
                <input
                  v-model="email"
                  @input="errors.email = ''"
                  type="email"
                  placeholder="Deine E-Mail eingeben"
                  :class="[
                    errors.email
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-black/10 focus:ring-black/20',
                  ]"
                  class="w-full bg-black/[0.03] border rounded-2xl pl-10 pr-4 py-4 text-black placeholder-black/25 text-sm focus:outline-none focus:ring-2 transition-all"
                />
              </div>
              <p v-if="errors.email" class="text-red-500 text-xs mt-2 ml-1">{{ errors.email }}</p>
            </div>

            <button
              @click="saveProfile"
              class="mt-6 w-full bg-black text-white text-sm font-semibold py-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
            >
              Änderungen speichern
            </button>

            <div class="flex items-center gap-3 mt-4 mb-2">
              <div class="flex-1 h-px bg-black/10"></div>
              <span class="text-xs text-black/30 font-medium">oder</span>
              <div class="flex-1 h-px bg-black/10"></div>
            </div>

            <button
              @click="showPasswordModal = true"
              class="w-full bg-white text-black text-sm font-semibold py-4 rounded-2xl cursor-pointer border border-black/10 transition-all duration-300 hover:scale-[1.02] hover:bg-black/[0.03] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <i class="pi pi-lock text-sm"></i> Passwort ändern
            </button>

            <div class="flex items-center gap-3 mt-4 mb-2">
              <div class="flex-1 h-px bg-black/10"></div>
              <span class="text-xs text-black/30 font-medium">oder</span>
              <div class="flex-1 h-px bg-black/10"></div>
            </div>

            <button
              @click="showDeleteModal = true"
              class="w-full bg-white text-red-500 text-sm font-semibold py-4 rounded-2xl cursor-pointer border border-red-200 transition-all duration-300 hover:scale-[1.02] hover:bg-red-50 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <i class="pi pi-trash text-sm"></i> Account löschen
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- IMAGE UPLOAD MODAL -->
    <Transition name="fade">
      <div v-if="showImageModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeImageModal"></div>
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="bg-black px-8 py-6 flex items-center justify-between text-white">
            <h2 class="font-semibold text-lg">Foto aktualisieren</h2>
            <button
              @click="closeImageModal"
              class="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
          <div class="p-8">
            <div
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onFileDrop"
              :class="[
                errors.image
                  ? 'border-red-500 bg-red-50'
                  : isDragging
                    ? 'border-black bg-black/[0.03]'
                    : 'border-black/10 bg-black/[0.01]',
              ]"
              class="w-full h-56 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden"
            >
              <img v-if="displayImage" :src="displayImage" class="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />
              <i
                class="pi pi-cloud-upload text-3xl z-10"
                :class="errors.image ? 'text-red-400' : 'text-black/20'"
              ></i>
              <p
                class="text-sm font-medium z-10"
                :class="errors.image ? 'text-red-500' : 'text-black/60'"
              >
                Bild hierher ziehen
              </p>
            </div>

            <p v-if="errors.image" class="text-red-500 text-center text-xs mt-4">
              {{ errors.image }}
            </p>

            <div class="h-8"></div>
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              @change="onFileSelect"
              accept="image/*"
            />
            <button
              @click="$refs.fileInput.click()"
              class="w-full py-4 bg-black/[0.03] border border-black/10 rounded-2xl text-sm font-semibold text-black hover:bg-black/5 transition-all cursor-pointer"
            >
              Datei auswählen
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- PASSWORD MODAL -->
    <Transition name="fade">
      <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="closePasswordModal"
        ></div>
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="bg-black px-8 py-6 flex items-center justify-between text-white">
            <h2 class="font-semibold text-lg">Passwort ändern</h2>
            <button
              @click="closePasswordModal"
              class="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div class="px-8 py-10 flex flex-col gap-5">
            <div>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  ><i class="pi pi-lock text-sm"></i
                ></span>
                <input
                  v-model="passwords.current"
                  @input="errors.currentPass = ''"
                  type="password"
                  placeholder="Aktuelles Passwort"
                  :class="[errors.currentPass ? 'border-red-500' : 'border-black/10']"
                  class="w-full bg-black/[0.03] border rounded-2xl pl-10 pr-4 py-4 text-sm text-black focus:outline-none transition-all"
                />
              </div>
              <p v-if="errors.currentPass" class="text-red-500 text-xs mt-1.5 ml-1">
                {{ errors.currentPass }}
              </p>
            </div>

            <div class="h-px bg-black/5 my-1"></div>

            <div>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  ><i class="pi pi-key text-sm"></i
                ></span>
                <input
                  v-model="passwords.new"
                  @input="errors.newPass = ''"
                  type="password"
                  placeholder="Neues Passwort"
                  :class="[errors.newPass ? 'border-red-500' : 'border-black/10']"
                  class="w-full bg-black/[0.03] border rounded-2xl pl-10 pr-4 py-4 text-sm text-black focus:outline-none transition-all"
                />
              </div>
              <p v-if="errors.newPass" class="text-red-500 text-xs mt-1.5 ml-1">
                {{ errors.newPass }}
              </p>
            </div>

            <div>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  ><i class="pi pi-shield text-sm"></i
                ></span>
                <input
                  v-model="passwords.confirm"
                  @input="errors.confirmPass = ''"
                  type="password"
                  placeholder="Neues Passwort bestätigen"
                  :class="[errors.confirmPass ? 'border-red-500' : 'border-black/10']"
                  class="w-full bg-black/[0.03] border rounded-2xl pl-10 pr-4 py-4 text-sm text-black focus:outline-none transition-all"
                />
              </div>
              <p v-if="errors.confirmPass" class="text-red-500 text-xs mt-1.5 ml-1">
                {{ errors.confirmPass }}
              </p>
            </div>

            <button
              @click="updatePassword"
              class="mt-4 w-full bg-black text-white py-4 rounded-2xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-black/10"
            >
              Passwort aktualisieren
            </button>
            <button
              @click="closePasswordModal"
              class="text-black/40 text-sm py-2 hover:text-black/70 transition-colors cursor-pointer"
            >
              Abbrechen
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
              <h2 class="font-black text-xl text-slate-900 mb-2">Account wirklich löschen?</h2>
              <p class="text-sm text-slate-500">Diese Aktion ist unwiderruflich. Dein Account und alle zugehörigen Daten werden dauerhaft gelöscht.</p>
            </div>
            <p v-if="deleteError" class="text-red-500 text-xs w-full text-left">{{ deleteError }}</p>
            <div class="flex gap-3 w-full" style="margin-top: 0.5rem">
              <button
                @click="showDeleteModal = false"
                class="flex-1 py-3.5 rounded-2xl border border-black/10 text-slate-600 font-semibold text-sm hover:bg-black/[0.03] transition-all cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                @click="deleteAccount"
                class="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <FooterCmp />
  </Background>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import Background from '@/components/Background.vue'
import FooterCmp from '@/components/FooterCmp.vue'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types.ts'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const authStore = useAuthStore()
const userId = authStore.user.UserId

const avatarUrl = computed(() => {
  if (authStore.user?.AvatarPath) {
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '')
    const path = authStore.user.AvatarPath.startsWith('avatars/') 
      ? authStore.user.AvatarPath 
      : `avatars/${authStore.user.AvatarPath}`
    return `${baseUrl}/${path}`
  }
  return ''
})

const displayImage = computed(() => {
  return previewImage.value || avatarUrl.value
})

// UI States
const showPasswordModal = ref(false)
const showImageModal = ref(false)
const showDeleteModal = ref(false)
const deleteError = ref('')
const isDragging = ref(false)
const previewImage = ref<string | null>(null)

const userName = ref('')
const email = ref('')

const displayName = ref(authStore.user.UserName)
const displayEmail = ref(authStore.user.Email)

const passwords = reactive({ current: '', new: '', confirm: '' })
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  userName.value = authStore.user.UserName
  email.value = authStore.user.Email
})

const errors = reactive({
  userName: '',
  email: '',
  currentPass: '',
  newPass: '',
  confirmPass: '',
  image: '',
})

/** API Upload Funktion **/
const uploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append('avatar', file)
  try {
    const response = await fetch(API_URL + `/users/${userId}/avatar`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })

    if (response.ok) {
      console.log('Avatar erfolgreich hochgeladen')
      const data = await response.json()
      authStore.updateUser({ AvatarPath: data.data.avatarPath })
    } else {
      const err = await response.json()
      errors.image = err.message || 'Upload fehlgeschlagen'
    }
  } catch (e) {
    errors.image = 'Netzwerkfehler beim Upload'
  }
}

const saveProfile = async () => {
  let valid = true
  if (!userName.value) {
    errors.userName = 'Bitte Name angeben'
    valid = false
  }
  if (!email.value) {
    errors.email = 'Bitte E-Mail angeben'
    valid = false
  }
  if (valid) {
    try {
      const response = await fetch(API_URL + `/users/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName.value,
          email: email.value,
        }),
      })
      if (response.ok) {
        console.log('Update Profile')
      } else {
        console.error('Failed update Profile')
        throw new Error();
      }
      displayName.value = userName.value
      displayEmail.value = email.value
      const user: User = JSON.parse(<string>sessionStorage.getItem('user'))
      user.UserName = displayName.value
      user.Email = email.value
      sessionStorage.setItem('user', JSON.stringify(user))
    } catch (err) {
      errors.userName = 'Netzwerkfehler beim Upload'
      errors.email = 'Netzwerkfehler beim Upload'
    }
  }
}

const updatePassword = async () => {
  let valid = true
  if (!passwords.current) {
    errors.currentPass = 'Aktuelles Passwort fehlt'
    valid = false
  }
  if (!passwords.new) {
    errors.newPass = 'Neues Passwort fehlt'
    valid = false
  }
  if (passwords.new !== passwords.confirm) {
    errors.confirmPass = 'Passwörter nicht identisch'
    valid = false
  }
  if (!passwords.confirm) {
    errors.confirmPass = 'Neues Passwort fehlt'
  }

  if (valid) {
    try {
      const response = await fetch(API_URL + `/users/${userId}/password`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "currentPassword": passwords.current,
          "newPassword": passwords.new,
        })
      })
      if(response.ok) {
        console.log('Update Password')
      }else {
        console.error('Something went wrong, while updating password');
        throw new Error();
      }

      closePasswordModal()
    } catch (err) {
      errors.currentPass = "Passwort passt nicht";

    }
  }
}

const deleteAccount = async () => {
  deleteError.value = ''
  try {
    const response = await fetch(API_URL + `/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    if (response.ok) {
      localStorage.removeItem(`enrolled_${userId}`)
      localStorage.removeItem(`licenseClass_${userId}`)
      authStore.logout()
    } else {
      const err = await response.json()
      deleteError.value = err.error?.message || 'Löschen fehlgeschlagen'
    }
  } catch {
    deleteError.value = 'Netzwerkfehler beim Löschen'
  }
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  passwords.current = ''
  passwords.new = ''
  passwords.confirm = ''
  errors.currentPass = ''
  errors.newPass = ''
  errors.confirmPass = ''
}

const closeImageModal = () => {
  showImageModal.value = false
  errors.image = ''
}

/** Image Handlers **/
const onDragOver = () => {
  isDragging.value = true
  errors.image = ''
}
const onDragLeave = () => {
  isDragging.value = false
}
const onFileDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) handleImageUpload(file)
}
const onFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleImageUpload(file)
}

const handleImageUpload = (file: File) => {
  if (!file.type.startsWith('image/')) {
    errors.image = 'Nur Bilder erlaubt (JPG, PNG, GIF, WebP)'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    errors.image = 'Datei zu groß (max. 5MB)'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  uploadAvatar(file)
  closeImageModal()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
