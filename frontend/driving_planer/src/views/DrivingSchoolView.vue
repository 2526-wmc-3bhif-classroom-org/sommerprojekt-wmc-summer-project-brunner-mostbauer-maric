<template>
  <!-- Main page wrapper -->
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">
    <div class="max-w-6xl w-full">

      <!-- Header section -->
      <div class="mb-8 flex flex-col items-center text-center relative z-0">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-600 font-semibold mb-4">
          <i class="pi pi-map-marker text-blue-400"></i>
          Fahrschul-Verzeichnis
        </div>

        <!-- Title component -->
        <HeaderMain title="Fahrschulen in der Nähe" desktopHeight="md:text-5xl" mobileHeight="text-2xl" class="md:pt-6 md:pb-2 pt-8 pb-2" :duration=500 />

        <!-- Subtitle -->
        <p class="text-center md:text-lg text-black/50 text-xs" v-motion-fade:duration="500">
          Vergleiche Fahrschulen und finde die passende für dich.
        </p>
      </div>

      <!-- Stats cards -->
      <div class="py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <!-- Total schools -->
        <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <i class="pi pi-car text-blue-500"></i>
          </div>
          <div>
            <p class="text-2xl font-black text-slate-900">{{ schools.length }}</p>
            <p class="text-xs text-slate-400 font-medium">Fahrschulen</p>
          </div>
        </div>

        <!-- Schools with website -->
        <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <i class="pi pi-check-circle text-emerald-500"></i>
          </div>
          <div>
            <p class="text-2xl font-black text-slate-900">{{ schools.filter(s => s.link).length }}</p>
            <p class="text-xs text-slate-400 font-medium">Mit Website</p>
          </div>
        </div>

        <!-- Unique locations -->
        <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <i class="pi pi-map text-violet-500"></i>
          </div>
          <div>
            <p class="text-2xl font-black text-slate-900">{{ uniqueOrte }}</p>
            <p class="text-xs text-slate-400 font-medium">Orte</p>
          </div>
        </div>
      </div>

      <!-- Table / List container -->
      <div class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

        <!-- Top bar: title + search -->
        <div class="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-bold text-slate-900">Übersicht</h2>

            <!-- Result count -->
            <span class="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
              {{ filteredSchools.length }} Einträge
            </span>
          </div>

          <!-- Search input -->
          <div class="relative w-full sm:w-64">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
            <input
              v-model="search"
              type="text"
              placeholder="Suchen..."
              class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        <!-- Error state -->
        <div v-if="loadingError" class="p-16 text-center">
          <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-exclamation-triangle text-red-400 text-2xl"></i>
          </div>
          <p class="font-bold text-slate-700 mb-1">Daten konnten nicht geladen werden</p>
        </div>

        <div v-else class="overflow-x-auto">

          <!-- Desktop table -->
          <table class="hidden md:table w-full text-left table-fixed border-separate border-spacing-0">
            <thead>
              <tr class="bg-slate-50 border-b border-gray-100">
                <th class="px-6 py-4 w-[6%] text-xs font-bold text-slate-400 uppercase tracking-widest">#</th>
                <th class="px-0 py-4 w-[13.5%] text-xs font-bold text-slate-400 uppercase tracking-widest">Fahrschule</th>
                <th class="px-0 py-4 w-[37%] text-xs font-bold text-slate-400 uppercase tracking-widest">Ort</th>
                <th class="px-6 py-4 w-[25%] text-xs font-bold text-slate-400 uppercase tracking-widest">Inhaber</th>
                <th class="px-6 py-4 w-[13%] text-xs font-bold text-slate-400 uppercase tracking-widest">Bewertung</th>
                <th class="px-6 py-4 w-[10%] text-xs font-bold text-slate-400 uppercase tracking-widest">Website</th>
              </tr>
            </thead>

            <!-- Rows rendered via component -->
            <tbody>
              <DrivingSchoolLine
                v-for="(school, i) in filteredSchools"
                :key="i"
                :school="school"
                :index="i"
              />
            </tbody>
          </table>

          <!-- Mobile list view -->
          <div class="md:hidden divide-y divide-gray-100">
            <div
              v-for="(school, i) in filteredSchools"
              :key="'mob-' + i"
              class="p-4 active:bg-slate-50 transition-colors"
              @click="school.isExpanded = !school.isExpanded" >

              <!-- Header row -->
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-blue-500 uppercase tracking-tight">#{{ i + 1 }}</span>

                <!-- External link (if available) -->
                <a v-if="school.link" :href="school.link" target="_blank" @click.stop class="text-blue-500 text-sm p-1">
                  <i class="pi pi-external-link"></i>
                </a>
              </div>

              <!-- Basic info -->
              <h3 class="font-bold text-slate-900">{{ school.name }}</h3>
              <p class="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <i class="pi pi-map-marker text-[10px]"></i> {{ school.ort }}
              </p>

              <!-- Owner + rating -->
              <div class="flex items-center justify-between mt-4">
                <span class="text-xs text-slate-400 italic">{{ school.inhaber }}</span>

                <!-- Interactive star rating -->
                <div class="flex gap-1">
                  <i
                    v-for="star in 5"
                    :key="star"
                    @click.stop="school.rating = star"
                    class="pi text-sm"
                    :class="[
                      star <= (school.rating || 0) ? 'pi-star-fill text-yellow-400' : 'pi-star text-slate-200'
                    ]"
                  ></i>
                </div>
              </div>

              <!-- Expandable notes section -->
              <div v-if="school.isExpanded" class="mt-4 pt-4 border-t border-slate-50">
                <div class="bg-slate-50 rounded-xl p-3 border border-blue-50" @click.stop>
                  <div class="flex items-center gap-2 mb-2">
                    <i class="pi pi-pencil text-blue-400 text-[10px]"></i>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Notizen</span>
                  </div>

                  <!-- User note input -->
                  <textarea
                    v-model="school.comment"
                    placeholder="Deine Notiz..."
                    class="w-full p-2 bg-white border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="filteredSchools.length === 0" class="p-16 text-center">
              <p class="text-slate-400">Keine Fahrschulen gefunden.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <FooterCmp></FooterCmp>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DrivingSchoolLine from "@/components/DrivingSchoolLine.vue";
