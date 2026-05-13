<template>
  <Background>
  <HeaderMain :title="t('home.title')" desktopHeight="md:text-7xl" mobileHeight="text-3xl" class="pt-20 pb-10 md:pb-16" :duration=500 />

  <p class="text-center md:text-xl text-black/50 text-sm"
     v-motion-fade
     :duration="500"
  >
    {{ t('home.subtitle') }}
  </p>

  <div class="m-5 md:w-full flex flex-auto justify-center py-12 gap-4 px-4 md:px-0">
    <div
      v-motion
      :initial="{ opacity: 0, x: -50 }"
      :visible-once="{ opacity: 1, x: 0, transition: { duration: 900, ease: 'linear' }}"
    >
    <button class="bg-black text-white text-center text-xl md:p-6 p-4 rounded-3xl md:m-5 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            @click="scrollTo('start-now')"
    >
      {{ t('home.learnMore') }}
    </button>
    </div>
    <div
      v-motion
      :initial="{ opacity: 0, x: 50 }"
      :visible-once="{ opacity: 1, x: 0, transition: { duration: 900, ease: 'linear' }}"
    >
    <button class="bg-white text-black text-center text-xl md:p-6 p-4 m-5 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            @click="scrollTo('advantages')"
    >
      {{ t('home.ourAdvantages') }}
    </button>
    </div>
  </div>

  <div id="statistics" class="flex justify-center py-12 gap-4 flex-col md:flex-row">
      <div
        v-for="stat in statistics"
        :key="stat.description"
        class="p-5"
      >
        <StatisticCard
          :description="stat.description"
          :borderColor="stat.borderColor"
          :textColor="stat.textColor"
          :backgroundColor="stat.backgroundColor"
          :endValue="stat.endValue"
          :duration="stat.duration"
          :suffix="stat.suffix"
        />
      </div>
  </div>

  <div id="advantages">
    <HeaderMain :title="t('home.ourAdvantages')" desktopHeight="md:text-5xl" mobileHeight="text-3xl" :duration=500 headingType="h2" />
  </div>
  <div class="flex justify-center py-16 gap-4 px-6 md:flex-row flex-col">
    <CardMain
      v-for="card in pros"
      :key="card.titleKey"
      :title="t(card.titleKey)"
      :description="t(card.descKey)"
      :icon="card.icon"
      :duration="card.duration"
      :iconColor="card.iconColor"
      :borderColor="card.borderColor"
      headingType="h3"
    />
  </div>

  <div id="start-now">
    <HeaderMain :title="t('home.readyToStart')" desktopHeight="md:text-5xl" mobileHeight="text-3xl" :duration=500 headingType="h2" />
  </div>
  <div class="flex justify-center"
    v-motion-pop-visible-once
    :duration="400"
  >
    <button class="bg-black text-white text-center text-xl p-6 rounded-3xl m-5 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
            @click="router.push(authStore.isAuthenticated ? '/start' : '/register')"
    >
      {{ t('home.startNow') }}
    </button>
  </div>
  <div class="py-8">
  <Timeline :entries="timeLineEntries" />
  </div>
  <FooterCmp />
  </Background>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import HeaderMain from "@/components/HeaderMain.vue";
import CardMain from "@/components/CardMain.vue";
import FooterCmp from "@/components/FooterCmp.vue";
import Timeline from "@/components/Timeline.vue";
import StatisticCard from "@/components/StatisticCard.vue";
import Background from "@/components/Background.vue";
import {useAuthStore} from "@/stores/authStore.ts";
import {useSchoolStore} from "@/stores/schoolStore.ts";
import {useUserStore} from "@/stores/userStore.ts";
import {useRouter} from "vue-router";

const { t } = useI18n()
const router = useRouter();
const schoolStore = useSchoolStore();
const userStore = useUserStore();
const authStore = useAuthStore();

onMounted(async () => {
  await schoolStore.fetchSchoolCount();
  await userStore.fetchUsersCount();
})

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const statistics = computed(() => [
  {
    description: t('home.stats.students'),
    borderColor: "border-blue-700",
    textColor: "text-white",
    backgroundColor: "bg-blue-700",
    endValue: userStore.countOfTotalUsers,
    suffix: "+",
    duration: 400,
  },
  {
    description: t('home.stats.successRate'),
    borderColor: "border-lime-700",
    textColor: "text-white",
    backgroundColor: "bg-lime-700",
    endValue: 95,
    suffix: "%",
    duration: 400,
  },
  {
    description: t('home.stats.schools'),
    borderColor: "border-white",
    textColor: "text-white",
    backgroundColor: "bg-violet-700",
    endValue: schoolStore.countOfSchools,
    suffix: "+",
    duration: 400,
  },
])

const pros = [
  { titleKey: 'home.advantages.individual.title', descKey: 'home.advantages.individual.description', icon: "pi pi-user", duration: 500, iconColor: "text-blue-500", borderColor: "border-blue-500" },
  { titleKey: 'home.advantages.efficient.title', descKey: 'home.advantages.efficient.description', icon: "pi pi-cog", duration: 700, iconColor: "text-violet-500", borderColor: "border-violet-500" },
  { titleKey: 'home.advantages.motivating.title', descKey: 'home.advantages.motivating.description', icon: "pi pi-chart-line", duration: 900, iconColor: "text-emerald-500", borderColor: "border-emerald-500" },
]

const timeLineEntries = computed(() => [
  { title: t('home.timeline.register.title'), description: t('home.timeline.register.description'), icon: "pi pi-user-plus", duration: 200, iconColor: "text-blue-500", borderColor: "border-blue-500" },
  { title: t('home.timeline.chooseSchool.title'), description: t('home.timeline.chooseSchool.description'), icon: "pi pi-book", duration: 200, iconColor: "text-violet-500", borderColor: "border-violet-500" },
  { title: t('home.timeline.getPlan.title'), description: t('home.timeline.getPlan.description'), icon: "pi pi-check", duration: 200, iconColor: "text-emerald-500", borderColor: "border-emerald-500" },
  { title: t('home.timeline.followPlan.title'), description: t('home.timeline.followPlan.description'), icon: "pi pi-directions", duration: 200, iconColor: "text-yellow-500", borderColor: "border-yellow-500" },
  { title: t('home.timeline.celebrate.title'), description: t('home.timeline.celebrate.description'), icon: "pi pi-star", duration: 200, iconColor: "text-pink-500", borderColor: "border-pink-500" },
])
</script>
