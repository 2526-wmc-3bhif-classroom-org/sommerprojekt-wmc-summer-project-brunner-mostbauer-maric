<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 pt-24 md:pt-16">
      <div class="max-w-6xl w-full">

        <!-- Header -->
        <div class="mb-10 flex flex-col items-center text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-xs text-indigo-600 font-semibold mb-4 transition-all duration-300 hover:scale-105 hover:bg-indigo-100 hover:shadow-sm cursor-default">
            <i class="pi pi-building text-indigo-400"></i>
            Fahrschulportal
          </div>
          <HeaderMain title="Meine Kurse" desktopHeight="md:text-5xl" mobileHeight="text-2xl" class="md:pt-4 md:pb-2 pt-6 pb-2" :duration="500" />
          <p class="text-center md:text-lg text-black/50 text-xs m-5 transition-colors duration-300 hover:text-black/80" v-motion-fade-visible>
            {{ authStore.isStudent ? 'Wähle deine Kurse – tritt einem Kurs bei und starte durch.' : 'Verwalte deine Fahrschulkurse – erstelle, bearbeite und behalte den Überblick.' }}
          </p>
        </div>

        <!-- Toolbar row -->
        <div class="flex flex-col sm:flex-row items-center sm:justify-between justify-center gap-4 mb-6 p-4">
          <div class="group cursor-default transition-all rounded-lg px-3 py-2 text-center sm:text-left">
            <h2 class="text-xl font-black text-slate-900 group-hover:text-indigo-600">Kursübersicht</h2>
            <p class="text-sm text-slate-400 mt-0.5 group-hover:text-indigo-500">{{ filteredCourses.length }} Kurs{{ filteredCourses.length !== 1 ? 'e' : '' }} angelegt</p>
          </div>

          <div class="flex items-center gap-3 flex-col sm:flex-row sm:items-center">
            <!-- Filter by license -->
            <select
              v-if="!authStore.isStudent"
              v-model="filterLicense"
              class="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm transition-all"
            >
              <option value="">Alle Klassen</option>
              <option v-for="cls in usedLicenses" :key="cls" :value="cls">Klasse {{ cls }}</option>
            </select>

            <!-- Add course button -->
            <button
              v-if="authStore.isSchool || authStore.isAdmin"
              @click="openCreateModal"
              class="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <i class="pi pi-plus text-xs"></i>
              Neuer Kurs
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="flex items-center justify-center py-24">
          <i class="pi pi-spin pi-spinner text-indigo-400 text-3xl"></i>
        </div>

        <!-- Course card grid -->
        <div v-else-if="filteredCourses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          <div
            v-for="(course, i) in filteredCourses"
            :key="course.id"
            v-motion
            :initial="{ opacity: 0, y: 24 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 350, delay: Math.min(i * 80, 320) } }"
            class="group bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
          >
            <!-- Card top accent band -->
            <div class="h-1.5 w-full" :class="licenseAccent(course.licenseType)"></div>

            <div class="p-7 flex flex-col flex-1 gap-6">

              <!-- License badge + actions -->
              <div class="flex items-start justify-between">
                <div>
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-black" :class="licenseBadge(course.licenseType)">
                    <i class="pi pi-id-card text-xs"></i>
                    Klasse {{ course.licenseType }}
                  </span>
                  <p class="text-xs text-slate-400 flex items-center gap-1.5" style="margin-top: 1.25rem;">
                    <i class="pi pi-calendar text-[10px]"></i>
                    {{ formatDate(course.dateFrom) }} – {{ formatDate(course.dateTo) }}
                  </p>
                  <p class="text-xs text-slate-400 flex items-center flex-wrap gap-1" style="margin-top: 1rem;">
                    <span v-for="day in course.weekdays" :key="day" class="inline-flex items-center gap-1 bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded-md font-semibold">{{ day }}</span>
                    <span v-if="course.isSchnellkurs" class="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md font-semibold">
                      <i class="pi pi-bolt text-[9px]"></i> Schnellkurs
                    </span>
                  </p>
                </div>

                <!-- Action buttons (visible on hover) -->
                <div v-if="authStore.isSchool || authStore.isAdmin" class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    @click="openEditModal(course)"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-110 transition-all"
                    title="Bearbeiten"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button
                    @click="confirmDelete(course.id)"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-red-300 hover:bg-red-50 hover:text-red-500 hover:scale-110 transition-all"
                    title="Löschen"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </div>

              <!-- Price -->
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-euro text-slate-400 text-sm"></i>
                </div>
                <div>
                  <p class="text-xs text-slate-400 leading-none mb-0.5">Kurspreis</p>
                  <p class="text-lg font-black text-slate-900">{{ course.price.toLocaleString('de-AT') }} €</p>
                </div>
              </div>

              <!-- Participant progress -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <i class="pi pi-users text-[10px]"></i>
                    Teilnehmer
                  </p>
                  <span class="text-xs font-black" :class="participantTextColor(course)">
                    {{ course.currentParticipants }} / {{ course.maxParticipants }}
                  </span>
                </div>
                <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-700"
                    :class="participantBarColor(course)"
                    :style="{ width: `${Math.min((course.currentParticipants / course.maxParticipants) * 100, 100)}%` }"
                  ></div>
                </div>
                <p class="text-[10px] text-slate-400 mt-1.5">
                  {{ course.maxParticipants - course.currentParticipants }} freie Plätze
                </p>
              </div>

              <!-- Status pill at bottom -->
              <div class="mt-auto pt-2 border-t border-gray-50 flex justify-between items-center">
                <span
                  class="text-[11px] font-bold px-2.5 py-1 rounded-full"
                  :class="statusPill(course)"
                >
                  {{ statusLabel(course) }}
                </span>
                <button
                  v-if="authStore.isSchool || authStore.isAdmin"
                  @click="openEditModal(course)"
                  class="text-xs text-indigo-500 hover:text-indigo-700 font-bold transition-colors flex items-center gap-1"
                >
                  Bearbeiten
                  <i class="pi pi-arrow-right text-[10px]"></i>
                </button>
                <button
                  v-else
                  @click="openJoinModal(course.id)"
                  class="text-xs text-emerald-500 hover:text-emerald-700 font-bold transition-colors flex items-center gap-1"
                >
                  Beitreten
                  <i class="pi pi-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="flex flex-col items-center justify-center py-24 text-center">
          <div class="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
            <i class="pi pi-inbox text-indigo-300 text-3xl"></i>
          </div>
          <h3 class="font-black text-slate-800 text-xl mb-2">Noch keine Kurse</h3>
          <p class="text-slate-400 text-sm mb-8 max-w-xs">
            {{ filterLicense ? `Keine Kurse für Klasse ${filterLicense} gefunden.` : 'Erstelle deinen ersten Kurs und starte durch.' }}
          </p>
          <button
            v-if="!filterLicense && (authStore.isSchool || authStore.isAdmin)"
            @click="openCreateModal"
            class="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl transition-all shadow-md"
          >
            <i class="pi pi-plus"></i>
            Ersten Kurs erstellen
          </button>
        </div>

      </div>
    </div>

    <FooterCmp />

    <!-- ── Create / Edit Modal ── -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>

        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 z-10">

          <!-- Modal header -->
          <div class="flex items-center gap-3 mb-7">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <i :class="editingId !== null ? 'pi pi-pencil' : 'pi pi-plus-circle'" class="text-indigo-500"></i>
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900">{{ editingId !== null ? 'Kurs bearbeiten' : 'Neuen Kurs erstellen' }}</h3>
              <p class="text-xs text-slate-400">Füll alle Pflichtfelder aus.</p>
            </div>
          </div>

          <div class="flex flex-col gap-5">

            <!-- License type -->
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Führerscheinklasse *</label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="cls in licenseClasses"
                  :key="cls"
                  @click="form.licenseType = cls"
                  class="py-2 rounded-xl text-xs font-bold border transition-all duration-150"
                  :class="form.licenseType === cls
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                    : 'bg-slate-50 text-slate-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'"
                >
                  {{ cls }}
                </button>
              </div>
              <p v-if="errors.licenseType" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.licenseType }}</p>
            </div>

            <!-- Date range -->
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Kurszeitraum *</label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] text-slate-400 font-semibold mb-1">Von</label>
                  <input
                    v-model="form.dateFrom"
                    type="date"
                    :min="todayISO"
                    class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 font-semibold mb-1">Bis</label>
                  <input
                    v-model="form.dateTo"
                    type="date"
                    :min="form.dateFrom || todayISO"
                    class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>
              <p v-if="errors.dateFrom" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.dateFrom }}</p>
              <p v-if="errors.dateTo" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.dateTo }}</p>
            </div>

            <!-- Time range -->
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Uhrzeit *</label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] text-slate-400 font-semibold mb-1">Von</label>
                  <input
                    v-model="form.timeFrom"
                    type="text"
                    placeholder="08:00"
                    maxlength="5"
                    class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 font-semibold mb-1">Bis</label>
                  <input
                    v-model="form.timeTo"
                    type="text"
                    placeholder="16:00"
                    maxlength="5"
                    class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>
              <p v-if="errors.timeFrom" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.timeFrom }}</p>
              <p v-if="errors.timeTo" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.timeTo }}</p>
            </div>

            <!-- Wochentage -->
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Wochentage</label>
              <div class="grid grid-cols-3 gap-2">
                <label
                  v-for="day in allWeekdays"
                  :key="day"
                  class="flex items-center gap-2 cursor-pointer select-none"
                >
                  <div
                    @click="toggleWeekday(day)"
                    class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0"
                    :class="form.weekdays.includes(day) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300 hover:border-indigo-400'"
                  >
                    <i v-if="form.weekdays.includes(day)" class="pi pi-check text-white text-[10px]"></i>
                  </div>
                  <span class="text-sm text-slate-700 font-semibold">{{ day }}</span>
                </label>
              </div>
              <p v-if="errors.weekdays" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.weekdays }}</p>
            </div>

            <!-- Schnellkurs -->
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Kursart</label>
              <label class="flex items-center gap-3 cursor-pointer select-none group w-fit">
                <div
                  @click="form.isSchnellkurs = !form.isSchnellkurs"
                  class="relative w-11 h-6 rounded-full border-2 transition-all duration-200 flex items-center"
                  :class="form.isSchnellkurs ? 'bg-amber-500 border-amber-500' : 'bg-slate-100 border-gray-300 group-hover:border-amber-300'"
                >
                  <div
                    class="absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                    :class="form.isSchnellkurs ? 'translate-x-5' : 'translate-x-0.5'"
                  ></div>
                </div>
                <span class="text-sm font-semibold" :class="form.isSchnellkurs ? 'text-amber-600' : 'text-slate-500'">
                  <i class="pi pi-bolt text-xs mr-1"></i>
                  Schnellkurs
                </span>
              </label>
            </div>

            <!-- Price + Max participants -->
            <div class="grid grid-cols-2 gap-4 pb-4">
              <div class="mb-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Preis (€) *</label>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  placeholder="z. B. 2500"
                  class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                />
                <p v-if="errors.price" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.price }}</p>
              </div>
              <div class="mb-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Max. Teilnehmer *</label>
                <input
                  v-model.number="form.maxParticipants"
                  type="number"
                  min="1"
                  placeholder="z. B. 20"
                  class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                />
                <p v-if="errors.maxParticipants" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.maxParticipants }}</p>
              </div>
            </div>

            <!-- Current participants (edit only) -->
            <div v-if="editingId !== null" class="pb-4">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Aktuelle Teilnehmeranzahl</label>
              <input
                v-model.number="form.currentParticipants"
                type="number"
                min="0"
                :max="form.maxParticipants"
                class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              />
              <p v-if="errors.currentParticipants" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.currentParticipants }}</p>
            </div>
          </div>

          <!-- Actions -->
          <p v-if="saveError" class="text-xs text-red-500 text-center" style="margin-top: 0.6rem;">{{ saveError }}</p>
          <div class="flex gap-3 mt-4">
            <button @click="closeModal" class="flex-1 py-3.5 rounded-xl border border-gray-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
              Abbrechen
            </button>
            <button @click="saveCourse" class="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm transition-all shadow-md">
              {{ editingId !== null ? 'Änderungen speichern' : 'Kurs erstellen' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Delete confirm ── -->
    <Transition name="modal">
      <div v-if="deleteTargetId !== null" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="deleteTargetId = null"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 z-10 text-center">
          <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-exclamation-triangle text-red-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 mb-2">Kurs wirklich löschen?</h3>
          <p class="text-sm text-slate-500 mb-8">Diese Aktion kann nicht rückgängig gemacht werden. Alle Teilnehmerdaten gehen verloren.</p>
          <div class="flex gap-3">
            <button @click="deleteTargetId = null" class="flex-1 py-3.5 rounded-xl border border-gray-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Abbrechen</button>
            <button @click="deleteCourse" class="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold text-sm transition-all shadow-md">Löschen</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Join confirm ── -->
    <Transition name="modal">
      <div v-if="joinTargetId !== null" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="joinTargetId = null"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 z-10 text-center">
          <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-user-plus text-emerald-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 mb-2">Kurs beitreten?</h3>
          <div v-if="joinTargetCourse" class="text-sm text-slate-500 mb-2">
            <span class="font-bold text-slate-700">Klasse {{ joinTargetCourse.licenseType }}</span>
            &nbsp;·&nbsp;{{ formatDate(joinTargetCourse.dateFrom) }} – {{ formatDate(joinTargetCourse.dateTo) }}
          </div>
          <p class="text-sm text-slate-400 mb-8">Die Kurstage werden in deinem Kalender angezeigt.</p>
          <div class="flex gap-3">
            <button @click="joinTargetId = null" class="flex-1 py-3.5 rounded-xl border border-gray-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Abbrechen</button>
            <button @click="confirmJoin" class="flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm transition-all shadow-md">Beitreten</button>
          </div>
        </div>
      </div>
    </Transition>

  </Background>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Background from '@/components/Background.vue'
import HeaderMain from '@/components/HeaderMain.vue'
import FooterCmp from '@/components/FooterCmp.vue'
import InfoStatsCard from '@/components/InfoStatsCard.vue'
import { useAuthStore } from '@/stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const LICENSE_TYPE_IDS: Record<string, number> = {
  A: 1, A1: 2, A2: 3, AM: 4, B: 5, BE: 6, C: 7, C1: 8, CE: 9, D: 10, D1: 11, DE: 12
}
const LICENSE_ID_TO_NAME: Record<number, string> = Object.fromEntries(
  Object.entries(LICENSE_TYPE_IDS).map(([k, v]) => [v, k])
)

/* ── Types ── */
interface Course {
  id: number
  drivingSchoolId: number
  licenseType: string
  dateFrom: string
  dateTo: string
  timeFrom: string
  timeTo: string
  weekdays: string[]
  isSchnellkurs: boolean
  price: number
  maxParticipants: number
  currentParticipants: number
}

function mapProgram(p: any): Course {
  return {
    id: p.LicenseProgramId,
    drivingSchoolId: p.DrivingSchoolId,
    licenseType: LICENSE_ID_TO_NAME[p.LicenseTypeId] ?? String(p.LicenseTypeId),
    dateFrom: p.DateFrom,
    dateTo: p.DateTo,
    timeFrom: p.TimeFrom ?? '',
    timeTo: p.TimeTo ?? '',
    weekdays: p.Weekdays ? p.Weekdays.split(',') : [],
    isSchnellkurs: !!p.IsSchnellkurs,
    price: p.Price,
    maxParticipants: p.MaxParticipants,
    currentParticipants: p.CurrentParticipants,
  }
}

const courses = ref<Course[]>([])
const isLoading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

/* ── School course ownership via localStorage ── */
function schoolCoursesKey() {
  return `schoolCourseIds_${authStore.user?.UserId ?? 0}`
}
function getOwnCourseIds(): number[] {
  const raw = localStorage.getItem(schoolCoursesKey())
  return raw ? JSON.parse(raw) : []
}
function addOwnCourseId(id: number) {
  const ids = getOwnCourseIds()
  if (!ids.includes(id)) localStorage.setItem(schoolCoursesKey(), JSON.stringify([...ids, id]))
}
function removeOwnCourseId(id: number) {
  const ids = getOwnCourseIds().filter(i => i !== id)
  localStorage.setItem(schoolCoursesKey(), JSON.stringify(ids))
}

function courseEditsKey() {
  return `schoolCourseEdits_${authStore.user?.UserId ?? 0}`
}
function getCourseEdits(): Record<number, Partial<Course>> {
  const raw = localStorage.getItem(courseEditsKey())
  return raw ? JSON.parse(raw) : {}
}
function saveCourseEdit(id: number, data: Partial<Course>) {
  const edits = getCourseEdits()
  edits[id] = data
  localStorage.setItem(courseEditsKey(), JSON.stringify(edits))
}
function removeCourseEdit(id: number) {
  const edits = getCourseEdits()
  delete edits[id]
  localStorage.setItem(courseEditsKey(), JSON.stringify(edits))
}

function courseTimesKey() {
  return 'courseTimes'
}
function getCourseTimes(): Record<number, { timeFrom: string; timeTo: string }> {
  const merged: Record<number, { timeFrom: string; timeTo: string }> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key === 'courseTimes' || key?.startsWith('courseTimes_')) {
      const raw = localStorage.getItem(key)
      if (raw) Object.assign(merged, JSON.parse(raw))
    }
  }
  return merged
}
function saveCourseTime(id: number, timeFrom: string, timeTo: string) {
  const times = getCourseTimes()
  times[id] = { timeFrom, timeTo }
  localStorage.setItem(courseTimesKey(), JSON.stringify(times))
}
function removeCourseTime(id: number) {
  const times = getCourseTimes()
  delete times[id]
  localStorage.setItem(courseTimesKey(), JSON.stringify(times))
}

