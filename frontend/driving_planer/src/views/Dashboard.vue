<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 md:p-12 pt-20">

      <div class="max-w-6xl w-full px-2 sm:px-4" v-motion-fade-visible>

        <div class="text-center">
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

        <div class="h-20 md:h-28"></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-stretch">

          <!-- KM-LOG CARD -->
          <div class="bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] flex flex-col h-full border border-zinc-100" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-4" style="margin-bottom: 40px">
              <div class="w-2 h-8 bg-black rounded-full"></div>
              <h2 class="font-black text-2xl text-black uppercase tracking-tight">KM-Log</h2>
            </div>

            <div class="flex flex-col gap-3" style="margin-bottom: 48px">
              <div class="grid grid-cols-2 gap-3">
                <input v-model="kmStart" type="number" min="0" step="0.1" placeholder="Start KM"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', kmError && (kmStart === null || kmStart < 0) ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
                <input v-model="kmEnd" type="number" min="0" step="0.1" placeholder="End KM"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', kmError && (kmEnd === null || kmEnd < 0) ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <input v-model="locStart" type="text" placeholder="Start Ort"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', kmError && !locStart ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
                <input v-model="locEnd" type="text" placeholder="Ziel Ort"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', kmError && !locEnd ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
              </div>

              <p v-if="kmError" class="text-[10px] font-bold uppercase text-red-500 tracking-widest ml-2">{{ kmError }}</p>

              <button @click="addKmEntry" class="w-full bg-black text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-80 transition-all active:scale-[0.98]">
                Fahrt speichern
              </button>
            </div>

            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[250px]">
              <div v-if="kmEntries.length === 0" class="h-full flex items-center justify-center opacity-10 italic text-sm">Keine Einträge</div>
              <div v-else class="space-y-4">
                <div v-for="(entry, i) in kmEntries" :key="i" class="group flex justify-between items-center p-5 border border-zinc-100 rounded-[2rem] bg-zinc-50/30">
                  <div class="flex flex-col gap-1">
                    <span class="text-[15px] text-black uppercase tracking-widest opacity-40">{{ entry.startLoc }} → {{ entry.endLoc }}</span>
                    <span class="text-xl font-black text-black">{{ entry.diff }} <span class="text-sm font-light opacity-50 uppercase tracking-normal">KM</span></span>
                  </div>
                  <button @click="removeKmEntry(i)" class="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all p-2">
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TASKS CARD -->
          <div class="bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] flex flex-col h-full border border-zinc-100" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-4" style="margin-bottom: 40px">
              <div class="w-2 h-8 bg-black rounded-full"></div>
              <h2 class="font-black text-2xl text-black uppercase tracking-tight">Tasks</h2>
            </div>
            <div class="flex gap-3" style="margin-bottom: 48px">
              <input v-model="checkInput" @keyup.enter="addCheck" type="text" placeholder="Neue Aufgabe..."
                     :class="['flex-1 p-4 rounded-2xl font-bold text-sm outline-none transition-all border', taskError && !checkInput.trim() ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
              <button @click="addCheck" class="bg-black text-white px-6 rounded-2xl hover:opacity-80 transition-all active:scale-90"><i class="pi pi-plus text-xs"></i></button>
            </div>
            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[250px]">
              <div v-for="(item, i) in checklist" :key="i" class="group flex items-center justify-between p-4 mb-3 border border-zinc-100 rounded-[1.5rem] bg-zinc-50/30 transition-all">
                <label class="flex items-center gap-4 cursor-pointer flex-1">
                  <div class="relative flex items-center justify-center">
                    <input type="checkbox" v-model="item.done" @change="syncTasks" class="peer appearance-none w-6 h-6 rounded-full border-2 border-zinc-100 checked:bg-black checked:border-black transition-all cursor-pointer" />
                    <i class="pi pi-check absolute text-[10px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none"></i>
                  </div>
                  <span :class="item.done ? 'line-through opacity-20 italic' : 'font-bold'" class="text-base text-black transition-all">{{ item.text }}</span>
                </label>
                <button @click="removeCheck(i)" class="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 p-2 transition-all">
                  <i class="pi pi-trash text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- KALENDER CARD -->
          <div class="bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] flex flex-col h-full border border-zinc-100 relative overflow-hidden" v-motion-slide-visible-bottom>
            <div class="flex items-center justify-between" style="margin-bottom: 40px">
              <div class="flex items-center gap-4">
                <div class="w-2 h-8 bg-black rounded-full"></div>
                <div>
                  <h2 class="font-black text-2xl text-black uppercase tracking-tight">Planer</h2>
                  <p class="text-xs font-bold text-black/40 uppercase tracking-widest" style="margin-top: 4px">{{ calendarMonthLabel }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="prevMonth" class="w-8 h-8 rounded-full bg-zinc-50 hover:bg-black hover:text-white transition-all flex items-center justify-center"><i class="pi pi-chevron-left text-[10px]"></i></button>
                <button @click="nextMonth" class="w-8 h-8 rounded-full bg-zinc-50 hover:bg-black hover:text-white transition-all flex items-center justify-center"><i class="pi pi-chevron-right text-[10px]"></i></button>
              </div>
            </div>
            <div class="grid grid-cols-7 gap-2 mb-4 flex-1">
              <div v-for="dayName in ['M','D','M','D','F','S','S']" :key="dayName" class="text-center text-[10px] font-bold opacity-20">{{ dayName }}</div>
              <div v-for="(day, i) in calendarDays" :key="i" class="aspect-square flex items-center justify-center">
                <button v-if="day" @click="openCalendarEntry(day)"
                        :class="['w-10 h-10 rounded-xl font-bold text-sm transition-all relative flex items-center justify-center',
                  isToday(day) ? 'bg-black text-white shadow-xl' : 'text-black hover:bg-zinc-50',
                  hasEntry(day) && !isToday(day) ? 'after:content-[\'\'] after:absolute after:top-1 after:right-1 after:w-1.5 after:h-1.5 after:bg-black after:rounded-full' : '']">
                  {{ day }}
                </button>
              </div>
            </div>
            <transition name="slide-up">
              <div v-if="calendarModalOpen" class="absolute inset-0 bg-white p-8 flex flex-col z-20">
                <div class="flex justify-between items-center mb-6">
                  <span class="text-[10px] font-black uppercase opacity-30">{{ calendarSelectedLabel }}</span>
                  <button @click="calendarModalOpen = false" class="text-black/20 hover:text-black p-2"><i class="pi pi-times"></i></button>
                </div>

                <!-- Margin zw. Header und Textfield -->
                <textarea v-model="calendarEntryText" class="flex-1 bg-zinc-50 rounded-2xl p-5 text-black font-bold outline-none resize-none border border-transparent focus:border-black/5" style="margin-bottom: 24px" placeholder="Notiz eingeben..." />

                <!-- Action Buttons -->
                <div class="flex gap-3">
                  <button v-if="hasEntry(calendarSelectedDay)" @click="deleteCalendarEntry" class="bg-red-50 text-red-500 px-6 rounded-2xl hover:bg-red-100 transition-all">
                    <i class="pi pi-trash"></i>
                  </button>
                  <button @click="saveCalendarEntry" class="flex-1 bg-black text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95">
                    Speichern
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- EVENTS CARD -->
          <div class="bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] flex flex-col h-full border border-zinc-100" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-4" style="margin-bottom: 40px">
              <div class="w-2 h-8 bg-black rounded-full"></div>
              <h2 class="font-black text-2xl text-black uppercase tracking-tight">Events</h2>
            </div>
            <div class="flex flex-col gap-3" style="margin-bottom: 48px">
              <div class="grid grid-cols-2 gap-3">
                <select v-model="typeInput"
                        :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all border appearance-none cursor-pointer',
                  eventError && !typeInput ? 'bg-red-50 border-red-200 text-red-900' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']">
                  <option value="" disabled selected>Typ wählen</option>
                  <option value="Theorie">Theorie</option>
                  <option value="Praxis">Praxis</option>
                </select>
                <input v-model="dateInput" type="date"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all border',
                  eventError && (!dateInput) ? 'bg-red-50 border-red-200 text-red-900' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
              </div>

              <p v-if="eventError" class="text-[10px] font-bold uppercase text-red-500 tracking-widest ml-2">{{ eventError }}</p>

              <button @click="addDate" class="w-full bg-black text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-[0.98]">Termin speichern</button>
            </div>
            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[250px]">
              <div v-if="dates.length === 0" class="h-full flex items-center justify-center opacity-10 italic text-sm">Keine Termine</div>
              <div v-else class="space-y-4">
                <div v-for="(date, i) in dates" :key="i" class="group flex justify-between items-center p-5 border border-zinc-100 rounded-[2rem] bg-zinc-50/30">
                  <div class="flex flex-col gap-1">
                    <span class="text-[15px] text-black uppercase tracking-widest opacity-40">{{ date.type }}</span>
                    <span class="font-bold text-lg text-black">{{ new Date(date.date).toLocaleDateString('de-DE') }}</span>
                  </div>
                  <button @click="removeDate(i)" class="opacity-0 group-hover:opacity-100 text-zinc-200 hover:text-red-500 transition-all p-2">
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
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
import { ref, computed, watch } from 'vue'
import Background from '@/components/Background.vue'
import HeaderMain from '@/components/HeaderMain.vue'
import FooterCmp from '@/components/FooterCmp.vue'

