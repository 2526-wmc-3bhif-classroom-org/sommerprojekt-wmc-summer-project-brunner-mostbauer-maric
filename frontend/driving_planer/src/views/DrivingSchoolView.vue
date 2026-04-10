<template>
  <Background>
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">
        <div class="max-w-6xl w-full">

          <!-- Header section -->
          <div class="mb-8 flex flex-col items-center text-center relative z-0">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-600 font-semibold mb-4 transition-all duration-300 hover:scale-105 hover:bg-blue-100 hover:shadow-sm cursor-default">
              <i class="pi pi-map-marker text-blue-400"></i>
              Fahrschul-Verzeichnis
            </div>

            <!-- Title component -->
            <HeaderMain title="Fahrschulen in der Nähe" desktopHeight="md:text-5xl" mobileHeight="text-2xl" class="md:pt-6 md:pb-2 pt-8 pb-2" :duration=500 />

            <!-- Subtitle -->
            <p class="text-center md:text-lg text-black/50 text-xs transition-colors duration-300 hover:text-black/80" v-motion-fade:duration="500">
              Vergleiche Fahrschulen und finde die passende für dich.
            </p>
          </div>

          <!-- Stats cards -->
          <div class="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

            <InfoStatsCard
              v-for="(card, i) in 1"
              :key="i"
              :index="i"
              title="Individuell"
              :description="`${schools.length} Fahrschulen verfügbar`"
              icon="pi pi-car"
              iconColor="text-blue-500"
              borderColor="border-blue-500"
            />

            <InfoStatsCard
              v-for="(card, i) in 1"
              :key="i"
              :index="i"
              title="Effizient"
              :description="`${schools.filter(s => s.link).length} mit Website`"
              icon="pi pi-link"
              iconColor="text-violet-500"
              borderColor="border-violet-500"
            />

            <InfoStatsCard
              v-for="(card, i) in 1"
              :key="i"
              :index="i"
              title="Motivierend"
              :description="`${uniqueOrte} Orte verfügbar`"
              icon="pi pi-map-marker"
              iconColor="text-emerald-500"
              borderColor="border-emerald-500"
            />

          </div>

          <!-- Table / List container -->
          <div class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

            <!-- Top bar: title + search -->
            <div class="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 bg-white">
              <div class="flex items-center gap-3 group/title cursor-default">
                <h2 class="text-lg font-bold text-slate-900 group-hover/title:text-blue-600 transition-colors relative">
                  Übersicht
                  <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover/title:w-full transition-all duration-300"></span>
                </h2>

                <!-- Result count -->
                <span class="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full hover:bg-blue-100 hover:scale-105 transition-all cursor-help border border-transparent hover:border-blue-200">
                  {{ filteredSchools.length }} Einträge
                </span>
              </div>

              <!-- Search input -->
              <div class="relative w-full sm:w-64 group/search">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm group-focus-within/search:text-blue-500 group-hover/search:text-slate-400 transition-colors"></i>
                <input
                  v-model="search"
                  type="text"
                  placeholder="Suchen..."
                  class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white hover:bg-slate-100/50 transition-all shadow-sm hover:shadow"
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
                    <th class="px-6 py-4 w-[6%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default">#</th>
                    <th class="px-0 py-4 w-[13.5%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default">Fahrschule</th>
                    <th class="px-0 py-4 w-[37%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default">Ort</th>
                    <th class="px-6 py-4 w-[25%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default">Inhaber</th>
                    <th class="px-6 py-4 w-[13%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default text-center">Bewertung</th>
                    <th class="px-6 py-4 w-[10%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default text-right">Website</th>
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
    </div>
  </Background>
  <!-- Main page wrapper -->


  <!-- Footer -->
  <FooterCmp></FooterCmp>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DrivingSchoolLine from "@/components/DrivingSchoolLine.vue";
import Background from '@/components/Background.vue';
import FooterCmp from '@/components/FooterCmp.vue';
import HeaderMain from '@/components/HeaderMain.vue';
import InfoStatsCard from "@/components/InfoStatsCard.vue";

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
