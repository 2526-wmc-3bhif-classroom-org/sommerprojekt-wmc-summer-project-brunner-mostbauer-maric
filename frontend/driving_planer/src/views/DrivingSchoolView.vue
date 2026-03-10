<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div class="mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-600 font-semibold mb-4">
          <i class="pi pi-map-marker text-blue-400"></i>
          Fahrschul-Verzeichnis
        </div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Fahrschulen <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">in der Nähe</span>
        </h1>
        <p class="text-slate-500">Vergleiche Fahrschulen und finde die passende für dich.</p>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <i class="pi pi-car text-blue-500"></i>
          </div>
          <div>
            <p class="text-2xl font-black text-slate-900">{{ schools.length }}</p>
            <p class="text-xs text-slate-400 font-medium">Fahrschulen</p>
          </div>
        </div>
        <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <i class="pi pi-check-circle text-emerald-500"></i>
          </div>
          <div>
            <p class="text-2xl font-black text-slate-900">{{ schools.filter(s => s.link).length }}</p>
            <p class="text-xs text-slate-400 font-medium">Mit Website</p>
          </div>
        </div>
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

      <!-- Main table card -->
      <div class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

        <!-- Toolbar -->
        <div class="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-bold text-slate-900">Übersicht</h2>
            <span class="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
              {{ filteredSchools.length }} Einträge
            </span>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <!-- Search -->
            <div class="relative flex-1 sm:w-64">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
              <input
                v-model="search"
                type="text"
                placeholder="Suchen..."
                class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              />
            </div>

            <!-- Toggle button -->
            <button
              @click="isOpen = !isOpen"
              class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 whitespace-nowrap"
            >
              <i :class="['pi text-xs', isOpen ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
              {{ isOpen ? 'Einklappen' : 'Anzeigen' }}
            </button>
          </div>
        </div>

        <!-- Error state -->
        <div v-if="loadingError" class="p-16 text-center">
          <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-exclamation-triangle text-red-400 text-2xl"></i>
          </div>
          <p class="font-bold text-slate-700 mb-1">CSV konnte nicht geladen werden</p>
          <p class="text-sm text-slate-400">Prüfe ob die Datei im <code class="bg-slate-100 px-1 rounded">public</code> Ordner liegt.</p>
        </div>

        <!-- Empty/closed state -->
        <div v-else-if="!isOpen" class="p-12 text-center">
          <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-list text-blue-400 text-2xl"></i>
          </div>
          <p class="font-bold text-slate-700 mb-1">Liste ausgeblendet</p>
          <p class="text-sm text-slate-400">Klicke auf "Anzeigen" um alle Fahrschulen zu sehen.</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
            <tr class="bg-slate-50 border-b border-gray-100">
              <th class="px-6 py-3 w-12 text-xs font-bold text-slate-400 uppercase tracking-widest">#</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Fahrschule</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Ort</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Inhaber</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aktion</th>
            </tr>
            </thead>
            <tbody>
            <DrivingSchoolLine
              v-for="(school, i) in filteredSchools"
              :key="i"
              :school="school"
              :index="i"
            />
            <!-- No results -->
            <tr v-if="filteredSchools.length === 0">
              <td colspan="5" class="px-6 py-16 text-center">
                <i class="pi pi-search text-slate-200 text-3xl mb-3 block"></i>
                <p class="text-slate-400 font-medium">Keine Fahrschule gefunden für "{{ search }}"</p>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DrivingSchoolLine from "@/components/DrivingSchoolLine.vue";

interface Fahrschule {
  name: string
  ort: string
  inhaber: string
  email: string
  link: string
}

const schools = ref<Fahrschule[]>([])
const isOpen = ref(false)
const loadingError = ref(false)
const search = ref('')

const filteredSchools = computed(() => {
  if (!search.value.trim()) return schools.value
  const q = search.value.toLowerCase()
  return schools.value.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.ort.toLowerCase().includes(q) ||
    s.inhaber.toLowerCase().includes(q)
  )
})

const uniqueOrte = computed(() =>
  new Set(schools.value.map(s => s.ort).filter(Boolean)).size
)

async function loadCSV() {
  try {
    const response = await fetch('/driving_schools.csv')
    if (!response.ok) throw new Error('CSV nicht gefunden')
    const text = await response.text()
    const lines = text.trim().split('\n')
    schools.value = lines.slice(1).map(line => {
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
    loadingError.value = true
  }
}

onMounted(() => loadCSV())
</script>
