<template>

  <!-- Main page container -->
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">

    <div class="max-w-6xl w-full">

      <!-- Page header section -->
      <div class="mb-8 flex flex-col items-center text-center">
        <!-- Small badge above the title -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-600 font-semibold mb-4">
          <i class="pi pi-map-marker text-blue-400"></i>
          Fahrschul-Verzeichnis
        </div>

        <!-- Main page title component -->
        <HeaderMain title="Fahrschulen in der Nähe" desktopHeight="md:text-5xl" mobileHeight="text-2xl" class="md:pt-6 md:pb-2 pt-8 pb-2" :duration=500 />

        <!-- Page subtitle -->
        <p class="text-center md:text-lg text-black/50 text-xs" v-motion-fade:duration="500">
          Vergleiche Fahrschulen und finde die passende für dich.
        </p>
      </div>

      <!-- Statistics cards -->
      <div class="py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <!-- Total number of driving schools -->
        <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <i class="pi pi-car text-blue-500"></i>
          </div>
          <div>
            <p class="text-2xl font-black text-slate-900">{{ schools.length }}</p>
            <p class="text-xs text-slate-400 font-medium">Fahrschulen</p>
          </div>
        </div>

        <!-- Number of schools with a website -->
        <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <i class="pi pi-check-circle text-emerald-500"></i>
          </div>
          <div>
            <p class="text-2xl font-black text-slate-900">{{ schools.filter(s => s.link).length }}</p>
            <p class="text-xs text-slate-400 font-medium">Mit Website</p>
          </div>
        </div>

        <!-- Number of unique locations -->
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

      <!--
      Optional cards section (currently disabled)
      <div class="flex justify-center py-16 gap-4 px-6 md:flex-row flex-col">
      <CardMain
        v-for="card in pros"
        :key="card.title"
        :title="card.title"
        :description="card.description"
        :icon="card.icon"
        :duration="card.duration"
        :iconColor="card.iconColor"
        :borderColor="card.borderColor"
        />
      </div>
      -->

      <!-- Table container -->
      <div class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

        <!-- Table header with title and search field -->
        <div class="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-bold text-slate-900">Übersicht</h2>

            <!-- Badge showing number of filtered entries -->
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

        <!-- Error message if data loading fails -->
        <div v-if="loadingError" class="p-16 text-center">
          <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-exclamation-triangle text-red-400 text-2xl"></i>
          </div>
          <p class="font-bold text-slate-700 mb-1">Daten konnten nicht geladen werden</p>
        </div>

        <!-- Table section -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left table-fixed border-separate border-spacing-0">

            <!-- Table header -->
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

            <!-- Table body -->
            <tbody>
              <!-- Each row is rendered using a component -->
              <DrivingSchoolLine
                v-for="(school, i) in filteredSchools"
                :key="i"
                :school="school"
                :index="i"
              />
            </tbody>
          </table>

          <!-- Message when no schools match the search -->
          <div v-if="filteredSchools.length === 0" class="p-16 text-center">
             <p class="text-slate-400">Keine Fahrschulen gefunden.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer component -->
  <FooterCmp></FooterCmp>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DrivingSchoolLine from "@/components/DrivingSchoolLine.vue";
import Background from '@/components/Background.vue';
import CardMain from "@/components/CardMain.vue";
import FooterCmp from '@/components/FooterCmp.vue';
import HeaderMain from '@/components/HeaderMain.vue';


// TypeScript interface describing a driving school object
interface Fahrschule {
  name: string
  ort: string
  inhaber: string
  email: string
  link: string
}

// Reactive array containing all driving schools
const schools = ref<Fahrschule[]>([])

// Indicates if loading the CSV failed
const loadingError = ref(false)

// Search input value
const search = ref('')


// Computed list of schools filtered by search query
const filteredSchools = computed(() => {
  if (!search.value.trim()) return schools.value
  const q = search.value.toLowerCase()

  return schools.value.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.ort.toLowerCase().includes(q) ||
    s.inhaber.toLowerCase().includes(q)
  )
})


// Number of unique locations (Orte)
const uniqueOrte = computed(() =>
  new Set(schools.value.map(s => s.ort).filter(Boolean)).size
)


// Loads the CSV file containing the driving school data
async function loadCSV() {
  try {
    const response = await fetch('/driving_schools.csv')
    if (!response.ok) throw new Error('CSV nicht gefunden')

    const text = await response.text()

    // Split CSV into lines
    const lines = text.trim().split('\n')

    // Convert CSV rows into objects
    schools.value = lines.slice(1).map(line => {

      // Regex splits the CSV columns correctly
      const col = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []

      return {
        name: col[0]?.replace(/"/g, '') || '',
        ort: col[1]?.replace(/"/g, '') || '',
        inhaber: col[2]?.replace(/"/g, '') || '',
        email: col[3]?.replace(/"/g, '') || '',
        link: col[4]?.replace(/"/g, '') || ''
      }

    }).filter(s => s.name)

  } catch (e) {
    console.error(e)

    // Show error state in the UI
    loadingError.value = true
  }
}


// Load data when the component is mounted
onMounted(() => loadCSV())



/* Optional feature cards (currently disabled)
const pros = [
  {
    title: `Fahrschulen: ${schools.value.length}`,
    description: "",
    icon: "pi pi-car",
    duration: 500,
    iconColor: "text-blue-500",
    borderColor: "border-blue-500",
  },
  {
    title: "Effizient",
    description: "Optimieren Sie Ihren Lernprozess mit unserem intelligenten Planungsalgorithmus.",
    icon: "pi pi-cog",
    duration: 700,
    iconColor: "text-violet-500",
    borderColor: "border-violet-500",
  },
  {
    title: "Motivierend",
    description: "Verfolgen Sie Ihren Fortschritt und bleiben Sie motiviert auf dem Weg zum Führerschein.",
    icon: "pi pi-chart-line",
    duration: 900,
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500",
  }
]
*/

</script>