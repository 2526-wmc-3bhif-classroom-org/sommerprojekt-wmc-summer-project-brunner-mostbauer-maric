<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 pt-24 md:pt-16">
      <div class="max-w-6xl w-full">

        <div class="mb-10 flex flex-col items-center text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-xs text-indigo-600 font-semibold mb-4 transition-all duration-300 hover:scale-105 hover:bg-indigo-100 hover:shadow-sm cursor-default">
            <i class="pi pi-building text-indigo-400"></i>
            {{ t('manage.badge') }}
          </div>
          <HeaderMain :title="t('manage.title')" desktopHeight="md:text-5xl" mobileHeight="text-2xl" class="md:pt-4 md:pb-2 pt-6 pb-2" :duration="500" />
          <p class="text-center md:text-lg text-black/50 text-xs m-5 transition-colors duration-300 hover:text-black/80" v-motion-fade-visible>
            {{ authStore.isStudent ? t('manage.subtitleStudent') : t('manage.subtitleSchool') }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center sm:justify-between justify-center gap-4 mb-6 p-4">
          <div class="group cursor-default transition-all rounded-lg px-3 py-2 text-center sm:text-left">
            <h2 class="text-xl font-black text-slate-900 group-hover:text-indigo-600">{{ t('manage.overview') }}</h2>
            <p class="text-sm text-slate-400 mt-0.5 group-hover:text-indigo-500">
              {{ filteredCourses.length }} {{ filteredCourses.length !== 1 ? t('manage.coursesCount', { n: filteredCourses.length }).split('|')[2]?.trim() : t('manage.coursesCount', { n: 1 }).split('|')[1]?.trim() }}
            </p>
          </div>

          <div class="flex items-center gap-3 flex-col sm:flex-row sm:items-center">
            <div class="flex flex-col w-full sm:w-auto">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">{{ t('manage.filterByClass') }}</span>
              <select
                v-model="filterLicense"
                class="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm transition-all"
              >
                <option value="">{{ t('manage.allClasses') }}</option>
                <option v-for="cls in usedLicenses" :key="cls" :value="cls">{{ t('manage.class', { cls }) }}</option>
              </select>
            </div>
            <div class="flex flex-col w-full sm:w-auto">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">{{ t('manage.filterByDate') }}</span>
              <input
                v-model="filterDate"
                type="date"
                class="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm transition-all"
              />
            </div>

            <button
              v-if="authStore.isSchool || authStore.isAdmin"
              @click="openCreateModal"
              class="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <i class="pi pi-plus text-xs"></i>
              {{ t('manage.newCourse') }}
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center py-24">
          <i class="pi pi-spin pi-spinner text-indigo-400 text-3xl"></i>
        </div>

        <div v-else-if="filteredCourses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          <div
            v-for="(course, i) in filteredCourses"
            :key="course.id"
            v-motion
            :initial="{ opacity: 0, y: 24 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 350, delay: Math.min(i * 80, 320) } }"
            class="group bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
          >
            <div class="h-1.5 w-full" :class="licenseAccent(course.licenseType)"></div>

            <div class="p-7 flex flex-col flex-1 gap-6">
              <div class="flex items-start justify-between">
                <div>
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-black" :class="licenseBadge(course.licenseType)">
                    <i class="pi pi-id-card text-xs"></i>
                    {{ t('manage.class', { cls: course.licenseType }) }}
                  </span>
                  <p class="text-xs text-slate-400 flex items-center gap-1.5" style="margin-top: 1.25rem;">
                    <i class="pi pi-calendar text-[10px]"></i>
                    {{ formatDate(course.dateFrom) }} – {{ formatDate(course.dateTo) }}
                  </p>
                  <p class="text-xs text-slate-400 flex items-center flex-wrap gap-1" style="margin-top: 1rem;">
                    <span v-for="day in course.weekdays" :key="day" class="inline-flex items-center gap-1 bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded-md font-semibold">{{ day }}</span>
                    <span v-if="course.isSchnellkurs" class="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md font-semibold">
                      <i class="pi pi-bolt text-[9px]"></i> {{ t('manage.schnellkurs') }}
                    </span>
                  </p>
                </div>

                <div v-if="authStore.isSchool || authStore.isAdmin" class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button @click="openEditModal(course)" class="w-8 h-8 flex items-center justify-center rounded-lg text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-110 transition-all" :title="t('common.edit')">
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button @click="confirmDelete(course.id)" class="w-8 h-8 flex items-center justify-center rounded-lg text-red-300 hover:bg-red-50 hover:text-red-500 hover:scale-110 transition-all" :title="t('common.delete')">
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-euro text-slate-400 text-sm"></i>
                </div>
                <div>
                  <p class="text-xs text-slate-400 leading-none mb-0.5">{{ t('manage.coursePrice') }}</p>
                  <p class="text-lg font-black text-slate-900">{{ course.price.toLocaleString('de-AT') }} €</p>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <i class="pi pi-users text-[10px]"></i>
                    {{ t('manage.participants') }}
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
                  {{ t('manage.freeSpots', { count: course.maxParticipants - course.currentParticipants }) }}
                </p>
              </div>

              <div class="mt-auto pt-2 border-t border-gray-50 flex justify-between items-center">
                <span class="text-[11px] font-bold px-2.5 py-1 rounded-full" :class="statusPill(course)">
                  {{ statusLabel(course) }}
                </span>
                <button
                  v-if="authStore.isSchool || authStore.isAdmin"
                  @click="openEditModal(course)"
                  class="text-xs text-indigo-500 hover:text-indigo-700 font-bold transition-colors flex items-center gap-1"
                >
                  {{ t('common.edit') }}
                  <i class="pi pi-arrow-right text-[10px]"></i>
                </button>
                <button
                  v-else
                  @click="openJoinModal(course.id)"
                  class="text-xs text-emerald-500 hover:text-emerald-700 font-bold transition-colors flex items-center gap-1"
                >
                  {{ t('common.join') }}
                  <i class="pi pi-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-24 mt-4 text-center">
          <div class="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
            <i class="pi pi-inbox text-indigo-300 text-3xl"></i>
          </div>
          <h3 class="font-black text-slate-800 text-xl" style="margin-top: 0.75rem; margin-bottom: 0.75rem;">{{ t('manage.empty.title') }}</h3>
          <p class="text-slate-400 text-sm max-w-xs" style="margin-bottom: 1rem;">
            {{ filterLicense ? t('manage.empty.noClass', { cls: filterLicense }) : t('manage.empty.noCoursesYet') }}
          </p>
          <button
            v-if="!filterLicense && (authStore.isSchool || authStore.isAdmin)"
            @click="openCreateModal"
            class="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl transition-all shadow-md"
          >
            <i class="pi pi-plus"></i>
            {{ t('manage.empty.createFirst') }}
          </button>
        </div>

      </div>
    </div>

    <FooterCmp />

    <!-- Create / Edit Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-9999 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>

        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-4 sm:p-8 z-10 overflow-y-auto max-h-[90vh]">
          <div class="flex items-center gap-3" style="margin-bottom: 2rem;">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <i :class="editingId !== null ? 'pi pi-pencil' : 'pi pi-plus-circle'" class="text-indigo-500"></i>
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900">{{ editingId !== null ? t('manage.modal.editTitle') : t('manage.modal.createTitle') }}</h3>
              <p class="text-xs text-slate-400">{{ t('manage.modal.fillAll') }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-5">
            <div v-if="authStore.isAdmin && editingId === null">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('manage.modal.drivingSchool') }}</label>
              <select v-model="selectedSchoolId" class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all">
                <option :value="null" disabled>{{ t('manage.modal.drivingSchoolSelect') }}</option>
                <option v-for="school in schools" :key="school.DrivingSchoolId" :value="school.DrivingSchoolId">{{ school.Name }}</option>
              </select>
              <p v-if="errors.selectedSchoolId" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.selectedSchoolId }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('manage.modal.licenseClass') }}</label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="cls in licenseClasses"
                  :key="cls"
                  @click="form.licenseType = cls"
                  class="py-2 rounded-xl text-xs font-bold border transition-all duration-150"
                  :class="form.licenseType === cls ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105' : 'bg-slate-50 text-slate-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'"
                >
                  {{ cls }}
                </button>
              </div>
              <p v-if="errors.licenseType" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.licenseType }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('manage.modal.coursePeriod') }}</label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] text-slate-400 font-semibold mb-1">{{ t('manage.modal.from') }}</label>
                  <input v-model="form.dateFrom" type="date" :min="todayISO" class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 font-semibold mb-1">{{ t('manage.modal.to') }}</label>
                  <input v-model="form.dateTo" type="date" :min="form.dateFrom || todayISO" class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
                </div>
              </div>
              <p v-if="errors.dateFrom" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.dateFrom }}</p>
              <p v-if="errors.dateTo" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.dateTo }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('manage.modal.time') }}</label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] text-slate-400 font-semibold mb-1">{{ t('manage.modal.from') }}</label>
                  <input v-model="form.timeFrom" type="time" class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 font-semibold mb-1">{{ t('manage.modal.to') }}</label>
                  <input v-model="form.timeTo" type="time" class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
                </div>
              </div>
              <p v-if="errors.timeFrom" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.timeFrom }}</p>
              <p v-if="errors.timeTo" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.timeTo }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('manage.modal.weekdays') }}</label>
              <div class="grid grid-cols-3 gap-2">
                <label v-for="day in allWeekdays" :key="day" class="flex items-center gap-2 cursor-pointer select-none">
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

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('manage.modal.courseType') }}</label>
              <label class="flex items-center gap-3 cursor-pointer select-none group w-fit">
                <div
                  @click="form.isSchnellkurs = !form.isSchnellkurs"
                  class="relative w-11 h-6 rounded-full border-2 transition-all duration-200 flex items-center"
                  :class="form.isSchnellkurs ? 'bg-amber-500 border-amber-500' : 'bg-slate-100 border-gray-300 group-hover:border-amber-300'"
                >
                  <div class="absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-200" :class="form.isSchnellkurs ? 'translate-x-5' : 'translate-x-0.5'"></div>
                </div>
                <span class="text-sm font-semibold" :class="form.isSchnellkurs ? 'text-amber-600' : 'text-slate-500'">
                  <i class="pi pi-bolt text-xs mr-1"></i>
                  {{ t('manage.schnellkurs') }}
                </span>
              </label>
            </div>

            <div class="grid grid-cols-2 gap-4 pb-4">
              <div class="mb-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('manage.modal.price') }}</label>
                <input v-model.number="form.price" type="number" min="0" placeholder="z. B. 2500" class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
                <p v-if="errors.price" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.price }}</p>
              </div>
              <div class="mb-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('manage.modal.maxParticipants') }}</label>
                <input v-model.number="form.maxParticipants" type="number" min="1" placeholder="z. B. 20" class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
                <p v-if="errors.maxParticipants" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.maxParticipants }}</p>
              </div>
            </div>

            <div v-if="editingId !== null" class="pb-4">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('manage.modal.currentParticipants') }}</label>
              <input v-model.number="form.currentParticipants" type="number" min="0" :max="form.maxParticipants" class="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
              <p v-if="errors.currentParticipants" class="text-xs text-red-500" style="margin-top: 0.6rem;">{{ errors.currentParticipants }}</p>
            </div>
          </div>

          <p v-if="saveError" class="text-xs text-red-500 text-center" style="margin-top: 0.6rem;">{{ saveError }}</p>
          <div class="flex gap-3 mt-4">
            <button @click="closeModal" class="flex-1 py-3.5 rounded-xl border border-gray-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
              {{ t('common.cancel') }}
            </button>
            <button @click="saveCourse" class="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm transition-all shadow-md">
              {{ editingId !== null ? t('manage.modal.saveChanges') : t('manage.modal.createCourse') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete confirm -->
    <Transition name="modal">
      <div v-if="deleteTargetId !== null" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="deleteTargetId = null"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 z-10 text-center flex flex-col items-center">
          <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <i class="pi pi-exclamation-triangle text-red-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 mb-2">{{ t('manage.delete.title') }}</h3>
          <p class="text-sm text-slate-500 mb-8">{{ t('manage.delete.description') }}</p>
          <div class="flex gap-3 w-full">
            <button @click="deleteTargetId = null" class="flex-1 py-3.5 rounded-xl border border-gray-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">{{ t('common.cancel') }}</button>
            <button @click="deleteCourse" class="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold text-sm transition-all shadow-md">{{ t('common.delete') }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Join confirm -->
    <Transition name="modal">
      <div v-if="joinTargetId !== null" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="joinTargetId = null"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 z-10 text-center">
          <div class="w-14 h-14 bg-emerald-50 rounded-2xl inline-flex items-center justify-center mb-4">
            <i class="pi pi-user-plus text-emerald-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 mb-2">{{ t('manage.join.title') }}</h3>
          <div v-if="joinTargetCourse" class="text-sm text-slate-500 mb-2">
            <span class="font-bold text-slate-700">{{ t('manage.class', { cls: joinTargetCourse.licenseType }) }}</span>
            &nbsp;·&nbsp;{{ formatDate(joinTargetCourse.dateFrom) }} – {{ formatDate(joinTargetCourse.dateTo) }}
          </div>
          <p class="text-sm text-slate-400" :class="hasPendingEnrollment ? 'mb-8' : 'mb-4'">{{ t('manage.join.description') }}</p>
          <div v-if="!hasPendingEnrollment" class="flex flex-col gap-3 mb-6 text-left">
            <div style="margin-top: 0.75rem;">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{{ t('start.pace') }}</label>
              <select v-model="joinGoal" class="w-full p-3 bg-slate-50 border-2 border-transparent rounded-xl text-black font-bold focus:bg-white focus:border-black transition-all outline-none appearance-none">
                <option value="" disabled>{{ t('start.paceGoal') }}</option>
                <option value="fast">{{ t('start.paceFast') }}</option>
                <option value="normal">{{ t('start.paceNormal') }}</option>
                <option value="relaxed">{{ t('start.paceRelaxed') }}</option>
              </select>
              <span v-if="joinErrors.goal" class="text-red-500 text-xs mt-1 block">{{ joinErrors.goal }}</span>
              <div style="margin-bottom: 0.75rem;"></div>
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="joinTargetId = null" class="flex-1 py-3.5 rounded-xl border border-gray-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">{{ t('common.cancel') }}</button>
            <button @click="confirmJoin" class="flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm transition-all shadow-md">{{ t('common.join') }}</button>
          </div>
        </div>
      </div>
    </Transition>

  </Background>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Background from '@/components/Background.vue'
import HeaderMain from '@/components/HeaderMain.vue'
import FooterCmp from '@/components/FooterCmp.vue'
import { useAuthStore } from '@/stores/authStore'

const { t } = useI18n()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const LICENSE_TYPE_IDS: Record<string, number> = {
  A: 1, A1: 2, A2: 3, AM: 4, B: 5, BE: 6, C: 7, C1: 8, CE: 9, D: 10, D1: 11, DE: 12,
  B1: 13, C1E: 14, D1E: 15, F: 16
}
const LICENSE_ID_TO_NAME: Record<number, string> = Object.fromEntries(
  Object.entries(LICENSE_TYPE_IDS).map(([k, v]) => [v, k])
)

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


const filterLicense = ref('')
const filterDate = ref('')
const filteredCourses = computed(() => {
  return courses.value.filter(c => {
    if (filterLicense.value && c.licenseType !== filterLicense.value) return false
    if (filterDate.value && c.dateTo < filterDate.value) return false
    return true
  })
})
const usedLicenses = computed(() => [...new Set(courses.value.map(c => c.licenseType))])

async function fetchCourses() {
  isLoading.value = true
  try {
    const headers = { 'Content-Type': 'application/json', ...(authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}) }
    if (authStore.isSchool && authStore.user?.DrivingSchoolId) {
      const res = await fetch(`${API_URL}/programs/school/${authStore.user.DrivingSchoolId}`, { headers })
      if (res.ok) {
        const json = await res.json()
        courses.value = (json.data ?? []).map((p: any) => mapProgram(p))
      }
    } else {
      const res = await fetch(`${API_URL}/programs`, { headers })
      if (res.ok) {
        const json = await res.json()
        courses.value = (json.data ?? []).map((p: any) => mapProgram(p))
      }
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (authStore.isStudent) {
    const pending = sessionStorage.getItem('pendingEnrollment')
    if (pending) {
      const { licenseClass } = JSON.parse(pending)
      if (licenseClass) filterLicense.value = licenseClass
    }
  }
  await fetchCourses()
})

const licenseClasses = ['A', 'A1', 'A2', 'AM', 'B', 'B1', 'BE', 'C', 'C1', 'CE', 'C1E', 'D', 'D1', 'DE', 'D1E', 'F']
const allWeekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

function formatDate(d: string) {
  return d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'
}

const accentMap: Record<string,string> = { A:'bg-orange-400', A1:'bg-orange-300', A2:'bg-amber-400', AM:'bg-yellow-400', B:'bg-indigo-500', B1:'bg-indigo-300', BE:'bg-indigo-400', C:'bg-violet-500', C1:'bg-violet-400', CE:'bg-purple-500', C1E:'bg-purple-400', D:'bg-emerald-500', D1:'bg-emerald-400', DE:'bg-teal-500', D1E:'bg-teal-400', F:'bg-slate-500' }
const badgeMap: Record<string,string> = { A:'bg-orange-50 text-orange-600', A1:'bg-orange-50 text-orange-500', A2:'bg-amber-50 text-amber-600', AM:'bg-yellow-50 text-yellow-600', B:'bg-indigo-50 text-indigo-600', B1:'bg-indigo-50 text-indigo-400', BE:'bg-indigo-50 text-indigo-500', C:'bg-violet-50 text-violet-600', C1:'bg-violet-50 text-violet-500', CE:'bg-purple-50 text-purple-600', C1E:'bg-purple-50 text-purple-500', D:'bg-emerald-50 text-emerald-600', D1:'bg-emerald-50 text-emerald-500', DE:'bg-teal-50 text-teal-600', D1E:'bg-teal-50 text-teal-500', F:'bg-slate-100 text-slate-600' }
const licenseAccent = (t: string) => accentMap[t] ?? 'bg-slate-400'
const licenseBadge = (t: string) => badgeMap[t] ?? 'bg-slate-100 text-slate-600'

function participantBarColor(c: Course) { const r = c.currentParticipants / c.maxParticipants; return r >= 1 ? 'bg-red-400' : r >= 0.8 ? 'bg-amber-400' : 'bg-emerald-400' }
function participantTextColor(c: Course) { const r = c.currentParticipants / c.maxParticipants; return r >= 1 ? 'text-red-500' : r >= 0.8 ? 'text-amber-500' : 'text-emerald-600' }
function statusLabel(c: Course) { const r = c.currentParticipants / c.maxParticipants; return r >= 1 ? t('manage.status.full') : r >= 0.8 ? t('manage.status.almostFull') : t('manage.status.available') }
function statusPill(c: Course) { const r = c.currentParticipants / c.maxParticipants; return r >= 1 ? 'bg-red-50 text-red-500' : r >= 0.8 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600' }

const showModal = ref(false)
const editingId = ref<number | null>(null)
const saveError = ref('')
const schools = ref<{ DrivingSchoolId: number; Name: string }[]>([])
const selectedSchoolId = ref<number | null>(null)
const emptyForm = () => ({ licenseType: '', dateFrom: '', dateTo: '', timeFrom: '', timeTo: '', weekdays: [] as string[], isSchnellkurs: false, price: undefined as unknown as number, maxParticipants: 20, currentParticipants: 0 })

function toggleWeekday(day: string) { const idx = form.value.weekdays.indexOf(day); if (idx === -1) form.value.weekdays.push(day); else form.value.weekdays.splice(idx, 1) }
const form = ref(emptyForm())
const errors = ref<Record<string, string>>({})
const todayISO = new Date().toISOString().split('T')[0] as string

function isValidTime(timeStr: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(timeStr)) return false
  const parts = timeStr.split(':').map(Number)
  const h = parts[0] as number
  const m = parts[1] as number
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

function validate() {
  const e: Record<string, string> = {}
  if (authStore.isAdmin && editingId.value === null && !selectedSchoolId.value) e.selectedSchoolId = 'Bitte eine Fahrschule wählen'
  if (!form.value.licenseType) e.licenseType = t('manage.modal.errors.licenseType')
  if (form.value.weekdays.length === 0) e.weekdays = t('manage.modal.errors.weekdays')
  if (!form.value.dateFrom) e.dateFrom = t('manage.modal.errors.dateFrom')
  else if (form.value.dateFrom < todayISO) e.dateFrom = t('manage.modal.errors.datePast')
  if (!form.value.dateTo) e.dateTo = t('manage.modal.errors.dateTo')
  else if (form.value.dateTo < (form.value.dateFrom || todayISO)) e.dateTo = t('manage.modal.errors.dateToAfter')
  if (!form.value.timeFrom) e.timeFrom = t('manage.modal.errors.timeFrom')
  else if (!isValidTime(form.value.timeFrom)) e.timeFrom = t('manage.modal.errors.timeFromInvalid')
  if (!form.value.timeTo) e.timeTo = t('manage.modal.errors.timeTo')
  else if (!isValidTime(form.value.timeTo)) e.timeTo = t('manage.modal.errors.timeToInvalid')
  else if (form.value.timeFrom && isValidTime(form.value.timeFrom) && form.value.timeTo <= form.value.timeFrom) e.timeTo = t('manage.modal.errors.timeToAfter')
  if (form.value.price <= 0) e.price = t('manage.modal.errors.price')
  if (form.value.maxParticipants < 1) e.maxParticipants = t('manage.modal.errors.maxParticipants')
  if (form.value.currentParticipants < 0) e.currentParticipants = t('manage.modal.errors.currentParticipantsNeg')
  else if (form.value.currentParticipants > form.value.maxParticipants) e.currentParticipants = t('manage.modal.errors.currentParticipantsMax', { max: form.value.maxParticipants })
  errors.value = e
  return Object.keys(e).length === 0
}

async function openCreateModal() {
  form.value = emptyForm(); editingId.value = null; errors.value = {}; saveError.value = ''; selectedSchoolId.value = null
  if (authStore.isAdmin && schools.value.length === 0) {
    const res = await fetch(`${API_URL}/schools`, { headers: { Authorization: `Bearer ${authStore.token ?? ''}` } })
    if (res.ok) { const json = await res.json(); schools.value = json.data ?? json }
  }
  showModal.value = true
}
function openEditModal(c: Course) { form.value = { ...c }; editingId.value = c.id; errors.value = {}; saveError.value = ''; showModal.value = true }
function closeModal() { showModal.value = false }

async function saveCourse() {
  if (!validate()) return
  saveError.value = ''
  if (editingId.value !== null) {
    const res = await fetch(`${API_URL}/programs/${editingId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token ?? ''}` },
      body: JSON.stringify({ LicenseTypeId: LICENSE_TYPE_IDS[form.value.licenseType], DateFrom: form.value.dateFrom, DateTo: form.value.dateTo, TimeFrom: form.value.timeFrom, TimeTo: form.value.timeTo, Weekdays: form.value.weekdays.join(','), IsSchnellkurs: form.value.isSchnellkurs ? 1 : 0, Price: form.value.price, MaxParticipants: form.value.maxParticipants })
    })
    if (res.ok) { closeModal(); await fetchCourses() }
    else { const json = await res.json().catch(() => ({})); saveError.value = json?.error?.message ?? t('manage.modal.errors.saveError') }
  } else {
    const res = await fetch(`${API_URL}/programs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token ?? ''}` },
      body: JSON.stringify({ DrivingSchoolId: authStore.isAdmin ? selectedSchoolId.value : authStore.user?.DrivingSchoolId, LicenseTypeId: LICENSE_TYPE_IDS[form.value.licenseType], DateFrom: form.value.dateFrom, DateTo: form.value.dateTo, TimeFrom: form.value.timeFrom, TimeTo: form.value.timeTo, Weekdays: form.value.weekdays.join(','), IsSchnellkurs: form.value.isSchnellkurs ? 1 : 0, Price: form.value.price, MaxParticipants: form.value.maxParticipants })
    })
    if (res.ok) { closeModal(); await fetchCourses() }
    else { const json = await res.json().catch(() => ({})); saveError.value = json?.error?.message ?? t('manage.modal.errors.createError') }
  }
}

