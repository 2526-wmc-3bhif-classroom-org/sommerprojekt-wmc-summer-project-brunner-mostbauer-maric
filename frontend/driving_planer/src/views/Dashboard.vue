<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 md:p-12 pt-20">

      <div class="max-w-6xl w-full px-2 sm:px-4" v-motion-fade-visible>

        <div class="text-center">
          <HeaderMain
            :title="t('dashboard.title')"
            desktopHeight="md:text-7xl"
            mobileHeight="text-5xl"
            class="pb-0 text-black leading-none"
            :duration="500"
          />
          <p class="text-black font-black text-[10px] md:text-[12px] tracking-[0.3em] uppercase opacity-30 mt-6">
            {{ t('dashboard.subtitle') }}
          </p>
        </div>

        <div class="h-20 md:h-28"></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-stretch">

          <!-- KM-LOG CARD -->
          <div class="bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] flex flex-col h-full border border-zinc-100" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-4" style="margin-bottom: 40px">
              <div class="w-2 h-8 bg-black rounded-full"></div>
              <h2 class="font-black text-2xl text-black uppercase tracking-tight">{{ t('dashboard.kmLog.title') }}</h2>
            </div>

            <div class="flex flex-col gap-3" style="margin-bottom: 48px">
              <div class="grid grid-cols-2 gap-3">
                <input v-model="kmStart" type="number" min="0" step="0.1" :placeholder="t('dashboard.kmLog.startKm')"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', (kmError && (kmStart === null || kmStart < 0)) || kmErrorCode === 'endKmGreater' ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
                <input v-model="kmEnd" type="number" min="0" step="0.1" :placeholder="t('dashboard.kmLog.endKm')"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', (kmError && (kmEnd === null || kmEnd < 0)) || kmErrorCode === 'endKmGreater' ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <input v-model="locStart" type="text" :placeholder="t('dashboard.kmLog.startLocation')"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', kmError && !locStart ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
                <input v-model="locEnd" type="text" :placeholder="t('dashboard.kmLog.endLocation')"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', kmError && !locEnd ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
              </div>

              <input v-model="conditions" type="text" :placeholder="t('dashboard.kmLog.conditions')"
                     :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all w-full border', kmError && !conditions ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />

              <p v-if="kmError" class="text-[10px] font-bold uppercase text-red-500 tracking-widest ml-2">{{ kmError }}</p>

              <button @click="addKmEntry" class="w-full bg-black text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-80 transition-all active:scale-[0.98]">
                {{ t('dashboard.kmLog.save') }}
              </button>
            </div>

            <!-- Edit Modal Overlay -->
            <transition name="slide-up">
              <div v-if="editKmLogId !== null" class="absolute inset-0 bg-white z-40 rounded-[3rem] p-8 md:p-10 flex flex-col">
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-4">
                    <div class="w-2 h-8 bg-black rounded-full"></div>
                    <h2 class="font-black text-2xl text-black uppercase tracking-tight">{{ t('dashboard.kmLog.editTitle') }}</h2>
                  </div>
                  <button @click="cancelEdit" class="text-zinc-300 hover:text-black transition-all p-2">
                    <i class="pi pi-times"></i>
                  </button>
                </div>

                <div class="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-black uppercase text-black/30 tracking-widest ml-1">{{ t('dashboard.kmLog.startKm') }}</label>
                      <input v-model="editData.startKm" type="number" step="0.1" class="p-4 rounded-2xl font-bold text-sm outline-none bg-zinc-50 border border-transparent focus:bg-white focus:border-black/5 text-black" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-black uppercase text-black/30 tracking-widest ml-1">{{ t('dashboard.kmLog.endKm') }}</label>
                      <input v-model="editData.endKm" type="number" step="0.1" class="p-4 rounded-2xl font-bold text-sm outline-none bg-zinc-50 border border-transparent focus:bg-white focus:border-black/5 text-black" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-black uppercase text-black/30 tracking-widest ml-1">{{ t('dashboard.kmLog.startLocation') }}</label>
                      <input v-model="editData.startLocation" type="text" class="p-4 rounded-2xl font-bold text-sm outline-none bg-zinc-50 border border-transparent focus:bg-white focus:border-black/5 text-black" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-black uppercase text-black/30 tracking-widest ml-1">{{ t('dashboard.kmLog.endLocation') }}</label>
                      <input v-model="editData.endLocation" type="text" class="p-4 rounded-2xl font-bold text-sm outline-none bg-zinc-50 border border-transparent focus:bg-white focus:border-black/5 text-black" />
                    </div>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] font-black uppercase text-black/30 tracking-widest ml-1">{{ t('dashboard.kmLog.conditionsLabel') }}</label>
                    <input v-model="editData.conditions" type="text" class="p-4 rounded-2xl font-bold text-sm outline-none bg-zinc-50 border border-transparent focus:bg-white focus:border-black/5 text-black" />
                  </div>

                  <p v-if="editError" class="text-[10px] font-bold uppercase text-red-500 tracking-widest ml-2 mt-2">{{ editError }}</p>

                  <button @click="saveEdit" class="w-full bg-black text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-80 transition-all active:scale-[0.98] mt-4">
                    {{ t('dashboard.kmLog.saveChanges') }}
                  </button>
                </div>
              </div>
            </transition>

            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[250px]">
              <div v-if="kmEntries.length === 0" class="h-full flex items-center justify-center opacity-10 italic text-sm">{{ t('dashboard.kmLog.empty') }}</div>
              <div v-else class="space-y-4">
                <div v-for="(entry, i) in kmEntries" :key="entry.KmLogId || i" class="group flex flex-col p-5 border border-zinc-100 rounded-[2rem] bg-zinc-50/30 transition-all">
                  <div class="flex justify-between items-start">
                    <div class="flex flex-col gap-1">
                      <span class="text-[15px] text-black uppercase tracking-widest opacity-40">{{ entry.StartLocation }} → {{ entry.EndLocation }}</span>
                      <div class="flex items-baseline gap-2">
                        <span class="text-xl font-black text-black">{{ (entry.EndKm - entry.StartKm).toFixed(1) }} <span class="text-sm font-light opacity-50 uppercase tracking-normal">KM</span></span>
                        <span v-if="entry.Conditions" class="text-[10px] font-bold text-black/30 uppercase tracking-widest">{{ entry.Conditions }}</span>
                      </div>
                    </div>
                    <div class="flex gap-1">
                      <button @click="startEdit(entry)" class="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-black transition-all p-2">
                        <i class="pi pi-pencil text-xs"></i>
                      </button>
                      <button @click="removeKmEntry(entry.KmLogId)" class="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all p-2">
                        <i class="pi pi-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TASKS CARD -->
          <div class="bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] flex flex-col h-full border border-zinc-100" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-4" style="margin-bottom: 40px">
              <div class="w-2 h-8 bg-black rounded-full"></div>
              <h2 class="font-black text-2xl text-black uppercase tracking-tight">{{ t('dashboard.tasks.title') }}</h2>
            </div>
            <div class="flex gap-3" style="margin-bottom: 48px">
              <input v-model="checkInput" @keyup.enter="addCheck" type="text" :placeholder="t('dashboard.tasks.placeholder')"
                     :class="['flex-1 p-4 rounded-2xl font-bold text-sm outline-none transition-all border', taskError && !checkInput.trim() ? 'bg-red-50 border-red-200 text-red-900 placeholder:text-red-300' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
              <button @click="addCheck" class="bg-black text-white px-6 rounded-2xl hover:opacity-80 transition-all active:scale-90"><i class="pi pi-plus text-xs"></i></button>
            </div>
            <div class="overflow-y-auto pr-2 custom-scrollbar max-h-[380px]">
              <div v-if="checklist.length === 0" class="flex flex-col items-center justify-center py-16 gap-2 opacity-20">
                <i class="pi pi-check-square text-3xl"></i>
                <p class="text-[10px] font-black uppercase tracking-wider">{{ t('dashboard.tasks.empty') }}</p>
              </div>
              <div v-else class="flex flex-col gap-3">
                <div v-for="item in checklist" :key="item.id" class="group flex items-center justify-between p-4 border border-zinc-100 rounded-[1.5rem] bg-zinc-50/30 transition-all">
                  <label class="flex items-center gap-4 cursor-pointer flex-1 min-w-0">
                    <div class="relative flex items-center justify-center flex-shrink-0">
                      <input type="checkbox" v-model="item.done" @change="toggleTask(item)" class="peer appearance-none w-6 h-6 rounded-full border-2 border-zinc-100 checked:bg-black checked:border-black transition-all cursor-pointer" />
                      <i class="pi pi-check absolute text-[10px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none"></i>
                    </div>
                    <input v-if="editingId === item.id" v-model="editText" @keyup.enter="saveEditTask(item)" @blur="saveEditTask(item)" type="text" class="flex-1 bg-transparent outline-none font-bold text-base text-black min-w-0" />
                    <span v-else :class="item.done ? 'line-through opacity-20 italic' : 'font-bold'" class="text-base text-black transition-all truncate">{{ item.isDefault && defaultTaskKeys[item.text] ? t(defaultTaskKeys[item.text]) : item.text }}</span>
                  </label>
                  <div class="flex gap-1 flex-shrink-0">
                    <button @click="!item.isDefault && startEditTask(item)"
                      :class="['p-2 transition-all', item.isDefault ? 'invisible' : 'opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-black']">
                      <i class="pi pi-pencil text-xs"></i>
                    </button>
                    <button @click="removeCheck(item)"
                      :class="['p-2 transition-all', item.isDefault && !item.done ? 'invisible' : 'opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500']">
                      <i class="pi pi-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- KALENDER CARD -->
          <div class="bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] flex flex-col h-full border border-zinc-100 relative" v-motion-slide-visible-bottom>
            <div class="flex items-center justify-between" style="margin-bottom: 40px">
              <div class="flex items-center gap-4">
                <div class="w-2 h-8 bg-black rounded-full"></div>
                <div>
                  <h2 class="font-black text-2xl text-black uppercase tracking-tight">{{ t('dashboard.calendar.title') }}</h2>
                  <p class="text-xs font-bold text-black/40 uppercase tracking-widest" style="margin-top: 4px">{{ calendarMonthLabel }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="prevMonth" class="w-8 h-8 rounded-full bg-zinc-50 hover:bg-black hover:text-white transition-all flex items-center justify-center"><i class="pi pi-chevron-left text-[10px]"></i></button>
                <button @click="nextMonth" class="w-8 h-8 rounded-full bg-zinc-50 hover:bg-black hover:text-white transition-all flex items-center justify-center"><i class="pi pi-chevron-right text-[10px]"></i></button>
              </div>
            </div>
            <div v-if="calendarLegend.length > 0" class="flex gap-4 flex-wrap" style="margin-bottom: 12px">
              <div v-for="item in calendarLegend" :key="item.label" class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full flex-shrink-0" :class="item.color"></span>
                <span class="text-[10px] font-black text-black/40 uppercase tracking-widest">{{ item.label }}</span>
              </div>
            </div>
            <div class="grid grid-cols-7 gap-2 mb-4 flex-1">
              <div v-for="(dayName, i) in calendarWeekdays" :key="i" class="text-center text-xs font-black text-black/50">{{ dayName }}</div>
              <div v-for="(day, i) in calendarDays" :key="i" class="flex flex-col items-center justify-start" style="padding-top: 4px; min-height: 3.5rem">
                <div class="relative">
                  <button v-if="day" @click="openCalendarEntry(day)"
                          @mouseenter="hoveredDay = day"
                          @mouseleave="hoveredDay = null"
                          :class="['w-9 h-9 rounded-xl font-bold text-sm transition-all relative flex items-center justify-center flex-shrink-0',
                    isToday(day) ? 'bg-black text-white shadow-xl' :
                    isCourseDay(day) ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' :
                    'text-black hover:bg-zinc-50',
                    hasEntry(day) && !isToday(day) ? 'after:content-[\'\'] after:absolute after:top-1 after:right-1 after:w-1.5 after:h-1.5 after:bg-black after:rounded-full' : '']">
                    {{ day }}
                  </button>
                  <div
                    v-if="day && hoveredDay === day && isCourseDay(day) && joinedCourseWithTimes?.timeFrom && joinedCourseWithTimes?.timeTo"
                    class="absolute left-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap pointer-events-none z-30 shadow-lg"
                    style="bottom: calc(100% + 6px); transform: translateX(-50%)">
                    {{ joinedCourseWithTimes.timeFrom }} – {{ joinedCourseWithTimes.timeTo }}
                  </div>
                  <div
                    v-else-if="day && hoveredDay === day && !isCourseDay(day) && isDrivingLessonDay(day) && joinedSchool?.OpeningTimeFrom && joinedSchool?.OpeningTimeTo"
                    class="absolute left-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap pointer-events-none z-30 shadow-lg"
                    style="bottom: calc(100% + 6px); transform: translateX(-50%)">
                    {{ joinedSchool.OpeningTimeFrom }} – {{ joinedSchool.OpeningTimeTo }}
                  </div>
                </div>
                <div v-if="day && eventsForDay(day).length > 0" class="flex gap-0.5 flex-wrap justify-center" style="margin-top: 3px">
                  <span
                    v-for="(ev, j) in eventsForDay(day)" :key="j"
                    class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    :class="eventColorMap[ev.type] ?? 'bg-gray-400'"
                  ></span>
                </div>
              </div>
            </div>
            <transition name="slide-up">
              <div v-if="calendarModalOpen" class="absolute inset-0 overflow-hidden rounded-[3rem] bg-white p-8 flex flex-col z-20">
                <div class="flex justify-between items-center mb-6">
                  <span class="text-[10px] font-black uppercase opacity-30">{{ calendarSelectedLabel }}</span>
                  <button @click="calendarModalOpen = false" class="text-black/20 hover:text-black p-2"><i class="pi pi-times"></i></button>
                </div>

                <textarea v-model="calendarEntryText" class="flex-1 bg-zinc-50 rounded-2xl p-5 text-black font-bold outline-none resize-none border border-transparent focus:border-black/5" style="margin-bottom: 24px" :placeholder="t('dashboard.calendar.notePlaceholder')" />

                <div class="flex gap-3">
                  <button v-if="hasEntry(calendarSelectedDay)" @click="deleteCalendarEntry" class="bg-red-50 text-red-500 px-6 rounded-2xl hover:bg-red-100 transition-all">
                    <i class="pi pi-trash"></i>
                  </button>
                  <button @click="saveCalendarEntry" class="flex-1 bg-black text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95">
                    {{ t('dashboard.calendar.save') }}
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- EVENTS CARD -->
          <div class="bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] flex flex-col h-full border border-zinc-100" v-motion-slide-visible-bottom>
            <div class="flex items-center gap-4" style="margin-bottom: 40px">
              <div class="w-2 h-8 bg-black rounded-full"></div>
              <h2 class="font-black text-2xl text-black uppercase tracking-tight">{{ t('dashboard.events.title') }}</h2>
            </div>
            <div class="flex flex-col gap-3" style="margin-bottom: 48px">
              <div class="grid grid-cols-2 gap-3">
                <select v-model="typeInput"
                        :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all border appearance-none cursor-pointer',
                  eventError && !typeInput ? 'bg-red-50 border-red-200 text-red-900' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']">
                  <option value="" disabled selected>{{ t('dashboard.events.typePlaceholder') }}</option>
                  <option value="Theorie">{{ t('dashboard.events.theorie') }}</option>
                  <option value="Praxis">{{ t('dashboard.events.praxis') }}</option>
                </select>
                <input v-model="dateInput" type="date"
                       :class="['p-4 rounded-2xl font-bold text-sm outline-none transition-all border',
                  eventError && (!dateInput) ? 'bg-red-50 border-red-200 text-red-900' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-black/5 text-black']" />
              </div>

              <p v-if="eventError" class="text-[10px] font-bold uppercase text-red-500 tracking-widest ml-2">{{ eventError }}</p>

              <button @click="addDate" class="w-full bg-black text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-[0.98]">{{ t('dashboard.events.save') }}</button>
            </div>
            <div class="overflow-y-auto pr-2 custom-scrollbar max-h-[380px]">
              <div v-if="dates.length === 0 && examDates.length === 0" class="flex flex-col items-center justify-center py-16 gap-2 opacity-20">
                <i class="pi pi-calendar text-3xl"></i>
                <p class="text-[10px] font-black uppercase tracking-wider">{{ t('dashboard.events.empty') }}</p>
              </div>
              <div v-else class="flex flex-col gap-4">
                <div v-for="(date, i) in examDates" :key="`exam-${i}`" class="flex justify-between items-center p-5 border border-zinc-100 rounded-[2rem] bg-zinc-50/30">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <span class="text-[13px] text-black uppercase tracking-widest opacity-40">{{ t('eventTypes.' + date.type, date.type) }}</span>
                      <span class="text-[9px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full">{{ t('common.auto') }}</span>
                    </div>
                    <span class="font-bold text-lg text-black">{{ new Date(date.date).toLocaleDateString(dateLocale) }}</span>
                  </div>
                </div>
                <div v-for="(date, i) in dates" :key="i" class="group flex justify-between items-center p-5 border border-zinc-100 rounded-[2rem] bg-zinc-50/30">
                  <div class="flex flex-col gap-1">
                    <span class="text-[15px] text-black uppercase tracking-widest opacity-40">{{ t('eventTypes.' + date.type, date.type) }}</span>
                    <span class="font-bold text-lg text-black">{{ new Date(date.date).toLocaleDateString(dateLocale) }}</span>
                  </div>
                  <button @click="removeDate(i)" class="opacity-0 group-hover:opacity-100 text-zinc-200 hover:text-red-500 transition-all p-2">
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- FAHRSCHULE INFO CARD -->
        <div v-if="joinedSchool" class="bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] border border-zinc-100" style="margin-top: 40px;" v-motion-slide-visible-bottom>
          <div class="flex items-center gap-4" style="margin-bottom: 28px">
            <div class="w-2 h-8 bg-black rounded-full"></div>
            <div>
              <h2 class="font-black text-2xl text-black uppercase tracking-tight">{{ t('dashboard.school.title') }}</h2>
              <p class="text-xs font-bold text-black/30 uppercase tracking-widest" style="margin-top: 4px">{{ joinedSchool.Name }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <a v-if="joinedSchool.Phone" :href="`tel:${joinedSchool.Phone}`" class="flex items-center gap-4 p-5 rounded-[1.5rem] bg-zinc-50/60 border border-zinc-100 hover:bg-zinc-100 transition-all">
              <div class="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center flex-shrink-0">
                <i class="pi pi-phone text-sm"></i>
              </div>
              <div class="min-w-0">
                <p class="text-[9px] font-black uppercase tracking-widest text-black/30" style="margin-bottom: 2px">{{ t('dashboard.school.phone') }}</p>
                <p class="font-bold text-sm text-black truncate">{{ joinedSchool.Phone }}</p>
              </div>
            </a>
            <a v-if="joinedSchool.Email" :href="`mailto:${joinedSchool.Email}`" class="flex items-center gap-4 p-5 rounded-[1.5rem] bg-zinc-50/60 border border-zinc-100 hover:bg-zinc-100 transition-all">
              <div class="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center flex-shrink-0">
                <i class="pi pi-envelope text-sm"></i>
              </div>
              <div class="min-w-0">
                <p class="text-[9px] font-black uppercase tracking-widest text-black/30" style="margin-bottom: 2px">{{ t('dashboard.school.email') }}</p>
                <p class="font-bold text-sm text-black truncate">{{ joinedSchool.Email }}</p>
              </div>
            </a>
            <a v-if="joinedSchool.Website" :href="joinedSchool.Website" target="_blank" rel="noopener" class="flex items-center gap-4 p-5 rounded-[1.5rem] bg-zinc-50/60 border border-zinc-100 hover:bg-zinc-100 transition-all">
              <div class="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center flex-shrink-0">
                <i class="pi pi-globe text-sm"></i>
              </div>
              <div class="min-w-0">
                <p class="text-[9px] font-black uppercase tracking-widest text-black/30" style="margin-bottom: 2px">{{ t('dashboard.school.website') }}</p>
                <p class="font-bold text-sm text-black truncate">{{ joinedSchool.Website }}</p>
              </div>
            </a>
            <div v-if="joinedSchool.Location" class="flex items-center gap-4 p-5 rounded-[1.5rem] bg-zinc-50/60 border border-zinc-100">
              <div class="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center flex-shrink-0">
                <i class="pi pi-map-marker text-sm"></i>
              </div>
              <div class="min-w-0">
                <p class="text-[9px] font-black uppercase tracking-widest text-black/30" style="margin-bottom: 2px">{{ t('dashboard.school.address') }}</p>
                <p class="font-bold text-sm text-black truncate">{{ joinedSchool.Location }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <FooterCmp />
  </Background>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Background from '@/components/Background.vue'
import HeaderMain from '@/components/HeaderMain.vue'
import FooterCmp from '@/components/FooterCmp.vue'
import { useAuthStore } from '@/stores/authStore'

const { t, locale, tm } = useI18n()
const authStore = useAuthStore()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const dateLocale = computed(() => locale.value === 'de' ? 'de-DE' : 'en-US')
const calendarWeekdays = computed(() => tm('dashboard.calendar.weekdays') as string[])

const syncCalendar = () => {}
async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/events`, {
      headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
    })
    if (res.ok) {
      const data = await res.json()
      const all = (data ?? []).map((e: any) => ({ id: e.EventId, type: e.Type, date: e.Date }))
      drivingLessons.value = all.filter((e: any) => e.type === 'Fahrstunde')
      dates.value = all.filter((e: any) => e.type !== 'Fahrstunde')
    }
  } catch {}
}

const joinedCourse = ref<any>(null)
const joinedSchool = ref<any>(null)

const joinedCourseWithTimes = computed(() => joinedCourse.value ?? null)

const weekdayToJS: Record<string, number> = { Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6, So: 0 }

const isCourseDay = (day: number | null): boolean => {
  if (!day || !joinedCourse.value) return false
  const m = String(calendarMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  const dateStr = `${calendarYear.value}-${m}-${d}`
  const courseFrom = (joinedCourse.value.dateFrom ?? '').substring(0, 10)
  const courseTo = (joinedCourse.value.dateTo ?? '').substring(0, 10)
  if (dateStr < courseFrom || dateStr > courseTo) return false
  const courseDays = (joinedCourse.value.weekdays as string[]).map(w => weekdayToJS[w])
  return courseDays.includes(new Date(calendarYear.value, calendarMonth.value, day).getDay())
}

const isDrivingLessonDay = (day: number | null): boolean => {
  if (!day) return false
  const m = String(calendarMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  const dateStr = `${calendarYear.value}-${m}-${d}`
  return drivingLessons.value.some(e => e.date === dateStr)
}

const eventColorMap: Record<string, string> = {
  Theorie: 'bg-amber-400',
  Praxis:  'bg-emerald-400',
  Fahrstunde: 'bg-green-400',
  'Voraussichtliche Grundwissensprüfung': 'bg-sky-400',
  'Voraussichtliche Kursspezifische Theorieprüfung':      'bg-rose-400',
  'Voraussichtliche Praxisprüfung':       'bg-violet-400',
}

const calendarLegend = computed(() => {
  const items: { label: string; color: string }[] = []
  if (joinedCourse.value) items.push({ label: t('dashboard.calendar.legend.course'), color: 'bg-indigo-400' })
  if (drivingLessons.value.length > 0) items.push({ label: t('dashboard.calendar.legend.drivingLessons'), color: 'bg-green-400' })
  if (dates.value.some(e => e.type === 'Theorie')) items.push({ label: t('dashboard.calendar.legend.theory'), color: 'bg-amber-400' })
  if (dates.value.some(e => e.type === 'Praxis')) items.push({ label: t('dashboard.calendar.legend.practice'), color: 'bg-emerald-400' })
  if (examDates.value.some(e => e.type === 'Voraussichtliche Grundwissensprüfung')) items.push({ label: t('dashboard.calendar.legend.grundwissen'), color: 'bg-sky-400' })
  if (examDates.value.some(e => e.type === 'Voraussichtliche Kursspezifische Theorieprüfung')) items.push({ label: t('dashboard.calendar.legend.theoriePruefung'), color: 'bg-rose-400' })
  if (examDates.value.some(e => e.type === 'Voraussichtliche Praxisprüfung')) items.push({ label: t('dashboard.calendar.legend.praxisPruefung'), color: 'bg-violet-400' })
  return items
})

const eventsForDay = (day: number | null) => {
  if (!day) return []
  const m = String(calendarMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  const dateStr = `${calendarYear.value}-${m}-${d}`
  return [...dates.value, ...examDates.value, ...drivingLessons.value].filter(e => e.date === dateStr)
}

// KM-LOG LOGIC
const kmStart = ref<number | null>(null)
const kmEnd = ref<number | null>(null)
const locStart = ref('')
const locEnd = ref('')
const conditions = ref('')
const kmEntries = ref<any[]>([])
const kmError = ref('')
const kmErrorCode = ref('')

watch([kmStart, kmEnd, locStart, locEnd, conditions], () => { kmError.value = ''; kmErrorCode.value = '' })

const fetchKmLogs = async () => {
  try {
    const res = await fetch(`${API_URL}/kmlog`, {
      headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
    })
    if (res.ok) {
      kmEntries.value = await res.json()
    }
  } catch (err) {
    console.error("Failed to fetch KM logs:", err)
  }
}

const addKmEntry = async () => {
  if (kmStart.value === null || kmEnd.value === null || !locStart.value || !locEnd.value || !conditions.value.trim()) {
    kmErrorCode.value = 'fillAll'
    kmError.value = t('dashboard.kmLog.errors.fillAll')
    return
  }

  if (kmEnd.value < kmStart.value) {
    kmErrorCode.value = 'endKmGreater'
    kmError.value = t('dashboard.kmLog.errors.endKmGreater')
    return
  }

  try {
    const res = await fetch(`${API_URL}/kmlog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token ?? ''}`
      },
      body: JSON.stringify({
        startKm: kmStart.value,
        endKm: kmEnd.value,
        startLocation: locStart.value,
        endLocation: locEnd.value,
        conditions: conditions.value
      })
    })

    if (res.ok) {
      await fetchKmLogs()
      kmStart.value = kmEnd.value
      kmEnd.value = null
      locStart.value = locEnd.value
      locEnd.value = ''
      conditions.value = ''
    } else {
      const error = await res.json()
      kmErrorCode.value = 'networkError'
      kmError.value = error.error?.message || t('dashboard.kmLog.errors.networkError')
    }
  } catch (err) {
    kmErrorCode.value = 'networkError'
    kmError.value = t('dashboard.kmLog.errors.networkError')
  }
}

const removeKmEntry = async (id: number) => {
  try {
    const res = await fetch(`${API_URL}/kmlog/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
    })
    if (res.ok) {
      await fetchKmLogs()
    }
  } catch (err) {
    console.error("Failed to delete KM entry:", err)
  }
}

