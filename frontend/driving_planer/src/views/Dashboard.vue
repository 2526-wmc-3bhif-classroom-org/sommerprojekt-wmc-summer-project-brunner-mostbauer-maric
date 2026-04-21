<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 pt-24 md:pt-16">

      <div class="max-w-6xl w-full" v-motion-fade-visible>

        <div class="text-center mb-10 md:mb-16 p-4">
          <HeaderMain
            title="Dashboard"
            desktopHeight="md:text-6xl"
            mobileHeight="text-4xl"
            class="pb-2 text-black"
            :duration="500"
          />
          <p class="text-black font-bold text-base md:text-xl opacity-60 mt-4 p-4">
            Verwalte deinen Fortschritt zum Führerschein
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          <!-- Gefahrene Kilometer -->
          <div class="group bg-white/80 backdrop-blur-sm border-2 border-white rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-[450px]" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-black rounded-2xl">
                <i class="pi pi-map-marker text-white text-xl"></i>
              </div>
              <h2 class="font-black text-2xl text-black uppercase tracking-tight">Gefahrene Kilometer</h2>
            </div>

            <div class="flex gap-3 mb-2">
              <input
                v-model="kmInput"
                type="number"
                placeholder="km eingeben..."
                class="flex-1 p-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none"
                @keyup.enter="addKm"
              />
              <button
                @click="addKm"
                class="bg-black text-white px-6 rounded-2xl font-black hover:bg-gray-800 active:scale-90 transition-all shadow-lg flex items-center justify-center"
              >
                <i class="pi pi-plus"></i>
              </button>
            </div>
            
            <div class="h-6 mb-2">
              <span
                v-if="!validKm"
                class="text-xs text-red-600 font-bold uppercase tracking-wider animate-pulse"
              >Ungültiges Format (nur positive Zahlen)</span>
            </div>

            <div class="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-black/20">
              <ul class="space-y-3">
                <li
                  v-for="(km, i) in kmList"
                  :key="i"
                  class="text-md text-black font-bold bg-slate-50/80 p-4 rounded-2xl flex justify-between items-center border border-slate-100 hover:border-black/10 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-xs text-black/40">#{{ i + 1 }}</span>
                    <span>{{ km }} km</span>
                  </div>
                  <button @click="removeKm(i)" class="w-10 h-10 rounded-xl flex items-center justify-center text-black/20 hover:text-red-500 hover:bg-red-50 transition-all">
                    <i class="pi pi-trash"></i>
                  </button>
                </li>
              </ul>
              <div v-if="kmList.length === 0" class="h-full flex flex-col items-center justify-center text-black/20 gap-2">
                <i class="pi pi-info-circle text-4xl"></i>
                <p class="font-bold">Noch keine Einträge</p>
              </div>
            </div>
          </div>

          <!-- Checkliste -->
          <div class="group bg-white/80 backdrop-blur-sm border-2 border-white rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-[450px]" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-black rounded-2xl">
                <i class="pi pi-check-square text-white text-xl"></i>
              </div>
              <h2 class="font-black text-2xl text-black uppercase tracking-tight">Checkliste</h2>
            </div>

            <div class="flex gap-3 mb-6">
              <input
                v-model="checkInput"
                type="text"
                placeholder="Neues Item..."
                class="flex-1 p-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none"
                @keyup.enter="addCheck"
              />
              <button
                @click="addCheck"
                class="bg-black text-white px-6 rounded-2xl font-black hover:bg-gray-800 active:scale-90 transition-all shadow-lg flex items-center justify-center"
              >
                <i class="pi pi-plus"></i>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-black/20">
              <div class="space-y-3">
                <div
                  v-for="(item, i) in checklist"
                  :key="i"
                  class="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-white hover:border-black/10 transition-all group/item"
                >
                  <label class="flex items-center gap-4 cursor-pointer flex-1">
                    <div class="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        v-model="item.done"
                        class="peer appearance-none w-6 h-6 border-2 border-black/20 rounded-lg checked:bg-black checked:border-black transition-all cursor-pointer"
                      />
                      <i class="pi pi-check absolute text-white text-xs opacity-0 peer-checked:opacity-100 pointer-events-none"></i>
                    </div>
                    <span :class="item.done ? 'line-through text-black/30' : 'text-black font-bold'" class="text-lg transition-all">
                      {{ item.text }}
                    </span>
                  </label>
                  
                  <button 
                    @click="removeCheck(i)"
                    class="w-10 h-10 rounded-xl flex items-center justify-center text-black/20 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </div>
              <div v-if="checklist.length === 0" class="h-full flex flex-col items-center justify-center text-black/20 gap-2">
                <i class="pi pi-list text-4xl"></i>
                <p class="font-bold">Checkliste ist leer</p>
              </div>
            </div>
          </div>

          <!-- Dokumente -->
          <div class="group bg-white/80 backdrop-blur-sm border-2 border-white rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-[450px]" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-black rounded-2xl">
                <i class="pi pi-file-pdf text-white text-xl"></i>
              </div>
              <h2 class="font-black text-2xl text-black uppercase tracking-tight">Dokumente</h2>
            </div>

            <div class="flex-1 flex flex-col gap-6">
              <div class="relative h-full border-2 border-dashed border-black/10 rounded-[2rem] bg-slate-50/50 hover:bg-white hover:border-black/30 transition-all group/upload cursor-pointer flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                <input
                  type="file"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div class="flex flex-col items-center gap-4 group-hover:scale-110 transition-transform duration-300">
                  <div class="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center">
                    <i class="pi pi-upload text-3xl text-black/40 group-hover:text-black transition-colors"></i>
                  </div>
                  <div>
                    <p class="text-black font-black text-xl mb-1">Datei auswählen</p>
                    <p class="text-black/40 font-bold text-sm">PDF, JPG oder PNG (Max. 10MB)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Prüfungstermine -->
          <div class="group bg-white/80 backdrop-blur-sm border-2 border-white rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-[450px]" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-black rounded-2xl">
                <i class="pi pi-calendar text-white text-xl"></i>
              </div>
              <h2 class="font-black text-2xl text-black uppercase tracking-tight">Prüfungstermine</h2>
            </div>

            <div class="flex flex-col gap-4 mb-4">
                <div class="grid grid-cols-2 gap-3">
                  <select 
                    v-model="typeInput"
                    class="p-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="Theorie">Theorie</option>
                    <option value="Praxis">Praxis</option>
                    <option value="Erste Hilfe">Erste Hilfe</option>
                    <option value="Arzt">Arzt</option>
                  </select>
                  <input
                    v-model="dateInput"
                    type="date"
                    class="p-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none"
                  />
                </div>

                <button
                @click="addDate"
                class="w-full bg-black text-white p-4 rounded-2xl font-black text-lg hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <i class="pi pi-plus-circle"></i>
                  Hinzufügen
                </button>
            </div>
            
            <div class="h-6 mb-2">
              <span
                v-if="!dateValid"
                class="text-xs text-red-600 font-bold uppercase tracking-wider animate-pulse"
              >Datum muss in der Zukunft liegen</span>
            </div>

            <div class="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-black/20">
              <ul class="space-y-3">
                  <li
                  v-for="(date, i) in dates"
                  :key="i"
                  class="group/item text-md text-black font-bold bg-slate-50/80 p-4 rounded-2xl border-l-8 border-black flex justify-between items-center hover:bg-white transition-all shadow-sm"
                  >
                    <div class="flex flex-col">
                      <span class="text-xs uppercase text-black/40 font-black tracking-widest mb-1">{{ date.type }}</span>
                      <span class="text-lg">
                        {{ new Date(date.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }) }}
                      </span>
                    </div>

                    <div class="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <button @click="editDate(i)" class="w-10 h-10 rounded-xl flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all">
                        <i class="pi pi-pencil"></i>
                      </button>
                      <button @click="removeDate(i)" class="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-all">
                        <i class="pi pi-trash"></i>
                      </button>
                    </div>
                  </li>
                </ul>
                <div v-if="dates.length === 0" class="h-full flex flex-col items-center justify-center text-black/20 gap-2">
                  <i class="pi pi-calendar-times text-4xl"></i>
                  <p class="font-bold">Keine Termine geplant</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterCmp />
  </Background>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Background from '@/components/Background.vue'
