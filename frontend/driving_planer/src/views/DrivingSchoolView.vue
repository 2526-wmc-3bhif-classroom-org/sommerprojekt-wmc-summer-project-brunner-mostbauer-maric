<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'

// Struktur für die Fahrschul-Daten
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

async function loadCSV() {
  try {
    const response = await fetch('/driving_schools.csv')
    if (!response.ok) throw new Error('CSV nicht gefunden')

    const text = await response.text()
    const lines = text.trim().split('\n')

    // Header überspringen und Zeilen verarbeiten
    schools.value = lines.slice(1).map(line => {
      // Regex trennt bei Kommas, ignoriert aber Kommas in Anführungszeichen
      const col = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []
      return {
        name: col[0]?.replace(/"/g, '') || '',
        ort: col[1]?.replace(/"/g, '') || '',
        inhaber: col[2]?.replace(/"/g, '') || '',
        email: col[3]?.replace(/"/g, '') || '',
        link: col[4]?.replace(/"/g, '') || ''
      }
    }).filter(s => s.name) // Leere Zeilen entfernen
  } catch (e) {
    console.error(e)
    loadingError.value = true
  }
}

onMounted(() => {
  loadCSV()
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 p-6">
    <div class="max-w-6xl mx-auto">

      <div class="mb-10 text-center md:text-left">
        <h1 class="text-4xl font-black text-white mb-2 tracking-tight">
          Fahrschul-<span class="text-blue-500">Datenbank</span>
        </h1>
        <p class="text-slate-400">Alle verfügbaren Fahrschulen aus deiner Liste im Überblick.</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

        <div class="p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800/30">
          <div>
            <h2 class="text-xl font-bold text-white">Übersicht</h2>
            <p class="text-xs text-slate-500 uppercase font-semibold tracking-widest">
              {{ schools.length }} Einträge geladen
            </p>
          </div>
          <Button
            @click="isOpen = !isOpen"
            :label="isOpen ? 'Liste einklappen' : 'Alle Fahrschulen anzeigen'"
            :icon="isOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
            class="p-button-raised p-button-info"
          />
        </div>

        <div v-if="loadingError" class="p-10 text-center border-t border-slate-800">
          <p class="text-red-400 font-medium">⚠️ CSV-Datei konnte nicht geladen werden.</p>
          <p class="text-xs text-slate-500 mt-2 italic">Prüfe, ob die Datei im 'public' Ordner liegt.</p>
        </div>

        <div v-if="isOpen && !loadingError" class="overflow-x-auto border-t border-slate-800">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-800/50 text-slate-300 text-sm">
              <th class="px-6 py-4 font-bold">Fahrschule</th>
              <th class="px-6 py-4 font-bold">Ort</th>
              <th class="px-6 py-4 font-bold">Inhaber</th>
              <th class="px-6 py-4 font-bold text-right">Aktion</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
            <tr v-for="(s, i) in schools" :key="i" class="hover:bg-blue-500/5 transition-colors group">
              <td class="px-6 py-4">
                <span class="font-bold text-blue-400 group-hover:text-blue-300">{{ s.name }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-400">{{ s.ort }}</td>
              <td class="px-6 py-4 text-sm text-slate-300">{{ s.inhaber }}</td>
              <td class="px-6 py-4 text-right">
                <a :href="s.link" target="_blank"
                   class="inline-block bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all border border-slate-700">
                  Website ↗
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
:deep(.p-button) {
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.875rem;
}
</style>
