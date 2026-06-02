<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Background from '@/components/Background.vue'
import FooterCmp from '@/components/FooterCmp.vue'
import HeaderMain from '@/components/HeaderMain.vue'

const { t } = useI18n()

const form = ref({
  email: '',
  subject: '',
  message: '',
})

const errors = ref({
  email: false,
  subject: false,
  message: false,
})

const isLoading = ref(false)
const successMessage = ref(false)
const errorMessage = ref(false)

function validate(): boolean {
  errors.value.email = !form.value.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
  errors.value.subject = !form.value.subject.trim()
  errors.value.message = !form.value.message.trim()
  return !errors.value.email && !errors.value.subject && !errors.value.message
}

async function sendEmail() {
  if (!validate()) return

  isLoading.value = true
  successMessage.value = false
  errorMessage.value = false

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_uqzyw68',
        template_id: 'template_935l259',
        user_id: 'kHe1-wGycJs6eA8VG',
        template_params: {
          name: form.value.email,
          email: form.value.email,
          title: form.value.subject,
          message: form.value.message,
        },
      }),
    })
    if (!res.ok) throw new Error()
    successMessage.value = true
    form.value = { email: '', subject: '', message: '' }
  } catch {
    errorMessage.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 pt-24 md:pt-16">
      <div class="max-w-6xl w-full flex flex-col gap-10">

        <!-- Hero -->
        <div class="flex flex-col items-center text-center gap-4 pt-8 pb-4">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-600 font-semibold hover:bg-blue-100 transition-colors cursor-default">
            <i class="pi pi-envelope text-blue-400"></i>
            {{ t('contact.badge') }}
          </div>
          <HeaderMain :title="t('contact.title')" desktopHeight="md:text-6xl" mobileHeight="text-3xl" :duration="400" />
          <p class="text-black/50 md:text-lg text-sm max-w-xl leading-relaxed" v-motion-fade-visible>
            {{ t('contact.subtitle') }}
          </p>
        </div>

        <!-- Content grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <!-- Info column -->
          <div class="flex flex-col gap-4">
            <div
              v-motion
              :initial="{ opacity: 0, scale: 0.9 }"
              :visible-once="{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 800,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15
                }
              }"
              class="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 flex flex-col gap-5"
            >
              <h3 class="font-bold text-slate-900 text-base">{{ t('contact.infoTitle') }}</h3>

              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-envelope text-blue-500 text-sm"></i>
                </div>
                <div>
                  <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{{ t('contact.emailLabel') }}</p>
                  <p class="text-sm text-slate-700 mt-0.5">drivingplaner@gmail.com</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-map-marker text-violet-500 text-sm"></i>
                </div>
                <div>
                  <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{{ t('contact.addressLabel') }}</p>
                  <p class="text-sm text-slate-700 mt-0.5">HTL Leonding<br>Limesstraße 12, 4060 Leonding</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-users text-emerald-500 text-sm"></i>
                </div>
                <div>
                  <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{{ t('contact.teamLabel') }}</p>
                  <p class="text-sm text-slate-700 mt-0.5">Luka Marić<br>Jan Brunner<br>Julian Mostbauer</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form -->
          <div
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :visible-once="{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 800,
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: 200
              }
            }"
            class="md:col-span-2 bg-white border border-gray-100 rounded-3xl shadow-sm p-6 flex flex-col gap-5"
          >
            <h3 class="font-bold text-slate-900 text-base">{{ t('contact.formTitle') }}</h3>

            <!-- Success -->
            <div v-if="successMessage" class="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm text-emerald-700 font-medium">
              <i class="pi pi-check-circle text-emerald-500"></i>
              {{ t('contact.success') }}
            </div>

            <!-- Error -->
            <div v-if="errorMessage" class="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
              <i class="pi pi-exclamation-circle text-red-500"></i>
              {{ t('contact.error') }}
            </div>

            <div class="flex flex-col gap-4">
              <!-- Email -->
              <div class="flex flex-col gap-1.5 pb-2">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ t('contact.form.email') }}</label>
                <input
                  v-model="form.email"
                  type="email"
                  :placeholder="t('contact.form.emailPlaceholder')"
                  :class="['w-full px-4 py-3 rounded-xl border text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all', errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-slate-50 hover:bg-white']"
                  @input="errors.email = false"
                />
                <p v-if="errors.email" class="text-xs text-red-500">{{ t('contact.form.emailError') }}</p>
              </div>

              <!-- Subject -->
              <div class="flex flex-col gap-1.5 pb-2">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ t('contact.form.subject') }}</label>
                <input
                  v-model="form.subject"
                  type="text"
                  :placeholder="t('contact.form.subjectPlaceholder')"
                  :class="['w-full px-4 py-3 rounded-xl border text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all', errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-slate-50 hover:bg-white']"
                  @input="errors.subject = false"
                />
                <p v-if="errors.subject" class="text-xs text-red-500">{{ t('contact.form.subjectError') }}</p>
              </div>

              <!-- Message -->
              <div class="flex flex-col gap-1.5 pb-2">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ t('contact.form.message') }}</label>
                <textarea
                  v-model="form.message"
                  :placeholder="t('contact.form.messagePlaceholder')"
                  rows="5"
                  :class="['w-full px-4 py-3 rounded-xl border text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none', errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-slate-50 hover:bg-white']"
                  @input="errors.message = false"
                ></textarea>
                <p v-if="errors.message" class="text-xs text-red-500">{{ t('contact.form.messageError') }}</p>
              </div>

              <button
                @click="sendEmail"
                :disabled="isLoading"
                class="w-full bg-black text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-transform shadow-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <i v-if="isLoading" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-send"></i>
                {{ isLoading ? t('contact.form.sending') : t('contact.form.send') }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
    <FooterCmp />
  </Background>
</template>