/* ── Filter ── */
const filterLicense = ref('')
const filteredCourses = computed(() =>
  filterLicense.value
    ? courses.value.filter(c => c.licenseType === filterLicense.value)
    : courses.value
)
const usedLicenses = computed(() => [...new Set(courses.value.map(c => c.licenseType))])

async function fetchCourses() {
  isLoading.value = true
  try {
    const res = await fetch(`${API_URL}/programs`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {})
      }
    })
    if (res.ok) {
      const json = await res.json()
      const times = getCourseTimes()
      const all: Course[] = (json.data ?? []).map((p: any) => {
        const base = mapProgram(p)
        return { ...base, ...(times[base.id] ?? {}) }
      })
      if (authStore.isSchool) {
        const ownIds = getOwnCourseIds()
        const edits = getCourseEdits()
        courses.value = all
          .filter(c => ownIds.includes(c.id))
          .map(c => ({ ...c, ...edits[c.id] }))
      } else {
        courses.value = all
      }
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (authStore.isStudent && authStore.user) {
    const saved = localStorage.getItem(`licenseClass_${authStore.user.UserId}`)
    if (saved) filterLicense.value = saved
  }
  await fetchCourses()
})

/* ── Computed stats ── */
const totalParticipants = computed(() => courses.value.reduce((s, c) => s + c.currentParticipants, 0))
const uniqueLicenses    = computed(() => new Set(courses.value.map(c => c.licenseType)).size)

