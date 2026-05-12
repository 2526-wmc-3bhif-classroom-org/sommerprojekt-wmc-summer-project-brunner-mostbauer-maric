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
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', (kmError && (kmStart === null || kmStart < 0)) || (kmError === 'End KM muss größer als Start KM sein') ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
                <input v-model="kmEnd" type="number" min="0" step="0.1" placeholder="End KM"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', (kmError && (kmEnd === null || kmEnd < 0)) || (kmError === 'End KM muss größer als Start KM sein') ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <input v-model="locStart" type="text" placeholder="Start Ort"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', kmError && !locStart ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
                <input v-model="locEnd" type="text" placeholder="Ziel Ort"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', kmError && !locEnd ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
              </div>

              <input v-model="conditions" type="text" placeholder="Fahrbedingungen (z.B. Regen, Nacht)"
                     :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', kmError && !conditions ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />

              <p v-if="kmError" class="text-[10px] font-bold uppercase text-red-500 tracking-widest ml-2">{{ kmError }}</p>

              <button @click="addKmEntry" class="w-full bg-black text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-80 transition-all active:scale-[0.98]">
                Fahrt speichern
              </button>
            </div>

            <!-- Edit Modal Overlay -->
            <transition name="slide-up">
              <div v-if="editKmLogId !== null" class="absolute inset-0 bg-white z-40 rounded-[3rem] p-8 md:p-10 flex flex-col">
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-4">
                    <div class="w-2 h-8 bg-black rounded-full"></div>
                    <h2 class="font-black text-2xl text-black uppercase tracking-tight">Edit KM-Log</h2>
                  </div>
                  <button @click="cancelEdit" class="text-zinc-300 hover:text-black transition-all p-2">
                    <i class="pi pi-times"></i>
                  </button>
                </div>

                <div class="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-black uppercase text-black/30 tracking-widest ml-1">Start KM</label>
                      <input v-model="editData.startKm" type="number" step="0.1" class="p-4 rounded-2xl font-bold text-sm outline-none bg-zinc-50 border border-transparent focus:bg-white focus:border-black/5 text-black" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-black uppercase text-black/30 tracking-widest ml-1">End KM</label>
                      <input v-model="editData.endKm" type="number" step="0.1" class="p-4 rounded-2xl font-bold text-sm outline-none bg-zinc-50 border border-transparent focus:bg-white focus:border-black/5 text-black" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-black uppercase text-black/30 tracking-widest ml-1">Start Ort</label>
                      <input v-model="editData.startLocation" type="text" class="p-4 rounded-2xl font-bold text-sm outline-none bg-zinc-50 border border-transparent focus:bg-white focus:border-black/5 text-black" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-black uppercase text-black/30 tracking-widest ml-1">Ziel Ort</label>
                      <input v-model="editData.endLocation" type="text" class="p-4 rounded-2xl font-bold text-sm outline-none bg-zinc-50 border border-transparent focus:bg-white focus:border-black/5 text-black" />
                    </div>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] font-black uppercase text-black/30 tracking-widest ml-1">Fahrbedingungen</label>
                    <input v-model="editData.conditions" type="text" class="p-4 rounded-2xl font-bold text-sm outline-none bg-zinc-50 border border-transparent focus:bg-white focus:border-black/5 text-black" />
                  </div>

                  <p v-if="editError" class="text-[10px] font-bold uppercase text-red-500 tracking-widest ml-2 mt-2">{{ editError }}</p>

                  <button @click="saveEdit" class="w-full bg-black text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-80 transition-all active:scale-[0.98] mt-4">
                    Änderungen speichern
                  </button>
                </div>
              </div>
            </transition>

            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[250px]">
              <div v-if="kmEntries.length === 0" class="h-full flex items-center justify-center opacity-10 italic text-sm">Keine Einträge</div>
              <div v-else class="space-y-4">
                <div v-for="(entry, i) in kmEntries" :key="entry.KmLogId || i" class="group flex flex-col p-5 border border-zinc-100 rounded-[2rem] bg-zinc-50/30 transition-all">
                  <div class="flex justify-between items-start">
                    <div class="flex flex-col gap-1">
                      <span class="text-[15px] text-black uppercase tracking-widest opacity-40">{{ entry.StartLocation }} → {{ entry.EndLocation }}</span>
                      <div class="flex items-baseline gap-2">
                        <span class="text-xl font-black text-black">{{ (entry.EndKm - entry.StartKm).toFixed(1) }} <span class="text-sm font-light opacity-50 uppercase tracking-normal">KM</span></span>
                        <span v-if="entry.Conditions" class="text-[10px] font-bold text-black/30 uppercase tracking-widest">{{ entry.Conditions }}</span>
                      </div>
                    </div>
                    <div class="flex gap-1">
                      <button @click="startEdit(entry)" class="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-black transition-all p-2">
                        <i class="pi pi-pencil text-xs"></i>
                      </button>
                      <button @click="removeKmEntry(entry.KmLogId)" class="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all p-2">
                        <i class="pi pi-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
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
          <div class="bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] flex flex-col h-full border border-zinc-100 relative" v-motion-slide-visible-bottom>
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
            <div v-if="calendarLegend.length > 0" class="flex gap-4 flex-wrap" style="margin-bottom: 12px">
              <div v-for="item in calendarLegend" :key="item.label" class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full flex-shrink-0" :class="item.color"></span>
                <span class="text-[10px] font-black text-black/40 uppercase tracking-widest">{{ item.label }}</span>
              </div>
            </div>
            <div class="grid grid-cols-7 gap-2 mb-4 flex-1">
              <div v-for="(dayName, i) in ['Mo','Di','Mi','Do','Fr','Sa','So']" :key="i" class="text-center text-xs font-black text-black/50">{{ dayName }}</div>
              <div v-for="(day, i) in calendarDays" :key="i" class="flex flex-col items-center justify-start" style="padding-top: 4px; min-height: 3.5rem">
                <div class="relative">
                  <button v-if="day" @click="openCalendarEntry(day)"
                          @mouseenter="hoveredDay = day"
                          @mouseleave="hoveredDay = null"
                          :class="['w-9 h-9 rounded-xl font-bold text-sm transition-all relative flex items-center justify-center flex-shrink-0',
                    isToday(day) ? 'bg-black text-white shadow-xl' :
                    isCourseDay(day) ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' :
                    'text-black hover:bg-zinc-50',
                    hasEntry(day) && !isToday(day) ? 'after:content-[\'\'] after:absolute after:top-1 after:right-1 after:w-1.5 after:h-1.5 after:bg-black after:rounded-full' : '']">
                    {{ day }}
                  </button>
                  <div
                    v-if="day && hoveredDay === day && isCourseDay(day) && joinedCourseWithTimes?.timeFrom && joinedCourseWithTimes?.timeTo"
                    class="absolute left-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap pointer-events-none z-30 shadow-lg"
                    style="bottom: calc(100% + 6px); transform: translateX(-50%)">
                    {{ joinedCourseWithTimes.timeFrom }} – {{ joinedCourseWithTimes.timeTo }}
                  </div>
                </div>
                <div v-if="day && eventsForDay(day).length > 0" class="flex gap-0.5 flex-wrap justify-center" style="margin-top: 3px">
                  <span
                    v-for="(ev, j) in eventsForDay(day)" :key="j"
                    class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    :class="eventColorMap[ev.type] ?? 'bg-gray-400'"
                  ></span>
                </div>
              </div>
            </div>
            <transition name="slide-up">
              <div v-if="calendarModalOpen" class="absolute inset-0 overflow-hidden rounded-[3rem] bg-white p-8 flex flex-col z-20">
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
              <div v-if="dates.length === 0 && examDates.length === 0" class="h-full flex items-center justify-center opacity-10 italic text-sm">Keine Termine</div>
              <div v-else class="space-y-4">
                <div v-for="(date, i) in examDates" :key="`exam-${i}`" class="flex justify-between items-center p-5 border border-zinc-100 rounded-[2rem] bg-zinc-50/30">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <span class="text-[13px] text-black uppercase tracking-widest opacity-40">{{ date.type }}</span>
                      <span class="text-[9px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full">Auto</span>
                    </div>
                    <span class="font-bold text-lg text-black">{{ new Date(date.date).toLocaleDateString('de-DE') }}</span>
                  </div>
                </div>
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
import { ref, computed, watch, onMounted } from 'vue'
import Background from '@/components/Background.vue'
import HeaderMain from '@/components/HeaderMain.vue'
import FooterCmp from '@/components/FooterCmp.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const syncTasks = () => {}
const syncCalendar = () => {}
const syncEvents = () => {
  if (authStore.user?.UserId) {
    localStorage.setItem(`events_${authStore.user.UserId}`, JSON.stringify(dates.value))
  }
}