// EDIT KM-LOG LOGIC
const editKmLogId = ref<number | null>(null)
const editError = ref('')
const editData = ref({
  startKm: 0,
  endKm: 0,
  startLocation: '',
  endLocation: '',
  conditions: ''
})

const startEdit = (entry: any) => {
  editKmLogId.value = entry.KmLogId
  editData.value = {
    startKm: entry.StartKm,
    endKm: entry.EndKm,
    startLocation: entry.StartLocation,
    endLocation: entry.EndLocation,
    conditions: entry.Conditions || ''
  }
  editError.value = ''
}

const cancelEdit = () => {
  editKmLogId.value = null
}

const saveEdit = async () => {
  if (!editData.value.startLocation || !editData.value.endLocation || !editData.value.conditions.trim()) {
    editError.value = t('dashboard.kmLog.errors.fillAll')
    return
  }
  if (editData.value.endKm < editData.value.startKm) {
    editError.value = t('dashboard.kmLog.errors.endKmGreater')
    return
  }

  try {
    const res = await fetch(`${API_URL}/kmlog/${editKmLogId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token ?? ''}`
      },
      body: JSON.stringify(editData.value)
    })

    if (res.ok) {
      await fetchKmLogs()
      editKmLogId.value = null
    } else {
      const error = await res.json()
      editError.value = error.error?.message || t('dashboard.kmLog.errors.networkError')
    }
  } catch (err) {
    editError.value = t('dashboard.kmLog.errors.networkError')
  }
}