/* ── Static data ── */
const licenseClasses = ['A', 'A1', 'A2', 'AM', 'B', 'BE', 'C', 'C1', 'CE', 'D', 'D1', 'DE']
const allWeekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

/* ── Helpers ── */
function formatDate(d: string) {
  return d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'
}

const accentMap: Record<string,string> = {
  A:'bg-orange-400', A1:'bg-orange-300', A2:'bg-amber-400', AM:'bg-yellow-400',
  B:'bg-indigo-500', BE:'bg-indigo-400', C:'bg-violet-500', C1:'bg-violet-400',
  CE:'bg-purple-500', D:'bg-emerald-500', D1:'bg-emerald-400', DE:'bg-teal-500',
}
const badgeMap: Record<string,string> = {
  A:'bg-orange-50 text-orange-600', A1:'bg-orange-50 text-orange-500', A2:'bg-amber-50 text-amber-600',
  AM:'bg-yellow-50 text-yellow-600', B:'bg-indigo-50 text-indigo-600', BE:'bg-indigo-50 text-indigo-500',
  C:'bg-violet-50 text-violet-600', C1:'bg-violet-50 text-violet-500', CE:'bg-purple-50 text-purple-600',
  D:'bg-emerald-50 text-emerald-600', D1:'bg-emerald-50 text-emerald-500', DE:'bg-teal-50 text-teal-600',
}
const licenseAccent = (t: string) => accentMap[t] ?? 'bg-slate-400'
const licenseBadge  = (t: string) => badgeMap[t]  ?? 'bg-slate-100 text-slate-600'

