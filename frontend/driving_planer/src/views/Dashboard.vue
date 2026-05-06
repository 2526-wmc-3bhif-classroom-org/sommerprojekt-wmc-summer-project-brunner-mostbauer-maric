<template>
  <Background>
    <!-- Padding-Top und responsive Paddings angepasst -->
    <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 md:p-12 pt-20">

      <div class="max-w-6xl w-full px-2 sm:px-4" v-motion-fade-visible>

        <!-- HEADER - Abstand optimiert -->
        <div class="text-center mb-16 md:mb-24" style="margin-bottom: 7px">
          <HeaderMain
            title="Dashboard"
            desktopHeight="md:text-7xl"
            mobileHeight="text-5xl"
            class="pb-0 text-black leading-none"
            :duration="500"
          />
          <p class="text-black font-black text-[10px] md:text-[12px] tracking-[0.3em] uppercase opacity-30 mt-6">
            Driving Management System
          </p>
        </div>

        <!-- GRID SYSTEM - gap für mobile verkleinert, items-stretch sorgt für gleiche Kartenhöhe -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-stretch">

          <!-- KM-LOG CARD -->
          <div class="bg-white border border-black/5 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col h-full w-full" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-5 mb-8" style="margin-bottom: 7px">
              <div class="w-12 h-12 md:w-14 md:h-14 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                <i class="pi pi-map-marker text-white text-xl md:text-2xl"></i>
              </div>
              <h2 class="font-black text-2xl md:text-3xl text-black uppercase tracking-tighter">KM-Log</h2>
            </div>

            <div class="flex flex-col gap-4 mb-8">
              <div class="grid grid-cols-2 gap-4">
                <input v-model="kmStart" type="number" placeholder="Start KM" class="p-4 bg-zinc-50 border border-transparent rounded-xl text-black font-bold text-sm outline-none focus:bg-white focus:border-black transition-all w-full" />
                <input v-model="kmEnd" type="number" placeholder="End KM" class="p-4 bg-zinc-50 border border-transparent rounded-xl text-black font-bold text-sm outline-none focus:bg-white focus:border-black transition-all w-full" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <input v-model="locStart" type="text" placeholder="Start Ort" class="p-4 bg-zinc-50 border border-transparent rounded-xl text-black font-bold text-sm outline-none focus:bg-white focus:border-black transition-all w-full" />
                <input v-model="locEnd" type="text" placeholder="Ziel Ort" class="p-4 bg-zinc-50 border border-transparent rounded-xl text-black font-bold text-sm outline-none focus:bg-white focus:border-black transition-all w-full" />
              </div>
              <input v-model="conditionInput" type="text" placeholder="Fahrbedingungen..." class="p-4 bg-zinc-50 border border-transparent rounded-xl text-black font-bold text-sm outline-none focus:bg-white focus:border-black w-full" />

              <button @click="addKmEntry" class="w-full bg-black text-white p-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl active:scale-95">
                Fahrt speichern
              </button>
            </div>

            <!-- Scrollbereich flexibel -->
            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px] max-h-[300px]">
              <div v-if="kmEntries.length === 0" class="flex flex-col items-center justify-center py-10 opacity-20"><i class="pi pi-map text-4xl mb-2"></i><p class="font-black uppercase text-xs">Leer</p></div>
              <div v-else class="space-y-4">
                <div v-for="(entry, i) in kmEntries" :key="i" class="p-5 rounded-3xl border-l-[10px] flex justify-between items-center bg-zinc-50 border border-black/5 shadow-sm border-l-black">
                  <div class="flex flex-col gap-1">
                    <span class="text-[10px] font-black uppercase opacity-40 italic">{{ entry.startLoc }} → {{ entry.endLoc }}</span>
                    <span class="text-xl md:text-2xl font-black text-black">{{ entry.diff }} KM</span>
                  </div>
                  <button @click="removeKmEntry(i)" class="text-black/10 hover:text-red-600 p-2"><i class="pi pi-trash"></i></button>
                </div>
              </div>
            </div>
          </div>

          <!-- TASKS CARD -->
          <div class="bg-white border border-black/5 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col h-full w-full" v-motion-slide-visible-bottom >
            <div class="flex items-center gap-5 mb-8" style="margin-bottom: 7px">
              <div class="w-12 h-12 md:w-14 md:h-14 bg-black rounded-2xl flex items-center justify-center shadow-lg"><i class="pi pi-check-square text-white text-xl md:text-2xl"></i></div>
              <h2 class="font-black text-2xl md:text-3xl text-black uppercase tracking-tighter">Tasks</h2>
            </div>
            <div class="flex gap-3 mb-8">
              <input v-model="checkInput" @keyup.enter="addCheck" type="text" placeholder="Aufgabe..." class="flex-1 p-4 bg-zinc-50 border border-transparent rounded-2xl text-black font-bold outline-none focus:bg-white focus:border-black transition-all" />
              <button @click="addCheck" class="bg-black text-white px-5 md:px-7 rounded-2xl hover:bg-zinc-800 transition-all shadow-lg active:scale-95"><i class="pi pi-plus font-bold"></i></button>
            </div>
            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px] max-h-[450px]">
              <div v-for="(item, i) in checklist" :key="i" class="flex items-center justify-between p-5 rounded-[1.8rem] bg-zinc-50 mb-4 border border-black/[0.03]">
                <label class="flex items-center gap-4 cursor-pointer flex-1">
                  <input type="checkbox" v-model="item.done" class="w-6 h-6 rounded-lg accent-black cursor-pointer shadow-sm" />
                  <span :class="item.done ? 'line-through opacity-30 italic' : 'font-black'" class="text-lg md:text-xl text-black">{{ item.text }}</span>
                </label>
                <button @click="removeCheck(i)" class="text-black/10 hover:text-red-600 p-2"><i class="pi pi-trash"></i></button>
              </div>
            </div>
          </div>

          <!-- KALENDER CARD -->
          <div class="bg-white border border-black/5 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col h-full relative overflow-hidden w-full" v-motion-slide-visible-bottom>
            <div class="flex items-center justify-between mb-8" style="margin-bottom: 7px">
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 md:w-14 md:h-14 bg-black rounded-2xl flex items-center justify-center shadow-lg"><i class="pi pi-calendar text-white text-xl md:text-2xl"></i></div>
                <h2 class="font-black text-2xl md:text-3xl text-black uppercase tracking-tighter">Planer</h2>
              </div>
              <div class="flex gap-2">
                <button @click="prevMonth" class="w-9 h-9 rounded-xl bg-zinc-50 hover:bg-black hover:text-white transition-all flex items-center justify-center border border-black/5"><i class="pi pi-chevron-left text-[10px]"></i></button>
                <button @click="nextMonth" class="w-9 h-9 rounded-xl bg-zinc-50 hover:bg-black hover:text-white transition-all flex items-center justify-center border border-black/5"><i class="pi pi-chevron-right text-[10px]"></i></button>
              </div>
            </div>
            <div class="text-center mb-6"><span class="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-black">{{ calendarMonthLabel }}</span></div>
            <div class="grid grid-cols-7 gap-1 md:gap-4 mb-4">
              <div v-for="dayName in ['Mo','Di','Mi','Do','Fr','Sa','So']" :key="dayName" class="text-center text-[9px] md:text-[10px] font-black opacity-30 uppercase">{{ dayName }}</div>
              <div v-for="(day, i) in calendarDays" :key="i" class="aspect-square flex items-center justify-center">
                <button v-if="day" @click="openCalendarEntry(day)"
                        :class="['w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl font-black text-sm md:text-lg transition-all relative flex items-center justify-center',
                  isToday(day) ? 'bg-black text-white shadow-xl scale-105' : 'text-black hover:bg-zinc-100',
                  hasEntry(day) && !isToday(day) ? 'border-2 border-black/10 bg-zinc-50' : '']">
                  {{ day }}
                  <span v-if="hasEntry(day)" class="absolute bottom-1 w-1 h-1 rounded-full" :class="isToday(day) ? 'bg-white' : 'bg-black'"></span>
                </button>
              </div>
            </div>
            <!-- Kalender Modal -->
            <transition name="slide-up">
              <div v-if="calendarModalOpen" class="absolute inset-0 bg-white rounded-[2.5rem] p-6 md:p-10 flex flex-col z-20 shadow-2xl">
                <div class="flex justify-between items-center mb-6">
                  <span class="text-xs font-black uppercase opacity-40">{{ calendarSelectedLabel }}</span>
                  <button @click="calendarModalOpen = false" class="text-black/20 hover:text-black p-2"><i class="pi pi-times"></i></button>
                </div>
                <textarea v-model="calendarEntryText" placeholder="Notiz..." class="flex-1 bg-zinc-50 rounded-3xl p-5 text-black font-bold text-base outline-none resize-none border-2 border-transparent focus:border-black" />
                <button @click="saveCalendarEntry" class="mt-6 h-14 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95">Speichern</button>
              </div>
            </transition>
          </div>

          <!-- EVENTS CARD -->
          <div class="bg-white border border-black/5 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col h-full w-full" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-5 mb-8" style="margin-bottom: 7px">
              <div class="w-12 h-12 md:w-14 md:h-14 bg-black rounded-2xl flex items-center justify-center shadow-lg"><i class="pi pi-calendar-plus text-white text-xl md:text-2xl"></i></div>
              <h2 class="font-black text-2xl md:text-3xl text-black uppercase tracking-tighter">Events</h2>
            </div>
            <div class="flex flex-col gap-4 mb-8">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select v-model="typeInput" class="p-4 bg-zinc-50 border border-transparent rounded-2xl text-black font-black text-xs outline-none focus:bg-white focus:border-black appearance-none cursor-pointer w-full">
                  <option value="" disabled>Anlass</option>
                  <option value="Theorie">Theorie</option>
                  <option value="Praxis">Fahrstunde</option>
                  <option value="Erste Hilfe">Kurs</option>
                </select>
                <input v-model="dateInput" type="date" class="p-4 bg-zinc-50 border border-transparent rounded-2xl text-black font-black text-xs outline-none focus:bg-white focus:border-black w-full" />
              </div>
              <button @click="addDate" class="w-full bg-black text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95">Termin fixieren</button>
            </div>
            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px] max-h-[350px]">
              <div v-for="(date, i) in dates" :key="i" class="p-5 rounded-3xl border-l-[10px] border-black bg-zinc-50 flex justify-between items-center mb-5 shadow-sm">
                <div class="flex flex-col">
                  <span class="text-[9px] font-black uppercase opacity-20">{{ date.type }}</span>
                  <span class="font-black text-lg md:text-xl text-black">{{ new Date(date.date).toLocaleDateString('de-DE') }}</span>
                </div>
                <button @click="removeDate(i)" class="text-black/10 hover:text-red-600 p-2"><i class="pi pi-trash"></i></button>
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
import { ref, computed } from 'vue'
import Background from '@/components/Background.vue'
import HeaderMain from '@/components/HeaderMain.vue'
import FooterCmp from '@/components/FooterCmp.vue'