// TASKS LOGIC
const defaultTaskKeys: Record<string, string> = {
  'Ärztliche/Augenuntersuchung': 'defaultTasks.medicalExam',
  'Erste-Hilfe-Kurs': 'defaultTasks.firstAid',
  'Theorieprüfung anmelden': 'defaultTasks.theoryExam',
  'Praxisstunden absolvieren': 'defaultTasks.practiceHours',
  'Praxisprüfung anmelden': 'defaultTasks.practicalExam',
}

const DEFAULT_TASKS = [
  'Ärztliche/Augenuntersuchung',
  'Erste-Hilfe-Kurs',
  'Theorieprüfung anmelden',
  'Praxisstunden absolvieren',
  'Praxisprüfung anmelden',
]

const checkInput = ref('')
const taskError = ref(false)
const checklist = ref<any[]>([])
const editingId = ref<number | null>(null)
const editText = ref('')
watch(checkInput, () => { taskError.value = false })

const fetchTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
  })
  if (res.ok) {
    const data = await res.json()
    checklist.value = data.map((t: any) => ({ id: t.TaskId, text: t.Text, done: t.Done === 1, isDefault: t.IsDefault === 1 }))
    if (checklist.value.length === 0) {
      for (const text of DEFAULT_TASKS) {
        await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token ?? ''}` },
          body: JSON.stringify({ text, isDefault: true })
        })
      }
      await fetchTasks()
    }
  }
}

const addCheck = async () => {
  if (!checkInput.value.trim()) { taskError.value = true; return }
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token ?? ''}` },
    body: JSON.stringify({ text: checkInput.value.trim(), isDefault: false })
  })
  if (res.ok) {
    checkInput.value = ''
    await fetchTasks()
  }
}

