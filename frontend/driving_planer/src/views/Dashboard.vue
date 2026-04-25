<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 pt-24 md:pt-16">

      <div class="max-w-5xl w-full px-4 md:px-6" v-motion-fade-visible>

        <div class="text-center mb-6 md:mb-10 p-4">
          <HeaderMain
            title="Dashboard"
            desktopHeight="md:text-6xl"
            mobileHeight="text-4xl"
            class="pb-0 text-black leading-none"
            :duration="500"
          />
          <p class="text-black font-black text-[9px] md:text-[10px] tracking-[0.2em] uppercase opacity-30 mt-1">
            Driving Management
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">

          <!-- Gefahrene Kilometer -->
          <div class="group bg-white border border-black/5 rounded-[1.8rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-[360px]" v-motion-slide-visible-bottom>
            <div class="flex items-center justify-between mb-6 pb-2">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 bg-black rounded-xl flex items-center justify-center shadow-md">
                  <i class="pi pi-map-marker text-white text-lg"></i>
                </div>
                <h2 class="font-black text-xl text-black uppercase tracking-tighter">KM-Log</h2>
              </div>
              <div class="h-1 w-8 bg-black/10 rounded-full"></div>
            </div>

            <div class="flex gap-3 mb-4 pb-2">
              <input
                v-model="kmInput"
                type="number"
                min="0"
                placeholder="Kilometer..."
                class="flex-1 p-3 bg-black/[0.03] border border-transparent rounded-xl text-black font-black text-base focus:bg-white focus:border-black transition-all outline-none placeholder:opacity-20"
                @keyup.enter="addKm"
              />
              <button
                @click="addKm"
                class="bg-black text-white w-14 rounded-xl font-black hover:bg-zinc-800 active:scale-95 transition-all flex items-center justify-center shadow-sm"
              >
                <i class="pi pi-plus text-base"></i>
              </button>
            </div>
            <span v-if="!validKm" class="text-red-500 font-black text-[10px] tracking-wide" style="margin-bottom: 0.75rem; display: block;">Bitte eine positive Kilometer-Zahl eingeben.</span>

            <div class="flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div v-if="kmList.length === 0" class="flex flex-col items-center justify-center h-full gap-2 opacity-20">
                <i class="pi pi-map-marker text-3xl"></i>
                <p class="text-[10px] font-black uppercase tracking-wider">Noch keine Einträge</p>
              </div>
              <ul v-else class="flex flex-col gap-2">
                <li
                  v-for="(km, i) in kmList"
                  :key="i"
                  class="group/item text-sm text-black font-black bg-black/[0.02] p-4 rounded-xl flex justify-between items-center border border-black/5 hover:border-black/20 hover:bg-white transition-all duration-300"
                >
                  <div class="flex items-center gap-4">
                    <span class="text-[8px] bg-black text-white w-4 h-4 rounded-full flex items-center justify-center font-black italic">#{{ i + 1 }}</span>
                    <span class="text-base">{{ km }} <span class="text-[9px] opacity-30">KM</span></span>
                  </div>
                  <button @click="removeKm(i)" class="w-8 h-8 rounded-lg flex items-center justify-center text-black/10 hover:text-red-600 hover:bg-red-50 transition-all">
                    <i class="pi pi-trash text-[10px]"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Checkliste -->
          <div class="group bg-white border border-black/5 rounded-[1.8rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-[360px]" v-motion-slide-visible-bottom>
            <div class="flex items-center justify-between mb-6 pb-2">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 bg-black rounded-xl flex items-center justify-center shadow-md">
                  <i class="pi pi-check-square text-white text-lg"></i>
                </div>
                <h2 class="font-black text-xl text-black uppercase tracking-tighter">Tasks</h2>
              </div>
              <div class="h-1 w-8 bg-black/10 rounded-full"></div>
            </div>

            <div class="flex gap-3 mb-6 pb-2">
              <input
                v-model="checkInput"
                type="text"
                placeholder="Neue Aufgabe..."
                class="flex-1 p-3 bg-black/[0.03] border border-transparent rounded-xl text-black font-black text-sm focus:bg-white focus:border-black transition-all outline-none placeholder:opacity-20"
                @keyup.enter="addCheck"
              />
              <button
                @click="addCheck"
                class="bg-black text-white w-14 rounded-xl font-black hover:bg-zinc-800 active:scale-95 transition-all flex items-center justify-center shadow-sm"
              >
                <i class="pi pi-plus text-sm"></i>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div v-if="checklist.length === 0" class="flex flex-col items-center justify-center h-full gap-2 opacity-20">
                <i class="pi pi-check-square text-3xl"></i>
                <p class="text-[10px] font-black uppercase tracking-wider">Noch keine Aufgaben</p>
              </div>
              <div v-else class="flex flex-col gap-2">
                <div
                  v-for="(item, i) in checklist"
                  :key="i"
                  class="flex items-center justify-between p-4 rounded-xl bg-black/[0.02] border border-black/5 hover:border-black/20 hover:bg-white transition-all duration-300 group/item"
                >
                  <label class="flex items-center gap-4 cursor-pointer flex-1">
                    <div class="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        v-model="item.done"
                        class="peer appearance-none w-6 h-6 border-2 border-black/10 rounded-md checked:bg-black checked:border-black transition-all cursor-pointer"
                      />
                      <i class="pi pi-check absolute text-white text-[10px] opacity-0 peer-checked:opacity-100 pointer-events-none"></i>
                    </div>
                    <span :class="item.done ? 'line-through text-black/20 italic' : 'text-black font-black'" class="text-lg transition-all">
                      {{ item.text }}
                    </span>
                  </label>

                  <div class="flex gap-2">
                    <button @click="editCheck(i)" class="w-8 h-8 rounded-lg flex items-center justify-center text-black/10 hover:text-blue-600 hover:bg-blue-50 transition-all">
                      <i class="pi pi-pencil text-[10px]"></i>
                    </button>
                    <button @click="removeCheck(i)" class="w-8 h-8 rounded-lg flex items-center justify-center text-black/10 hover:text-red-600 hover:bg-red-50 transition-all">
                      <i class="pi pi-trash text-[10px]"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dokumente -->
          <div class="group bg-white border border-black/5 rounded-[1.8rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-[360px]" v-motion-slide-visible-bottom>
            <div class="flex items-center justify-between mb-6 pb-2">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 bg-black rounded-xl flex items-center justify-center shadow-md">
                  <i class="pi pi-file-pdf text-white text-lg"></i>
                </div>
                <h2 class="font-black text-xl text-black uppercase tracking-tighter">Files</h2>
              </div>
              <div class="h-1 w-8 bg-black/10 rounded-full"></div>
            </div>

            <div class="flex-1">
              <div class="relative h-full border border-dashed border-black/[0.1] rounded-2xl bg-black/[0.02] hover:bg-white hover:border-black/20 transition-all group/upload cursor-pointer flex flex-col items-center justify-center p-6 text-center">
                <input
                  type="file"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div class="flex flex-col items-center gap-4 group-hover:scale-[1.01] transition-transform duration-500">
                  <div class="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg">
                    <i class="pi pi-cloud-upload text-3xl text-white"></i>
                  </div>
                  <div>
                    <p class="text-black font-black text-base mb-1">Upload</p>
                    <p class="text-black/30 font-bold text-[9px] max-w-[160px] leading-tight">Dateien hier ablegen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Prüfungstermine -->
          <div class="group bg-white border border-black/5 rounded-[1.8rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-[360px]" v-motion-slide-visible-bottom>
            <div class="flex items-center justify-between mb-6 pb-2">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 bg-black rounded-xl flex items-center justify-center shadow-md">
                  <i class="pi pi-calendar text-white text-lg"></i>
                </div>
                <h2 class="font-black text-xl text-black uppercase tracking-tighter">Events</h2>
              </div>
              <div class="h-1 w-8 bg-black/10 rounded-full"></div>
            </div>

            <div class="flex flex-col gap-3 mb-5 pb-2">
                <div class="flex flex-col sm:flex-row gap-3">
                  <div class="flex-1 flex flex-col gap-1">
                    <select
                      v-model="typeInput"
                      :class="['p-3 bg-black/[0.03] border rounded-xl text-black font-black text-xs focus:bg-white transition-all outline-none appearance-none cursor-pointer w-full', !typeValid ? 'border-red-500 bg-red-50/30' : 'border-transparent focus:border-black']"
                    >
                      <option value="" disabled>Anlass wählen...</option>
                      <option value="Theorie">THEORY</option>
                      <option value="Praxis">PRACTICE</option>
                      <option value="Erste Hilfe">FIRST AID</option>
                      <option value="Arzt">DOCTOR</option>
                    </select>
                    <span v-if="!typeValid" class="text-red-500 font-black text-[10px] tracking-wide">Muss einen Anlass auswählen</span>
                  </div>
                  <div class="flex-1 flex flex-col gap-1">
                    <input
                      v-model="dateInput"
                      type="date"
                      :class="['p-3 bg-black/[0.03] border rounded-xl text-black font-black text-xs focus:bg-white transition-all outline-none w-full', !dateValid ? 'border-red-500 bg-red-50/30' : 'border-transparent focus:border-black']"
                    />
                    <span v-if="!dateValid" class="text-red-500 font-black text-[10px] tracking-wide">Datum muss in der Zukunft liegen.</span>
                  </div>
                </div>

                <button
                @click="addDate"
                class="w-full bg-black text-white p-3 rounded-xl font-black text-xs hover:bg-zinc-800 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.1em] shadow-sm"
                >
                  <i class="pi pi-plus-circle text-sm"></i>
                  Hinzufügen
                </button>
            </div>

            <div class="flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div v-if="dates.length === 0" class="flex flex-col items-center justify-center h-full gap-2 opacity-20">
                <i class="pi pi-calendar text-3xl"></i>
                <p class="text-[10px] font-black uppercase tracking-wider">Noch keine Termine</p>
              </div>
              <ul v-else class="flex flex-col gap-2">
                  <li
                  v-for="(date, i) in dates"
                  :key="i"
                  class="group/item text-sm text-black font-black bg-black/[0.02] p-4 rounded-xl border-l-[6px] border-black flex justify-between items-center hover:bg-white transition-all shadow-sm"
                  >
                    <div class="flex flex-col">
                      <span class="text-[8px] uppercase text-black/20 font-black tracking-[0.1em] mb-1">{{ date.type }}</span>
                      <span class="text-base leading-tight">
                        {{ new Date(date.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }) }}
                      </span>
                    </div>

                    <div class="flex gap-2">
                      <button @click="editDate(i)" class="w-8 h-8 rounded-lg flex items-center justify-center text-black/10 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <i class="pi pi-pencil text-[10px]"></i>
                      </button>
                      <button @click="removeDate(i)" class="w-8 h-8 rounded-lg flex items-center justify-center text-black/10 hover:text-red-600 hover:bg-red-50 transition-all">
                        <i class="pi pi-trash text-[10px]"></i>
                      </button>
                    </div>
                  </li>
                </ul>
            </div>
          </div>
        </div>      </div>
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

const editCheck = (i: number) => {
  const item = checklist.value[i]
  checkInput.value = item.text
  checklist.value.splice(i, 1)
}

/* Dates */
const typeInput = ref('')
const dateInput = ref('')
const dates = ref<{ type: string, date: string }[]>([])
const dateValid = ref<boolean>(true)
const typeValid = ref<boolean>(true)
const addDate = () => {
  typeValid.value = !!typeInput.value
  if (!dateInput.value || Number.isNaN(new Date(dateInput.value).getTime()) || new Date(dateInput.value).getTime() < new Date(Date.now()).getTime()){
    dateValid.value = false;
  } else {
    dateValid.value = true
  }
  if (!typeValid.value || !dateValid.value) return
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