import HeaderMain from '@/components/HeaderMain.vue'
import FooterCmp from '@/components/FooterCmp.vue'

/* KM */
const kmInput = ref('')
const kmList = ref<number[]>([])
const validKm = ref<boolean>(true);


const addKm = () => {
  if (!kmInput.value || Number.isNaN(Number(kmInput.value)) || Number(kmInput.value) <= 0) {
    validKm.value = false
    return
  }
  validKm.value = true;
  kmList.value.push(Number(kmInput.value))
  kmInput.value = ''
}

const removeKm = (i:number) => {
  kmList.value.splice(i,1)
}

/* Checklist */
const checkInput = ref('')
const checklist = ref<{ text: string, done: boolean }[]>([])

const addCheck = () => {
  if (!checkInput.value.trim()) return
  checklist.value.push({ text: checkInput.value, done: false })
  checkInput.value = ''
}

const removeCheck = (i: number) => {
  checklist.value.splice(i, 1)
}

/* Dates */
const typeInput = ref('Test')
const dateInput = ref('')
const dates = ref<{ type: string, date: string }[]>([])
const dateValid = ref<boolean>(true)
const addDate = () => {
  if (!dateInput.value || Number.isNaN(new Date(dateInput.value).getTime()) || new Date(dateInput.value).getTime() < new Date(Date.now()).getTime()){
    dateValid.value = false;
    return;
  }
  dateValid.value = true
  dates.value.push({
    type: typeInput.value,
    date: dateInput.value
  })

  dateInput.value = ''
  typeInput.value = ''
}

/* function to remove dates */
const removeDate = (index: number) => {
  dates.value.splice(index, 1)
}

const editDate = (i: number) => {
  const item = dates.value[i]

  typeInput.value = item.type
  dateInput.value = item.date

  dates.value.splice(i, 1)
}

</script>

<style scoped>
</style>
