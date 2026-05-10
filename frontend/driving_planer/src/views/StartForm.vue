<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 pt-16 md:pt-10">
      <div class="max-w-2xl w-full" v-motion-fade-visible>
        <div class="text-center mb-10">
          <HeaderMain title="Dein Start" desktopHeight="md:text-6xl" mobileHeight="text-4xl" class="pb-2 text-black" :duration="500" />
          <p class="text-black font-bold text-base md:text-xl opacity-60 mt-4 px-4">
            Konfiguriere deinen persönlichen Fahrplan zum Erfolg
          </p>
        </div>

        <form @submit.prevent="submitForm" class="bg-white border-2 border-gray-100 rounded-[2rem] p-8 shadow-xl flex flex-col gap-8 transition-all hover:shadow-2xl">
          <!-- License Class -->
          <div>
            <label class="font-black text-xl mb-4 block text-black uppercase tracking-tight">Führerscheinklasse</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                v-for="cls in classes"
                :key="cls"
                @click="formData.licenseClass = cls"
                :class="['p-4 rounded-2xl border-2 font-black text-center cursor-pointer transition-all active:scale-95',
                  formData.licenseClass === cls ? 'bg-black text-white border-black shadow-md' : 'bg-slate-50 text-black border-transparent hover:border-black/20']"
              >
                {{ cls }}
              </div>
            </div>
          </div>

          <!-- Driving School -->
          <div>
            <label class="font-black text-xl mb-4 block text-black uppercase tracking-tight">Fahrschule</label>
            <div v-if="schoolsLoading" class="flex items-center justify-center py-8 text-black/30">
              <i class="pi pi-spin pi-spinner text-xl"></i>
            </div>
            <div v-else-if="schools.length === 0" class="flex flex-col items-center justify-center py-8 opacity-30 gap-2">
              <i class="pi pi-building text-2xl"></i>
              <p class="text-xs font-black uppercase tracking-wider">Keine Fahrschulen verfügbar</p>
            </div>
            <div v-else class="flex flex-col gap-2">
              <div class="relative">
                <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-black/30 text-sm"></i>
                <input
                  v-model="schoolSearch"
                  type="text"
                  placeholder="Fahrschule suchen..."
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none text-sm"
                />
              </div>
              <div class="flex flex-col gap-2 overflow-y-auto pr-1" style="max-height: 17.5rem">
                <div v-if="filteredSchools.length === 0" class="flex flex-col items-center justify-center py-6 opacity-30 gap-2">
                  <i class="pi pi-search text-2xl"></i>
                  <p class="text-xs font-black uppercase tracking-wider">Keine Treffer</p>
                </div>
                <div
                  v-for="school in filteredSchools"
                  :key="school.DrivingSchoolId"
                  @click="toggleSchool(school.DrivingSchoolId)"
                  :class="['flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.99]',
                    formData.schoolId === school.DrivingSchoolId
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-slate-50 text-black border-transparent hover:border-black/20']"
                >
                  <div class="flex flex-col gap-0.5">
                    <span class="font-black text-sm">{{ school.Name }}</span>
                    <span class="text-xs opacity-50">{{ school.Location }}</span>
                  </div>
                  <i v-if="formData.schoolId === school.DrivingSchoolId" class="pi pi-check text-sm"></i>
                </div>
              </div>
            </div>
            <span v-if="!schoolValid" class="text-red-700 text-sm tracking-tight uppercase">Bitte eine Fahrschule wählen.</span>
          </div>

          <!-- Start Date & Goal -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="font-black text-lg mb-3 block text-black uppercase tracking-tight">Geplanter Start</label>
              <input
                v-model="formData.startDate"
                type="date"
                required
                class="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none shadow-sm"
              />
              <span v-if="!dateValid" class="text-red-700 text-sm tracking-tight uppercase">Das Datumsformat ist nicht korrekt. (Datum muss in der Zukunft sein).</span>
            </div>
            <div>
              <label class="font-black text-lg mb-3 block text-black uppercase tracking-tight">Dein Lerntempo *</label>
              <select
                v-model="formData.goal"
                :class="['w-full p-4 border-2 rounded-2xl text-black font-bold focus:bg-white transition-all outline-none appearance-none shadow-sm', !goalValid ? 'border-red-400 bg-red-50/30' : 'bg-slate-50 border-transparent focus:border-black']"
              >
                <option value="" disabled>Wähle ein Ziel...</option>
                <option value="fast">🏎️ Schnellstmöglich (Intensiv)</option>
                <option value="normal">🚗 Normales Tempo</option>
                <option value="relaxed">🛵 Ganz entspannt</option>
              </select>
              <span v-if="!goalValid" class="text-red-700 text-sm tracking-tight uppercase">Bitte ein Lerntempo wählen.</span>
            </div>
          </div>

          <button
            type="submit"
            class="mt-4 bg-black text-white p-5 rounded-2xl font-black text-xl hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl hover:shadow-2xl uppercase tracking-widest flex items-center justify-center gap-3"
          >
            Fahrplan erstellen
            <i class="pi pi-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
    <FooterCmp />
  </Background>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Background from '@/components/Background.vue'
import HeaderMain from '@/components/HeaderMain.vue'
import FooterCmp from '@/components/FooterCmp.vue'
import { useAuthStore } from '@/stores/authStore'
import { useSchoolStore } from '@/stores/schoolStore'
import type { DrivingSchool } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const schoolStore = useSchoolStore()

const classes = ['AM','A1', 'A2', 'A', 'B1', 'B', 'C1', 'C', 'D1', 'D', 'BE', 'C1E', 'CE', 'D1E', 'DE', 'F']

const schools = ref<DrivingSchool[]>([])
const schoolsLoading = ref(false)
const schoolSearch = ref('')

const filteredSchools = computed(() =>
  schools.value.filter(s =>
    s.Name.toLowerCase().includes(schoolSearch.value.toLowerCase()) ||
    s.Location?.toLowerCase().includes(schoolSearch.value.toLowerCase())
  )
)

onMounted(async () => {
  schoolsLoading.value = true
  await schoolStore.fetchSchools()
  schools.value = schoolStore.schools
  schoolsLoading.value = false
})

const formData = reactive({
  licenseClass: 'B',
  startDate: new Date().toISOString().split('T')[0],
  goal: '',
  schoolId: null as number | null,
})

const dateValid = ref(true)
const goalValid = ref(true)
const schoolValid = ref(true)

const toggleSchool = (id: number) => {
  formData.schoolId = formData.schoolId === id ? null : id
  schoolValid.value = true
}

const submitForm = () => {
  goalValid.value = !!formData.goal
  schoolValid.value = formData.schoolId !== null
  const timestampForm = new Date(formData.startDate).getTime()
  if (!formData.startDate || Number.isNaN(timestampForm) || !checkIfFuture(new Date(formData.startDate), new Date(Date.now()))) {
    dateValid.value = false
  } else {
    dateValid.value = true
  }
  if (!dateValid.value || !goalValid.value || !schoolValid.value) return

  if (authStore.user?.UserId) {
    localStorage.setItem(`enrolled_${authStore.user.UserId}`, 'true')
  }
  router.push('/dashboard')
}

const checkIfFuture = (formDate: Date, todayDate: Date) => {
  const d1 = new Date(formDate.getTime())
  const d2 = new Date(todayDate.getTime())
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return d1.getTime() >= d2.getTime()
}
</script>

<style scoped>
/* Custom select styling for a better look on mobile */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='black'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.5rem;
}
</style>