function participantBarColor(c: Course) {
  const r = c.currentParticipants / c.maxParticipants
  return r >= 1 ? 'bg-red-400' : r >= 0.8 ? 'bg-amber-400' : 'bg-emerald-400'
}
function participantTextColor(c: Course) {
  const r = c.currentParticipants / c.maxParticipants
  return r >= 1 ? 'text-red-500' : r >= 0.8 ? 'text-amber-500' : 'text-emerald-600'
}
function statusLabel(c: Course) {
  const r = c.currentParticipants / c.maxParticipants
  return r >= 1 ? 'Ausgebucht' : r >= 0.8 ? 'Fast voll' : 'Verfügbar'
}
function statusPill(c: Course) {
  const r = c.currentParticipants / c.maxParticipants
  return r >= 1 ? 'bg-red-50 text-red-500' : r >= 0.8 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
}

/* ── Modal ── */
const showModal = ref(false)
const editingId = ref<number | null>(null)
const saveError = ref('')
const emptyForm = () => ({ licenseType: '', dateFrom: '', dateTo: '', timeFrom: '', timeTo: '', weekdays: [] as string[], isSchnellkurs: false, price: undefined as unknown as number, maxParticipants: 20, currentParticipants: 0 })

function toggleWeekday(day: string) {
  const idx = form.value.weekdays.indexOf(day)
  if (idx === -1) form.value.weekdays.push(day)
  else form.value.weekdays.splice(idx, 1)
}
const form = ref(emptyForm())
const errors = ref<Record<string, string>>({})