const toggleTask = async (item: any) => {
  await fetch(`${API_URL}/tasks/${item.id}/done`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token ?? ''}` },
    body: JSON.stringify({ done: item.done })
  })
}

const startEditTask = (item: any) => {
  editingId.value = item.id
  editText.value = item.text
}

const saveEditTask = async (item: any) => {
  if (editingId.value !== item.id) return
  editingId.value = null
  if (!editText.value.trim() || editText.value.trim() === item.text) return
  await fetch(`${API_URL}/tasks/${item.id}/text`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token ?? ''}` },
    body: JSON.stringify({ text: editText.value.trim() })
  })
  item.text = editText.value.trim()
}

const removeCheck = async (item: any) => {
  await fetch(`${API_URL}/tasks/${item.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
  })
  checklist.value = checklist.value.filter(t => t.id !== item.id)
}

// CALENDAR LOGIC
const hoveredDay = ref<number | null>(null)
const calendarYear = ref(new Date().getFullYear())
const calendarMonth = ref(new Date().getMonth())
const calendarEntries = ref<Record<string, string>>({})
const calendarModalOpen = ref(false)
const calendarSelectedDay = ref<number | null>(null)
const calendarEntryText = ref('')
const calendarMonthLabel = computed(() =>
  new Date(calendarYear.value, calendarMonth.value).toLocaleDateString(
    locale.value === 'de' ? 'de-DE' : 'en-US',
    { month: 'long', year: 'numeric' }
  )
)
const calendarSelectedLabel = computed(() => {
  if (!calendarSelectedDay.value) return ''
  return new Date(calendarYear.value, calendarMonth.value, calendarSelectedDay.value)
    .toLocaleDateString(locale.value === 'de' ? 'de-DE' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
})
const calendarDays = computed(() => {
  const firstDow = (new Date(calendarYear.value, calendarMonth.value, 1).getDay() + 6) % 7
  const daysInMonth = new Date(calendarYear.value, calendarMonth.value + 1, 0).getDate()
  const cells = Array(firstDow).fill(null); for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null); return cells
})
const entryKey = (day: number) => `${calendarYear.value}-${calendarMonth.value + 1}-${day}`
const isToday = (day: number) => { const t = new Date(); return day === t.getDate() && calendarMonth.value === t.getMonth() && calendarYear.value === t.getFullYear() }
const hasEntry = (day: number | null) => day !== null && !!calendarEntries.value[entryKey(day)]
const openCalendarEntry = (day: number) => { calendarSelectedDay.value = day; calendarEntryText.value = calendarEntries.value[entryKey(day)] || ''; calendarModalOpen.value = true }
const saveCalendarEntry = () => { if (calendarSelectedDay.value) calendarEntries.value[entryKey(calendarSelectedDay.value)] = calendarEntryText.value; calendarModalOpen.value = false; syncCalendar() }
const deleteCalendarEntry = () => { if (calendarSelectedDay.value) delete calendarEntries.value[entryKey(calendarSelectedDay.value)]; calendarModalOpen.value = false; syncCalendar() }
const prevMonth = () => { if (calendarMonth.value === 0) { calendarMonth.value = 11; calendarYear.value-- } else calendarMonth.value-- }
const nextMonth = () => { if (calendarMonth.value === 11) { calendarMonth.value = 0; calendarYear.value++ } else calendarMonth.value++ }

// EXAM DATE CALCULATION
const examPaceMap: Record<string, { theorie: number; praxis: number }> = {
  fast:    { theorie: 14,  praxis: 28  },
  normal:  { theorie: 42,  praxis: 84  },
  relaxed: { theorie: 90,  praxis: 180 },
}

function toNextWeekday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  if (day === 6) d.setDate(d.getDate() + 2)
  if (day === 0) d.setDate(d.getDate() + 1)
  return d
}

function recalculateExamDates(goal: string | null, startDateStr: string | null, course: any) {
  if (!goal || !startDateStr) return

  const pace = examPaceMap[goal]
  if (!pace) return

  const startDate = new Date(startDateStr)
  const courseEndStr = course?.dateTo?.substring(0, 10)
  const courseEnd = courseEndStr ? new Date(courseEndStr) : null
  const base = courseEnd && courseEnd > startDate ? courseEnd : startDate

  const grundwissenDate = toNextWeekday(new Date(base.getTime() + 30 * 86400000))
  const theorieDate = toNextWeekday(new Date(base.getTime() + pace.theorie * 86400000))
  const praxisDate = toNextWeekday(new Date(base.getTime() + pace.praxis * 86400000))

  const newExamDates = [
    { type: 'Voraussichtliche Grundwissensprüfung', date: grundwissenDate.toISOString().split('T')[0], auto: true },
    { type: 'Voraussichtliche Kursspezifische Theorieprüfung', date: theorieDate.toISOString().split('T')[0], auto: true },
    { type: 'Voraussichtliche Praxisprüfung', date: praxisDate.toISOString().split('T')[0], auto: true },
  ]
  examDates.value = newExamDates
}

// EVENTS LOGIC
const typeInput = ref('')
const dateInput = ref('')
const dates = ref<any[]>([])
const examDates = ref<any[]>([])
const drivingLessons = ref<any[]>([])
const eventError = ref('')

onMounted(async () => {
  if (authStore.user?.UserId) {
    const userId = String(authStore.user.UserId)
    fetchKmLogs()
    fetchTasks()
    fetchEvents()

    try {
      const enrollRes = await fetch(`${API_URL}/users/${userId}/enrollments`, {
        headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
      })
      if (enrollRes.ok) {
        const enrollments = await enrollRes.json()
        if (Array.isArray(enrollments) && enrollments.length > 0) {
          const e = enrollments[0]
          const licenseTypeMapping: Record<number, string> = {
            1: 'A', 2: 'A1', 3: 'A2', 4: 'AM', 5: 'B', 6: 'BE', 7: 'C', 8: 'C1', 9: 'CE', 10: 'D', 11: 'D1', 12: 'DE'
          }
          joinedCourse.value = {
            id: e.LicenseProgramId,
            drivingSchoolId: e.DrivingSchoolId,
            licenseType: licenseTypeMapping[e.LicenseTypeId] ?? String(e.LicenseTypeId),
            dateFrom: e.DateFrom,
            dateTo: e.DateTo,
            timeFrom: e.TimeFrom ?? '',
            timeTo: e.TimeTo ?? '',
            weekdays: e.Weekdays ? e.Weekdays.split(',') : [],
            isSchnellkurs: !!e.IsSchnellkurs,
            price: e.Price,
            maxParticipants: e.MaxParticipants,
            currentParticipants: e.CurrentParticipants,
          }
          recalculateExamDates(e.Goal ?? null, e.PlannerStartDate ?? null, joinedCourse.value)
        }
      }
    } catch {}

    if (joinedCourse.value?.drivingSchoolId) {
      try {
        const res = await fetch(`${API_URL}/schools/${joinedCourse.value.drivingSchoolId}`, {
          headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
        })
        if (res.ok) {
          const json = await res.json()
          joinedSchool.value = json
        }
      } catch {}
    }
  }
})
watch([typeInput, dateInput], () => { eventError.value = '' })
const addDate = async () => {
  if (!typeInput.value || !dateInput.value) { eventError.value = t('dashboard.events.errors.incomplete'); return }
  try {
    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token ?? ''}` },
      body: JSON.stringify({ type: typeInput.value, date: dateInput.value })
    })
    if (res.ok) {
      const data = await res.json()
      dates.value.push({ id: data.EventId, type: typeInput.value, date: dateInput.value })
      typeInput.value = ''; dateInput.value = ''
    }
  } catch {}
}
const removeDate = async (i: number) => {
  const event = dates.value[i]
  if (!event?.id) { dates.value.splice(i, 1); return }
  try {
    const res = await fetch(`${API_URL}/events/${event.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
    })
    if (res.ok) dates.value.splice(i, 1)
  } catch {}
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px); }
input[type="date"]::-webkit-calendar-picker-indicator { filter: brightness(0); cursor: pointer; opacity: 0.7; }
</style>
