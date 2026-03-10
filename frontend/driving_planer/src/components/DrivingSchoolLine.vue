<template>
  <tbody class="border-b border-gray-50 last:border-0">
    <tr 
      class="hover:bg-slate-50/50 transition-colors cursor-pointer group" 
      @click="isExpanded = !isExpanded"
    >
      <td class="px-6 py-4 text-sm font-medium text-slate-400 w-16">{{ index + 1 }}</td>
      
      <td class="px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
            <i class="pi pi-car text-xs"></i>
          </div>
          <span class="font-bold text-slate-700">{{ school.name }}</span>
        </div>
      </td>

      <td class="px-6 py-4 text-sm text-slate-500">
        <div class="flex items-center gap-1">
          <i class="pi pi-map-marker text-[10px] text-slate-300"></i>
          {{ school.ort }}
        </div>
      </td>

      <td class="px-6 py-4 text-sm text-slate-500">{{ school.inhaber }}</td>

      <td class="px-6 py-4">
        <div class="flex gap-1">
          <i 
            v-for="star in 5" 
            :key="star"
            @click.stop="rating = star"
            class="pi cursor-pointer transition-all hover:scale-125"
            :class="[
              star <= rating ? 'pi-star-fill text-yellow-400' : 'pi-star text-slate-200',
              'text-sm'
            ]"
          ></i>
        </div>
      </td>

      <td class="px-6 py-4 text-right">
        <div class="flex items-center justify-end gap-3">
          <a 
            v-if="school.link" 
            :href="school.link" 
            target="_blank" 
            @click.stop
            class="p-2 bg-white border border-gray-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
            title="Website öffnen"
          >
            <i class="pi pi-external-link text-xs"></i>
          </a>
          <i :class="['pi text-[10px] text-slate-300 transition-transform duration-300', isExpanded ? 'rotate-180' : '']" class="pi-chevron-down"></i>
        </div>
      </td>
    </tr>

    <tr v-if="isExpanded" class="bg-slate-50/50">
      <td colspan="6" class="px-6 py-0">
        <div class="overflow-hidden transition-all duration-300">
          <div class="py-4 px-10">
            <div class="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                <i class="pi pi-pencil text-blue-400 text-xs"></i>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Deine Notizen</span>
              </div>
              <textarea
                v-model="comment"
                @click.stop
                placeholder="Schreibe hier etwas rein..."
                class="w-full p-3 bg-slate-50 border-none rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  school: {
    name: string
    ort: string
    inhaber: string
    link: string
  },
  index: number
}>()

const isExpanded = ref(false)
const rating = ref(0)
const comment = ref('')
</script>