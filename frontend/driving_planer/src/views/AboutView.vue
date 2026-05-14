<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HeaderMain from "@/components/HeaderMain.vue"
import InfoStatsCard from "@/components/InfoStatsCard.vue"
import Background from "@/components/Background.vue"
import FooterCmp from "@/components/FooterCmp.vue"
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const featureCards = computed(() => [
  { icon: 'pi pi-lightbulb', iconColor: 'text-yellow-500', title: t('about.cards.mission.title'), description: t('about.cards.mission.description') },
  { icon: 'pi pi-eye', iconColor: 'text-blue-500', title: t('about.cards.vision.title'), description: t('about.cards.vision.description') },
  { icon: 'pi pi-users', iconColor: 'text-violet-500', title: t('about.cards.team.title'), description: t('about.cards.team.description') },
  { icon: 'pi pi-heart', iconColor: 'text-pink-500', title: t('about.cards.values.title'), description: t('about.cards.values.description') },
])

const teamMembers = computed(() => [
  { name: 'Luka Marić', initials: 'LM', role: t('about.team.role'), bg: 'bg-blue-500'},
  { name: 'Jan Brunner', initials: 'JB', role: t('about.team.role'), bg: 'bg-violet-500' },
  { name: 'Julian Mostbauer', initials: 'JM', role: t('about.team.role'), bg: 'bg-emerald-500' },
])
</script>

<template>
  <Background>
    <div class="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 pt-24 md:pt-16">
      <div class="max-w-6xl w-full flex flex-col gap-10">

        <!-- Hero -->
        <div class="flex flex-col items-center text-center gap-4 pt-8 pb-4">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-600 font-semibold hover:bg-blue-100 transition-colors cursor-default">
            <i class="pi pi-users text-blue-400"></i>
            {{ t('about.badge') }}
          </div>
          <HeaderMain :title="t('about.title')" desktopHeight="md:text-6xl" mobileHeight="text-3xl" :duration="400" />
          <p class="text-black/50 md:text-lg text-sm max-w-2xl leading-relaxed" v-motion-fade-visible>
            {{ t('about.subtitle') }}
          </p>
          <div class="flex gap-3 mt-2 flex-wrap justify-center">
            <button
              class="bg-black text-white px-6 py-3 rounded-2xl font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg text-sm"
              @click="router.push('/register')"
            >
              {{ t('about.joinButton') }}
            </button>
            <button
              class="bg-white border border-gray-200 text-slate-700 px-6 py-3 rounded-2xl font-semibold hover:scale-105 active:scale-95 transition-transform shadow-sm text-sm"
              @click="() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })"
            >
              {{ t('about.learnMore') }}
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoStatsCard
            :index="0"
            :title="'3'"
            :description="t('about.stats.developers')"
            icon="pi pi-code"
            iconColor="text-blue-500"
            borderColor="border-blue-500"
          />
          <InfoStatsCard
            :index="1"
            :title="'60+'"
            :description="t('about.stats.schools')"
            icon="pi pi-car"
            iconColor="text-violet-500"
            borderColor="border-violet-500"
          />
          <InfoStatsCard
            :index="2"
            :title="'1'"
            :description="t('about.stats.goal')"
            icon="pi pi-flag"
            iconColor="text-emerald-500"
            borderColor="border-emerald-500"
          />
        </div>

        <!-- What drives us -->
        <div id="mission" class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100">
            <h2 class="text-lg font-bold text-slate-900">{{ t('about.whatDrivesUs') }}</h2>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="card in featureCards"
              :key="card.title"
              v-motion-pop-visible-once
              class="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-slate-50/50"
            >
              <div class="flex-shrink-0 w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                <i :class="[card.icon, card.iconColor, 'text-lg']"></i>
              </div>
              <div>
                <p class="font-bold text-slate-900 mb-1 text-base">{{ card.title }}</p>
                <p class="text-base text-slate-500 leading-relaxed">{{ card.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Team -->
        <div class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-1">
            <h2 class="text-lg font-bold text-slate-900">{{ t('about.team.title') }}</h2>
            <span class="sm:ml-auto text-xs text-slate-400">{{ t('about.team.subtitle') }}</span>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="member in teamMembers"
              :key="member.name"
              v-motion-pop-visible-once
              class="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-100 bg-slate-50/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default"
            >
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm" :class="member.bg">
                {{ member.initials }}
              </div>
              <div class="text-center">
                <p class="font-bold text-slate-900 text-base">{{ member.name }}</p>
                <p class="text-sm text-slate-400 mt-0.5">{{ member.role }}</p>
              </div>

            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="bg-white border border-gray-100 rounded-3xl shadow-sm p-10 md:p-14 text-center flex flex-col items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
            <i class="pi pi-car text-blue-500 text-xl"></i>
          </div>
          <h2 class="text-slate-900 font-black text-2xl md:text-4xl">{{ t('about.joinUs') }}</h2>
          <p class="text-slate-400 max-w-md text-base">{{ t('about.joinSubtitle') }}</p>
          <button
            class="mt-2 bg-black text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-lg text-sm"
            @click="router.push('/register')"
          >
            {{ t('about.joinButton') }}
          </button>
        </div>

      </div>
    </div>
    <FooterCmp />
  </Background>
</template>