const joinedCourse = ref<any>(null)

const courseTimesCache = ref<Record<string, { timeFrom: string; timeTo: string }>>({})

function loadCourseTimes() {
  const merged: Record<string, { timeFrom: string; timeTo: string }> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key === 'courseTimes' || key?.startsWith('courseTimes_')) {
      const raw = localStorage.getItem(key)
      if (raw) Object.assign(merged, JSON.parse(raw))
    }
  }
  courseTimesCache.value = merged
}

const joinedCourseWithTimes = computed(() => {
  const course = joinedCourse.value
  if (!course) return null
  return { ...course, ...(courseTimesCache.value[String(course.id)] ?? courseTimesCache.value[course.id] ?? {}) }
})

const weekdayToJS: Record<string, number> = { Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6, So: 0 }

const isCourseDay = (day: number | null): boolean => {
  if (!day || !joinedCourse.value) return false
  const m = String(calendarMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  const dateStr = `${calendarYear.value}-${m}-${d}`
  const courseFrom = (joinedCourse.value.dateFrom ?? '').substring(0, 10)
  const courseTo = (joinedCourse.value.dateTo ?? '').substring(0, 10)
  if (dateStr < courseFrom || dateStr > courseTo) return false
  const courseDays = (joinedCourse.value.weekdays as string[]).map(w => weekdayToJS[w])
  return courseDays.includes(new Date(calendarYear.value, calendarMonth.value, day).getDay())
}

const eventColorMap: Record<string, string> = {
  Theorie: 'bg-amber-400',
  Praxis:  'bg-emerald-400',
  'Voraussichtliche Grundwissensprüfung': 'bg-sky-400',
  'Voraussichtliche Kursspezifische Theorieprüfung':      'bg-rose-400',
  'Voraussichtliche Praxisprüfung':       'bg-violet-400',
}

const calendarLegend = computed(() => {
  const items: { label: string; color: string }[] = []
  if (joinedCourse.value) items.push({ label: 'Kurs', color: 'bg-indigo-400' })
  if (dates.value.some(e => e.type === 'Theorie')) items.push({ label: 'Theorie', color: 'bg-amber-400' })
  if (dates.value.some(e => e.type === 'Praxis')) items.push({ label: 'Praxis', color: 'bg-emerald-400' })
  if (examDates.value.some(e => e.type === 'Voraussichtliche Grundwissensprüfung')) items.push({ label: 'Grundwissen',    color: 'bg-sky-400'    })
  if (examDates.value.some(e => e.type === 'Voraussichtliche Kursspezifische Theorieprüfung'))      items.push({ label: 'Theorie Prüfung', color: 'bg-rose-400'   })
  if (examDates.value.some(e => e.type === 'Voraussichtliche Praxisprüfung'))       items.push({ label: 'Praxis Prüfung',  color: 'bg-violet-400' })
  return items
})

const eventsForDay = (day: number | null) => {
  if (!day) return []
  const m = String(calendarMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  const dateStr = `${calendarYear.value}-${m}-${d}`
  return [...dates.value, ...examDates.value].filter(e => e.date === dateStr)
}

// KM-LOG LOGIC
const kmStart = ref<number | null>(null)
const kmEnd = ref<number | null>(null)
const locStart = ref('')
const locEnd = ref('')
const conditions = ref('')
const kmEntries = ref<any[]>([])
const kmError = ref('')

watch([kmStart, kmEnd, locStart, locEnd, conditions], () => { kmError.value = '' })

const fetchKmLogs = async () => {
  try {
    const res = await fetch(`${API_URL}/kmlog`, {
      headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
    })
    if (res.ok) {
      kmEntries.value = await res.json()
    }
  } catch (err) {
    console.error("Failed to fetch KM logs:", err)
  }
}

const addKmEntry = async () => {
  if (kmStart.value === null || kmEnd.value === null || !locStart.value || !locEnd.value || !conditions.value.trim()) {
    kmError.value = "Alle Felder müssen ausgefüllt werden"
    return
  }

  if (kmEnd.value < kmStart.value) {
    kmError.value = "End KM muss größer als Start KM sein"
    return
  }

  try {
    const res = await fetch(`${API_URL}/kmlog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token ?? ''}`
      },
      body: JSON.stringify({
        startKm: kmStart.value,
        endKm: kmEnd.value,
        startLocation: locStart.value,
        endLocation: locEnd.value,
        conditions: conditions.value
      })
    })

    if (res.ok) {
      await fetchKmLogs()
      kmStart.value = kmEnd.value
      kmEnd.value = null
      locStart.value = locEnd.value
      locEnd.value = ''
      conditions.value = ''
    } else {
      const error = await res.json()
      kmError.value = error.error?.message || "Fehler beim Speichern"
    }
  } catch (err) {
    kmError.value = "Netzwerkfehler"
  }
}

