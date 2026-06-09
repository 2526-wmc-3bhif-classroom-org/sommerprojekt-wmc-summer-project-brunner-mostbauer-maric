<template>
  <template v-if="true">
    <tr
      @click="isExpanded = !isExpanded"
      class="hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative z-0 hover:z-10"
    >
      <td class="px-6 py-4 text-sm font-medium text-slate-400 group-hover:text-blue-400 transition-colors">
        {{ index + 1 }}
      </td>

      <td class="px-0 py-4">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-all duration-300">
            <i class="pi pi-car text-sm"></i>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{{ school.Name }}</span>
            <span v-if="school.distance != null" class="text-xs text-slate-400">
              <i class="pi pi-map-marker text-[10px] text-blue-400 mr-0.5"></i>
              {{ school.distance.toFixed(1) }} km entfernt
            </span>
          </div>
        </div>
      </td>

      <td class="px-0 py-4 text-sm text-slate-500">
        <div v-if="school.Location" class="overflow-hidden">
          <a
            :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(school.Location)"
            target="_blank"
            @click.stop
            class="truncate hover:text-blue-500 hover:underline transition-colors cursor-pointer"
            title="Auf Google Maps suchen"
          >
            {{ school.Location }}
          </a>
        </div>
        <div v-else class="overflow-hidden">
          <span class="truncate">{{ '—' }}</span>
        </div>
      </td>

      <td class="px-6 py-4 text-sm text-slate-500 truncate">
        {{ school.Owner || '—' }}
      </td>

      <td class="px-6 py-4">
        <div class="flex flex-col items-center gap-1">
          <div class="flex gap-1">
            <i
              v-for="star in 5"
              :key="star"
              @mouseenter="authStore.isSchool ? null : hoveredStar = star"
              @mouseleave="authStore.isSchool ? null : hoveredStar = 0"
              @click.stop="authStore.isSchool ? null : setRating(star)"
              class="pi text-sm transition-colors"
              :class="[
                star <= (hoveredStar || Math.round(averageRating)) ? 'pi-star-fill text-yellow-400' : 'pi-star text-slate-200',
                authStore.isSchool ? 'cursor-default opacity-80' : 'cursor-pointer'
              ]"
            ></i>
          </div>
          <span class="text-[10px] text-slate-400">
            {{ averageRating > 0 ? averageRating.toFixed(1) + ' / 5' : t('schools.noRating') }}
          </span>
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
          <div
            v-else
            class="p-2 bg-slate-50 border border-gray-100 rounded-lg text-slate-300 cursor-not-allowed opacity-50"
            :title="t('schools.noWebsite')"
          >
            <i class="pi pi-external-link text-xs"></i>
          </div>
        </div>
      </td>
    </tr>
    <tr v-if="isExpanded" class="bg-slate-50/50">
      <td colspan="6" class="px-6 py-4 border-b border-gray-100">
        <SchoolComments :schoolId="school.DrivingSchoolId" />
      </td>
    </tr>
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DrivingSchool, Rating } from "@/types.ts"
import { useSchoolStore } from "@/stores/schoolStore.ts"
import { useAuthStore } from "@/stores/authStore.ts"
import SchoolComments from "./SchoolComments.vue"

const { t } = useI18n()
const schoolStore = useSchoolStore()
const authStore = useAuthStore()

const props = defineProps<{
  school: DrivingSchool
  index: number
}>()

const isExpanded = ref(false)
const hoveredStar = ref(0)

const userRating = computed(() => {
  const userId = authStore.user?.UserId
  if (!userId) return 0
  const rating = schoolStore.ratings.find(r => r.DrivingSchoolId === props.school.DrivingSchoolId && r.UserId === userId)
  return rating?.Stars ?? 0
})

const averageRating = computed(() => {
  const schoolRatings = schoolStore.ratings.filter(r => r.DrivingSchoolId === props.school.DrivingSchoolId)
  if (schoolRatings.length === 0) return 0
  return schoolRatings.reduce((a, b) => a + b.Stars, 0) / schoolRatings.length
})

const userCommentRating = computed(() => {
  const userId = authStore.user?.UserId
  if (!userId) return null
  return schoolStore.ratings.find(r => r.DrivingSchoolId === props.school.DrivingSchoolId && r.UserId === userId)
})

async function setRating(stars: number) {
  const currentRating = userRating.value
  const newRating = currentRating === stars ? 0 : stars
  
  if (newRating === 0) {
    // If setting to 0, this removes the rating and comment
    await schoolStore.setRating(props.school.DrivingSchoolId, 0)
  } else {
    // Keep the current comment if it exists
    const currentContent = userCommentRating.value?.Content || undefined
    await schoolStore.setRating(props.school.DrivingSchoolId, newRating, currentContent)
  }
}
</script>
