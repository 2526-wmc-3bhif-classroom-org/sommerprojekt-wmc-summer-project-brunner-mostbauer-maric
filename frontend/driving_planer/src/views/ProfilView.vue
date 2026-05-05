<template>
  <Background>
    <div class="min-h-screen px-4 py-20 md:py-32 flex flex-col items-center">

      <!-- Profile Card -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' }}"
        class="w-full max-w-xl"
      >
        <div class="bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">

          <!-- Avatar Banner Section -->
          <div class="bg-black px-10 pt-12 pb-24">
            <div class="flex items-center gap-6">
              <!-- Profile Image Button -->
              <button
                @click="showImageModal = true"
                id="profile-avatar-btn"
                class="group relative w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center shrink-0 overflow-hidden transition-all hover:border-white/40 cursor-pointer"
              >
                <!-- Current Avatar Icon -->
                <i class="pi pi-user text-white text-3xl group-hover:opacity-0 transition-opacity"></i>

                <!-- Hover Overlay with Edit Icon -->
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <i class="pi pi-camera text-white text-xl"></i>
                </div>
              </button>

              <div>
                <p id="profile-display-name" class="text-white text-xl font-semibold mb-1">{{userName}}</p>
                <p id="profile-display-email" class="text-white/50 text-sm">{{email}}</p>
              </div>
            </div>
          </div>

          <!-- Form Fields Container -->
          <div class="-mt-10 mx-4 mb-8 bg-white rounded-2xl shadow-md border border-black/5 px-8 py-10 flex flex-col gap-6">

            <!-- Name Field -->
            <div>
              <label for="input-name" class="block text-xs font-semibold uppercase tracking-widest text-black/40 mb-3">
                Name
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30">
                  <i class="pi pi-user text-sm"></i>
                </span>
                <input
                  id="input-name"
                  v-model="userName"
                  type="text"
                  placeholder="Deinen Namen eingeben"
                  class="w-full bg-black/[0.03] border border-black/10 rounded-2xl pl-10 pr-4 py-4 text-black placeholder-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <!-- Email Field -->
            <div>
              <label for="input-email" class="block text-xs font-semibold uppercase tracking-widest text-black/40 mb-3">
                E-Mail
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30">
                  <i class="pi pi-envelope text-sm"></i>
                </span>
                <input
                  id="input-email"
                  v-model="email"
                  type="email"
                  placeholder="Deine E-Mail eingeben"
                  class="w-full bg-black/[0.03] border border-black/10 rounded-2xl pl-10 pr-4 py-4 text-black placeholder-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <!-- Profile Save Action -->
            <button
              id="btn-save-profile"
              @click="saveProfile"
              class="mt-6 w-full bg-black text-white text-sm font-semibold py-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
            >
              Änderungen speichern
            </button>

            <!-- Divider -->
            <div class="flex items-center gap-3 mt-4 mb-2">
              <div class="flex-1 h-px bg-black/10"></div>
              <span class="text-xs text-black/30 font-medium">oder</span>
              <div class="flex-1 h-px bg-black/10"></div>
            </div>

            <!-- Password Reset Action -->
            <button
              id="btn-open-password-modal"
              @click="showPasswordModal = true"
              class="w-full bg-white text-black text-sm font-semibold py-4 rounded-2xl cursor-pointer border border-black/10 transition-all duration-300 hover:scale-[1.02] hover:bg-black/[0.03] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <i class="pi pi-lock text-sm"></i>
              Passwort zurücksetzen
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- IMAGE UPLOAD MODAL -->
    <Transition name="fade">
      <div v-if="showImageModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showImageModal = false"></div>
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

          <!-- Modal Header -->
          <div class="bg-black px-8 py-6 flex items-center justify-between text-white">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <i class="pi pi-camera text-white text-sm"></i>
              </div>
              <h2 class="font-semibold text-lg">Foto aktualisieren</h2>
            </div>
            <button @click="showImageModal = false" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer">
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <div class="p-8">
            <!-- Drag & Drop Area -->
            <div
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onFileDrop"
              :class="{'border-black bg-black/[0.03]': isDragging, 'border-black/10 bg-black/[0.01]': !isDragging}"
              class="w-full h-56 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300"
            >
              <div class="w-16 h-16 rounded-2xl bg-black/[0.03] flex items-center justify-center mb-2">
                <i class="pi pi-cloud-upload text-3xl text-black/20"></i>
              </div>
              <p class="text-sm font-medium text-black/60">Bild hierher ziehen</p>
              <p class="text-xs text-black/30 uppercase tracking-widest">oder</p>
            </div>

            <!-- Spacer -->
            <div class="h-8"></div>

            <!-- Manual Upload Button -->
            <input type="file" ref="fileInput" class="hidden" @change="onFileSelect" accept="image/*" />
            <button
              @click="$refs.fileInput.click()"
              class="w-full py-4 bg-black/[0.03] border border-black/10 rounded-2xl text-sm font-semibold text-black hover:bg-black/5 transition-all duration-300 active:scale-[0.98]"
            >
              Datei auswählen
            </button>

            <button @click="showImageModal = false" class="w-full text-black/40 text-sm py-2 mt-4 cursor-pointer hover:text-black/70 transition-colors">
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- PASSWORD MODAL -->
    <Transition name="fade">
      <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showPasswordModal = false"></div>
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

          <!-- Modal Header -->
          <div class="bg-black px-8 py-6 flex items-center justify-between text-white">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <i class="pi pi-lock text-white text-sm"></i>
              </div>
              <h2 class="font-semibold text-lg">Passwort ändern</h2>
            </div>
            <button @click="showPasswordModal = false" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer">
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="px-8 py-10 flex flex-col gap-6">
            <!-- Current Password -->
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-lock text-sm"></i></span>
              <input
                type="password"
                placeholder="Aktuelles Passwort"
                class="w-full bg-black/[0.03] border border-black/10 rounded-2xl pl-10 pr-4 py-4 text-sm text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
            </div>

            <div class="h-px bg-black/5 my-2"></div>

            <!-- New Password -->
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-key text-sm"></i></span>
              <input
                type="password"
                placeholder="Neues Passwort"
                class="w-full bg-black/[0.03] border border-black/10 rounded-2xl pl-10 pr-4 py-4 text-sm text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
            </div>

            <!-- Confirm New Password -->
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"><i class="pi pi-shield text-sm"></i></span>
              <input
                type="password"
                placeholder="Neues Passwort bestätigen"
                class="w-full bg-black/[0.03] border border-black/10 rounded-2xl pl-10 pr-4 py-4 text-sm text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
            </div>

            <button @click="updatePassword" class="w-full bg-black text-white py-4 rounded-2xl font-semibold shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Passwort aktualisieren
            </button>

            <button @click="showPasswordModal = false" class="text-black/40 text-sm py-2 hover:text-black/70 transition-colors">
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <FooterCmp />
  </Background>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Background from "@/components/Background.vue";
import FooterCmp from "@/components/FooterCmp.vue";
import { useAuthStore } from "@/stores/authStore";

/**
 * State Management
 */
const authStore = useAuthStore();
const showPasswordModal = ref(false);
const showImageModal = ref(false);
const isDragging = ref(false);

const userName = ref(authStore.user.UserName);
const email = ref(authStore.user.Email);
const fileInput = ref<HTMLInputElement | null>(null);

/**
 * Profile Action Methods
 */
const saveProfile = () => {
  console.log("Saving changes for user:", userName.value);
};

const updatePassword = () => {
  console.log("Updating password...");
};

/**
 * Image Upload & Drag/Drop Handlers
 */
const onDragOver = () => {
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onFileDrop = (event: DragEvent) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleImageUpload(files[0]);
  }
};

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    handleImageUpload(target.files[0]);
  }
};

const handleImageUpload = (file: File) => {
  console.log("Image file selected:", file.name);
  showImageModal.value = false;
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
