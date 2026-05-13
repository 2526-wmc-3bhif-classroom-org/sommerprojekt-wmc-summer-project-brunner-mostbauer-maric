<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HeaderMain from "@/components/HeaderMain.vue"
import CardMain from "@/components/CardMain.vue"
import Background from "@/components/Background.vue"
import FooterCmp from "@/components/FooterCmp.vue"

const { t } = useI18n()

const aboutCards = computed(() => [
  { title: t('about.cards.mission.title'), description: t('about.cards.mission.description'), icon: "pi pi-lightbulb", duration: 400, iconColor: "text-yellow-500", borderColor: "border-yellow-500" },
  { title: t('about.cards.vision.title'), description: t('about.cards.vision.description'), icon: "pi pi-eye", duration: 400, iconColor: "text-blue-500", borderColor: "border-blue-500" },
  { title: t('about.cards.team.title'), description: t('about.cards.team.description'), icon: "pi pi-users", duration: 400, iconColor: "text-violet-500", borderColor: "border-violet-500" },
  { title: t('about.cards.values.title'), description: t('about.cards.values.description'), icon: "pi pi-heart", duration: 400, iconColor: "text-pink-500", borderColor: "border-pink-500" },
])
</script>

<template>
  <Background>

    <section class="flex flex-col items-center justify-center md:py-24 pt-24 pb-10 px-6 text-center">
      <HeaderMain
        :title="t('about.title')"
        desktopHeight="md:text-7xl"
        mobileHeight="text-3xl"
        :duration="400"
      />
      <p class="text-black/50 md:text-xl text-sm mt-4 max-w-2xl">
        {{ t('about.subtitle') }}
      </p>
    </section>

    <section class="py-4 px-6">
      <HeaderMain :title="t('about.whatDrivesUs')" desktopHeight="md:text-5xl" mobileHeight="text-2xl" :duration="400" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
        <CardMain
          v-for="card in aboutCards"
          :key="card.title"
          :title="card.title"
          :description="card.description"
          :icon="card.icon"
          :duration="card.duration"
          :iconColor="card.iconColor"
          :borderColor="card.borderColor"
          class="w-full"
        />
      </div>
    </section>

    <section class="flex flex-col items-center py-8 gap-6 text-center px-6">
      <HeaderMain :title="t('about.joinUs')" desktopHeight="md:text-5xl" mobileHeight="text-2xl" :duration="400" />
      <p class="text-black/50 md:text-xl text-sm max-w-xl">
        {{ t('about.joinSubtitle') }}
      </p>
      <button
        class="bg-black text-white text-xl p-6 rounded-3xl cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 shadow-lg"
        @click="$router.push('/register')"
      >
        {{ t('about.joinButton') }}
      </button>
    </section>
    <FooterCmp />
  </Background>
</template>