const deleteTargetId = ref<number | null>(null)
function confirmDelete(id: number) { deleteTargetId.value = id }
async function deleteCourse() {
  if (deleteTargetId.value === null) return
  const id = deleteTargetId.value
  const res = await fetch(`${API_URL}/programs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${authStore.token ?? ''}` } })
  if (res.ok) { courses.value = courses.value.filter(c => c.id !== id) }
  deleteTargetId.value = null
}

const LICENSE_LESSON_COUNT: Record<string, number> = {
  A: 12, A1: 10, A2: 12, AM: 8, B: 16, B1: 12, BE: 8,
  C: 20, C1: 12, CE: 20, C1E: 12, D: 20, D1: 12, DE: 14, D1E: 10, F: 8,
}

const LESSONS_PER_WEEK: Record<string, number> = {
  fast: 3, normal: 2, relaxed: 1,
}

function getISOWeekKey(date: Date): string {
  const d = new Date(date)
  const day = d.getDay() || 7
  d.setDate(d.getDate() + 4 - day)
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${d.getFullYear()}-${weekNum}`
}

async function generateDrivingLessons(course: Course, goal: string, schoolOpeningDays: number[]) {
  const totalLessons = LICENSE_LESSON_COUNT[course.licenseType] ?? 16
  const lessonsPerWeek = LESSONS_PER_WEEK[goal] ?? 2
  const weekdayMap: Record<string, number> = { Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6, So: 0 }
  const courseDayNums = new Set(course.weekdays.map(w => weekdayMap[w]))

  const current = new Date(course.dateFrom)
  const courseEnd = new Date(course.dateTo)
  let totalCount = 0
  let weekLessons = 0
  let currentWeekKey = ''

  // Phase 1: während dem Kurs – auf Kurstagen
  while (totalCount < totalLessons && current <= courseEnd) {
    const weekKey = getISOWeekKey(current)
    if (weekKey !== currentWeekKey) {
      weekLessons = 0
      currentWeekKey = weekKey
    }
    if (weekLessons < lessonsPerWeek && courseDayNums.has(current.getDay())) {
      const dateStr = current.toISOString().split('T')[0]
      await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token ?? ''}` },
        body: JSON.stringify({ type: 'Fahrstunde', date: dateStr }),
      })
      totalCount++
      weekLessons++
    }
    current.setDate(current.getDate() + 1)
  }

  // Phase 2: nach dem Kurs – auf Öffnungstagen der Fahrschule
  if (totalCount < totalLessons && schoolOpeningDays.length > 0) {
    const openingDayNums = new Set(schoolOpeningDays)
    currentWeekKey = ''
    weekLessons = 0

    const maxDate = new Date(course.dateTo)
    maxDate.setFullYear(maxDate.getFullYear() + 2)

    while (totalCount < totalLessons && current <= maxDate) {
      const weekKey = getISOWeekKey(current)
      if (weekKey !== currentWeekKey) {
        weekLessons = 0
        currentWeekKey = weekKey
      }
      if (weekLessons < lessonsPerWeek && openingDayNums.has(current.getDay())) {
        const dateStr = current.toISOString().split('T')[0]
        await fetch(`${API_URL}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token ?? ''}` },
          body: JSON.stringify({ type: 'Fahrstunde', date: dateStr }),
        })
        totalCount++
        weekLessons++
      }
      current.setDate(current.getDate() + 1)
    }
  }
}