const syncKmLog = () => {}
const syncTasks = () => {}
const syncCalendar = () => {}
const syncEvents = () => {}

// KM-LOG LOGIC
const kmStart = ref<number | null>(null)
const kmEnd = ref<number | null>(null)
const locStart = ref('')
const locEnd = ref('')
const kmEntries = ref<any[]>([])
const kmError = ref('')

watch([kmStart, kmEnd, locStart, locEnd], () => { kmError.value = '' })

const addKmEntry = () => {
  if (kmStart.value === null || kmEnd.value === null || !locStart.value || !locEnd.value) {
    kmError.value = "Felder unvollständig"
    return
  }
  const difference = parseFloat((kmEnd.value - kmStart.value).toFixed(2))
  kmEntries.value.unshift({
    startLoc: locStart.value,
    endLoc: locEnd.value,
    diff: difference
  })
  kmStart.value = kmEnd.value
  kmEnd.value = null
  locStart.value = locEnd.value
  locEnd.value = ''
  syncKmLog()
}
const removeKmEntry = (i: number) => { kmEntries.value.splice(i, 1); syncKmLog() }

// TASKS LOGIC
const checkInput = ref('')
const taskError = ref(false)
const checklist = ref<any[]>([])
watch(checkInput, () => { taskError.value = false })
const addCheck = () => {
  if (!checkInput.value.trim()) { taskError.value = true; return }
  checklist.value.push({ text: checkInput.value, done: false });
  checkInput.value = '';
  syncTasks()
}
const removeCheck = (i: number) => { checklist.value.splice(i, 1); syncTasks() }

