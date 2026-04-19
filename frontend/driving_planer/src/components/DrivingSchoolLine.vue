<template>

    <!-- Main row -->
    <tr
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative z-0 hover:z-10"
      @click="isExpanded = !isExpanded"
    >
      <td class="px-6 py-4 text-sm font-medium text-slate-400 group-hover:text-blue-400 transition-colors">
        {{ index + 1 }}
      </td>

      <td class="px-0 py-4">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <i class="pi pi-car text-sm"></i>
          </div>
          <span class="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{{ school.Name }}</span>
        </div>
      </td>

      <td class="px-0 py-4 text-sm text-slate-500">
        <div class="flex items-center gap-1 overflow-hidden">
          <i class="pi pi-map-marker text-[10px] text-slate-300 flex-shrink-0"></i>
          <span class="truncate">{{ school.Location }}</span>
        </div>
      </td>

      <td class="px-6 py-4 text-sm text-slate-500 truncate">
        {{ school.Owner }}
      </td>

      <td class="px-6 py-4">
        <div class="flex justify-center gap-1">
          <i
            v-for="star in 5"
            :key="star"
            @click.stop="rating = star"
            class="pi cursor-pointer text-sm"
            :class="[
              star <= rating ? 'pi-star-fill text-yellow-400' : 'pi-star text-slate-200'
            ]"
          ></i>
        </div>
      </td>

      <td class="px-6 py-4 text-right">
        <div class="flex items-center justify-end gap-3">
          <a
            v-if="school.Website"
            :href="school.Website"
            target="_blank"
            @click.stop
            class="p-2 bg-white border border-gray-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:scale-110 active:scale-95 transition-all shadow-sm"
          >
            <i class="pi pi-external-link text-xs"></i>
          </a>
          <i
            class="pi pi-chevron-down text-[10px] text-slate-300 transition-transform duration-300"
            :class="isExpanded ? 'rotate-180' : ''"
          ></i>
        </div>
      </td>
    </tr>

    <!-- Expand row -->
    <tr v-if="isExpanded" class="bg-slate-50/50">
      <td colspan="6" class="px-6 py-0">
        <div class="py-4 px-10">
          <div class="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-300 group/note">
            <div class="flex items-center gap-2 mb-2">
              <i class="pi pi-pencil text-blue-400 text-xs group-hover/note:rotate-12 transition-transform"></i>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter group-hover/note:text-blue-400 transition-colors">
                Deine Notizen
              </span>
            </div>
            <textarea
              v-model="comment"
              @click.stop
              placeholder="Schreibe hier etwas rein..."
              class="w-full p-3 bg-slate-50 border-none rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:ring-2 focus:ring-blue-100 resize-none"
              rows="2"
            ></textarea>
          </div>
        </div>
      </td>
    </tr>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import type {DrivingSchool} from "@/types.ts";

defineProps<{
  school: DrivingSchool
  index: number
}>()

const isExpanded = ref(false)
const rating = ref(0)
const comment = ref('')
</script>