/* ── Computed today string for min-date ── */
const todayISO = new Date().toISOString().split('T')[0]

function isValidTime(t: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(t)) return false
  const [h, m] = t.split(':').map(Number)
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

function validate() {
  const e: Record<string, string> = {}
  if (!form.value.licenseType) {
    e.licenseType = 'Bitte eine Klasse auswählen.'
  }
  if (form.value.weekdays.length === 0) {
    e.weekdays = 'Bitte mindestens einen Wochentag auswählen.'
  }
  if (!form.value.dateFrom) {
    e.dateFrom = 'Bitte ein Startdatum angeben.'
  } else if (form.value.dateFrom < todayISO) {
    e.dateFrom = 'Startdatum darf nicht in der Vergangenheit liegen.'
  }
  if (!form.value.dateTo) {
    e.dateTo = 'Bitte ein Enddatum angeben.'
  } else if (form.value.dateTo < (form.value.dateFrom || todayISO)) {
    e.dateTo = 'Enddatum muss nach dem Startdatum liegen.'
  }
  if (!form.value.timeFrom) {
    e.timeFrom = 'Bitte eine Startzeit angeben.'
  } else if (!isValidTime(form.value.timeFrom)) {
    e.timeFrom = 'Ungültige Zeit – Format: HH:MM (z. B. 08:30).'
  }
  if (!form.value.timeTo) {
    e.timeTo = 'Bitte eine Endzeit angeben.'
  } else if (!isValidTime(form.value.timeTo)) {
    e.timeTo = 'Ungültige Zeit – Format: HH:MM (z. B. 16:00).'
  } else if (form.value.timeFrom && isValidTime(form.value.timeFrom) && form.value.timeTo <= form.value.timeFrom) {
    e.timeTo = 'Endzeit muss nach der Startzeit liegen.'
  }
  if (form.value.price <= 0) {
    e.price = 'Preis muss größer als 0 sein.'
  }
  if (form.value.maxParticipants < 1) {
    e.maxParticipants = 'Mindestens 1 Teilnehmer erforderlich.'
  }
  if (form.value.currentParticipants < 0) {
    e.currentParticipants = 'Aktuelle Teilnehmeranzahl darf nicht negativ sein.'
  } else if (form.value.currentParticipants > form.value.maxParticipants) {
    e.currentParticipants = `Aktuelle Teilnehmeranzahl darf nicht größer als die maximale Teilnehmeranzahl (${form.value.maxParticipants}) sein.`
  }
  errors.value = e
  return Object.keys(e).length === 0
}

