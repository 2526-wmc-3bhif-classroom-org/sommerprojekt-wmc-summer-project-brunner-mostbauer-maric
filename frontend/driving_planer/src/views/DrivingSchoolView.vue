<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 pt-24 md:pt-16">
      <div class="max-w-6xl w-full">

          <div class="mb-8 flex flex-col items-center text-center relative z-0">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-600 font-semibold mb-4 transition-all duration-300 hover:scale-105 hover:bg-blue-100 hover:shadow-sm cursor-default">
              <i class="pi pi-map-marker text-blue-400"></i>
              {{ t('schools.badge') }}
            </div>

            <HeaderMain :title="t('schools.title')" desktopHeight="md:text-5xl" mobileHeight="text-2xl" class="md:pt-6 md:pb-2 pt-8 pb-2" :duration=500 />

            <p class="text-center md:text-lg text-black/50 text-xs transition-colors duration-300 hover:text-black/80" v-motion-fade:duration="500">
              {{ t('schools.subtitle') }}
            </p>
          </div>

          <div class="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <InfoStatsCard
              :index="0"
              :title="t('schools.stats.schools')"
              :description="t('schools.stats.schoolsDesc', { count: schoolStore.countOfSchools })"
              icon="pi pi-car"
              iconColor="text-blue-500"
              borderColor="border-blue-500"
            />
            <InfoStatsCard
              :index="1"
              :title="t('schools.stats.withWebsite')"
              :description="t('schools.stats.withWebsiteDesc', { count: schools.filter(s => s.Website).length })"
              icon="pi pi-link"
              iconColor="text-violet-500"
              borderColor="border-violet-500"
            />
            <InfoStatsCard
              :index="2"
              :title="t('schools.stats.locations')"
              :description="t('schools.stats.locationsDesc', { count: uniqueOrte })"
              icon="pi pi-map-marker"
              iconColor="text-emerald-500"
              borderColor="border-emerald-500"
            />
          </div>

          <div class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

            <div class="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 bg-white">
              <div class="flex items-center gap-3 group/title cursor-default">
                <h2 class="text-lg font-bold text-slate-900 group-hover/title:text-blue-600 transition-colors relative">
                  {{ t('schools.overview') }}
                  <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover/title:w-full transition-all duration-300"></span>
                </h2>
                <span class="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full hover:bg-blue-100 hover:scale-105 transition-all cursor-default border border-transparent hover:border-blue-200">
                  {{ t('schools.entries', { count: filteredSchools.length }) }}
                </span>
              </div>

              <div class="relative w-full sm:w-64 group/search">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm group-focus-within/search:text-blue-500 group-hover/search:text-slate-400 transition-colors"></i>
                <input
                  v-model="search"
                  type="text"
                  :placeholder="t('schools.search')"
                  class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white hover:bg-slate-100/50 transition-all shadow-sm hover:shadow"
                />
              </div>
            </div>

            <div v-if="loadingError" class="p-16 text-center">
              <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="pi pi-exclamation-triangle text-red-400 text-2xl"></i>
              </div>
              <p class="font-bold text-slate-700 mb-1">{{ t('schools.loadError') }}</p>
            </div>

            <div v-else-if="isLoading" class="p-16 text-center">
              <i class="pi pi-spin pi-spinner text-blue-400 text-3xl"></i>
              <p class="text-sm text-slate-400 mt-4">{{ t('schools.loading') }}</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="hidden md:table w-full text-left table-fixed border-separate border-spacing-0">
                <thead>
                  <tr class="bg-slate-50 border-b border-gray-100">
                    <th class="px-6 py-4 w-[6%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default">{{ t('schools.tableHeaders.nr') }}</th>
                    <th class="px-0 py-4 w-[22%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default">{{ t('schools.tableHeaders.school') }}</th>
                    <th class="px-0 py-4 w-[28.5%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default">{{ t('schools.tableHeaders.location') }}</th>
                    <th class="px-6 py-4 w-[25%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default">{{ t('schools.tableHeaders.owner') }}</th>
                    <th class="px-6 py-4 w-[13%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default text-center">{{ t('schools.tableHeaders.rating') }}</th>
                    <th class="px-6 py-4 w-[10%] text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default text-right">{{ t('schools.tableHeaders.website') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <DrivingSchoolLine
                    v-for="(school, i) in filteredSchools"
                    :key="i"
                    :school="school"
                    :index="i"
                  />
                </tbody>
              </table>

              <div class="md:hidden divide-y divide-gray-100">
                <div
                  v-for="(school, i) in filteredSchools"
                  :key="'mob-' + i"
                  class="p-4 active:bg-slate-50 transition-colors"
                  @click="school.isExpanded = !school.isExpanded" >

                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] font-bold text-blue-500 uppercase tracking-tight">#{{ i + 1 }}</span>
                    <a v-if="school.Website" :href="school.Website" target="_blank" @click.stop class="text-blue-500 text-sm p-1">
                      <i class="pi pi-external-link"></i>
                    </a>
                    <span v-else class="text-slate-300 text-sm p-1 opacity-50 cursor-not-allowed">
                      <i class="pi pi-external-link"></i>
                    </span>
                  </div>

                  <h3 class="font-bold text-slate-900">{{ school.Name }}</h3>
                  <div class="mt-1">
                    <a
                      v-if="school.Location"
                      :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(school.Location)"
                      target="_blank"
                      @click.stop
                      class="text-sm text-slate-500 hover:text-blue-500 active:text-blue-600 transition-colors flex items-center w-fit"
                    >
                      {{ school.Location }}
                    </a>
                    <p v-else class="text-sm text-slate-500">
                      {{ '—' }}
                    </p>
                  </div>

                  <div class="flex items-center justify-between mt-4">
                    <span class="text-xs text-slate-400 italic">{{ school.Owner || '—' }}</span>
                    <div class="flex flex-col items-end gap-0.5">
                      <div class="flex gap-1">
                        <i
                          v-for="star in 5"
                          :key="star"
                          @click.stop="authStore.isSchool ? null : setMobileRating(school, star)"
                          class="pi text-sm"
                          :class="[
                            star <= Math.round(getMobileAvg(school)) ? 'pi-star-fill text-yellow-400' : 'pi-star text-slate-200',
                            authStore.isSchool ? 'cursor-default opacity-80' : 'cursor-pointer'
                          ]"
                        ></i>
                      </div>
                      <span class="text-[10px] text-slate-400">
                        {{ getMobileAvg(school) > 0 ? getMobileAvg(school).toFixed(1) + ' / 5' : t('schools.noRating') }}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              <div v-if="filteredSchools.length === 0" class="p-16 text-center">
                <h3 class="font-bold text-slate-700 mb-1">{{ t('schools.empty.title') }}</h3>
                <p class="text-sm text-slate-400">{{ t('schools.empty.subtitle') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    <FooterCmp />
  </Background>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DrivingSchoolLine from "@/components/DrivingSchoolLine.vue";
import SchoolComments from "@/components/SchoolComments.vue";
import Background from '@/components/Background.vue';
import FooterCmp from '@/components/FooterCmp.vue';
import HeaderMain from '@/components/HeaderMain.vue';
import InfoStatsCard from "@/components/InfoStatsCard.vue";
import {useSchoolStore} from "@/stores/schoolStore.ts";
import {useAuthStore} from "@/stores/authStore.ts";
import type {DrivingSchool} from "@/types.ts";

const { t } = useI18n()
const schoolStore = useSchoolStore();
const authStore = useAuthStore();

interface WebsiteDrivingSchool extends DrivingSchool {
  isExpanded?: boolean
}

function getMobileAvg(school: WebsiteDrivingSchool): number {
  const schoolRatings = schoolStore.ratings.filter(r => r.DrivingSchoolId === school.DrivingSchoolId)
  if (schoolRatings.length === 0) return 0
  return schoolRatings.reduce((a, b) => a + b.Stars, 0) / schoolRatings.length
}

async function setMobileRating(school: WebsiteDrivingSchool, stars: number) {
  const userId = authStore.user?.UserId
  if (!userId) return
  
  const ratingRecord = schoolStore.ratings.find(r => r.DrivingSchoolId === school.DrivingSchoolId && r.UserId === userId)
  const currentRating = ratingRecord?.Stars ?? 0
  const currentContent = ratingRecord?.Content || undefined
  const newRating = currentRating === stars ? 0 : stars

  if (newRating === 0) {
    await schoolStore.setRating(school.DrivingSchoolId, 0)
  } else {
    await schoolStore.setRating(school.DrivingSchoolId, newRating, currentContent)
  }
}

const schools = ref<WebsiteDrivingSchool[]>([]);
const loadingError = ref(false)
const isLoading = ref(false)
const search = ref('')

const syncSchools = () => {
  schools.value = schoolStore.schools as WebsiteDrivingSchool[]
}

const filteredSchools = computed(() => {
  if (!search.value.trim()) return schools.value
  const q = search.value.toLowerCase()
  return schools.value.filter(s =>
    s.Name.toLowerCase().includes(q) ||
    s.Location?.toLowerCase().includes(q) ||
    s.Owner?.toLowerCase().includes(q)
  )
})

const uniqueOrte = computed(() =>
  new Set(schools.value.map(s => s.Location).filter(Boolean)).size
)

onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    schoolStore.fetchSchools(),
    schoolStore.fetchRatings(),
    schoolStore.fetchSchoolCount()
  ])
  syncSchools()
  isLoading.value = false
  if (schoolStore.error) {
    loadingError.value = true
  }
})
</script>