// CALENDAR LOGIC
const calendarYear = ref(new Date().getFullYear())
const calendarMonth = ref(new Date().getMonth())
const calendarEntries = ref<Record<string, string>>({})
const calendarModalOpen = ref(false)
const calendarSelectedDay = ref<number | null>(null)
const calendarEntryText = ref('')
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
const deleteCalendarEntry = () => { if (calendarSelectedDay.value) delete calendarEntries.value[entryKey(calendarSelectedDay.value)]; calendarModalOpen.value = false; syncCalendar() }
const prevMonth = () => { if (calendarMonth.value === 0) { calendarMonth.value = 11; calendarYear.value-- } else calendarMonth.value-- }
const nextMonth = () => { if (calendarMonth.value === 11) { calendarMonth.value = 0; calendarYear.value++ } else calendarMonth.value++ }

// EVENTS LOGIC
const typeInput = ref('')
const dateInput = ref('')
const dates = ref<any[]>([])
const eventError = ref('')
watch([typeInput, dateInput], () => { eventError.value = '' })
const addDate = () => {
  if (!typeInput.value || !dateInput.value) { eventError.value = "Felder unvollständig"; return }
  dates.value.push({ type: typeInput.value, date: dateInput.value })
  typeInput.value = ''; dateInput.value = ''; syncEvents()
}
const removeDate = (i: number) => { dates.value.splice(i, 1); syncEvents() }
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px); }
</style>
