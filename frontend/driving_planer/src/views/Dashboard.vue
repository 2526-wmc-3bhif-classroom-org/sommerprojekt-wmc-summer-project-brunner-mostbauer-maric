<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 pt-24 md:pt-16">

      <div class="max-w-7xl w-full px-6 md:px-12" v-motion-fade-visible>

        <div class="text-center mb-12 md:mb-20 px-4">
          <HeaderMain
            title="Dashboard"
            desktopHeight="md:text-8xl"
            mobileHeight="text-6xl"
            class="pb-0 text-black leading-none"
            :duration="500"
          />
          <p class="text-black font-black text-xs md:text-sm tracking-[0.4em] uppercase opacity-30 mt-2">
            Professional Driving Management
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-stretch">

          <!-- Gefahrene Kilometer -->
          <div class="group bg-white border-2 border-black/5 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-[520px]" v-motion-slide-visible-bottom>
            <div class="flex items-center justify-between mb-10">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-black rounded-[1.2rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:rotate-2 transition-transform duration-500">
                  <i class="pi pi-map-marker text-white text-2xl"></i>
                </div>
                <h2 class="font-black text-3xl text-black uppercase tracking-tighter">KM-Log</h2>
              </div>
              <div class="h-1 w-12 bg-black/10 rounded-full"></div>
            </div>

            <div class="flex gap-4 mb-8">
              <input
                v-model="kmInput"
                type="number"
                placeholder="000"
                class="flex-1 p-6 bg-black/[0.03] border-2 border-transparent rounded-[1.8rem] text-black font-black text-xl focus:bg-white focus:border-black transition-all outline-none placeholder:opacity-20"
                @keyup.enter="addKm"
              />
              <button
                @click="addKm"
                class="bg-black text-white w-20 rounded-[1.8rem] font-black hover:bg-zinc-800 active:scale-95 transition-all shadow-2xl flex items-center justify-center group/btn"
              >
                <i class="pi pi-plus group-hover:scale-110 transition-transform"></i>
              </button>
            </div>
            
            <div class="flex-1 overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              <ul class="space-y-4">
                <li
                  v-for="(km, i) in kmList"
                  :key="i"
                  class="group/item text-md text-black font-black bg-black/[0.02] p-6 rounded-[2rem] flex justify-between items-center border border-black/5 hover:border-black/20 hover:bg-white transition-all duration-300"
                >
                  <div class="flex items-center gap-5">
                    <span class="text-[10px] bg-black text-white w-6 h-6 rounded-full flex items-center justify-center font-black">#{{ i + 1 }}</span>
                    <span class="text-xl">{{ km }} <span class="text-xs opacity-30 font-bold ml-1">KILOMETER</span></span>
                  </div>
                  <button @click="removeKm(i)" class="w-12 h-12 rounded-2xl flex items-center justify-center text-black/10 hover:text-red-600 hover:bg-red-50 transition-all">
                    <i class="pi pi-trash"></i>
                  </button>
                </li>
              </ul>
              <div v-if="kmList.length === 0" class="h-full flex flex-col items-center justify-center text-black/5 gap-4">
                <i class="pi pi-directions text-7xl"></i>
                <p class="font-black uppercase tracking-[0.3em] text-[10px]">No data recorded</p>
              </div>
            </div>
          </div>

          <!-- Checkliste -->
          <div class="group bg-white border-2 border-black/5 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-[520px]" v-motion-slide-visible-bottom>
            <div class="flex items-center justify-between mb-10">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-black rounded-[1.2rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:-rotate-2 transition-transform duration-500">
                  <i class="pi pi-check-square text-white text-2xl"></i>
                </div>
                <h2 class="font-black text-3xl text-black uppercase tracking-tighter">Aufgaben</h2>
              </div>
              <div class="h-1 w-12 bg-black/10 rounded-full"></div>
            </div>

            <div class="flex gap-4 mb-8">
              <input
                v-model="checkInput"
                type="text"
                placeholder="Neue Aufgabe..."
                class="flex-1 p-6 bg-black/[0.03] border-2 border-transparent rounded-[1.8rem] text-black font-black text-lg focus:bg-white focus:border-black transition-all outline-none placeholder:opacity-20"
                @keyup.enter="addCheck"
              />
              <button
                @click="addCheck"
                class="bg-black text-white w-20 rounded-[1.8rem] font-black hover:bg-zinc-800 active:scale-95 transition-all shadow-2xl flex items-center justify-center group/btn"
              >
                <i class="pi pi-plus group-hover:scale-110 transition-transform"></i>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div class="space-y-4">
                <div
                  v-for="(item, i) in checklist"
                  :key="i"
                  class="flex items-center justify-between p-6 rounded-[2rem] bg-black/[0.02] border border-black/5 hover:border-black/20 hover:bg-white transition-all duration-300 group/item"
                >
                  <label class="flex items-center gap-5 cursor-pointer flex-1">
                    <div class="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        v-model="item.done"
                        class="peer appearance-none w-8 h-8 border-3 border-black/10 rounded-2xl checked:bg-black checked:border-black transition-all cursor-pointer"
                      />
                      <i class="pi pi-check absolute text-white text-sm opacity-0 peer-checked:opacity-100 pointer-events-none"></i>
                    </div>
                    <span :class="item.done ? 'line-through text-black/20 italic' : 'text-black font-black'" class="text-xl transition-all">
                      {{ item.text }}
                    </span>
                  </label>
                  
                  <div class="flex gap-2">
                    <button @click="editCheck(i)" class="w-12 h-12 rounded-2xl flex items-center justify-center text-black/10 hover:text-blue-600 hover:bg-blue-50 transition-all">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button @click="removeCheck(i)" class="w-12 h-12 rounded-2xl flex items-center justify-center text-black/10 hover:text-red-600 hover:bg-red-50 transition-all">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dokumente -->
          <div class="group bg-white border-2 border-black/5 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-[520px]" v-motion-slide-visible-bottom>
            <div class="flex items-center justify-between mb-10">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-black rounded-[1.2rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:rotate-2 transition-transform duration-500">
                  <i class="pi pi-file-pdf text-white text-2xl"></i>
                </div>
                <h2 class="font-black text-3xl text-black uppercase tracking-tighter">Files</h2>
              </div>
              <div class="h-1 w-12 bg-black/10 rounded-full"></div>
            </div>

            <div class="flex-1">
              <div class="relative h-full border-4 border-dashed border-black/[0.05] rounded-[2.5rem] bg-black/[0.02] hover:bg-white hover:border-black/20 hover:shadow-inner transition-all group/upload cursor-pointer flex flex-col items-center justify-center p-10 text-center">
                <input
                  type="file"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div class="flex flex-col items-center gap-8 group-hover:scale-[1.02] transition-transform duration-500">
                  <div class="w-28 h-28 rounded-full bg-black flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                    <i class="pi pi-cloud-upload text-4xl text-white"></i>
                  </div>
                  <div>
                    <p class="text-black font-black text-2xl mb-3">Dokument-Upload</p>
                    <p class="text-black/30 font-bold text-sm max-w-[240px] leading-relaxed">PDF, JPG oder PNG Dateien einfach hier ablegen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Prüfungstermine -->
          <div class="group bg-white border-2 border-black/5 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-[520px]" v-motion-slide-visible-bottom>
            <div class="flex items-center justify-between mb-10">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-black rounded-[1.2rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:-rotate-2 transition-transform duration-500">
                  <i class="pi pi-calendar text-white text-2xl"></i>
                </div>
                <h2 class="font-black text-3xl text-black uppercase tracking-tighter">Events</h2>
              </div>
              <div class="h-1 w-12 bg-black/10 rounded-full"></div>
            </div>

            <div class="flex flex-col gap-4 mb-6">
                <div class="flex flex-col sm:flex-row gap-4">
                  <select 
                    v-model="typeInput"
                    class="flex-1 p-6 bg-black/[0.03] border-2 border-transparent rounded-[1.8rem] text-black font-black focus:bg-white focus:border-black transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="Theorie">THEORIE</option>
                    <option value="Praxis">PRAXIS</option>
                    <option value="Erste Hilfe">FIRST AID</option>
                    <option value="Arzt">DOCTOR</option>
                  </select>
                  <input
                    v-model="dateInput"
                    type="date"
                    class="flex-1 p-6 bg-black/[0.03] border-2 border-transparent rounded-[1.8rem] text-black font-black focus:bg-white focus:border-black transition-all outline-none"
                  />
                </div>

                <button
                @click="addDate"
                class="w-full bg-black text-white p-6 rounded-[1.8rem] font-black text-lg hover:bg-zinc-800 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                >
                  <i class="pi pi-plus-circle text-xl"></i>
                  Add Event
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              <ul class="space-y-4">
                  <li
                  v-for="(date, i) in dates"
                  :key="i"
                  class="group/item text-md text-black font-black bg-black/[0.02] p-6 rounded-[2rem] border-l-[12px] border-black flex justify-between items-center hover:bg-white transition-all shadow-sm"
                  >
                    <div class="flex flex-col">
                      <span class="text-[10px] uppercase text-black/20 font-black tracking-[0.3em] mb-1">{{ date.type }}</span>
                      <span class="text-xl">
                        {{ new Date(date.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }) }}
                      </span>
                    </div>

                    <div class="flex gap-2">
                      <button @click="editDate(i)" class="w-12 h-12 rounded-2xl flex items-center justify-center text-black/10 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <i class="pi pi-pencil"></i>
                      </button>
                      <button @click="removeDate(i)" class="w-12 h-12 rounded-2xl flex items-center justify-center text-black/10 hover:text-red-600 hover:bg-red-50 transition-all">
                        <i class="pi pi-trash"></i>
                      </button>
                    </div>
                  </li>
                </ul>
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

const editCheck = (i: number) => {
  const item = checklist.value[i]
  checkInput.value = item.text
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