// Hilfsfunktionen für Sync
const syncKmLog = () => {}
const syncTasks = () => {}
const syncCalendar = () => {}
const syncEvents = () => {}

// KM-LOG
const kmStart = ref<number | null>(null), kmEnd = ref<number | null>(null), locStart = ref(''), locEnd = ref(''), conditionInput = ref(''), kmEntries = ref<any[]>([])
const addKmEntry = () => {
  if (kmStart.value === null || kmEnd.value === null || !locStart.value || !locEnd.value) return
  kmEntries.value.unshift({ startLoc: locStart.value, endLoc: locEnd.value, diff: kmEnd.value - kmStart.value })
  kmStart.value = kmEnd.value; kmEnd.value = null; locStart.value = locEnd.value; locEnd.value = ''; syncKmLog()
}
const removeKmEntry = (i: number) => { kmEntries.value.splice(i, 1); syncKmLog() }

// TASKS
const checkInput = ref(''), checklist = ref<any[]>([])
const addCheck = () => { if (!checkInput.value.trim()) return; checklist.value.push({ text: checkInput.value, done: false }); checkInput.value = ''; syncTasks() }
const removeCheck = (i: number) => { checklist.value.splice(i, 1); syncTasks() }

// CALENDAR
const calendarYear = ref(new Date().getFullYear()), calendarMonth = ref(new Date().getMonth()), calendarEntries = ref<Record<string, string>>({}), calendarModalOpen = ref(false), calendarSelectedDay = ref<number | null>(null), calendarEntryText = ref('')
const calendarMonthLabel = computed(() => new Date(calendarYear.value, calendarMonth.value).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }))
const calendarSelectedLabel = computed(() => calendarSelectedDay.value ? `${calendarSelectedDay.value}. ${calendarMonthLabel.value}` : '')
const calendarDays = computed(() => {
  const firstDow = (new Date(calendarYear.value, calendarMonth.value, 1).getDay() + 6) % 7
  const daysInMonth = new Date(calendarYear.value, calendarMonth.value + 1, 0).getDate()
  const cells = Array(firstDow).fill(null); for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null); return cells
})
const entryKey = (day: number) => `${calendarYear.value}-${calendarMonth.value + 1}-${day}`
const isToday = (day: number) => { const t = new Date(); return day === t.getDate() && calendarMonth.value === t.getMonth() && calendarYear.value === t.getFullYear() }
const hasEntry = (day: number | null) => day !== null && !!calendarEntries.value[entryKey(day)]
const openCalendarEntry = (day: number) => { calendarSelectedDay.value = day; calendarEntryText.value = calendarEntries.value[entryKey(day)] || ''; calendarModalOpen.value = true }
const saveCalendarEntry = () => { if (calendarSelectedDay.value) calendarEntries.value[entryKey(calendarSelectedDay.value)] = calendarEntryText.value; calendarModalOpen.value = false; syncCalendar() }
const prevMonth = () => { if (calendarMonth.value === 0) { calendarMonth.value = 11; calendarYear.value-- } else calendarMonth.value-- }
const nextMonth = () => { if (calendarMonth.value === 11) { calendarMonth.value = 0; calendarYear.value++ } else calendarMonth.value++ }

// EVENTS
const typeInput = ref(''), dateInput = ref(''), dates = ref<any[]>([])
const addDate = () => { if (!typeInput.value || !dateInput.value) return; dates.value.push({ type: typeInput.value, date: dateInput.value }); typeInput.value = ''; dateInput.value = ''; syncEvents() }
const removeDate = (i: number) => { dates.value.splice(i, 1); syncEvents() }
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(30px); }
</style>
