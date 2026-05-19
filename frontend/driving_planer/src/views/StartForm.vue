<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 pt-16 md:pt-10">
      <div class="max-w-2xl w-full" v-motion-fade-visible>
        <div class="text-center" style="margin-bottom: 1.25rem;">
          <HeaderMain :title="t('start.title')" desktopHeight="md:text-6xl" mobileHeight="text-4xl" class="pb-2 text-black" :duration="500" />
          <p class="text-black font-bold text-base md:text-xl opacity-60 mt-4 px-4">
            {{ t('start.subtitle') }}
          </p>
        </div>

        <form @submit.prevent="submitForm" class="bg-white border-2 border-gray-100 rounded-[2rem] p-8 shadow-xl flex flex-col gap-8 transition-all hover:shadow-2xl">
          <div>
            <label class="font-black text-xl block text-black uppercase tracking-tight" style="margin-bottom: 1rem;">{{ t('start.licenseClass') }}</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                v-for="cls in classes"
                :key="cls"
                @click="selectClass(cls)"
                :class="['p-4 rounded-2xl border-2 font-black text-center cursor-pointer transition-all active:scale-95',
                  formData.licenseClass === cls ? 'bg-black text-white border-black shadow-md' : 'bg-slate-50 text-black border-transparent hover:border-black/20']"
              >
                {{ cls }}
              </div>
            </div>
            <span v-if="!classValid" class="text-red-700 text-sm tracking-tight uppercase" style="margin-top: 0.5rem; display: block;">{{ t('start.errors.noCourse', { cls: formData.licenseClass }) }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="font-black text-lg block text-black uppercase tracking-tight" style="margin-bottom: 0.875rem;">{{ t('start.startDate') }}</label>
              <input
                v-model="formData.startDate"
                type="date"
                required
                class="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none shadow-sm"
              />
              <span v-if="!dateValid" class="text-red-700 text-sm tracking-tight uppercase">{{ t('start.errors.invalidDate') }}</span>
            </div>
            <div>
              <label class="font-black text-lg block text-black uppercase tracking-tight" style="margin-bottom: 0.875rem;">{{ t('start.pace') }}</label>
              <select
                v-model="formData.goal"
                :class="['w-full p-4 border-2 rounded-2xl text-black font-bold focus:bg-white transition-all outline-none appearance-none shadow-sm', !goalValid ? 'border-red-400 bg-red-50/30' : 'bg-slate-50 border-transparent focus:border-black']"
              >
                <option value="" disabled>{{ t('start.paceGoal') }}</option>
                <option value="fast">{{ t('start.paceFast') }}</option>
                <option value="normal">{{ t('start.paceNormal') }}</option>
                <option value="relaxed">{{ t('start.paceRelaxed') }}</option>
              </select>
              <span v-if="!goalValid" class="text-red-700 text-sm tracking-tight uppercase">{{ t('start.errors.noPace') }}</span>
            </div>
          </div>

           <button
             type="submit"
             class="mt-4 bg-black text-white p-5 rounded-2xl font-black text-xl active:scale-[0.98] transition-all duration-300 shadow-xl uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:bg-gray-900 group"
           >
             {{ t('start.submit') }}
             <i class="pi pi-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
           </button>

            <button
              type="button"
              @click="skipEnrollment"
              class="mt-2 bg-gray-100 text-black p-4 rounded-2xl font-bold text-base hover:bg-gray-200 active:scale-[0.98] transition-all uppercase tracking-widest border-2 border-gray-300 hover:border-gray-400"
            >
              {{ t('start.skip') }}
            </button>
         </form>
       </div>
     </div>
     <FooterCmp />
   </Background>
 </template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Background from '@/components/Background.vue'
import HeaderMain from '@/components/HeaderMain.vue'
import FooterCmp from '@/components/FooterCmp.vue'
import { useAuthStore } from '@/stores/authStore'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()


const classes = ['AM','A1', 'A2', 'A', 'B1', 'B', 'C1', 'C', 'D1', 'D', 'BE', 'C1E', 'CE', 'D1E', 'DE', 'F']
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const licenseTypeMapping: Record<number, string> = {
  1: 'A', 2: 'A1', 3: 'A2', 4: 'AM', 5: 'B', 6: 'BE', 7: 'C', 8: 'C1', 9: 'CE', 10: 'D', 11: 'D1', 12: 'DE'
}

const availableCourses = ref<any[]>([])

onMounted(async () => {
  try {
    const response = await fetch(`${API_URL}/programs`)
    const result = await response.json()
    if (result.data) {
      availableCourses.value = result.data.map((p: any) => ({
        licenseType: licenseTypeMapping[p.LicenseTypeId] || 'Unknown',
        dateFrom: p.DateFrom,
        dateTo: p.DateTo
      }))
    }
  } catch (e) {
    console.error('Failed to fetch programs:', e)
  }
})

const formData = reactive({
  licenseClass: 'B',
  startDate: new Date().toISOString().split('T')[0],
  goal: '',
})

const dateValid = ref(true)
const goalValid = ref(true)
const classValid = ref(true)

const selectClass = (cls: string) => {
  formData.licenseClass = cls
  classValid.value = true
}

const submitForm = () => {
  goalValid.value = !!formData.goal
  const timestampForm = new Date(formData.startDate).getTime()
  if (!formData.startDate || Number.isNaN(timestampForm) || !checkIfFuture(new Date(formData.startDate), new Date(Date.now()))) {
    dateValid.value = false
  } else {
    dateValid.value = true
  }
  if (!dateValid.value || !goalValid.value) return

  classValid.value = availableCourses.value.some(
    c => c.licenseType === formData.licenseClass && c.dateTo >= formData.startDate
  )
  if (!classValid.value) return

  sessionStorage.setItem('pendingEnrollment', JSON.stringify({
    licenseClass: formData.licenseClass,
    startDate: formData.startDate,
    goal: formData.goal
  }))
  router.push('/manage')
}

const checkIfFuture = (formDate: Date, todayDate: Date) => {
  const d1 = new Date(formDate.getTime())
  const d2 = new Date(todayDate.getTime())
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return d1.getTime() >= d2.getTime()
}

const skipEnrollment = () => {
  authStore.setSkippedEnrollment(true)
  sessionStorage.removeItem('pendingEnrollment')
  router.push('/dashboard')
}
</script>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='black'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.5rem;
}
</style>