function openCreateModal() {
  form.value = emptyForm(); editingId.value = null; errors.value = {}; saveError.value = ''; showModal.value = true
}
function openEditModal(c: Course) {
  form.value = { ...c }; editingId.value = c.id; errors.value = {}; saveError.value = ''; showModal.value = true
}
function closeModal() { showModal.value = false }

async function saveCourse() {
  if (!validate()) return
  saveError.value = ''
  if (editingId.value !== null) {
    const res = await fetch(`${API_URL}/programs/${editingId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token ?? ''}` },
      body: JSON.stringify({
        LicenseTypeId: LICENSE_TYPE_IDS[form.value.licenseType],
        DateFrom: form.value.dateFrom,
        DateTo: form.value.dateTo,
        TimeFrom: form.value.timeFrom,
        TimeTo: form.value.timeTo,
        Weekdays: form.value.weekdays.join(','),
        IsSchnellkurs: form.value.isSchnellkurs ? 1 : 0,
        Price: form.value.price,
        MaxParticipants: form.value.maxParticipants,
      })
    })
    if (res.ok) {
      saveCourseTime(editingId.value, form.value.timeFrom, form.value.timeTo)
      removeCourseEdit(editingId.value)
      closeModal()
      await fetchCourses()
    } else {
      const json = await res.json().catch(() => ({}))
      saveError.value = json?.error?.message ?? 'Änderungen konnten nicht gespeichert werden.'
    }
  } else {
    const res = await fetch(`${API_URL}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token ?? ''}`
      },
      body: JSON.stringify({
        DrivingSchoolId: authStore.user?.DrivingSchoolId ?? 1,
        LicenseTypeId: LICENSE_TYPE_IDS[form.value.licenseType],
        DateFrom: form.value.dateFrom,
        DateTo: form.value.dateTo,
        TimeFrom: form.value.timeFrom,
        TimeTo: form.value.timeTo,
        Weekdays: form.value.weekdays.join(','),
        IsSchnellkurs: form.value.isSchnellkurs ? 1 : 0,
        Price: form.value.price,
        MaxParticipants: form.value.maxParticipants,
      })
    })
    if (res.ok) {
      const json = await res.json()
      const newId = json.data.id
      addOwnCourseId(newId)
      saveCourseTime(newId, form.value.timeFrom, form.value.timeTo)
      closeModal()
      await fetchCourses()
    } else {
      const json = await res.json().catch(() => ({}))
      saveError.value = json?.error?.message ?? 'Kurs konnte nicht erstellt werden.'
    }
  }
}

