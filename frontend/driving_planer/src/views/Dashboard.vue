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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          <div class="group bg-white border-2 border-gray-100 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 break-inside-avoid flex flex-col gap-4">
            <h2 class="font-black text-2xl mb-6 text-black uppercase tracking-tight">Gefahrene Kilometer</h2>

            <div class="flex gap-3">
              <input
                v-model="kmInput"
                type="number"
                placeholder="km eingeben..."
                class="flex-1 p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none"
              />
              <button
                @click="addKm"
                class="bg-black text-white px-6 rounded-2xl font-black hover:bg-gray-800 active:scale-90 transition-all shadow-lg"
              >
                +
              </button>
            </div>
            <span
              v-if="!validKm"
              class=" text-sm text-red-700 uppercase tracking-tight"
            >Die Eingabe entspricht nicht dem Format. (Positive Zahlen)</span>

            <ul class="mt-6 space-y-3 max-h-48 overflow-y-auto pr-2">
              <li
                v-for="(km, i) in kmList"
                :key="i"
                class="text-md text-black font-bold bg-slate-100 p-3 rounded-xl flex justify-between items-center animate-in fade-in slide-in-from-left-4"
              >
                <span>{{ km }} km</span>

                <!-- DELETE -->
                <button @click="removeKm(i)" class="text-black/30 hover:text-red-500">
                  <i class="pi pi-trash"></i>
                </button>
              </li>
            </ul>
          </div>

          <div class="group bg-white border-2 border-gray-100 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 break-inside-avoid">
            <h2 class="font-black text-2xl mb-6 text-black uppercase tracking-tight">Checkliste</h2>

            <div class="flex gap-3">
              <input
                v-model="checkInput"
                type="text"
                placeholder="Neues Item..."
                class="flex-1 p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none"
              />
              <button
                @click="addCheck"
                class="bg-black text-white px-6 rounded-2xl font-black hover:bg-gray-800 active:scale-90 transition-all shadow-lg"
              >
                +
              </button>
            </div>

            <div class="mt-6 space-y-3">
              <label
                v-for="(item, i) in checklist"
                :key="i"
                class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="item.done"
                  class="w-5 h-5 accent-black rounded cursor-pointer"
                />
                <span :class="item.done ? 'line-through text-gray-400 font-medium' : 'text-black font-bold text-lg'">
                  {{ item.text }}
                </span>
              </label>
            </div>
          </div>

          <div class="group bg-white border-2 border-gray-100 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 break-inside-avoid">
            <h2 class="font-black text-2xl mb-6 text-black uppercase tracking-tight">Dokumente</h2>

            <div class="relative group-hover:scale-[1.01] transition-transform">
              <input
                type="file"
                class="block w-full text-sm text-black font-bold
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-2xl file:border-0
                  file:text-sm file:font-black
                  file:bg-black file:text-white
                  hover:file:bg-gray-800
                  bg-slate-50 rounded-2xl border-2 border-dashed border-gray-200 p-4"
              />
            </div>
          </div>

          <div class="group bg-white border-2 border-gray-100 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 break-inside-avoid">
            <h2 class="font-black text-2xl mb-6 text-black uppercase tracking-tight">Prüfungstermine</h2>

            <div class="flex flex-col gap-4">
                <input
                v-model="dateInput"
                type="date"
                class="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none"
                />

                <button
                @click="addDate"
                class="w-full bg-black text-white p-4 rounded-2xl font-black text-lg hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg uppercase tracking-widest"
                >
                Hinzufügen
                </button>
            </div>

            <ul class="mt-6 space-y-3">
                <li
                v-for="(date, i) in dates"
                :key="i"
                class="group/item text-md text-black font-bold bg-slate-100 p-3 rounded-xl border-l-4 border-black flex justify-between items-center animate-in fade-in"
                >
                <span>
                  {{ date.type }} - {{ new Date(date.date).toLocaleDateString('de-DE') }}
                </span>

                  <div class="flex gap-2">
                    <!-- EDIT -->
                    <button @click="editDate(i)" class="text-blue-500">
                      <i class="pi pi-pencil"></i>
                    </button>

                    <!-- DELETE -->
                    <button @click="removeDate(i)" class="text-red-500">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </li>
              </ul>
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

/* Dates */
const typeInput = ref('Test')
const dateInput = ref('')
const dates = ref<{ type: string, date: string }[]>([])

const addDate = () => {
  if (!dateInput.value) return

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