const joinTargetId = ref<number | null>(null)
const joinTargetCourse = computed(() => joinTargetId.value !== null ? courses.value.find(c => c.id === joinTargetId.value) : null)
const hasPendingEnrollment = ref(false)
const joinGoal = ref('')
const joinErrors = ref<{ goal?: string }>({})

function openJoinModal(id: number) {
  joinTargetId.value = id
  hasPendingEnrollment.value = !!sessionStorage.getItem('pendingEnrollment')
  joinGoal.value = ''
  joinErrors.value = {}
}

async function confirmJoin() {
  if (!joinTargetCourse.value || !authStore.user) return
  const pending = sessionStorage.getItem('pendingEnrollment')
  let goal: string | undefined
  let plannerStartDate: string | undefined

  if (pending) {
    const parsed = JSON.parse(pending)
    goal = parsed.goal
    plannerStartDate = parsed.startDate
  } else {
    if (!joinGoal.value) { joinErrors.value = { goal: t('start.errors.noPace') }; return }
    goal = joinGoal.value
    plannerStartDate = joinTargetCourse.value.dateFrom
  }

  const res = await fetch(`${API_URL}/programs/${joinTargetId.value}/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token ?? ''}` },
    body: JSON.stringify({ goal, plannerStartDate })
  })
  if (res.ok) {
    authStore.setEnrolled(true)
    sessionStorage.removeItem('pendingEnrollment')
    if (joinTargetCourse.value && goal) {
      const weekdayMap: Record<string, number> = { Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6, So: 0 }
      let schoolOpeningDays: number[] = []
      try {
        const schoolRes = await fetch(`${API_URL}/schools/${joinTargetCourse.value.drivingSchoolId}`, {
          headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
        })
        if (schoolRes.ok) {
          const school = await schoolRes.json()
          if (school.OpeningDays) {
            schoolOpeningDays = school.OpeningDays.split(',').map((d: string) => weekdayMap[d]).filter((n: number) => n !== undefined)
          }
        }
      } catch {}
      await generateDrivingLessons(joinTargetCourse.value, goal, schoolOpeningDays)
    }
    joinTargetId.value = null
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator { filter: brightness(0); cursor: pointer; opacity: 0.7; }
input[type="time"]::-webkit-datetime-edit-ampm-field { display: none; }
</style>