/* ── Delete ── */
const deleteTargetId = ref<number | null>(null)
function confirmDelete(id: number) { deleteTargetId.value = id }
async function deleteCourse() {
  if (deleteTargetId.value === null) return
  const id = deleteTargetId.value
  const res = await fetch(`${API_URL}/programs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
  })
  if (res.ok) {
    removeOwnCourseId(id)
    removeCourseEdit(id)
    removeCourseTime(id)
    courses.value = courses.value.filter(c => c.id !== id)
  }
  deleteTargetId.value = null
}

/* ── Join ── */
const joinTargetId = ref<number | null>(null)
const joinTargetCourse = computed(() =>
  joinTargetId.value !== null ? courses.value.find(c => c.id === joinTargetId.value) : null
)

function openJoinModal(id: number) { joinTargetId.value = id }

async function confirmJoin() {
  if (!joinTargetCourse.value) return
  const res = await fetch(`${API_URL}/programs/${joinTargetId.value}/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authStore.token ?? ''}`
    }
  })
  if (res.ok) {
    if (authStore.user) {
      localStorage.setItem(`joinedCourse_${authStore.user.UserId}`, JSON.stringify(joinTargetCourse.value))
    }
    joinTargetId.value = null
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
input[type="date"]::-webkit-calendar-picker-indicator { filter: brightness(0); cursor: pointer; opacity: 0.7; }
</style>
