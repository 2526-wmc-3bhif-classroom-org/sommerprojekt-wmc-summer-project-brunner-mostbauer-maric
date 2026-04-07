<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 pt-24 md:pt-16">
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
              <span
                v-if="!dateValid"
                class="text-red-700 text-sm tracking-tight uppercase"
              >Das Datumsformat ist nicht korrekt. (Datum muss in der Zukunft sein).</span>
            </div>
            <div>
              <label class="font-black text-lg mb-3 block text-black uppercase tracking-tight">Dein Lerntempo</label>
              <select
                v-model="formData.goal"
                required
                class="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none appearance-none shadow-sm"
              >
                <option value="" disabled>Wähle ein Ziel...</option>
                <option value="fast">🏎️ Schnellstmöglich (Intensiv)</option>
                <option value="normal">🚗 Normales Tempo</option>
                <option value="relaxed">🛵 Ganz entspannt</option>
              </select>
            </div>
          </div>

          <!-- School selection -->
          <div>
            <label class="font-black text-xl mb-3 block text-black uppercase tracking-tight">Fahrschule</label>
            <div class="relative">
              <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                v-model="formData.schoolSearch"
                type="text"
                placeholder="Name der Fahrschule eingeben..."
                class="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none shadow-sm"
              />
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Background from '@/components/Background.vue'
import HeaderMain from '@/components/HeaderMain.vue'
import FooterCmp from '@/components/FooterCmp.vue'

const router = useRouter()

const classes = ['A', 'B', 'BE', 'C', 'CE', 'D', 'L', 'T']

const formData = reactive({
  licenseClass: 'B',
  startDate: new Date().toISOString().split('T')[0],
  goal: '',
  schoolSearch: ''
})

const dateValid = ref(true)

const submitForm = () => {
  if (!formData.startDate || Number.isNaN(new Date(formData.startDate).getTime()) || new Date(formData.startDate).getTime() < new Date(Date.now()).getTime()) {
    dateValid.value = false
    return
  }
  dateValid.value = true

  console.log('Startformular gesendet:', formData)
  router.push('/dashboard')
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