const removeKmEntry = async (id: number) => {
  try {
    const res = await fetch(`${API_URL}/kmlog/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
    })
    if (res.ok) {
      await fetchKmLogs()
    }
  } catch (err) {
    console.error("Failed to delete KM entry:", err)
  }
}

// EDIT KM-LOG LOGIC
const editKmLogId = ref<number | null>(null)
const editError = ref('')
const editData = ref({
  startKm: 0,
  endKm: 0,
  startLocation: '',
  endLocation: '',
  conditions: ''
})

const startEdit = (entry: any) => {
  editKmLogId.value = entry.KmLogId
  editData.value = {
    startKm: entry.StartKm,
    endKm: entry.EndKm,
    startLocation: entry.StartLocation,
    endLocation: entry.EndLocation,
    conditions: entry.Conditions || ''
  }
  editError.value = ''
}

const cancelEdit = () => {
  editKmLogId.value = null
}

const saveEdit = async () => {
  if (!editData.value.startLocation || !editData.value.endLocation || !editData.value.conditions.trim()) {
    editError.value = "Alle Felder müssen ausgefüllt werden"
    return
  }
  if (editData.value.endKm < editData.value.startKm) {
    editError.value = "End KM muss größer als Start KM sein"
    return
  }

  try {
    const res = await fetch(`${API_URL}/kmlog/${editKmLogId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token ?? ''}`
      },
      body: JSON.stringify(editData.value)
    })

    if (res.ok) {
      await fetchKmLogs()
      editKmLogId.value = null
    } else {
      const error = await res.json()
      editError.value = error.error?.message || "Fehler beim Speichern"
    }
  } catch (err) {
    editError.value = "Netzwerkfehler"
  }
}

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
const hoveredDay = ref<number | null>(null)
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

// EXAM DATE CALCULATION
const examPaceMap: Record<string, { theorie: number; praxis: number }> = {
  fast:    { theorie: 14,  praxis: 28  },
  normal:  { theorie: 42,  praxis: 84  },
  relaxed: { theorie: 90,  praxis: 180 },
}

function toNextWeekday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  if (day === 6) d.setDate(d.getDate() + 2)
  if (day === 0) d.setDate(d.getDate() + 1)
  return d
}

function recalculateExamDates(userId: string, course: any) {
  const goal = localStorage.getItem(`goal_${userId}`)
  const startDateStr = localStorage.getItem(`startDate_${userId}`)
  if (!goal || !startDateStr) return

  const pace = examPaceMap[goal]
  if (!pace) return

  const startDate = new Date(startDateStr)
  const courseEndStr = course?.dateTo?.substring(0, 10)
  const courseEnd = courseEndStr ? new Date(courseEndStr) : null
  const base = courseEnd && courseEnd > startDate ? courseEnd : startDate

  // Grundwissen: 30 days after course end
  const grundwissenDate = toNextWeekday(new Date(base.getTime() + 30 * 86400000))

  // License-specific theory: pace.theorie days after course end
  const theorieDate = toNextWeekday(new Date(base.getTime() + pace.theorie * 86400000))

  const praxisDate = toNextWeekday(new Date(base.getTime() + pace.praxis * 86400000))

  const newExamDates = [
    { type: 'Voraussichtliche Grundwissensprüfung', date: grundwissenDate.toISOString().split('T')[0], auto: true },
    { type: 'Voraussichtliche Kursspezifische Theorieprüfung',      date: theorieDate.toISOString().split('T')[0],      auto: true },
    { type: 'Voraussichtliche Praxisprüfung',        date: praxisDate.toISOString().split('T')[0],        auto: true },
  ]
  localStorage.setItem(`examDates_${userId}`, JSON.stringify(newExamDates))
  examDates.value = newExamDates
}

// EVENTS LOGIC
const typeInput = ref('')
const dateInput = ref('')
const dates = ref<any[]>([])
const examDates = ref<any[]>([])
const eventError = ref('')

onMounted(async () => {
  if (authStore.user?.UserId) {
    const userId = String(authStore.user.UserId)
    fetchKmLogs()
    const raw = localStorage.getItem(`events_${userId}`)
    if (raw) dates.value = JSON.parse(raw)

    const joinedRaw = localStorage.getItem(`joinedCourse_${userId}`)
    if (joinedRaw) joinedCourse.value = JSON.parse(joinedRaw)

    if (joinedCourse.value?.id) {
      try {
        const res = await fetch(`${API_URL}/programs`, {
          headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
        })
        if (res.ok) {
          const json = await res.json()
          const fresh = (json.data ?? []).find((p: any) => p.LicenseProgramId === joinedCourse.value.id)
          if (fresh) {
            const updated = {
              ...joinedCourse.value,
              dateFrom: fresh.DateFrom,
              dateTo: fresh.DateTo,
              weekdays: fresh.Weekdays ? fresh.Weekdays.split(',') : joinedCourse.value.weekdays,
            }
            localStorage.setItem(`joinedCourse_${userId}`, JSON.stringify(updated))
            joinedCourse.value = updated
          }
        }
      } catch {}
    }

    recalculateExamDates(userId, joinedCourse.value)
  }
  loadCourseTimes()
})
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