import Background from '@/components/Background.vue';
import CardMain from "@/components/CardMain.vue";
import FooterCmp from '@/components/FooterCmp.vue';
import HeaderMain from '@/components/HeaderMain.vue';

/* Data model for a driving school */
interface Fahrschule {
  name: string
  ort: string
  inhaber: string
  email: string
  link: string

  /* UI state fields */
  rating?: number
  comment?: string
  isExpanded?: boolean
}

/* Reactive state */
const schools = ref<Fahrschule[]>([])
const loadingError = ref(false)
const search = ref('')

/* Filtered list based on search input */
const filteredSchools = computed(() => {
  if (!search.value.trim()) return schools.value

  const q = search.value.toLowerCase()

  return schools.value.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.ort.toLowerCase().includes(q) ||
    s.inhaber.toLowerCase().includes(q)
  )
})

/* Count unique locations */
const uniqueOrte = computed(() =>
  new Set(schools.value.map(s => s.ort).filter(Boolean)).size
)

/* Load and parse CSV data */
async function loadCSV() {
  try {
    const response = await fetch('/driving_schools.csv')
    if (!response.ok) throw new Error('Daten nicht gefunden')

    const text = await response.text()
    const lines = text.trim().split('\n')

    /* Convert CSV rows into objects */
    schools.value = lines.slice(1).map(line => {
      const col = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []

      return {
        name: col[0]?.replace(/"/g, '') || '',
        ort: col[1]?.replace(/"/g, '') || '',
        inhaber: col[2]?.replace(/"/g, '') || '',
        email: col[3]?.replace(/"/g, '') || '',
        link: col[4]?.replace(/"/g, '') || '',

        /* Initialize UI-related fields */
        rating: 0,
        comment: '',
        isExpanded: false
      }
    }).filter(s => s.name)

  } catch (e) {
    console.error(e)

    /* Trigger error UI */
    loadingError.value = true
  }
}

/* Load data on component mount */
onMounted(() => loadCSV())
</script>